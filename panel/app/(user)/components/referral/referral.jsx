import React from "react";

const Referral = ({ handlereferalsubmit, isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center  px-4 ">
      <div className="w-full max-w-md p-6  rounded-2xl shadow-md">
        <h2 className="text-xl  font-semibold text-center mb-8">
          Enter Your Referral/Promo Code
        </h2>
        <label className="block  font-medium mb-2">Referral/Promo Code</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your code"
        />
        <button
          onClick={handlereferalsubmit}
          type="submit"
          className="my-5 w-full bg-[#4e0909] hover:bg-black hover:border hover:border-[#4e0909] hover:cursor-pointer font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          {" "}
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : null}
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>
        <p className="text-center text-gray-500 text-sm mt-3 cursor-pointer hover:underline">
          Skip for now
        </p>
      </div>
    </div>
  );
};

export default Referral;
