import API_URL from "@/config";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { BottomSheetContext } from "../../context/BottomSheet";
import { AuthContext } from "../../context/authprovider";
import { Loader } from "../../utils/loader";
import { BsCopy } from "react-icons/bs";
import MessageAlert from "../alert";

const Deposit = ({ amount }) => {
  const { closeBottomSheet, openBottomSheet } = useContext(BottomSheetContext);
  const [depositAmount, setDepositAmount] = useState(amount ? amount : "");
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const balance = 1250;
  const [uploadedFile, setUploadedFile] = useState(null);
  const [utr, setUtr] = useState("");
  // Fetch payment options from API when amount is submitted
  useEffect(() => {
    if (currentStep === 2 && paymentOptions.length === 0) {
      fetchPaymentOptions();
    }
  }, [currentStep]);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.log("Failed to copy: ", err);
      });
  };

  const fetchPaymentOptions = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${API_URL}/admin/banks`);
      const data = await response.json();
      const activeBanks = data.banks.filter((bank) => bank.status == "Active");
      setPaymentOptions(activeBanks);
    } catch (error) {
      console.log("Error fetching payment options:", error);
      // Fallback data in case API fails
      setPaymentOptions([
        { id: 1, name: "Bank Transfer", icon: "🏦" },
        { id: 2, name: "UPI", icon: "📱" },
        { id: 3, name: "Credit Card", icon: "💳" },
        { id: 4, name: "Wallet", icon: "👛" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAmount = (e) => {
    e.preventDefault();
    if (parseFloat(depositAmount) >= 1000) {
      setCurrentStep(2);
    } else {
      alert("Minimum deposit amount is 1000 coins");
    }
  };

  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleProofsend = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("bankId", selectedPaymentMethod.id);

      formData.append("proof", uploadedFile);
      formData.append("amount", depositAmount);
      formData.append("utr", utr);
      const response = await axios.post(`${API_URL}/deposit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        // alert("Deposit sent to admin for approval!");
        await closeBottomSheet();
        await openBottomSheet(
          () => (
            <MessageAlert message="Deposit request submitted successfully" />
          ),
          { closeicon: false }
        );

        // alert("UTR already exists.");
      } else {
        alert("Deposit failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 409) {
          console.log("UTR already exists");
          // await closeBottomSheet();
          await openBottomSheet(
            () => <MessageAlert message="UTR already exists" />,
            { closeicon: false }
          );
        } else {
          // Handle other error status codes
          alert(
            `Deposit failed. Error: ${
              error.response.data.message || "Please try again."
            }`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        alert("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        alert(`Deposit failed. Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepOne = () => {
    return (
      <div className="w-full pb-3 overflow-hidden bg-[#393939]">
        <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
          Deposit
        </div>
        <div className="px-3">
          <div className="my-4 rounded-lg bg-[#111111] text-center flex flex-col justify-center p-3">
            <div className="text-gray-200 text-xs">Available Balance</div>
            <div className="text-base sm:text-xl font-bold text-gray-200">
              {" "}
              {user ? (user.isDemo ? "500" : user.points) : "1,234.56"}
              {/* {user ? (user.isDemo ? "500" : user.points) + " coins" : "1,234.56"} */}
            </div>
          </div>

          <form onSubmit={handleSubmitAmount}>
            <label htmlFor="deposit-amount" className="block mb-1 text-xs">
              Deposit coins
            </label>
            <input
              type="number"
              id="deposit-amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-2 text-xs py-3 mb-2 bg-[#111111] rounded-lg focus:outline-none text-white"
            />

            <div className="text-xs text-white mb-3">
              Minimum deposit amount is 1000 coins
            </div>

            <button
              type="submit"
              className="w-full text-sm bg-[var(--color-primary)] text-black p-2 rounded-xl font-light hover:bg-green-700"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderStepTwo = () => {
    return (
      <div className="w-full overflow-hidden bg-[#393939]">
        <div className="flex items-center bg-[#171717]  text-white p-3">
          {/* <button onClick={handleBack} className="mr-2">
            ←
          </button> */}
          <div className=" text-sm font-bold text-center flex-1">
            Pay ₹{depositAmount}/-
          </div>
          <button onClick={handleBack} className="mr-2">
            ←
          </button>
          {/* <button onClick={() => closeBottomSheet()} className="ml-2">
            ✕
          </button> */}
        </div>

        {isLoading ? (
          <div className="my-4 text-center">
            <Loader />
          </div>
        ) : (
          <div className="my-4 px-3">
            {paymentOptions.length > 0 ? (
              <>
                {/* Group payment options by account method */}
                {paymentOptions.some(
                  (option) => option.accountMethod === "Bank"
                ) && (
                  <div className="mb-1">
                    <div className="text-xs text-gray-400 mb-2">
                      Bank Transfers
                    </div>
                    {paymentOptions
                      .filter((option) => option.accountMethod === "Bank")
                      .map((option) => (
                        <div
                          key={option.id}
                          onClick={() => handleSelectPaymentMethod(option)}
                          className="bg-[#111111] rounded-lg text-white p-2 mb-2 flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="font-medium text-sm">
                              {option.bankName}
                            </span>
                            <div className="text-xs text-gray-400">
                              {option.depositAmountRange}
                            </div>
                          </div>
                          <span className="text-xl">🏦</span>
                        </div>
                      ))}
                  </div>
                )}

                {paymentOptions.some(
                  (option) => option.accountMethod === "UPI"
                ) && (
                  <div className="mb-1">
                    <div className="text-xs text-gray-400 mb-2">
                      UPI Options
                    </div>
                    {paymentOptions
                      .filter((option) => option.accountMethod === "UPI")
                      .map((option) => (
                        <div
                          key={option.id}
                          onClick={() => handleSelectPaymentMethod(option)}
                          className="bg-[#111111] rounded-lg text-white p-3 mb-2 flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="font-medium">
                              {option.bankName}
                            </span>
                            <div className="text-xs text-gray-400">
                              {option.depositAmountRange}
                            </div>
                          </div>
                          <span className="text-xl">📱</span>
                        </div>
                      ))}
                  </div>
                )}

                {paymentOptions.some(
                  (option) => option.accountMethod === "Wallet"
                ) && (
                  <div className="mb-1">
                    <div className="text-sm text-gray-400 mb-2">
                      Crypto Wallets
                    </div>
                    {paymentOptions
                      .filter((option) => option.accountMethod === "Wallet")
                      .map((option) => (
                        <div
                          key={option.id}
                          onClick={() => handleSelectPaymentMethod(option)}
                          className="bg-[#111111] rounded-lg text-white p-3 mb-2 flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="font-medium">
                              {option.walletType}
                            </span>
                            <div className="text-xs text-gray-400">
                              {option.depositAmountRange}
                            </div>
                          </div>
                          <span className="text-xl">💰</span>
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No payment options found. Please contact support.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Update the renderStepThree function to handle different account methods
  const renderStepThree = () => {
    return (
      <div className="w-full pb-3  bg-[#393939] max-[500px]:max-h-[550px] max-h-[550px]  ">
        <div className="flex items-center bg-[#171717] text-white p-3">
          {/* <button onClick={handleBack} className="mr-2">
            ←
          </button> */}
          <div className="text-sm font-bold text-center flex-1">
            Pay ₹{depositAmount}/-
          </div>
          <button onClick={handleBack} className="mr-2">
            ←
          </button>
          {/* <button onClick={() => setCurrentStep(1)} className="ml-2">
            ✕
          </button> */}
        </div>
        <form onSubmit={handleProofsend} className="px-2">
          <div className="my-4 rounded-lg bg-[#111111] p-3 text-white">
            <div className="border-b pb-2 border-b-gray-900 flex items-center mb-4">
              <div className="w-5 h-5 sm:w-6 sm:h-6  bg-gray-700 rounded-full flex items-center justify-center mr-2">
                {selectedPaymentMethod.accountMethod === "Bank"
                  ? "🏦"
                  : selectedPaymentMethod.accountMethod === "UPI"
                  ? "📱"
                  : "💰"}
              </div>
              <div className="text-xs ">
                {selectedPaymentMethod.accountMethod === "Bank"
                  ? "Bank Details"
                  : selectedPaymentMethod.accountMethod === "UPI"
                  ? "UPI Details"
                  : "Wallet Details"}
              </div>
            </div>

            <div className="space-y-3 bg-[var(--color-secondary)] p-3 rounded-lg">
              {/* Conditional rendering based on account method */}
              {selectedPaymentMethod.accountMethod === "Bank" && (
                <>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-xs">Bank Name</div>
                    <div className="flex items-center">
                      <span className="mr-1 text-xs">
                        {selectedPaymentMethod.bankName}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(selectedPaymentMethod.bankName)
                        }
                        className="text-gray-400"
                      >
                        <BsCopy />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-xs">
                      account holder name
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1 text-white text-xs ">
                        {selectedPaymentMethod?.accountHolderName}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(
                            selectedPaymentMethod.accountHolderName
                          )
                        }
                        className="text-gray-400"
                      >
                        <BsCopy />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-xs">Account Number</div>
                    <div className="flex items-center">
                      <span className="mr-2 text-white text-xs">
                        {selectedPaymentMethod.accountNo}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(
                            selectedPaymentMethod?.accountNo
                          )
                        }
                        className="text-gray-400"
                      >
                        <BsCopy />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-xs">IFSC code</div>
                    <div className="flex items-center text-xs sm:text-base">
                      <span className="mr-2 text-white text-xs">
                        {selectedPaymentMethod?.ifscCode}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(selectedPaymentMethod.ifscCode)
                        }
                        className="text-gray-400"
                      >
                        <BsCopy />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {selectedPaymentMethod.accountMethod === "UPI" && (
                <>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-xs ">UPI Provider</div>
                    <div className="flex items-center">
                      <span className="mr-2 text-xs">
                        {selectedPaymentMethod.bankName}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(selectedPaymentMethod.bankName)
                        }
                        className="text-gray-400"
                      >
                        <BsCopy />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-xs">UPI ID</div>
                    <div className="flex items-center">
                      <span className="mr-2 text-white text-xs">
                        {selectedPaymentMethod.upiId}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(selectedPaymentMethod.upiId)
                        }
                        className="text-gray-400"
                      >
                        <BsCopy />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-xs">Account Holder</div>
                    <div className="flex items-center">
                      <span className="mr-2 text-white text-xs">
                        {selectedPaymentMethod?.accountHolderName}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(
                            selectedPaymentMethod.accountHolderName
                          )
                        }
                        className="text-gray-400"
                      >
                        <BsCopy />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {selectedPaymentMethod.accountMethod === "Wallet" && (
                <>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-xs">Wallet Type</div>
                    <div className="flex items-center">
                      <span className="mr-2 text-xs">
                        {selectedPaymentMethod?.walletType}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(
                            selectedPaymentMethod.walletType
                          )
                        }
                        className="text-gray-400"
                      >
                        <BsCopy />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-xs">Wallet Address</div>
                    <div className="flex items-center">
                      <span className="mr-2 text-red-500 text-xs">
                        {selectedPaymentMethod?.walletAddress}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(
                            selectedPaymentMethod.walletAddress
                          )
                        }
                        className="text-gray-400"
                      >
                        <BsCopy />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-xs">Account Holder</div>
                    <div className="flex items-center">
                      <span className="mr-2 text-red-500 text-xs">
                        {selectedPaymentMethod?.accountHolderName}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(
                            selectedPaymentMethod.accountHolderName
                          )
                        }
                        className="text-gray-400"
                      >
                        <BsCopy />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Display QR code if available */}
          {selectedPaymentMethod.qrCode && (
            <div className="my-4 flex justify-center">
              <img
                src={selectedPaymentMethod.qrCode}
                alt="Payment QR Code"
                className=" max-h-3/13 rounded-md"
              />
            </div>
          )}

          <div className="my-4">
            <label
              htmlFor="payment-screenshot"
              className="flex items-center justify-center gap-2 p-3 border-2 border-[#111111] rounded-xl cursor-pointer bg-transparent text-white"
            >
              <span className="text-sm text-center rounded-full w-5 h-5 bg-white  text-black">
                +
              </span>
              <span className="text-xs  text-white">
                {uploadedFile
                  ? uploadedFile.name
                  : "Click here to upload payment screenshot"}
              </span>
              <input
                type="file"
                id="payment-screenshot"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                required
              />
            </label>
          </div>

          <>
            {" "}
            <label htmlFor="deposit-amount" className="font-bold mb-2 text-xs">
              UTR
            </label>
            <input
              type="text"
              id="utr"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="UTR number"
              required
              className="text-xs w-full p-3 mb-2 bg-[#111111] rounded-lg focus:outline-none text-white"
            />
          </>

          {isLoading && (
            <div className="my-4 text-center">
              <Loader />
            </div>
          )}
          <button
            className={`text-xs w-full p-3 rounded-xl ${
              uploadedFile
                ? "bg-[var(--color-primary)] text-black hover:bg-green-700"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
            disabled={!uploadedFile}
          >
            Submit
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center bg-[var(--color-secondary)]">
      {currentStep === 1 && renderStepOne()}
      {currentStep === 2 && renderStepTwo()}
      {currentStep === 3 && renderStepThree()}
    </div>
  );
};

export default Deposit;
