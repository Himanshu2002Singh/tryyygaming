"use client";
import React, { useContext, useState } from "react";
import { BottomSheetContext } from "../../context/BottomSheet";

const editstake = () => {
  const { closeBottomSheet } = useContext(BottomSheetContext);

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [acceptAnyOdds, setAcceptAnyOdds] = useState({
    bookmaker: true,
    fancy: true,
  });

  const stakeAmounts = [100, 500, 1000, 5000, 10000, 50000, 100000];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
  };

  const handleToggleChange = (type) => {
    setAcceptAnyOdds({
      ...acceptAnyOdds,
      [type]: !acceptAnyOdds[type],
    });
  };

  return (
    <div className="w-full flex items-center justify-center pb-3 bg-[#393939]">
      <div className="w-full rounded-lg  text-white">
        <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
          <h2 className="text-sm font-semibold">Edit Stake</h2>
        </div>
        <div className="px-4">
          <p className="text-gray-400 my-3 text-sm">
            Please fill all required fields (*)
          </p>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {stakeAmounts.slice(0, 4).map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`bg-black py-2 text-xs text-center rounded ${
                  selectedAmount === amount ? "ring-2 ring-white" : ""
                }`}
              >
                {amount}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {stakeAmounts.slice(4).map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`bg-black py-2 text-xs text-center rounded ${
                  selectedAmount === amount ? "ring-2 ring-white" : ""
                }`}
              >
                {amount}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <p className="mb-2 text-sm">Accept Any Odds</p>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleChange("bookmaker")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    acceptAnyOdds.bookmaker ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      acceptAnyOdds.bookmaker
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm">Bookmaker</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleChange("fancy")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    acceptAnyOdds.fancy ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      acceptAnyOdds.fancy ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm">Fancy</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => closeBottomSheet()}
              className="py-1 hover:cursor-pointer text-sm bg-transparent border rounded text-center"
            >
              Cancel
            </button>
            <button
              onClick={() => closeBottomSheet()}
              className="py-1 hover:cursor-pointer bg-black rounded text-center"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default editstake;
