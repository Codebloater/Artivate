"use client";

import React, { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { ethers } from "ethers";
import DAO_ABI from "@/constants/daoConstants/DAO_ABI";

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};

const Member = ({ daoAddress }) => {
  // ALCHEMY SETUP
  const alchemy = new Alchemy(settings);

  const [membersArrayList, setMembersArrayList] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
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
        // Set the DAO Contract Instance
        const DAOContractInstance = new ethers.Contract(
          daoAddress,
          DAO_ABI,
          signer
        );

        const nftContractAddress = await DAOContractInstance.nft_Addr();

        const setAllData = async () => {
          let d = [];

          //
          const nftsOwners = await alchemy.nft.getOwnersForContract(
            nftContractAddress
          );

          let arr = nftsOwners.owners;

          for (const addr of arr) {
            const nftsCountForOwner = await alchemy.nft.getNftsForOwner(addr);

            const data = {
              nftOwnerAddress_: addr,
              ownerNftCount_: nftsCountForOwner.totalCount,
            };

            d.push(data);
          }

          setMembersArrayList(d);
        };
        setAllData();
      } catch (error) {
        console.log(error);
      }
    };

    fetchInfo();
  }, []);
  return (
    <div className="relative overflow-x-auto overflow-y-auto">
      <div className="w-full text-sm text-left text-gray-500">
        <div className="text-xs text-gray-700 uppercase ">
          <div className="flex justify-between text-sm font-semibold">
            <h2 className="p-4">Address</h2>
            <h2 className="p-4">Nfts</h2>
          </div>
        </div>
        <div className="bg-white w-full flex flex-col gap-3">
          {membersArrayList.length == 0 ? (
            <p>Loading...</p>
          ) : (
            membersArrayList.map((x) => {
              return (
                <div
                  key={Math.random()}
                  className="bg-white flex w-full justify-between"
                >
                  <h2 className="p-4 font-medium text-xs text-gray-900 whitespace-nowrap">
                    {x.nftOwnerAddress_}
                  </h2>
                  <p className="p-4">{x.ownerNftCount_}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Member;
