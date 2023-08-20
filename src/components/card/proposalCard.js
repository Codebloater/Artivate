import React from "react";

const ProposalCard = ({
  pTitle,
  pInitiator,
  pCreatedTimeStamp,
  pStatus,
  pDesc,
  pVotes,
  pDuration,
  accVotedCheck,
  handleonVoteSubmit,
}) => {
  const proposalIsActiveStatus = () => {
    if (pStatus == 0) {
      return <p className="text-xs text-green-400 font-semibold">Pass</p>;
    } else if (pStatus == 1) {
      return <p className="text-xs text-red-400 font-semibold">Fail</p>;
    } else {
      return (
        <p className="text-xs text-white py-0.5 px-1 rounded-sm bg-orange-400">
          Ongoing
        </p>
      );
    }
  };

  return (
    <div className="bg-white rounded-md shadow-lg shadow-gray-300 h-fit w-fit p-2 flex flex-col gap-2">
      {/* DAO HEADER SECTION */}
      <div className="flex justify-between ">
        <div className="flex flex-col gap-3 p-1">
          <h2 className="text-base text-black font-semibold">{pTitle}</h2>
          <p className="text-xs text-black">initiator: {pInitiator} </p>
          <p className="text-xs text-black">Created: {pCreatedTimeStamp} </p>
        </div>
        <div className="py-1">{proposalIsActiveStatus()}</div>
      </div>
      {/* DAO DESCRIPTION SECTION */}
      <div className="text-xs text-start text-slate-500 p-1">{pDesc}</div>
      <div className="text-xs items-baseline text-start text-gray-500 p-1 flex justify-start gap-5">
        <p className="text-xs text-gray-500">Votes: {pVotes} </p>
        <div className="text-xs text-gray-500">Duration: {pDuration} </div>
        {accVotedCheck == true ? (
          <p className="text-xs text-white py-0.5 px-1 rounded-sm bg-red-400">
            Voted
          </p>
        ) : (
          <button
            onClick={handleonVoteSubmit}
            className="text-xs text-white py-0.5 px-1 rounded-sm bg-green-400"
          >
            Vote
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
