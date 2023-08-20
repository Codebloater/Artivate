import React from "react";

const DAOCard = ({
  title,
  deployerAddress,
  proposalsX,
  nftAddress,
  minimumBalanceNFT,
  isEligible,
}) => {
  return (
    <div className=" w-fit h-fit bg-white rounded-md">
      <div className="flex flex-col gap-3 p-2">
        <h2 className="text-base text-black font-semibold">{title}</h2>
        <p className="text-xs text-gray-500">Deployer: {deployerAddress} </p>
        <p className="text-xs text-gray-500">Proposals: {proposalsX} </p>
        <p className="text-xs text-gray-500">NFT Address: {nftAddress} </p>
        <div className="flex justify-start items-center gap-4">
          <p className="text-xs text-gray-500">
            Min. Balance: {minimumBalanceNFT}
          </p>
          {isEligible == true ? (
            <p className="text-xs py-1 px-2 bg-green-500 text-white rounded-md">
              Eligible
            </p>
          ) : (
            <p className="text-xs py-1 px-2 bg-red-500 text-white rounded-md">
              inEligible
            </p>
          )}
        </div>

        {/* <p className="text-xs text-gray-500">Your NFT Count:</p> */}
      </div>
    </div>
  );
};

export default DAOCard;
