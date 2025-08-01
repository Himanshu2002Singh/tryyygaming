"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserBank } from "../../context/userbankprovider";
import { useBottomSheet } from "../../context/BottomSheet";
import { AuthContext } from "../../context/authprovider";
import { useContext } from "react";
import axios from "axios";
import API_URL from "@/config";
import MessageAlert from "../alert";

const Withdraw = ({ openbankform }) => {
  const { user, fetchUserDetails } = useContext(AuthContext);
  const { activeBanks, loading, addBankAccount } = useUserBank();
  const { closeBottomSheet, openBottomSheet } = useBottomSheet();

  const [formData, setFormData] = useState({
    useraccountHolderName: "",
    useraccountNo: "",
    userifscCode: "",
    bankName: "",
    branchName: "",
    city: "",
    state: "",
  });

  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [ifscLoading, setIfscLoading] = useState(false);
  const [ifscError, setIfscError] = useState("");

  // Set the first bank as selected by default when banks are loaded
  useEffect(() => {
    if (activeBanks && activeBanks.length > 0 && !selectedBankId) {
      setSelectedBankId(activeBanks[0].id);
    }
  }, [activeBanks, selectedBankId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If IFSC code is being entered and reaches 11 characters, fetch bank details
    if (name === "userifscCode" && value.length === 11) {
      fetchBankDetails(value);
    }
  };

  const fetchBankDetails = async (ifsc) => {
    try {
      setIfscLoading(true);
      setIfscError("");

      const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);

      if (response.data) {
        setFormData({
          ...formData,
          bankName: response.data.BANK || "",
          city: response.data.CITY || "",
          state: response.data.STATE || "",
          userifscCode: ifsc,
        });
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      setIfscError("Invalid IFSC code. Please check and try again.");
    } finally {
      setIfscLoading(false);
    }
  };

  const handleWithdrawalAmountChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    setWithdrawalAmount(value);
  };

  const handleBankSelect = (e) => {
    setSelectedBankId(e.target.value);
  };

  const handleAddBankSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    // Validate form data
    if (
      !formData.useraccountHolderName ||
      !formData.useraccountNo ||
      !formData.userifscCode
    ) {
      toast.error("Please fill all required fields");
      setFormSubmitting(false);
      return;
    }

    try {
      const success = await addBankAccount(formData);

      if (success) {
        // Reset form
        setFormData({
          useraccountHolderName: "",
          useraccountNo: "",
          userifscCode: "",
          bankName: "",
          branchName: "",
          city: "",
          state: "",
        });
      }
    } catch (error) {
      console.log("Error adding bank account:", error);
      toast.error(
        error.response?.data?.message || "Failed to add bank account"
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();

    // Validate withdrawal amount
    if (!withdrawalAmount || parseInt(withdrawalAmount) > user.points) {
      toast.error("Insufficient balance");
      return;
    }

    if (!selectedBankId) {
      toast.error("Please select a bank account");
      return;
    }

    setFormSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required");
        setFormSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/withdraw/request`,
        {
          amount: withdrawalAmount,
          userBankId: selectedBankId, // Here you would make the API call to process the withdrawal
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Withdrawal request submitted successfully");
        setWithdrawalAmount("");
        await fetchUserDetails();

        // Refresh user data to update points balance
        // if (refreshUserData) {
        //   refreshUserData();
        // }
        await closeBottomSheet();
        await openBottomSheet(() => (
          <MessageAlert message="Withdrawal request submitted successfully" />
        ));
      } else {
        toast.error(response.data.message || "Failed to process withdrawal");
      }
    } catch (error) {
      console.log("Error processing withdrawal:", error);
      toast.error(
        error.response?.data?.message || "Failed to process withdrawal request"
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Show loading state

  // Show bank form if no banks are available
  if (openbankform || !activeBanks || activeBanks.length === 0) {
    return (
      <div className="w-full flex pb-4 items-center justify-center bg-[#393939]">
        <ToastContainer />
        <div className="w-full rounded-lg text-white">
          <div className="bg-[#171717] text-white text-center p-4 text-sm font-bold">
            Add New Bank Account
          </div>
          <form className="space-y-2 mt-4 px-4" onSubmit={handleAddBankSubmit}>
            <div>
              <label className="text-xs block font-bold my-1">
                Account Holder Name
              </label>
              <input
                type="text"
                name="useraccountHolderName"
                value={formData.useraccountHolderName}
                onChange={handleChange}
                className="w-full px-2 text-xs py-2 bg-[#111111] rounded-lg focus:outline-none text-white"
                placeholder="Enter account holder name"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block font-bold my-1 text-xs">
                Account Number
              </label>
              <input
                type="text"
                name="useraccountNo"
                value={formData.useraccountNo}
                onChange={handleChange}
                className="w-full px-2 py-2 text-xs mb-2 bg-[#111111] rounded-lg focus:outline-none text-white"
                placeholder="Enter account number"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label className="text-xs block font-bold my-1">IFSC Code</label>
              <input
                type="text"
                name="userifscCode"
                value={formData.userifscCode}
                onChange={handleChange}
                className="w-full px-2 py-2 text-xs mb-2 bg-[#111111] rounded-lg focus:outline-none text-white"
                placeholder="Enter IFSC code"
                required
                autoComplete="off"
              />
              {ifscLoading && (
                <p className="text-yellow-500 text-xs mt-1">
                  Fetching bank details...
                </p>
              )}
              {ifscError && (
                <p className="text-red-500 text-xs mt-1">{ifscError}</p>
              )}
            </div>

            {/* Bank Name - Only shown after IFSC lookup */}
            {formData.bankName && (
              <div>
                <label className="text-xs block font-bold my-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="bankName"
                  value={formData.bankName}
                  readOnly
                  className="w-full px-2 py-2 text-xs mb-2 bg-[#111111] rounded-lg focus:outline-none text-white"
                />
              </div>
            )}

            {/* City and State - Only shown after IFSC lookup */}
            {(formData.city || formData.state) && (
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="text-xs block font-bold my-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    readOnly
                    autoComplete="off"
                    className="w-full px-2 py-2 text-xs mb-2 bg-[#111111] rounded-lg focus:outline-none text-white"
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-xs block font-bold my-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    readOnly
                    autoComplete="off"
                    className="w-full px-2 py-2 text-xs mb-2 bg-[#111111] rounded-lg focus:outline-none text-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={formSubmitting}
              className="w-full text-xs bg-[var(--color-primary)] text-black px-3 py-2 rounded-lg  hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show withdrawal form if banks are available
  return (
    <div className="w-full pb-3 flex items-center justify-center ">
      <ToastContainer />
      <div className="w-full rounded-lg bg-[#393939] text-white">
        <div className="bg-[#171717] text-white text-center p-3 text-sm ">
          Withdraw
        </div>
        <div className="px-3">
          {/* Balance Information */}
          <div className="bg-[#111111] rounded-lg mt-4 p-4">
            <div className="flex flex-col justify-between items-center">
              <span className=" text-gray-400 text-xs font-bold">
                Available Balance
              </span>
              <span className=" text-xs">{user?.points || 0}</span>
            </div>
          </div>

          {/* Withdrawable Amount */}
          <div className=" px-4 bg-[#111111] rounded-lg mt-4 p-3">
            <p className="text-xs text-white">
              Withdrawable Coins: {user?.points || 0}
            </p>
          </div>

          <form className="space-y-4 mt-5" onSubmit={handleWithdrawalSubmit}>
            {/* Amount Input */}
            <div>
              {/* <label className="block font-bold my-1">Enter Amount</label> */}
              <input
                type="text"
                value={withdrawalAmount}
                onChange={handleWithdrawalAmountChange}
                className="w-full p-3 text-xs bg-[#111111] rounded-lg focus:outline-none"
                placeholder="Enter coins"
                required
              />
              <p className="text-xs text-white mt-1 font-extralight tracking-wide">
                Minimum withdrawal amount is 1000 coins
              </p>
            </div>

            {/* Bank Selection */}
            <div className="bg-[#111111] rounded-lg text-white p-4 ">
              <div className="flex justify-between items-center mb-4">
                <label className="text-gray-300 text-xs">Preferred Bank</label>
                <div className="relative w-64 ml-auto">
                  <select
                    value={selectedBankId}
                    onChange={handleBankSelect}
                    className="w-full text-xs rounded-lg bg-[#111111] border border-gray-500 py-1 px-2 pr-8 appearance-none text-white"
                  >
                    {activeBanks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.bankName || bank.useraccountHolderName}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Selected Bank Details */}
              {selectedBankId && (
                <div>
                  {activeBanks
                    .filter((bank) => bank.id === selectedBankId)
                    .map((bank) => (
                      <div
                        key={bank.id}
                        className="border-t border-gray-700 pt-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white text-xs ">
                            Account Holder
                          </span>
                          <span className="text-right text-xs text-white px-2 py-0 rounded">
                            {bank.useraccountHolderName}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white text-xs ">
                            Account number
                          </span>
                          <span className="text-right text-xs text-white px-2 py-0 rounded">
                            {/* Show only last 4 digits for security */}
                            {bank.useraccountNo}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white text-xs ">IFSC</span>
                          <span className="text-right text-xs text-white px-2 py-0 rounded">
                            {bank.userifscCode}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-white text-xs ">Bank Name</span>
                          <span className="text-right text-xs text-white px-2 py-0 rounded">
                            {bank.bankName || "Not specified"}
                          </span>
                        </div>

                        {bank.branchName && (
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-300">Branch</span>
                            <span className="text-right">
                              {bank.branchName}
                            </span>
                          </div>
                        )}

                        {bank.city && (
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-white text-xs">City</span>
                            <span className="text-right text-xs text-white">
                              {bank.city}
                            </span>
                          </div>
                        )}

                        {bank.state && (
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-white text-xs">State</span>
                            <span className="text-right text-xs text-white">
                              {bank.state}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={formSubmitting}
              className="w-full text-xs bg-[var(--color-primary)] text-black px-3 py-3  font-light rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formSubmitting ? "Processing..." : "Withdraw Coins"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
