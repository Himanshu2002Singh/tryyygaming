import React from "react";
import { BsArrowLeft, BsCreditCard, BsXCircle } from "react-icons/bs";
import { useBottomSheet } from "../context/BottomSheet";
import Deposit from "./depositWithdraw/deposit";

const Purchasedpanelbeforepay = ({ amount }) => {
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  return (
    <div className="w-full pb-3 overflow-hidden bg-[#393939]">
      <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
        Pay ₹{amount}/-{" "}
      </div>

      {/* Wallet Option */}
      <div className="p-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            disabled
            type="checkbox"
            className="h-4 w-4 rounded border-white bg-transparent "
            // checked={walletSelected}
            // onChange={() => setWalletSelected(!walletSelected)}
          />
          <div>
            <p className="text-gray-300 text-[11px]">
              Current Wallet balance 0
            </p>
            <p className="text-sm text-gray-400 text-[10px]">Pay from wallet</p>
          </div>
        </label>
      </div>

      {/* Bank Transfer Option */}
      <div className="mx-2">
        <button
          onClick={() => openBottomSheet(() => <Deposit amount={amount} />)}
          className="w-full bg-[#1E1E1E] text-white py-3 px-4 rounded-md flex items-center justify-between"
        >
          <span className="text-[10px]">Bank Transfer</span>
          <div className="bg-white p-2 rounded-full">
            <BsCreditCard size={10} color="#0066ff" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Purchasedpanelbeforepay;
