import React from "react";

function TabItem({ title, isActive, onClick, textColor }) {
  return (
    <button
      className={`px-2 sm:px-4 py-4 text-xs sm:text-base font-medium ${
        isActive
          ? "border-b-2 bg-[#1E1E1E] text-white  border-[var(--color-primary)]"
          : `${textColor || "text-black"}`
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default TabItem;
