import React from "react";

const Globalsearchbottomsheet = ({ isBottomSheetOpen, toggleBottomSheet }) => {
  return (
    <div
      className={`
      z-[100] 
      absolute 
      left-1/2 
      -translate-x-1/2 
      w-[95%] 

      max-w-md
      sm:max-w-lg
      xl:max-w-xl 
      mx-auto 
      bg-[var(--color-secondary)] 
      shadow-lg 
      rounded-t-2xl 
      transform 
      transition-transform 
      duration-300 
      ease-in-out 
      ${isBottomSheetOpen ? "translate-y-0" : "hidden"}
    `}
      style={{
        height: "85%",
        bottom: "60px",
      }}
    >
      <div className="p-4 h-full overflow-hidden">
        <h2 className="text-sm mb-4 text-center">Global Search</h2>

        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full px-3 py-2 pl-10 text-sm text-[var(--color-text)]  rounded-lg bg-black focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
          />
        </div>

        {/* Close Button - Top Right */}
        <button
          onClick={toggleBottomSheet}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {/* Bottom Sheet Content Goes Here */}
        <div className="h-full">{/* Your bottom sheet content */}</div>
      </div>
    </div>
  );
};

export default Globalsearchbottomsheet;
