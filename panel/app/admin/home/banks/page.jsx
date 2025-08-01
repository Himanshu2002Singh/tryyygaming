"use client";

import React, { useState, useEffect } from "react";
import { FiEdit2, FiSearch, FiFile } from "react-icons/fi";
import { BsArrowLeft, BsArrowRight, BsBank2, BsTrash } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import Image from "next/image";
import { IoChevronDownOutline, IoCloseOutline } from "react-icons/io5";
import API_URL from "@/config";
import bankdata from "../../components/payment/banklist.json";
const BankAccountsContent = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [showSideForm, setShowSideForm] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [bankslist, setbankslist] = useState(
    Object.entries(bankdata)
      .sort(([bankA], [bankB]) => bankA.localeCompare(bankB))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {})
  ); // State to store JSON data

  const handleCloseForm = () => {
    setShowSideForm(false);
    setEditMode(false);
    setSelectedBankId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      bankName: "",
      bankType: "Saving",
      accountHolderName: "",
      accountNo: "",
      ifscCode: "",
      phoneNumber: "",
      qrCode: null,
      depositAmountRange: "",
      totalRequest: "0",
      accountMethod: "Bank",
    });
    setFileName("No file chosen");
  };

  const handleAddBank = () => {
    setShowSideForm(true);
    setEditMode(false);
    resetForm();
  };

  const [formData, setFormData] = useState({
    bankName: "",
    bankType: "Saving",
    accountHolderName: "",
    accountNo: "",
    ifscCode: "",
    phoneNumber: "",
    qrCode: null,
    depositAmountRange: "",
    totalRequest: "0",
    accountMethod: "Bank",
    upiId: "", // Add new field for UPI
    walletAddress: "", // Add new field for wallet
    walletType: "", // Add new field for wallet type
  });

  const [fileName, setFileName] = useState("No file chosen");

  // Fetch all banks
  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/banks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBanks(data.banks || []);
      } else {
        console.log("Failed to fetch banks");
      }
    } catch (error) {
      console.log("Error fetching banks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFormData({
        ...formData,
        qrCode: file,
      });
    }
  };

  // Update the handleSubmit function to handle different account methods
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("accountMethod", formData.accountMethod);
    formDataToSend.append("accountHolderName", formData.accountHolderName);
    formDataToSend.append("depositAmountRange", formData.depositAmountRange);

    if (formData.phoneNumber) {
      formDataToSend.append("phoneNumber", formData.phoneNumber);
    }

    // Add method-specific fields
    if (formData.accountMethod === "Bank") {
      formDataToSend.append("bankName", formData.bankName);
      formDataToSend.append("bankType", formData.bankType);
      formDataToSend.append("accountNo", formData.accountNo);
      formDataToSend.append("ifscCode", formData.ifscCode);
    } else if (formData.accountMethod === "UPI") {
      formDataToSend.append("bankName", formData.bankName); // UPI provider name
      formDataToSend.append("upiId", formData.upiId);
    } else if (formData.accountMethod === "Wallet") {
      formDataToSend.append("walletType", formData.walletType);
      formDataToSend.append("walletAddress", formData.walletAddress);
    }

    formDataToSend.append("totalRequest", formData.totalRequest);

    if (formData.qrCode && typeof formData.qrCode !== "string") {
      formDataToSend.append("image", formData.qrCode);
    }

    try {
      let response;

      if (editMode && selectedBankId) {
        // Update existing bank
        response = await fetch(`${API_URL}/admin/bank/${selectedBankId}`, {
          method: "PUT",
          body: formDataToSend,
        });
      } else {
        // Create new bank
        response = await fetch(`${API_URL}/admin/create-bank`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
          body: formDataToSend,
        });
      }

      if (response.ok) {
        const data = await response.json();
        fetchBanks(); // Refresh the banks list
        handleCloseForm();
        alert(
          editMode
            ? "Account updated successfully"
            : "Account added successfully"
        );
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to save account");
      }
    } catch (error) {
      console.error("Error saving account:", error);
      alert("Error saving account");
    }
  };

  const handleEditBank = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/bank/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const bank = data.bank;

        // Initialize with all possible fields, setting appropriate defaults
        setFormData({
          bankName: bank.bankName || "",
          bankType: bank.bankType || "Saving",
          accountHolderName: bank.accountHolderName || "",
          accountNo: bank.accountNo || "",
          ifscCode: bank.ifscCode || "",
          phoneNumber: bank.phoneNumber || "",
          qrCode: bank.qrCode || null,
          depositAmountRange: bank.depositAmountRange || "",
          totalRequest: bank.totalRequest || "0",
          accountMethod: bank.accountMethod || "Bank",
          upiId: bank.upiId || "",
          walletType: bank.walletType || "",
          walletAddress: bank.walletAddress || "",
        });

        setFileName(bank.qrCode ? "Current QR Code" : "No file chosen");
        setEditMode(true);
        setSelectedBankId(id);
        setShowSideForm(true);
      } else {
        console.error("Failed to fetch bank details");
        alert("Failed to fetch bank details");
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      alert("Error fetching bank details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBank = async (id) => {
    if (window.confirm("Are you sure you want to delete this bank?")) {
      try {
        const response = await fetch(`${API_URL}/admin/bank/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          fetchBanks(); // Refresh the banks list
          alert("Bank deleted successfully");
        } else {
          console.error("Failed to delete bank");
          alert("Failed to delete bank");
        }
      } catch (error) {
        console.error("Error deleting bank:", error);
        alert("Error deleting bank");
      }
    }
  };

  // Filter banks based on search query and filters
  const filteredBanks = banks.filter((bank) => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const bankName = bank.bankName?.toLowerCase() || "";
      const accountNo = bank.accountNo?.toLowerCase() || "";
      const accountHolderName = bank.accountHolderName?.toLowerCase() || "";
      const ifscCode = bank.ifscCode?.toLowerCase() || "";

      if (
        !bankName.includes(searchLower) &&
        !accountNo.includes(searchLower) &&
        !accountHolderName.includes(searchLower) &&
        !ifscCode.includes(searchLower)
      ) {
        return false;
      }
    }

    // Status filter - assuming we'll add a status field later
    if (filter === "Active" && bank.status !== "Active") {
      return false;
    } else if (filter === "Inactive" && bank.status != "Inactive") {
      return false;
    }

    return true;
  });

  // Pagination
  const indexOfLastBank = currentPage * entriesPerPage;
  const indexOfFirstBank = indexOfLastBank - entriesPerPage;
  const currentBanks = filteredBanks.slice(indexOfFirstBank, indexOfLastBank);

  return (
    <div className="container mx-auto sm:p-4 bg-[#D9D9D9] text-black min-h-screen">
      {/* Header with search and filters */}
      <div
        className={`w-full flex-1 p-6 transition-all duration-300 ${
          showSideForm ? "" : ""
        }`}
      >
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by bank name, account number, holder name..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400" />
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="relative w-full sm:w-40">
              <select
                className="appearance-none text-black bg-white border rounded-md pl-4 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <IoMdArrowDropdown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto">
              <button
                className="text-sm bg-[var(--color-primary)] w-full sm:w-auto text-black px-4 py-2 rounded-md transition"
                onClick={handleAddBank}
              >
                Add Bank Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      )}

      {/* Account cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 px-6">
          {currentBanks.length > 0 ? (
            currentBanks.map((bank) => (
              <div
                key={bank.id}
                className="bg-white rounded-lg shadow-2xl p-4 border-l-4 border-[#91a3b0]"
              >
                <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
                  <div className="flex flex-col sm:flex-row items-center">
                    {/* <BsBank2 className="text-[var(--color-primary)] text-xl mr-2" /> */}
                    {bank.qrCode ? (
                      <Image
                        className="w-auto h-12 mr-2"
                        src={bank.qrCode}
                        alt="Account Image"
                        width={0}
                        height={0}
                      />
                    ) : (
                      <BsBank2 className="text-black text-xl mr-2" />

                      // <div className="w-6 h-6 bg-red-500 rounded-md mr-2"></div>
                    )}{" "}
                    <div className="flex flex-col sm:flex-col sm:items-start items-center">
                      <span className="text-xs  sm:text-sm font-medium text-black-400">
                        {bank.accountHolderName}
                      </span>
                      <span className="text-xs text-black-400">
                        {new Date(bank.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex sm:my-0 my-2 items-center">
                    <div className="flex sm:my-0 my-2 items-center">
                      <span className="text-sm font-medium mr-2 text-black">
                        {bank.status === "Active" ? "Active" : "Inactive"}
                      </span>
                      <div
                        className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
                          bank.status === "Active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        onClick={async () => {
                          try {
                            // Toggle the status
                            const newStatus =
                              bank.status === "Active" ? "Inactive" : "Active";

                            // Create FormData for the update
                            const formData = new FormData();
                            formData.append("status", newStatus);

                            const response = await fetch(
                              `${API_URL}/admin/bank/${bank.id}`,
                              {
                                method: "PUT",
                                body: formData,
                              }
                            );

                            if (response.ok) {
                              // Refresh the banks list after successful update
                              fetchBanks();
                              alert(`Bank status updated to ${newStatus}`);
                            } else {
                              const errorData = await response.json();
                              alert(
                                errorData.message ||
                                  "Failed to update bank status"
                              );
                            }
                          } catch (error) {
                            console.error("Error updating bank status:", error);
                            alert("Error updating bank status");
                          }
                        }}
                      >
                        <div
                          className={`bg-white w-3 h-3 rounded-full transform ${
                            bank.status === "Active"
                              ? "translate-x-5"
                              : "translate-x-0"
                          } transition-transform duration-300`}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditBank(bank.id)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteBank(bank.id)}
                      >
                        <BsTrash />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                  {bank.accountMethod === "Bank" && (
                    <>
                      <div className="text-black-300 text-sm">Bank Name</div>
                      <div className="text-black font-medium text-sm truncate">
                        {bank.bankName}
                      </div>

                      <div className="text-black-400 text-sm">
                        Account Number
                      </div>
                      <div className="text-black font-medium text-sm truncate">
                        {bank.accountNo}
                      </div>

                      <div className="text-black-400 text-sm">IFSC</div>
                      <div className="text-black font-medium text-sm truncate">
                        {bank.ifscCode}
                      </div>

                      <div className="text-black-400 text-sm">Account Type</div>
                      <div className="text-black font-medium text-sm">
                        {bank.bankType}
                      </div>
                    </>
                  )}

                  {bank.accountMethod === "UPI" && (
                    <>
                      <div className="text-black-400 text-sm">UPI Provider</div>
                      <div className="text-black font-medium text-sm truncate">
                        {bank.bankName}
                      </div>

                      <div className="text-black-400 text-sm">UPI ID</div>
                      <div className="text-black font-medium text-sm truncate">
                        {bank.upiId}
                      </div>
                    </>
                  )}

                  {bank.accountMethod === "Wallet" && (
                    <>
                      <div className="text-black-400 text-sm">Wallet Type</div>
                      <div className="text-black font-medium text-sm truncate">
                        {bank.walletType}
                      </div>

                      <div className="text-black-400 text-sm">
                        Wallet Address
                      </div>
                      <div className="text-black font-medium text-sm truncate">
                        {bank.walletAddress}
                      </div>
                    </>
                  )}

                  <div className="text-black-400 text-sm">Deposit Limit</div>
                  <div className="text-black font-medium text-sm">
                    {bank.depositAmountRange}
                  </div>

                  <div className="text-black-400 text-sm">Total Requests</div>
                  <div className="text-black font-medium text-sm">
                    {bank.totalRequest || 0}
                  </div>
                </div>

                {/* {bank.qrCode && (
                  <div className="mt-4 flex justify-center">
                    <Image
                      src={bank.qrCode}
                      alt="QR Code"
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </div>
                )} */}
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-black-400">
              No bank accounts found.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredBanks.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-600 px-6 pb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2 text-black">Show</span>
            <div className="relative w-20">
              <select
                className="appearance-none bg-white border rounded-md pl-3 pr-8 py-1 w-full focus:outline-none"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <span className="ml-2 text-black">Entries</span>
          </div>

          <div className="flex items-center">
            <span className="mr-4 text-black">
              Showing {indexOfFirstBank + 1} to{" "}
              {Math.min(indexOfLastBank, filteredBanks.length)} of{" "}
              {filteredBanks.length} Entries
            </span>
            <div className="flex">
              <button
                className="px-3 py-1 border rounded-l-md bg-white disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <BsArrowLeft />
              </button>
              <button className="px-3 py-1 border-t border-b bg-white text-blue-600 font-medium">
                {currentPage}
              </button>
              <button
                className="px-3 py-1 border rounded-r-md bg-white disabled:opacity-50"
                disabled={indexOfLastBank >= filteredBanks.length}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <BsArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Account Modal */}
      {showSideForm && (
        <div className="fixed right-0 top-0 sm:w-96 h-full bg-white shadow-2xl border-l border-gray-200 z-10 p-6 overflow-y-auto">
          <div className="max-w-md mx-auto bg-white py-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl my-3 font-semibold">
                {editMode ? "Edit Bank Account" : "Add Bank Account"}
              </h2>
              <button className="text-gray-500 hover:text-gray-700">
                <IoCloseOutline className="w-6 h-6" onClick={handleCloseForm} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Account Methods */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Methods
                </label>
                <div className="relative">
                  <select
                    name="accountMethod"
                    value={formData.accountMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border text-grey text-black border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Bank">Bank</option>
                    <option value="Wallet">Wallet</option>
                    <option value="UPI">UPI</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <IoChevronDownOutline className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Bank List */}
              {/* Conditional fields based on Account Method */}
              {formData.accountMethod === "Bank" && (
                <>
                  {/* Bank List */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <div className="relative">
                      <select
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-grey text-black border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Select Bank --</option>
                        {Object.entries(bankslist).map(
                          ([bankName, bankCode]) => (
                            <option key={bankName} value={bankCode}>
                              {bankName}
                            </option>
                          )
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <IoChevronDownOutline className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Bank Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Type
                    </label>
                    <div className="relative">
                      <select
                        name="bankType"
                        value={formData.bankType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-grey text-black border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Saving">Saving</option>
                        <option value="Current">Current</option>
                        <option value="Fixed">Fixed Deposit</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <IoChevronDownOutline className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account No.
                    </label>
                    <input
                      type="text"
                      name="accountNo"
                      value={formData.accountNo}
                      onChange={handleInputChange}
                      placeholder="Account No"
                      className="w-full px-3 py-2 border text-black text-grey border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* IFSC Code */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      placeholder="IFSC Code."
                      className="w-full px-3 py-2 border text-black text-grey border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {formData.accountMethod === "UPI" && (
                <>
                  {/* UPI Provider */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UPI Provider
                    </label>
                    <div className="relative">
                      <select
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-grey text-black border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Select UPI Provider --</option>
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Paytm">Paytm</option>
                        <option value="BharatPe">BharatPe</option>
                        <option value="Amazon Pay">Amazon Pay</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <IoChevronDownOutline className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* UPI ID */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="example@upi"
                      className="w-full px-3 py-2 border text-black text-grey border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {formData.accountMethod === "Wallet" && (
                <>
                  {/* Wallet Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wallet Type
                    </label>
                    <div className="relative">
                      <select
                        name="walletType"
                        value={formData.walletType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-grey text-black border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Select Wallet Type --</option>
                        <option value="USDT">USDT</option>
                        <option value="Bitcoin">Bitcoin</option>
                        <option value="Ethereum">Ethereum</option>
                        <option value="Litecoin">Litecoin</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <IoChevronDownOutline className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleInputChange}
                      placeholder="Enter wallet address"
                      className="w-full px-3 py-2 border text-black text-grey border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Common fields for all account methods */}
              {/* Account Holder Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  placeholder="Enter Holder name"
                  className="w-full px-3 py-2 border text-black text-grey border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter Phone No."
                  className="w-full px-3 py-2 border text-black text-grey border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* QR Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code (Optional)
                </label>
                <div className="flex">
                  <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-l-md text-grey text-sm text-black cursor-pointer">
                    <FiFile className="mr-2" />
                    Choose File
                    <input
                      type="file"
                      name="qrCode"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  <span className="flex-1 px-3 py-2 border border-l-0 rounded-r-md text-grey text-black text-sm">
                    {fileName}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Max Size 2MB</p>
              </div>

              {/* Deposit Amount Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deposit Amount Range
                </label>
                <div className="relative">
                  <select
                    name="depositAmountRange"
                    value={formData.depositAmountRange}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border text-grey text-black border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select Amount Range --</option>
                    <option value="0-1000">₹0 - ₹1,000</option>
                    <option value="1000-5000">₹1,000 - ₹5,000</option>
                    <option value="5000-10000">₹5,000 - ₹10,000</option>
                    <option value="10000-50000">₹10,000 - ₹50,000</option>
                    <option value="50000+">₹50,000+</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <IoChevronDownOutline className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Total Request */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Request
                </label>
                <input
                  type="text"
                  name="totalRequest"
                  value={formData.totalRequest}
                  onChange={handleInputChange}
                  placeholder="Enter Total Request"
                  className="w-full px-3 py-2 border text-black text-grey border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCloseForm}
                  type="button"
                  className="flex-1 py-2 px-4 bg-gray-500 text-black rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-indigo-600 text-black rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showSideForm && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-30 z-0"
          onClick={handleCloseForm}
        />
      )}
    </div>
  );
};

export default BankAccountsContent;
