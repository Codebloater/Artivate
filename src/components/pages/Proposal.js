"use client";

import React, { useEffect } from "react";
import { ethers } from "ethers";
import ProposalCard from "../card/proposalCard";
import { useState } from "react";
import DAO_ABI from "@/constants/daoConstants/DAO_ABI";

const Proposal = ({ daoAddress }) => {
  const [allProposalsArray, setAllProposalsArray] = useState([]);

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
      // const currentBlockTimestamp =  await provider.getBlock().timestamp
      const signer = provider.getSigner();

      try {
        // Set the DAO Contract Instance
        const DAOContractInstance = new ethers.Contract(
          daoAddress,
          DAO_ABI,
          signer
        );

        const proposalsList = await DAOContractInstance.getAllProposals();

        let dataArrX = [];

        for (let i = 0; i < proposalsList.length; i++) {
          const isVotedAddress = await DAOContractInstance.isVotedOn(
            i,
            account[0]
          );

          const a = proposalsList[i];
          const data = {
            proposalTitleX_: a[1],
            proposalStatusX_: a[7].toString(),
            proposalInitiatorX_: a[0],
            proposalCreatedX_: a[4],
            proposalDescriptionX_: a[2],
            proposalTotalVotesCountX_: a[3].toString(),
            proposalCreatedTimeStampX_: a[4].toString(),
            isWalletAddressVotedOnProposalX_: isVotedAddress,
          };
          dataArrX.push(data);
        }

        setAllProposalsArray(dataArrX);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInfo();
  }, []);

  const handleVoteOnProposal = async ({ id }) => {
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
        daoAddress,
        DAO_ABI,
        signer
      );

      await DAOContractInstance.voteOnProposal(id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      {/* SEARCHBAR SECTION */}
      <div className="grid grid-cols-3 bg-white p-2 overflow-y-auto gap-10">
        {allProposalsArray.length == 0 ? (
          <p>Fetching or No Proposals</p>
        ) : (
          allProposalsArray.map((x, index) => {
            return (
              <ProposalCard
                key={x.proposalInitiatorX_ + Math.random()}
                pTitle={x.proposalTitleX_}
                pInitiator={x.proposalInitiatorX_}
                pStatus={x.proposalStatusX_}
                pDesc={x.proposalDescriptionX_}
                pVotes={x.proposalTotalVotesCountX_}
                pDuration={"1 week"}
                pCreatedTimeStamp={x.proposalCreatedTimeStampX_}
                accVotedCheck={x.isWalletAddressVotedOnProposalX_}
                handleonVoteSubmit={() => handleVoteOnProposal({ id: index })}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Proposal;
