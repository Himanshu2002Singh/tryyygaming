import React from "react";
import { FaDownload } from "react-icons/fa";

const MobileDownloadButton = () => {
  const handleDownload = () => {
    alert("Launching soon");
  };
  return (
    <div className="px-4 py-1  block md:hidden ">
      <button className="text-black bg-transparent text-xs py-3 w-full flex items-center justify-center gap-3 p-2 rounded-lg border border-[var(--color-primary)]  cursor-pointer transition">
        <FaDownload className="text-[var(--color-primary)] text-xl" />
        <span className="text-[var(--color-primary)]">Download App</span>
      </button>
    </div>
  );
};

export default MobileDownloadButton;
