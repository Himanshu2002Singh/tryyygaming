"use client";
import React, { useState, useContext, useEffect, Suspense } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
import { AuthContext } from "../../context/authprovider";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import API_URL from "@/config";
import NumberToText from "../../utils/numbertotext";
import { BottomSheetContext, useBottomSheet } from "../../context/BottomSheet";
import Deposit from "../../components/depositWithdraw/deposit";
import Purchasedpanelbeforepay from "../../components/purchasedpanelbeforepay";
import MessageAlert from "../../components/alert";

// Create a separate component that uses useSearchParams
function PanelDepositeContent() {
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(0.06);
  const [panelData, setPanelData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const panelId = searchParams.get("panelId");
  const [amountinText, setAmountinText] = useState("");

  useEffect(() => {
    if (panelId) {
      fetchPanelData(panelId);
    }
  }, [panelId]);

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

  const handleBuyNow = async () => {
    if (user && user.points && !user.isDemo && user.points >= amount) {
      try {
        const response = await axios.post(
          `${API_URL}/userpanel/panel-actions/deposit`,
          {
            panelPurchaseId: panelId,
            coins: amount,
            rate: rate,
            totalAmount: convertedAmount,
            currency: "INR",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          console.log("Deposit successful:", response.data);
          await openBottomSheet(
            () => (
              <MessageAlert message="Deposit request submitted successfully" />
            ),
            { closeicon: false }
          );
          // router.push("/deposit-success");
        }
      } catch (error) {
        console.log("Error processing deposit:", error);
      }
    } else {
      openBottomSheet(() => <Purchasedpanelbeforepay amount={amount} />);
      // openBottomSheet(Deposit);
    }
  };

  return (
    <div className="relative h-full p-4 bg-[#111111] text-white">
      {/* Header Panel */}
      <div className="bg-[var(--color-secondary)] rounded-lg p-4 mb-4 flex-col">
        <div className="flex items-start">
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

      {/* Deposit Coins */}
      <div className="mb-4">
        <h2 className="text-white mb-2 text-sm font-bold">Deposit Coins</h2>
        <div className="bg-[#1E1E1E] rounded-lg p-3">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="w-full bg-transparent text-white text-sm  border-none outline-none"
          />
          {/* <span className="float-right  text-white text-sm">
            {panelData?.rate} × {amount} = ₹ {convertedAmount.toFixed(0)}
          </span> */}
        </div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-gray-400 text-xs">{amountinText}</span>
      </div>
      {/* Action Buttons */}
      <div className=" flex gap-2 p-4 ">
        {/* <button
          onClick={handleAddToCart}
          className="flex-1 bg-yellow-500 text-xs text-black py-1 rounded-xl font-medium"
        >
          Add to Cart
        </button> */}
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-yellow-500 text-xs text-black py-3 rounded-xl font-medium"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

// Main component with Suspense
const PanelDeposite = () => {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-white">
          Loading panel deposit information...
        </div>
      }
    >
      <PanelDepositeContent />
    </Suspense>
  );
};

export default PanelDeposite;
