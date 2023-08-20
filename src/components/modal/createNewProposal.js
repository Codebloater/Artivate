"use client";

import React, { useState } from "react";
import DAO_ABI from "@/constants/daoConstants/DAO_ABI";
import { ethers } from "ethers";

const CreateNewProposal = ({
  isModalVisible,
  onClickCancel,
  daoContractAddressX,
}) => {
  if (!isModalVisible) {
    return null;
  }

  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");

  const onClickSubmit = async (e) => {
    e.preventDefault();

    const deployNewProposal = async () => {
      // Check the Ethereum is there or Not
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
          daoContractAddressX,
          DAO_ABI,
          signer
        );

        await DAOContractInstance.NewProposal(proposalTitle, proposalDesc);

        setProposalTitle("");
        setProposalDesc("");
      } catch (error) {
        console.log(error);
      }
    };

    deployNewProposal();
  };

  return (
    <div
      className={
        "fixed flex items-center justify-center bg-gray-400 bg-opacity-60 inset-0 backdrop-blur-sm top-0 bottom-0 right-0 left-0 text-black"
      }
    >
      <form className="bg-white rounded-lg p-4 w-96 flex flex-col gap-14">
        <div className="flex justify-start items-center">
          <h2 className="font-semibold text-xl">New Proposal</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400">Title</p>
          <input
            type="text"
            value={proposalTitle}
            onChange={(e) => setProposalTitle(e.target.value)}
            className="text-sm px-2 py-1 rounded-md placeholder:text-gray-400"
            placeholder="e.g Hire Someone"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400">Description</p>
          <textarea
            type="text"
            value={proposalDesc}
            onChange={(e) => setProposalDesc(e.target.value)}
            className="text-sm px-2 py-1 rounded-md placeholder:text-gray-400"
            placeholder="e.g Hire Someone"
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
      </form>
    </div>
  );
};

export default CreateNewProposal;
