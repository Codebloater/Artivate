"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BiUserCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setAccount } from "@/redux/slices/accountSlice";
import DAOCard from "@/components/card/DAOCard";
import CreateDAO from "@/components/modal/createDAO";
import ALLDAOInfoABI from "@/constants/AllDAOConstants/AllDAOInfo_ABI";
import DAO_ABI from "@/constants/daoConstants/DAO_ABI";

//* ------------- ALCHEMY SETUP -------------
import { Network, Alchemy } from "alchemy-sdk";
import Link from "next/link";

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};

export default function Home() {
  const accountAddressX = useSelector((state) => state.account.account);

  const dispatch = useDispatch();

  const [isCreateDAOModalOpen, setIsCreateDAOModalOpen] = useState(false);

  const [nftsCount, setNftsCount] = useState(null);

  // Array DAOs
  const [allCardInfoArray, setAllCardInfoArray] = useState([]);

  const [nftAddress, setNftAddress] = useState([]);

  // ALCHEMY SETUP
  const alchemy = new Alchemy(settings);

  useEffect(() => {
    const connectToWallet = async () => {
      //* Will Reload whenever the Chain is Changed
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      //* Will Reload whenever the Account is Changed
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      try {
        const { ethereum } = window;
        if (ethereum) {
          // GET ACCOUNT ADDRESSES
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });

          dispatch(setAccount(account[0]));

          // SET PROVIDER & SIGNER
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          //* 1 --------- fetch Total NFTs Count of Wallet Address--------------
          const nftsForOwner = await alchemy.nft.getNftsForOwner(account[0]);
          setNftsCount(nftsForOwner.totalCount);

          const ALLDAOInfoContractAddress =
            "0x8853924802c3ce981618e968713e649252f125b4";

          const ALLDAOInfoContractInstance = new ethers.Contract(
            ALLDAOInfoContractAddress,
            ALLDAOInfoABI,
            signer
          );

          //* 2 --------- fetch DAO Contract Address of the User's NFT Contract Address --------------
          const FetchAllTheData = async () => {
            const resArray = [];
            const nftAddressArray = [];

            for (const nft of nftsForOwner.ownedNfts) {
              nftAddressArray.push(nft.contract.address);

              try {
                // Fetch DAO Addresses
                const allDAOAddresses =
                  await ALLDAOInfoContractInstance.getAllDAOs(
                    nft.contract.address
                  );

                for (let index = 0; index < allDAOAddresses.length; index++) {
                  //----------------------------

                  const NftContractAddress = allDAOAddresses[index];

                  const NftContractInstance = new ethers.Contract(
                    NftContractAddress,
                    DAO_ABI,
                    signer
                  );

                  //----------------------------
                  try {
                    const CreatorAddress = await NftContractInstance.Creator();
                    const nameOfDAO = await NftContractInstance.DAOName();
                    const totalProposalsCount =
                      await NftContractInstance._proposalCounter();
                    const minBal = await NftContractInstance.minBalance();

                    const checkDAOEligibility =
                      await NftContractInstance.isValidAddress(account[0]);

                    const Cardinfo = {
                      daoName: nameOfDAO,
                      daoDeployerAddress: CreatorAddress,
                      totalProposalsCount: totalProposalsCount.toString(),
                      nftAddressX: nft.contract.address,
                      minimumBalanceNFTX: minBal.toString(),
                      checkEligibilityX: checkDAOEligibility,
                      daoContractAddressX: NftContractAddress,
                    };

                    // Add Cardinfo to the array if not already added
                    const existingCard = resArray.find(
                      (item) => item.daoContractAddressX === NftContractAddress
                    );

                    if (!existingCard) {
                      resArray.push(Cardinfo);
                    }
                  } catch (error) {
                    alert("Error");
                  }
                }
              } catch (error) {
                alert("Error");
              }
            }

            setNftAddress(nftAddressArray);
            setAllCardInfoArray(resArray);
          };

          FetchAllTheData();
        } else {
          alert("Install metamask First");
        }
      } catch (error) {
        alert("Error");
      }
    };

    connectToWallet();
  }, []);

  return (
    <>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white py-5 px-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BiUserCircle size={40} />
            <p className="text-xs font-semibold text-black">
              NFTs: {nftsCount}
            </p>
          </div>
          <p className="text-sm font-semibold text-black">{accountAddressX}</p>
        </div>

        {/* Create DAO Button */}
        <div className="flex justify-end px-10">
          {nftAddress.length === 0 ? (
            <p>Fetching...</p>
          ) : (
            <button
              onClick={() => setIsCreateDAOModalOpen(true)}
              className="bg-black py-1 px-3 text-white text-sm rounded-md"
            >
              Create DAO
            </button>
          )}
        </div>

        {/* DAO Cards */}
        <div className="bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5 md:px-10">
          {/* DAO CARD */}
          {nftsCount === null ? (
            <p>Loading...</p>
          ) : nftsCount === 0 ? (
            <p>No NFTs</p>
          ) : allCardInfoArray.length === 0 ? (
            <p>Fetching DAOs...</p>
          ) : (
            allCardInfoArray.map((y, index) => (
              <Link
                key={y.nftAddressX + index}
                href={y.checkEligibilityX ? `/${y.daoContractAddressX}` : "/"}
              >
                <DAOCard
                  title={y.daoName}
                  deployerAddress={y.daoDeployerAddress}
                  proposalsX={y.totalProposalsCount}
                  nftAddress={y.nftAddressX}
                  minimumBalanceNFT={y.minimumBalanceNFTX}
                  isEligible={y.checkEligibilityX}
                />
              </Link>
            ))
          )}
        </div>

        {/* Create DAO Modal */}
        <CreateDAO
          isVisible={isCreateDAOModalOpen}
          onClickCancel={() => setIsCreateDAOModalOpen(false)}
          nftsAddr={nftAddress}
        />
      </div>
    </>
  );
}
