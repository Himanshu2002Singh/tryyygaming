"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_URL from "@/config";
import NumberToText from "@/app/(user)/utils/numbertotext";
import { useBottomSheet } from "@/app/(user)/context/BottomSheet";
import MessageAlert from "@/app/(user)/components/alert";
import { AuthContext } from "@/app/(user)/context/authprovider";
import Purchasedpanelbeforepay from "@/app/(user)/components/purchasedpanelbeforepay";

const CreateWebPanel = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { fetchUserDetails } = useContext(AuthContext);
  const { openBottomSheet } = useBottomSheet();
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState(null);
  const [username, setUsername] = useState("");
  const [rateType, setRateType] = useState("sharing");
  const [accountType, setAccountType] = useState("Admin");
  const [currency, setCurrency] = useState("INR");
  const [coins, setCoins] = useState(10000);
  const [rate, setRate] = useState(0);
  const [showRateChart, setShowRateChart] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalamountIntext, setTotalamountIntext] = useState("");
  const [applicableRateRange, setApplicableRateRange] = useState({
    min: 0,
    max: 0,
  });

  useEffect(() => {
    setRate(applicableRateRange.min);
  }, [applicableRateRange]);
  useEffect(() => {
    if (id) {
      fetchPanelDetails();
    }
  }, [id]);

  useEffect(() => {
    // Calculate total amount when coins or rate changes
    if (rate > 0) {
      setTotalAmount(coins * rate);
    }
  }, [coins, rate]);

  useEffect(() => {
    // Update rate based on coins and rate chart when in sharing mode
    if (panel && rateType === "sharing" && panel.rateChart) {
      updateRateFromChart(coins);
    } else if (panel && rateType === "purchase" && panel.purchaserate) {
      // Set fixed purchase rate
      setRate(parseFloat(panel.purchaserate));
    }
  }, [coins, rateType, panel]);

  const updateRateFromChart = (coinAmount) => {
    if (!panel || !panel.rateChart) return;

    let rateChart = panel.rateChart;

    // If rateChart is a string, parse it
    if (typeof rateChart === "string") {
      try {
        rateChart = JSON.parse(rateChart);
      } catch (e) {
        console.error("Error parsing rate chart:", e);
        return;
      }
    }

    // Sort rate chart by coins (ascending)
    const sortedRateChart = [...rateChart].sort((a, b) => {
      const coinsA = parseInt(a.coins.replace(/[^0-9]/g, ""));
      const coinsB = parseInt(b.coins.replace(/[^0-9]/g, ""));
      return coinsA - coinsB;
    });

    // Find applicable rate tier
    let applicableTier = sortedRateChart[0]; // Default to first tier

    for (let tier of sortedRateChart) {
      const tierCoins = parseInt(tier.coins.replace(/[^0-9]/g, ""));
      if (coinAmount >= tierCoins) {
        applicableTier = tier;
      } else {
        break;
      }
    }

    // Set the applicable rate range
    const minRate = parseFloat(applicableTier.minRate);
    const maxRate = parseFloat(applicableTier.maxRate);

    setApplicableRateRange({ min: minRate, max: maxRate });

    // Set rate to min rate if current rate is outside the range
    if (rate < minRate || rate > maxRate || rate === 0) {
      setRate(minRate);
    }
  };
  useEffect(() => {
    let valueintext = NumberToText(totalAmount.toFixed(0));
    setTotalamountIntext(valueintext);

    // Update total amount in text when total amount changes
  }, [totalAmount]);

  const fetchPanelDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/panels/${id}`);
      const panelData = response.data.data;
      setPanel(panelData);
      if (panelData.accounttype) {
        setAccountType(panelData.accounttype);
      }
      // Initialize rate based on rate type
      if (rateType === "sharing" && panelData.rateChart) {
        // Set initial rate based on rate chart for 10,000 coins
        updateRateFromChart(10000);
      } else if (rateType === "purchase" && panelData.purchaserate) {
        // Set fixed purchase rate
        setRate(parseFloat(panelData.purchaserate));
      } else {
        // Fallback to a default rate
        setRate(0.16);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching panel details:", error);
      toast.error("Failed to fetch panel details");
      setLoading(false);
      // Redirect back if panel not found
      router.push("/paneldashboard");
    }
  };

  const handleRateChange = (e) => {
    // Get the raw input value without validation first
    const inputValue = e.target.value;

    // Check if the field is empty or just a decimal point (to allow typing)
    if (inputValue === "" || inputValue === ".") {
      // Set a temporary raw value in the input field
      e.target.value = inputValue;
      return;
    }

    const displayValue = parseFloat(inputValue);

    // Only validate and update if we have a valid number
    if (!isNaN(displayValue)) {
      const newRate = displayValue / 100;

      // Validate rate is within applicable range for sharing mode
      if (rateType === "sharing") {
        // Don't enforce min/max while typing - let user complete their input
        // Just store the value as is
        setRate(newRate);

        // Display warnings but don't force correction during typing
        if (
          newRate < applicableRateRange.min ||
          newRate > applicableRateRange.max
        ) {
          // Optional: Show a gentle warning instead of error toast
          console.warn(
            `Rate should be between ${applicableRateRange.min * 100} and ${
              applicableRateRange.max * 100
            }`
          );
        }
      } else {
        // For purchase mode, rate is fixed
        setRate(parseFloat(panel.purchaserate));
      }
    }
  };

  const handleCoinsChange = (e) => {
    const newCoins = parseInt(e.target.value) || 0;
    setCoins(newCoins);

    // Rate will be updated by the useEffect
  };

  const handleRateTypeChange = (type) => {
    setRateType(type);

    // Update rate based on new rate type
    if (panel) {
      if (type === "sharing" && panel.rateChart) {
        updateRateFromChart(coins);
      } else if (type === "purchase" && panel.purchaserate) {
        setRate(parseFloat(panel.purchaserate));
      }
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (!username) {
      return toast.error("Please enter a username");
    }

    // Validate rate based on rate type
    if (rateType === "sharing") {
      if (rate < applicableRateRange.min) {
        setRate(applicableRateRange.min); // Correct the rate to minimum allowed
        return toast.error(
          `Rate cannot be less than ${applicableRateRange.min * 100}`
        );
      } else if (rate > applicableRateRange.max) {
        setRate(applicableRateRange.max); // Correct the rate to maximum allowed
        return toast.error(
          `Rate cannot be more than ${applicableRateRange.max * 100}`
        );
      }
    }

    try {
      setIsProcessing(true);

      const purchaseData = {
        panelId: id,
        username,
        rateType,
        accountType,
        currency,
        coins,
        rate: rate,
        totalAmount,
      };

      const response = await axios.post(
        `${API_URL}/userpanel/purchase-panel`,
        purchaseData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        await openBottomSheet(
          () => <MessageAlert message="Purchase sent for review" />,
          { closeicon: false }
        );

        await fetchUserDetails();
        // toast.success(response.data.message);
        //
      }

      toast.success("Purchase initiated successfully");
      // Redirect to payment page or order confirmation
      // router.push(`/paneldashboard/payment/${response.data.data.id}`);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 400) {
          openBottomSheet(() => (
            <Purchasedpanelbeforepay amount={totalAmount} />
          ));

          // await closeBottomSheet();
          // await openBottomSheet(() => (
          //   <MessageAlert message="Insuffiicient balance" />
          // ));
        } else {
          // Handle other error status codes
          alert(
            `Deposit failed. Error: ${
              error.response.data.message || "Please try again."
            }`
          );
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = async () => {
    if (!username) {
      return toast.error("Please enter a username");
    }

    try {
      setIsProcessing(true);

      const cartData = {
        panelId: id,
        username,
        rateType,
        accountType,
        currency,
        coins,
        rate,
        totalAmount,
      };

      await axios.post(`${API_URL}/userpanel/addtocart`, cartData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Added to cart successfully");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#111111] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }
  if (!panel) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#111111] text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Panel not found</p>
          <button
            onClick={() => router.push("/paneldashboard")}
            className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-xl"
          >
            Back to Panels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen pb-12 overflow-auto bg-[#111111] text-white">
      {/* Main Content */}
      <div className="p-4 max-w-4xl mx-auto">
        {/* Exchange Info */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-black p-2 rounded-xl mr-3">
              {panel.logo ? (
                <img
                  src={panel.logo}
                  alt={panel.name}
                  className="w-12 h-8 object-contain"
                />
              ) : (
                <div className="w-12 h-8 flex items-center justify-center text-white">
                  {panel.name.substring(0, 1)}
                </div>
              )}
            </div>
            <div>
              <div className="text-sm">{panel.name}</div>
              <div className="text-gray-400 text-xs">
                {panel.category ? `${panel.category} • ` : ""}
                {panel.website}
              </div>
            </div>
          </div>
          <a
            href={`https://${panel.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
        <form onSubmit={handleBuyNow}>
          {/* Username Field */}
          <div className="bg-[#1E1E1E] rounded-xl p-4 mb-4">
            <div className="mb-2 text-[10px] font-extrabold">
              Preferred Username
            </div>
            <input
              type="text"
              className="w-full bg-[#111111] text-sm rounded-xl px-3 py-2 text-white border-none focus:outline-none"
              placeholder="Preferred Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="my-4 mb-2 text-xs">
              Rate Type <span className="text-red-500">*</span>
            </div>
            <div className="flex text-sm p-2 rounded-full w-fit space-x-2">
              {["sharing", "purchase"].map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`pr-12 pl-4 py-1 rounded-full flex items-center space-x-2 ${
                    rateType === option
                      ? "text-black border border-yellow-500"
                      : "bg-transparent text-gray-300 border border-transparent"
                  }`}
                  onClick={() => handleRateTypeChange(option)}
                  disabled={option === "purchase" && !panel.purchaserate * 100}
                >
                  <div
                    className={`w-4 h-4 flex items-center justify-center rounded-full border ${
                      rateType === option
                        ? "bg-black border-black text-[var(--color-primary)]"
                        : "border-gray-500"
                    }`}
                  >
                    {rateType === option && (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={`${
                      rateType === option
                        ? "text-[var(--color-primary)]"
                        : "border-gray-500"
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </span>
                </button>
              ))}
            </div>
            <div className="text-gray-400 my-1 text-[10px]">
              {rateType === "sharing"
                ? "Refundable coins"
                : "Non-refundable coins"}
            </div>
            <div className="my-2 text-xs font-bold">
              Account Type <span className="text-red-500">*</span>
            </div>
            <div className="relative">
              <select
                className="rounded-xl w-full bg-[#111111] text-sm px-3 py-2 text-white appearance-none focus:outline-none"
                value={accountType}
                disabled={true} // Disable the select to prevent changes
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value={panel?.accounttype}>{panel?.accounttype}</option>

                {/* <option value="Admin">Admin (master)</option>
              <option value="User">User</option> */}
              </select>
              <div className="absolute right-3 top-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Deposit Coins Section */}
          <div className="bg-[#1E1E1E] rounded-xl p-4 mb-4">
            <div className="text-base mb-4">Deposit Coins</div>

            <div className="flex mb-3">
              <div className="w-1/2 pr-2">
                <div className="mb-2 text-xs font-bold">Select Currency</div>
                <div className="relative">
                  <select
                    className="w-full rounded-xl text-xs bg-[#111111] px-3 py-3 text-white appearance-none focus:outline-none"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="INR">INR</option>
                  </select>
                  <div className="absolute right-3 top-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-yellow-500 mt-1 text-xs">
                  Only INR is available
                </div>
              </div>

              <div className="w-1/2 pl-2">
                <div className="mb-2 text-xs font-bold">Enter Coins</div>
                <input
                  type="number"
                  className="w-full text-sm  bg-[#111111] rounded-xl px-3 py-2 text-gray-300 border-none focus:outline-none"
                  value={coins}
                  onChange={handleCoinsChange}
                  min="1000"
                />
                <div className="text-gray-400 mt-1 text-xs">
                  {coins.toLocaleString()} coins
                </div>
              </div>
            </div>

            {/* Rate Input - Only editable in sharing mode */}
            <div className="my-4">
              <div className="mb-2 text-xs font-bold">
                Rate <span className="text-red-500">*</span>
              </div>
              <input
                type="number"
                step="0.01"
                className={`w-full bg-[#111111] text-sm rounded-xl px-3 py-2 text-white border-none focus:outline-none ${
                  rateType === "purchase" ? "opacity-70" : ""
                }`}
                value={rate * 100}
                onChange={handleRateChange}
                min={
                  rateType === "sharing"
                    ? applicableRateRange.min * 100
                    : undefined
                }
                max={
                  rateType === "sharing"
                    ? applicableRateRange.max * 100
                    : undefined
                }
                disabled={rateType === "purchase"}
              />
              {rateType === "sharing" && (
                <div className="text-yellow-500 mt-1 text-xs">
                  Enter rate between {applicableRateRange.min * 100} to{" "}
                  {applicableRateRange.max * 100} for {coins.toLocaleString()}{" "}
                  coins
                </div>
              )}
              {rateType === "purchase" && (
                <div className="text-yellow-500 mt-1 text-xs">
                  Fixed purchase rate: {panel.purchaserate * 100}
                </div>
              )}
            </div>

            {/* Rate Chart - Only show in sharing mode */}
            {rateType === "sharing" && (
              <div className="my-4">
                <button
                  type="button"
                  className="flex items-center w-full justify-between bg-[#111111] rounded-xl px-3 py-2"
                  onClick={() => setShowRateChart(!showRateChart)}
                >
                  <div className="flex items-center py-1">
                    <div className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-600 mr-2 text-white text-xs">
                      i
                    </div>
                    <h2 className="text-sm">Rate Chart</h2>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transform ${
                      showRateChart ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showRateChart && panel.rateChart && (
                  <div className="mt-2 bg-[#111111] rounded-xl p-3">
                    <div className="flex justify-between text-[10px] font-bold text-white mb-1">
                      <div>Coins</div>
                      <div>Rate</div>
                    </div>
                    {(() => {
                      let rateChart = panel.rateChart;
                      if (typeof rateChart === "string") {
                        try {
                          rateChart = JSON.parse(rateChart);
                        } catch (e) {
                          return (
                            <div className="text-red-500">
                              Invalid rate chart data
                            </div>
                          );
                        }
                      }

                      return Array.isArray(rateChart) ? (
                        rateChart.map((tier, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-[10px] border-t border-gray-800 py-1"
                          >
                            <div>{tier.coins}</div>
                            <div>
                              {tier.minRate * 100} - {tier.maxRate * 100}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-red-500">
                          No rate chart available
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Total Calculated Amount */}
            {!showRateChart && (
              <div className="mt-4">
                <div className="text-sm tracking-wide">
                  Total Calculated Amount
                </div>
                <div className="text-2xl mt-3">
                  ₹{Math.floor(totalAmount).toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] text-white">
                  {totalamountIntext}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {/* <button
            className="w-1/2 bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] py-2 text-xs rounded-xl flex items-center justify-center"
            onClick={handleAddToCart}
            disabled={isProcessing}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {isProcessing ? "Processing..." : "Add to cart"}
          </button> */}
            <button
              className="w-full bg-yellow-500 text-black py-2 text-xs rounded-3xl font-medium"
              // onClick={handleBuyNow}
              disabled={isProcessing}
              type="submit"
            >
              {isProcessing ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWebPanel;
