"use client";
import React, { useContext } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { BottomSheetContext } from "../context/BottomSheet";

const MessageAlert = ({
  message = "Submitted for Approval.",
  title = "Alert",
  buttonText = "OK",
}) => {
  const { closeBottomSheet } = useContext(BottomSheetContext);

  return (
    <div className="p-4 w-full rounded-md shadow-lg">
      <div className="bg-[#171717] p-2 rounded-lg flex items-center ">
        <div className="bg-[var(--color-primary)] p-2 rounded-md">
          <FiAlertCircle className="text-white h-3 w-3" />
        </div>
        <span className="text-white font-medium ml-2">{title}</span>
      </div>

      <p className="text-gray-300 my-3 text-sm">{message}</p>

      <button
        onClick={closeBottomSheet}
        className="w-full text-xs bg-[var(--color-primary)] text-black text-center py-2 px-2 rounded-md font-medium transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MessageAlert;
