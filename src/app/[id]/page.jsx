"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { FiSettings } from "react-icons/fi";
import { Network, Alchemy } from "alchemy-sdk";
import Proposal from "@/components/pages/Proposal";
import Member from "@/components/pages/Member";
import DAO_ABI from "@/constants/daoConstants/DAO_ABI";
import CreateNewProposal from "@/components/modal/createNewProposal";

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};

const page = ({ params }) => {
  const alchemy = new Alchemy(settings);

  const [setProposalPageSelection, setsetProposalPageSelection] =
    useState(true);

  const [daoTitle, setDaoTitle] = useState("");
  const [daoMembersCount, setDaoMembersCount] = useState(null);
  const [daoProposalsCount, setDaoProposalsCount] = useState(null);
  const [daoCreator, setDaoCreator] = useState("");

  const [newProposalModal, setNewProposalModal] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!window.ethereum) {
        alert("Install Metamask");
        return;
      }

      // fetch Provider and Signer
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      try {
        // Set the DAO Contract Instance
        const DAOContractInstance = new ethers.Contract(
          `${params.id}`,
          DAO_ABI,
          signer
        );

        const daotitleX = await DAOContractInstance.DAOName();
        const proposalCountX = await DAOContractInstance._proposalCounter();
        const daoCreatorX = await DAOContractInstance.Creator();

        const nftContractAddress_ = await DAOContractInstance.nft_Addr();

        //
        const nftsOwners = await alchemy.nft.getOwnersForContract(
          nftContractAddress_
        );

        let arr = nftsOwners.owners;

        setDaoMembersCount(arr.length);

        setDaoTitle(daotitleX);
        setDaoProposalsCount(proposalCountX.toString());
        setDaoCreator(daoCreatorX);
      } catch (error) {
        aalert("Error");
      }
    };

    fetchInfo();
  }, []);

  return (
    <>
      <div className="bg-white h-screen w-screen">
        <div className=" w-full h-44 flex justify-between px-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between px-3">
          <div className=" flex items-start py-4">
            <div className="flex justify-start items-baseline gap-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {daoTitle == "" ? null : daoTitle}
                </h2>
              </div>
              <div>
                <p className="text-xs">
                  Members:{" "}
                  {daoMembersCount == 0 ? "No Members" : daoMembersCount}
                </p>
              </div>
              <div>
                <p className="text-xs">
                  Proposals:{" "}
                  {daoProposalsCount == "" ? null : daoProposalsCount}
                </p>
              </div>
              <div>
                <p className="text-xs">
                  Creator: {daoCreator == "" ? null : daoCreator}
                </p>
              </div>
            </div>
          </div>
          {/* DAO INFORMATION SECTION */}
          <div className=" flex justify-start items-start py-4">
            <div className="flex justify-start items-center gap-2">
              <div className="border-black border-2 px-2 py-0.5 rounded-md">
                <p className="text-xs">{params.id}</p>
              </div>
              {/*<div>
              <FiSettings size={25} />
             </div> */}
            </div>
          </div>
        </div>
        {/* DAO DESCRIPTION SECTION */}
        {/*
        <div className=" w-full min-h-fit h-28 flex justify-between px-3">
          <div className=" flex items-start  py-2">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs">About Us Description</p>
              </div>
            </div>
          </div>
        </div>
      */}
        {/* PROPOSALS & MEMBERS TAB SECTION */}
        <div className=" w-full flex mt-10 flex-col gap-3 justify-between px-3">
          {/* PROPOSALS & MEMBERS NAVBAR SECTION */}
          <div className="flex justify-between w-full items-baseline">
            <div className="flex justify-start items-baseline gap-10">
              <div className="text-sm">
                <button
                  onClick={() => setsetProposalPageSelection(true)}
                  className={
                    setProposalPageSelection == true
                      ? "font-semibold"
                      : "text-gray-500 font-semibold"
                  }
                >
                  Proposals
                </button>
              </div>
              <div className="text-sm">
                <button
                  className={
                    setProposalPageSelection == true
                      ? "text-gray-500 font-semibold"
                      : "font-semibold"
                  }
                  onClick={() => setsetProposalPageSelection(false)}
                >
                  Members
                </button>
              </div>
            </div>
            <div>
              <button
                onClick={() => setNewProposalModal(true)}
                className="bg-black text-white text-sm py-0.5 px-2 rounded-md"
              >
                New Proposal
              </button>
            </div>
          </div>
          {/* PROPOSALS & MEMBERS PAGE SECTION */}
          <div className="">
            {setProposalPageSelection == true ? (
              <Proposal daoAddress={params.id} />
            ) : (
              <Member daoAddress={params.id} />
            )}
          </div>
        </div>
      </div>
      <CreateNewProposal
        isModalVisible={newProposalModal}
        onClickCancel={() => setNewProposalModal(false)}
        daoContractAddressX={params.id}
      />
    </>
  );
};

export default page;
