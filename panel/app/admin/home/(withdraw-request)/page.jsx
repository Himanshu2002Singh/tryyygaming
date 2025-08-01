"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiX,
  FiCheck,
  FiX as FiReject,
  FiFilter,
} from "react-icons/fi";
import { toast } from "react-toastify";
import API_URL from "@/config";

const Withdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // Default to pending
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [formData, setFormData] = useState({
    transactionId: "",
    remarks: "",
  });

  // Fetch withdrawal requests on component mount and when status filter changes
  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter]);

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      // Use the status filter in the API call, or omit it to get all requests
      const endpoint =
        statusFilter === "All"
          ? `${API_URL}/withdraw/withdrawals`
          : `${API_URL}/withdraw/withdrawals?status=${statusFilter}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });

      if (response.data.success) {
        setWithdrawals(response.data.data);
      } else {
        toast.error("Failed to fetch withdrawal requests");
      }
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      toast.error("Error fetching withdrawal requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveClick = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setFormData({
      transactionId: "",
      remarks: "",
    });
    setShowApproveForm(true);
  };

  const handleRejectClick = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setFormData({
      transactionId: "",
      remarks: "",
    });
    setShowApproveForm(true);
  };

  const handleCloseForm = () => {
    setShowApproveForm(false);
    setSelectedWithdrawal(null);
    setFormData({
      transactionId: "",
      remarks: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();

    // Validate form for approval
    if (!formData.transactionId) {
      toast.error("Transaction ID is required for approval");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/withdraw/withdrawals/${selectedWithdrawal.id}`,
        {
          status: "Approved",
          transactionId: formData.transactionId,
          remarks: formData.remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Withdrawal request approved successfully");
        handleCloseForm();
        fetchWithdrawals();
      } else {
        toast.error(
          response.data.message || "Failed to approve withdrawal request"
        );
      }
    } catch (error) {
      console.error("Error approving withdrawal request:", error);
      toast.error(
        error.response?.data?.message || "Error approving withdrawal request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/withdraw/withdrawals/${selectedWithdrawal.id}`,
        {
          status: "Rejected",
          remarks: formData.remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Withdrawal request rejected successfully");
        handleCloseForm();
        fetchWithdrawals();
      } else {
        toast.error(
          response.data.message || "Failed to reject withdrawal request"
        );
      }
    } catch (error) {
      console.error("Error rejecting withdrawal request:", error);
      toast.error(
        error.response?.data?.message || "Error rejecting withdrawal request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Filter withdrawals based on search query
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (withdrawal.user?.name &&
        withdrawal.user.name.toLowerCase().includes(searchLower)) ||
      (withdrawal.user?.email &&
        withdrawal.user.email.toLowerCase().includes(searchLower)) ||
      (withdrawal.user?.phone &&
        withdrawal.user.phone.toString().includes(searchLower)) ||
      (withdrawal.bankAccount?.useraccountHolderName &&
        withdrawal.bankAccount.useraccountHolderName
          .toLowerCase()
          .includes(searchLower)) ||
      (withdrawal.bankAccount?.useraccountNo &&
        withdrawal.bankAccount.useraccountNo.includes(searchLower)) ||
      (withdrawal.id && withdrawal.id.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="w-full bg-[#D9D9D9] text-black">
      {/* Main content area */}

      <div className="w-full flex-1 sm:px-6 sm:py-6 p-2 transition-all duration-300">
        <div className="rounded-lg bg-white shadow-2xl">
          <div className="p-0 sm:p-6">
            <h1 className="text-xl font-semibold text-black mb-6">
              Withdrawal Requests
            </h1>

            {/* Search and Filter bar */}
            <div className="flex flex-col gap-y-2.5 sm:gap-y-0 sm:flex-row justify-between mb-6">
              <div className="relative sm:w-64">
                <input
                  type="text"
                  placeholder="Search withdrawals"
                  className="w-full px-4 py-2 border rounded-md sm:pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute right-3 top-3 text-gray-500" />
              </div>

              {/* Status filter dropdown */}
              <div className="flex items-center space-x-2">
                <FiFilter className="text-gray-400" />
                <select
                  className="px-4 py-2 border rounded-md bg-white text-black"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Requests</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Withdrawals Display */}
            {isLoading && (
              <div className="text-center py-8 text-black">
                Loading withdrawal requests...
              </div>
            )}

            {!isLoading && filteredWithdrawals.length === 0 && (
              <div className="text-center py-8 text-black">
                No withdrawal requests found.
              </div>
            )}

            {!isLoading && filteredWithdrawals.length > 0 && (
              <div className="overflow-x-auto bg-white">
                <table className="min-w-full  bg-white rounded-lg overflow-hidden border border-gray-600">
                  <thead className="bg-[var(--color-primary)] text-black text-sm border-b border-gray-600">
                    <tr>
                      {[
                        "S.No",
                        "User Name",
                        // "Phone no.",
                        "User",
                        "Amount",
                        "Bank Details",
                        "Status",
                        "Transaction ID",
                        "Created At",
                        "Processed At",
                        "Actions",
                      ].map((header, i) => (
                        <th
                          key={i}
                          className="px-4 sm:py-3 text-left border-r border-gray-600 last:border-r-0"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-700">
                    {filteredWithdrawals.map((withdrawal, index) => (
                      <tr
                        key={withdrawal.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-[#E7E7E7]"
                        }  text-black`}
                      >
                        <td className="px-4 sm:py-3  border-r border-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 sm:py-3  border-r border-gray-700">
                          {withdrawal.user.username || "NA"}
                        </td>
                        {/* <td className="px-4 sm:py-3 text-white border-r border-gray-700">
                          {withdrawal.id.substring(0, 8)}...
                        </td> */}
                        {/* <td className="px-4 sm:py-3 text-white border-r border-gray-700">
                          {withdrawal.user?.phone}...
                        </td> */}
                        <td className="px-4 sm:py-3  border-r border-gray-700">
                          <div>
                            <p>{withdrawal.user?.name || "N/A"}</p>
                            <p className="sm:text-xs text-gray-400">
                              {withdrawal.user?.email || "N/A"}
                            </p>
                            {/* <p className="sm:text-xs text-gray-400">
                              {withdrawal.user?.phone || "N/A"}
                            </p> */}
                          </div>
                        </td>
                        <td className="px-4 sm:py-3  font-semibold border-r border-gray-700">
                          ₹{withdrawal.amount}
                        </td>
                        <td className="px-4 sm:py-3  border-r border-gray-700">
                          <div>
                            <p>
                              {withdrawal.bankAccount?.useraccountHolderName ||
                                "N/A"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {withdrawal.bankAccount?.bankName || "N/A"} -{" "}
                              {withdrawal.bankAccount?.useraccountNo || "N/A"}
                            </p>
                            <p className="text-xs text-gray-400">
                              IFSC:{" "}
                              {withdrawal.bankAccount?.userifscCode || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-700">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              withdrawal.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : withdrawal.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {withdrawal.status}
                          </span>
                        </td>
                        <td className="px-4 py-3  border-r border-gray-700">
                          {withdrawal.transactionId || "N/A"}
                        </td>
                        <td className="px-4 py-3  border-r border-gray-700">
                          {new Date(withdrawal.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3  border-r border-gray-700">
                          {withdrawal.processedAt
                            ? new Date(withdrawal.processedAt).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            {withdrawal.status === "Pending" ? (
                              <>
                                <button
                                  onClick={() => handleApproveClick(withdrawal)}
                                  className="bg-green-500 p-1.5 rounded-md  hover:bg-green-600"
                                  title="Approve"
                                >
                                  <FiCheck size={16} />
                                </button>
                                <button
                                  onClick={() => handleRejectClick(withdrawal)}
                                  className="bg-red-500 p-1.5 rounded-md  hover:bg-red-600"
                                  title="Reject"
                                >
                                  <FiReject size={16} />
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-black">
                                {withdrawal.status}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side form for approval/rejection */}
      {showApproveForm && (
        <div className="fixed right-0 top-0 sm:w-96 h-full bg-white shadow-lg border-l border-gray-200 z-10 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              {selectedWithdrawal
                ? `${
                    selectedWithdrawal.status === "Pending" ? "Process" : "View"
                  } Withdrawal Request`
                : "Process Withdrawal"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          {selectedWithdrawal && (
            <div className="mb-6 bg-gray shadow-2xl p-4 rounded-lg">
              <h3 className="text-black font-semibold mb-2">Request Details</h3>
              <div className="text-sm text-black space-y-2">
                <p>
                  <span className="text-black">Amount:</span> ₹
                  {selectedWithdrawal.amount}
                </p>
                <p>
                  <span className="text-black">User:</span>{" "}
                  {selectedWithdrawal.user?.name}
                </p>
                <p>
                  <span className="text-black">Account:</span>{" "}
                  {selectedWithdrawal.bankAccount?.useraccountHolderName}
                </p>
                <p>
                  <span className="text-black">Account No:</span>{" "}
                  {selectedWithdrawal.bankAccount?.useraccountNo}
                </p>
                <p>
                  <span className="text-black">Bank:</span>{" "}
                  {selectedWithdrawal.bankAccount?.bankName}
                </p>
                <p>
                  <span className="text-black">IFSC:</span>{" "}
                  {selectedWithdrawal.bankAccount?.userifscCode}
                </p>
                <p>
                  <span className="text-black">Requested:</span>{" "}
                  {new Date(selectedWithdrawal.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {selectedWithdrawal && selectedWithdrawal.status === "Pending" && (
            <form>
              <div className="mb-4">
                <label className="block text-black mb-2">Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  placeholder="Enter transaction ID"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <p className="text-xs text-black mt-1">
                  Required for approval, leave empty for rejection
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-black mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  placeholder="Enter remarks or reason"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] h-24"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRejectSubmit}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Reject"}
                </button>
                <button
                  type="button"
                  onClick={handleApproveSubmit}
                  className="px-4 py-2 bg-green-500 text-black rounded-md hover:bg-green-300 transition"
                  disabled={isLoading || !formData.transactionId}
                >
                  {isLoading ? "Processing..." : "Approve"}
                </button>
              </div>
            </form>
          )}

          {selectedWithdrawal && selectedWithdrawal.status !== "Pending" && (
            <div>
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-2">
                  Processing Details
                </h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>
                    <span className="text-gray-400">Status:</span>{" "}
                    {selectedWithdrawal.status}
                  </p>
                  <p>
                    <span className="text-gray-400">Processed At:</span>{" "}
                    {selectedWithdrawal.processedAt
                      ? new Date(
                          selectedWithdrawal.processedAt
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                  {selectedWithdrawal.transactionId && (
                    <p>
                      <span className="text-gray-400">Transaction ID:</span>{" "}
                      {selectedWithdrawal.transactionId}
                    </p>
                  )}
                  {selectedWithdrawal.remarks && (
                    <p>
                      <span className="text-gray-400">Remarks:</span>{" "}
                      {selectedWithdrawal.remarks}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay for when side form is open */}
      {showApproveForm && (
        <div
          className="fixed inset-0  backdrop-blur-[3px] z-0"
          onClick={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Withdraw;
