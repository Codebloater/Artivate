"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import DAO_ABI from "@/constants/daoConstants/DAO_ABI";
import DAO_ByteCode from "@/constants/daoConstants/DAO_ByteCode";
import ALLDAOInfoABI from "@/constants/AllDAOConstants/AllDAOInfo_ABI";

const CreateDAO = ({ isVisible, onClickCancel, nftsAddr }) => {
  if (!isVisible) {
    return null;
  }

  const allNFTsAddresses = nftsAddr;

  const [selectedNFTContractOption, setSelectedNFTContractOption] = useState(
    allNFTsAddresses[0]
  );

  const handleOptionChange = (event) => {
    setSelectedNFTContractOption(event.target.value);
  };

  const [accountX, setAccountX] = useState("");
  const [daoName, setDaoName] = useState("");
  const [minBalance, setMinBalance] = useState(null);
  const [minVotesForPorposal, setMinVotesForPorposal] = useState(null);

  const connectToWallet = async () => {
    // Check the Ethereum is there or Not
    if (!window.ethereum) {
      alert("Install Metamask");
      return;
    }

    try {
      const { ethereum } = window;
      if (ethereum) {
        // GET ACCOUNT ADDRESSES
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccountX(account[0]);
      } else {
        alert("Install metamask First");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(nftsAddr);
  connectToWallet();

  const onClickSubmit = async (e) => {
    e.preventDefault();

    const deployDAOContract = async () => {
      // Check the Ethereum is there or Not
      if (!window.ethereum) {
        alert("Install Metamask");
        return;
      }

      const account = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // fetch Provider and Signer
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      try {
        // Set the DAO ContractFactory Instance
        const contract_Factory = new ethers.ContractFactory(
          DAO_ABI,
          DAO_ByteCode,
          signer
        );

        //!------- Check Network Id -----------------------------
        const networkInfo = await provider.getNetwork();
        const networkId = networkInfo.chainId;
        //!-----------------------------------------------------

        if (networkId == 11155111) {
          // DAO Contract Deploy
          let DAOContract = await contract_Factory.deploy(
            selectedNFTContractOption,
            minBalance,
            daoName,
            account[0],
            minVotesForPorposal
          );

          await DAOContract.deployed();
          console.log(`Deployed Successfully DAO: ${DAOContract.address}`);

          // Set the AllDAO Contract Instance
          const AllDAOContractInstance = new ethers.Contract(
            "0x8853924802c3ce981618e968713e649252f125b4",
            ALLDAOInfoABI,
            signer
          );

          try {
            const tx = await AllDAOContractInstance.addNew(
              selectedNFTContractOption,
              DAOContract.address
            );
            await tx.wait();
            alert(`Successfully added Contract Address to User Contract`);
          } catch (error) {
            console.log(error);
          }
        } else {
          alert("Only Sepolia Network ");
        }
      } catch (error) {
        console.log(error);
      }
    };

    deployDAOContract();
  };

  return (
    <div
      className={
        "fixed flex items-center justify-center bg-gray-400 bg-opacity-60 inset-0 backdrop-blur-sm top-0 bottom-0 right-0 left-0 text-black"
      }
    >
      <form className="bg-white rounded-lg p-4 w-96 flex flex-col gap-14">
        <div className="flex justify-center items-center">
          <h2 className="font-semibold text-xl">New DAO</h2>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400">Creator</p>
            <div className="text-xs">
              {accountX == "" ? <p>Loading...</p> : accountX}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400">NFT Address</p>
            <select
              className="text-xs"
              value={selectedNFTContractOption}
              onChange={handleOptionChange}
            >
              {allNFTsAddresses.map((option) => (
                <option
                  className="text-xs"
                  key={option + Math.random()}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400">DAO Name</p>
            <input
              type="text"
              value={daoName}
              onChange={(e) => setDaoName(e.target.value)}
              className="text-sm px-2 py-1 rounded-md placeholder:text-gray-400"
              placeholder="e.g The Maker"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400">
              Minimum Balance to Enter DAO
            </p>
            <input
              type="number"
              value={minBalance == null ? 1 : minBalance}
              onChange={(e) => setMinBalance(e.target.value)}
              className="text-sm px-2 py-1 rounded-md placeholder:text-gray-400"
              placeholder="e.g 1"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400">
              Minimum Votes for Proposal to Pass
            </p>
            <input
              type="number"
              value={minVotesForPorposal == null ? 1 : minVotesForPorposal}
              onChange={(e) => setMinVotesForPorposal(e.target.value)}
              className="text-sm px-2 py-1 rounded-md placeholder:text-gray-400"
              placeholder="e.g 10"
            />
          </div>
          <div className="flex justify-evenly gap-2">
            <button
              onClick={onClickSubmit}
              className="bg-green-400 py-1 px-2 text-white rounded-md"
            >
              Deploy
            </button>
            <button
              onClick={onClickCancel}
              className="bg-red-400 py-1 px-2 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateDAO;
