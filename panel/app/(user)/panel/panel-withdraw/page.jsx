"use client";
import React, { useState, useContext, useEffect, Suspense } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
import { AuthContext } from "../../context/authprovider";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import API_URL from "@/config";
import NumberToText from "../../utils/numbertotext";
import BankingInfoUI from "../../components/depositWithdraw/bankshowui";
import { useUserBank } from "../../context/userbankprovider";
import { useBottomSheet } from "../../context/BottomSheet";
import MessageAlert from "../../components/alert";
import { toast, ToastContainer } from "react-toastify";
// Create a separate component that uses useSearchParams
function PanelWithdrawContent() {
  const { activeBanks, loading, addBankAccount } = useUserBank();
  const { openBottomSheet } = useBottomSheet();
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(0.06);
  const [panelData, setPanelData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const panelId = searchParams.get("panelId");
  const [amountinText, setAmountinText] = useState("");
  const [selectedOptionwithdraw, setSelectedOptionwithdraw] = useState("bank");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [isloading, setLoading] = useState(false);
  useEffect(() => {
    if (panelId) {
      fetchPanelData(panelId);
    }
  }, [panelId]);
  useEffect(() => {
    if (activeBanks && activeBanks.length > 0 && !selectedBankId) {
      setSelectedBankId(activeBanks[0].id);
    }
  }, [activeBanks, selectedBankId]);
  useEffect(() => {
    let amountinTextstate = NumberToText(amount);
    setAmountinText(amountinTextstate);
  }, [amount]);

  const fetchPanelData = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/userpanel/purchased-panel/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setPanelData(response.data.data);
        if (response.data.data.rate) {
          setRate(response.data.data.rate);
        }
      }
    } catch (error) {
      console.error("Error fetching panel data:", error);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value ? parseInt(value) : 0);
  };

  const convertedAmount = amount * rate;

  const handleAddToCart = () => {
    console.log("Added to cart:", { panelId, amount, convertedAmount });
  };

  const handleSubmit = async () => {
    try {
      // Validate inputs
      if (amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      if (selectedOptionwithdraw === "bank" && !selectedBankId) {
        toast.error("Please select a bank account");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${API_URL}/userpanel/panel-actions/withdraw`,
        {
          panelPurchaseId: panelId,
          coins: amount,
          rate: rate,
          totalAmount: convertedAmount,
          currency: "INR",
          withdrawalMethod: selectedOptionwithdraw,
          bankId:
            selectedOptionwithdraw === "bank" ? selectedBankId : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Deposit successful:", response.data);
        openBottomSheet(
          () => (
            <MessageAlert message="Withdrawal request submitted successfully" />
          ),
          { closeicon: false }
        );
        // router.push("/deposit-success");
      }
    } catch (error) {
      console.error("Error processing deposit:", error);
    }
  };

  return (
    <div className="relative h-full p-4 bg-[#111111] text-white">
      {/* Header Panel */}
      <ToastContainer />
      <div className="bg-[var(--color-secondary)] rounded-lg p-4 mb-4 flex-col">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-600 rounded-full mr-4 overflow-hidden">
            {panelData?.panelDetails ? (
              <img
                src={panelData.panelDetails.logo}
                alt="logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl">?</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-white text-xs">
              {panelData?.panelDetails?.name}
            </h1>
            <p className="text-gray-400 text-sm">
              {panelData?.panelDetails?.category}
            </p>
          </div>
        </div>
        <div className="bg-[#171717] rounded-t-lg mt-5 p-2 ">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center">
              <FaUser className="text-gray-400 mr-2" />
              <span className="text-gray-400">Username</span>
            </div>
            <span className="text-white">{panelData?.username}</span>
          </div>
        </div>
        <div className="w-full h-0.5"></div>
        {/* <div className="bg-[#171717] rounded-b-lg p-2 text-xs">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <IoIosEye className="text-gray-400 mr-2" />
              <span className="text-gray-400">Rate</span>
            </div>
            <span className="text-white">{panelData?.rate}</span>
          </div>
        </div> */}
      </div>

      {/* Withdraw Coins */}
      <div className="mb-4">
        <h2 className="text-white mb-2 text-sm font-bold">Withdraw Coins</h2>
        <div className="bg-[#1E1E1E] rounded-lg p-3">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="w-full bg-transparent text-white text-sm border-none outline-none"
          />
          {/* <span className="float-right text-white text-sm">
            {panelData?.rate} × {amount} = ₹ {convertedAmount.toFixed(0)}
          </span> */}
        </div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-gray-400 text-xs">{amountinText}</span>
      </div>

      {/* Withdraw Options */}
      <div className="text-white py-4 w-full max-w-md">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOptionwithdraw === "wallet"
                  ? "border-white"
                  : "border-gray-500"
              }`}
              onClick={() => setSelectedOptionwithdraw("wallet")}
            >
              {selectedOptionwithdraw === "wallet" && (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-xs">Withdraw to wallet</span>
          </div>

          <div className="flex items-center space-x-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOptionwithdraw === "bank"
                  ? "border-white"
                  : "border-gray-500"
              }`}
              onClick={() => setSelectedOptionwithdraw("bank")}
            >
              {selectedOptionwithdraw === "bank" && (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-xs">Withdraw to bank</span>
          </div>
        </div>
      </div>

      {selectedOptionwithdraw === "bank" && (
        <BankingInfoUI
          selectedBankId={selectedBankId}
          setSelectedBankId={setSelectedBankId}
        />
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 p-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="flex-1 bg-[var(--color-primary)] text-xs text-black py-3 rounded-xl font-medium"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

// Main component with Suspense
const PanelWithdraw = () => {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-white">
          Loading panel withdraw information...
        </div>
      }
    >
      <PanelWithdrawContent />
    </Suspense>
  );
};

export default PanelWithdraw;
