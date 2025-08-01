"use client";
import React, { useState, useContext, useEffect, Suspense } from "react";
import { FaExternalLinkAlt, FaUser } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
import { AuthContext } from "../../context/authprovider";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import API_URL from "@/config";
import NumberToText from "../../utils/numbertotext";
import Link from "next/link";
import { BsKey } from "react-icons/bs";

// Create a separate component that uses useSearchParams
function PanelTransactionContent() {
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
        `${API_URL}/userpanel/panel-purchase/actions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // If the data is an array, take the first item
        const data = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;

        setPanelData(data);
        if (data.rate) {
          setRate(data.rate);
        }
        console.log("Panel data loaded:", data); // Add this for debugging
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
    try {
      const response = await axios.post(
        `${API_URL}/transactions/deposit`,
        {
          panelPurchaseId: panelId,
          coins: amount,
          convertedAmount: convertedAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Deposit successful:", response.data);
        router.push("/deposit-success");
      }
    } catch (error) {
      console.log("Error processing deposit:", error);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative h-full p-4 bg-[#111111] text-white">
      {/* Header Panel */}
      <div className="bg-[var(--color-secondary)] rounded-lg p-4 mb-4 flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-gray-600 rounded-xl mr-4 overflow-hidden">
              {panelData?.panelDetails ? (
                <img
                  src={panelData.panelDetails.logo}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl">?</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-white text-xs">
                {" "}
                {panelData?.panelDetails.name}
              </h1>
              <p className="text-gray-400 text-sm">{panelData?.loginurl}</p>
            </div>
          </div>
          <div>
            <a
              href={
                panelData?.loginurl?.startsWith("http")
                  ? panelData.loginurl
                  : `https://${panelData?.loginurl}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaExternalLinkAlt />
            </a>
          </div>
        </div>
        <div className=" rounded-t-lg mt-5 p-2 ">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center">
              <FaUser className="text-gray-400 mr-2" />{" "}
              <span className="text-white">
                UserName: {panelData?.username}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-0.5"></div>
        <div className=" rounded-b-lg p-2 text-xs">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BsKey className="text-gray-400 mr-2" />
              <span className="text-white">
                Password: {panelData?.password}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Details */}
      {/* {panelData && (
        <div className="bg-[var(--color-secondary)] rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-white text-sm font-bold">Panel Details</h2>
            <span className="text-xs bg-green-600 px-2 py-1 rounded">
              {panelData.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-gray-400">Rate Type:</p>
              <p className="text-white">{panelData.rateType}</p>
            </div>
            <div>
              <p className="text-gray-400">Account Type:</p>
              <p className="text-white">{panelData.accountType}</p>
            </div>
            <div>
              <p className="text-gray-400">Currency:</p>
              <p className="text-white">{panelData.currency}</p>
            </div>
            <div>
              <p className="text-gray-400">Rate:</p>
              <p className="text-white">{panelData.rate}</p>
            </div>
            <div>
              <p className="text-gray-400">Coins:</p>
              <p className="text-white">{panelData.coins}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Amount:</p>
              <p className="text-white">₹{panelData.totalAmount}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-gray-400 text-xs">Created on:</p>
            <p className="text-white text-xs">
              {formatDate(panelData.createdAt)}
            </p>
          </div>
        </div>
      )} */}

      {/* Transaction History */}
      {panelData?.PanelActions && panelData.PanelActions.length > 0 && (
        <div className="bg-[var(--color-secondary)] rounded-lg p-4 mb-20">
          <h2 className="text-white text-sm border-b w-max  border-b-[var(--color-primary)] font-bold mb-3">
            Transaction History
          </h2>

          <div className="space-y-3">
            {panelData.PanelActions.map((action, index) => (
              <div key={index} className="bg-[#1E1E1E] rounded-lg text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      src={action.PanelPurchase.panelDetails.logo} // Correct path to logo
                      alt={action.PanelPurchase.panelDetails.name}
                      className="w-10 rounded-full h-10 object-contain"
                      // onError={(e) => {
                      //   // Fallback image if logo fails to load
                      //   e.target.src = "/default-panel-logo.png";
                      //   e.target.onerror = null;
                      // }}
                    />
                    <div className="flex flex-col">
                      <h3>{action.description}</h3>
                      <h3>{formatDate(action.createdAt)}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white">{action.coins}</p>
                    <span
                      className={` py-1 rounded ${
                        action.status === "Approved"
                          ? "text-green-600"
                          : action.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {action.status}
                    </span>
                  </div>
                </div>
                {/* <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">
                    {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      action.status === "Approved"
                        ? "bg-green-600"
                        : action.status === "Pending"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  >
                    {action.status}
                  </span>
                </div> */}
                {/* <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-400">Coins:</p>
                    <p className="text-white">{action.coins}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Amount:</p>
                    <p className="text-white">₹{action.totalAmount}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400">Description:</p>
                    <p className="text-white">{action.description}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400">Date:</p>
                    <p className="text-white">{formatDate(action.createdAt)}</p>
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Main component with Suspense
const PanelTransaction = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      }
    >
      <PanelTransactionContent />
    </Suspense>
  );
};

export default PanelTransaction;
