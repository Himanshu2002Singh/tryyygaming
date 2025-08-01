"use client";
import React, { useContext } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { BottomSheetContext } from "../context/BottomSheet";

const DemoUseralert = () => {
  const { closeBottomSheet } = useContext(BottomSheetContext);
  return (
    <div className="p-4 w-full rounded-md shadow-lg">
      <div className="bg-[#171717] p-2 rounded-lg flex items-center ">
        <div className="bg-[var(--color-primary)] p-2 rounded-md">
          <FiAlertCircle className="text-white h-3 w-3" />
        </div>

        <span className="text-white font-medium ml-2">Alert</span>
      </div>

      <p className="text-gray-300 my-3 text-sm">
        This is a demo ID please use real ID to use this feature.
      </p>

      <button
        onClick={closeBottomSheet}
        className="w-full text-xs bg-[var(--color-primary)] text-black text-center py-2 px-2 rounded-md font-medium transition-colors"
      >
        OK
      </button>
    </div>
  );
};

export default DemoUseralert;
