"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiX,
  FiCheck,
  FiX as FiReject,
  FiFilter,
  FiFileText,
} from "react-icons/fi";
import {
  FaSearch,
  FaFileAlt,
  FaFileExcel,
  FaSync,
  FaEye,
  FaTimes,
  FaRegCalendarAlt,
  FaSyncAlt,
  FaCalendarAlt,
  FaTimesCircle,
  FaRegTimesCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import API_URL from "@/config";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPaginate from "react-paginate";

const Withdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [formData, setFormData] = useState({
    transactionId: "",
    remarks: "",
  });
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [currentDetails, setCurrentDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [dateFilter, setDateFilter] = useState("All");
  const [remarkSearch, setRemarkSearch] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRangeLabel, setDateRangeLabel] = useState("Custom Date Range");
  const [searchTerm, setSearchTerm] = useState("");
  const [userIdSearch, setUserIdSearch] = useState("");
  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();

      // Add filters to params
      if (statusFilter && statusFilter !== "All") {
        params.append("status", statusFilter);
      }

      if (dateFilter && dateFilter !== "All") {
        params.append("dateFilter", dateFilter);
      }

      if (startDate && endDate) {
        params.append("startDate", startDate.toISOString().split("T")[0]);
        params.append("endDate", endDate.toISOString().split("T")[0]);
      }

      if (searchTerm) {
        params.append("utrSearch", searchTerm);
      }

      if (userIdSearch) {
        params.append("userId", userIdSearch);
      }

      if (remarkSearch) {
        params.append("bankdetails", remarkSearch);
      }

      // Add pagination
      params.append("page", currentPage);
      params.append("limit", itemsPerPage);

      // Make API request with filters
      const endpoint = `${API_URL}/withdraw/withdrawals?${params.toString()}`;
      console.log("Fetching withdrawals with params:", params.toString()); // Add this for debugging

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });

      if (response.data.success) {
        setWithdrawals(response.data.data);
        setTotalItems(response.data.pagination.totalItems);
        setTotalPages(response.data.pagination.totalPages);
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

  useEffect(() => {
    fetchWithdrawals();
  }, [
    currentPage,
    itemsPerPage,
    statusFilter,
    dateFilter,
    searchTerm,
    userIdSearch,
    remarkSearch,
  ]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchWithdrawals();
  };
  const handleRefresh = () => {
    fetchWithdrawals();
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

  const handleDetailsClick = (withdrawal) => {
    setCurrentDetails(withdrawal);
    setShowDetailsPopup(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsPopup(false);
    setCurrentDetails(null);
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
      // console.error("Error approving withdrawal request:", error);
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
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const startIndex = (currentPage - 1) * itemsPerPage; // Calculate start   return (

  const handleFilterChange = (e, filterType) => {
    const value = e.target.value;

    switch (filterType) {
      case "status":
        setStatusFilter(value);
        break;
      case "date":
        setDateFilter(value);
        break;
      case "utr":
        setSearchTerm(value);
        break;
      case "userId":
        setUserIdSearch(value);
        break;
      case "bankdetails":
        setRemarkSearch(value);
        break;
      case "date":
        // If selecting custom date range, show the date picker
        if (value === "Custom") {
          setShowDatePicker(true);
        } else {
          setDateFilter(value);
          setStartDate(null);
          setEndDate(null);
          setDateRangeLabel("Custom Date Range");
        }
        break;
      default:
        break;
    }

    // Don't trigger search immediately for text inputs
    if (
      filterType === "status" ||
      (filterType === "date" && value !== "Custom")
    ) {
      setCurrentPage(1); // Reset to first page when changing filters
    }
  };
  const applyDateRangeFilter = () => {
    if (startDate && endDate) {
      // Format the date range for display
      const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      };

      setDateRangeLabel(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setDateFilter("Custom"); // Set to custom to indicate we're using custom dates
      setCurrentPage(1); // Reset to first page
      setShowDatePicker(false); // Hide the date picker
      fetchWithdrawals(); // Fetch with new date range
    }
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage.selected + 1); // Set the new current page
  };
  const clearDateRangeFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setDateFilter("All");
    setDateRangeLabel("Custom Date Range");
    setCurrentPage(1);
    fetchWithdrawals();
  };
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
      <ToastContainer />
      <div className="w-full flex-1 sm:px-6 sm:py-6 p-2 transition-all duration-300">
        <div className="rounded-lg bg-white shadow-2xl">
          <div className="p-0 sm:p-6">
            <h1 className="text-xl font-semibold text-black mb-6">
              Withdrawal Requests
            </h1>
            <Modal
              ariaHideApp={false}
              isOpen={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.75)",
                  backdropFilter: "blur(5px)",
                  zIndex: 1000,
                },
                content: {
                  width: "400px",
                  height: "500px",
                  maxHeight: "90vh",
                  margin: "auto",
                  padding: 0,
                  border: "none",
                  borderRadius: "8px",
                  overflow: "visible",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  top: "50%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  transform: "translate(-50%, -50%)",
                },
              }}
            >
              <div className="flex flex-col h-full">
                <div className="bg-blue-600 text-white px-6 py-4">
                  <h2 className="text-xl font-semibold">Select Date Range</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Filter deposits by specific date range
                  </p>
                </div>
                <div className="flex flex-col justify-center flex-1 items-center">
                  <div className="p-6 bg-white flex-1 flex flex-col justify-center">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            maxDate={new Date()}
                            className="w-full text-black p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select start date"
                            popperPlacement="bottom-start"
                          />
                          <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            maxDate={new Date()}
                            className="w-full text-black p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select end date"
                            popperPlacement="bottom-start"
                          />
                          <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                        </div>
                      </div>

                      {startDate && endDate && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Selected Range:</span>{" "}
                            {startDate.toLocaleDateString()} -{" "}
                            {endDate.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200 w-full">
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors flex items-center"
                    >
                      <FaRegTimesCircle className="mr-2" /> Cancel
                    </button>
                    <button
                      onClick={clearDateRangeFilter}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
                    >
                      <FaSyncAlt className="mr-2" /> Clear
                    </button>
                    <button
                      onClick={applyDateRangeFilter}
                      disabled={!startDate || !endDate}
                      className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                        !startDate || !endDate
                          ? "bg-blue-300 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <FaSearch className="mr-2" /> Apply
                    </button>
                  </div>
                </div>
              </div>
            </Modal>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 items-center text-sm">
              <div className="flex flex-col items-start w-full sm:w-auto">
                <label className="text-black mr-2">Status</label>
                <select
                  className="border bg-white  rounded-md px-3 py-2 w-full sm:w-32"
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(e, "status")}
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex flex-col items-start w-full sm:w-auto">
                <label className="text-black mr-2">Select by Date</label>
                <select
                  onChange={(e) => handleFilterChange(e, "date")}
                  className="bg-white border rounded-md px-3 py-2 w-full sm:w-32"
                >
                  <option>Today</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  {/* <option value="Custom">Custom Range</option> */}
                </select>
              </div>
              <div className=" flex flex-col items-start w-full sm:w-auto">
                <label className="text-black mr-2">Custom date</label>

                <div
                  className=" bg-white flex items-center cursor-pointer text-black px-2 py-2 rounded-sm border border-black "
                  onClick={() => setShowDatePicker(true)}
                >
                  <FaRegCalendarAlt className="mr-1" />
                  <span>{dateRangeLabel}</span>
                </div>
              </div>
              {/* <div className="flex flex-col items-start w-full sm:w-auto">
                <label className="text-black mr-2">UTR Search</label>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search"
                    className="border rounded-md bg-white text-black pl-10 pr-3 py-2 w-full sm:w-32"
                    value={searchTerm}
                    onChange={(e) => handleFilterChange(e, "utr")}
                    onKeyPress={handleKeyPress}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div> */}

              <div className="flex flex-col items-start w-full sm:w-auto">
                <label className="text-black mr-2">User Id</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="border rounded-md bg-white text-black pl-10 pr-3 py-2 w-full sm:w-32"
                    value={userIdSearch}
                    onChange={(e) => handleFilterChange(e, "userId")}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="flex flex-col items-start w-full sm:w-auto">
                <label className="text-black mr-2">Bankdetail</label>
                <input
                  type="text"
                  onChange={(e) => handleFilterChange(e, "bankdetails")}
                  placeholder="Search bankdetail"
                  className="border rounded-md  bg-white text-black px-3 py-2 w-full sm:w-32"
                />
              </div>

              <div className="flex ml-auto">
                <button className="p-2 text-black hover:text-gray-700">
                  <FaFileAlt size={20} />
                </button>
                <button className="p-2 text-black hover:text-gray-700">
                  <FaFileExcel size={20} />
                </button>
              </div>
            </div>

            <div className="flex justify-end my-4 items-center">
              <button className="text-blue-600" onClick={handleRefresh}>
                <FaSync size={16} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
            {/* <div className="flex flex-col gap-y-2.5 sm:gap-y-0 sm:flex-row justify-between mb-6">
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
            </div> */}

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
                <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-600">
                  <thead className="bg-[var(--color-primary)] text-black text-sm border-b border-gray-600">
                    <tr>
                      {[
                        "S.No",
                        "User Name",
                        "User",
                        "Amount",
                        "Bank Details",
                        "Status",
                        "Transaction ID",
                        "Created At",
                        "Processed At",
                        "Actions",
                        "Details",
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
                        } text-black`}
                      >
                        <td className="px-4 sm:py-3 border-r border-gray-700">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 sm:py-3 border-r border-gray-700">
                          {withdrawal?.user?.username || "NA"}
                        </td>
                        <td className="px-4 sm:py-3 border-r border-gray-700">
                          <div>
                            <p>{withdrawal.user?.name || "N/A"}</p>
                            <p className="sm:text-xs text-gray-400">
                              {withdrawal.user?.email || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 sm:py-3 font-semibold border-r border-gray-700">
                          ₹{withdrawal.amount}
                        </td>
                        <td className="px-4 sm:py-3 border-r border-gray-700">
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
                        <td className="px-4 py-3 border-r border-gray-700">
                          {withdrawal.transactionId || "N/A"}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-700">
                          {new Date(withdrawal.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-700">
                          {withdrawal.processedAt
                            ? new Date(withdrawal.processedAt).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 border-r border-gray-700">
                          <div className="flex space-x-2">
                            {withdrawal.status === "Pending" ? (
                              <>
                                <button
                                  onClick={() => handleApproveClick(withdrawal)}
                                  className="bg-green-500 p-1.5 rounded-md hover:bg-green-600"
                                  title="Approve"
                                >
                                  <FiCheck size={16} />
                                </button>
                                <button
                                  onClick={() => handleRejectClick(withdrawal)}
                                  className="bg-red-500 p-1.5 rounded-md hover:bg-red-600"
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
                        <td className="px-4 py-3 border-r border-gray-700">
                          <button
                            onClick={() => handleDetailsClick(withdrawal)}
                            className="text-blue-500 hover:text-blue-700"
                            title="View Details"
                          >
                            <FiFileText size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
                {!isLoading && withdrawals.length > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Show</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1); // Reset to first page when changing items per page
                        }}
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                      >
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      <span className="text-sm text-gray-700">entries</span>
                    </div>

                    <div className="text-sm text-gray-700">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                      {totalItems} entries
                    </div>

                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      forcePage={currentPage - 1} // Force the current page
                      pageCount={totalPages}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageChange}
                      containerClassName={"flex space-x-1"}
                      pageClassName={"pagination-item"}
                      pageLinkClassName={
                        "px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }
                      previousClassName={"pagination-item"}
                      previousLinkClassName={
                        "px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }
                      nextClassName={"pagination-item"}
                      nextLinkClassName={
                        "px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }
                      breakClassName={"pagination-item"}
                      breakLinkClassName={
                        "px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }
                      activeClassName={"active"}
                      activeLinkClassName={
                        "px-3 py-1 rounded bg-white text-blue-600 hover:bg-blue-600"
                      }
                      disabledClassName={"disabled"}
                      disabledLinkClassName={
                        "px-3 py-1 rounded bg-gray-100 text-gray-900 cursor-not-allowed"
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

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

      {showDetailsPopup && currentDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Withdrawal Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-bold text-lg mb-2">Default</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">User Id:</span>{" "}
                    {currentDetails.user?.username || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Amount:</span> ₹
                    {currentDetails.amount}
                  </p>
                  <p>
                    <span className="font-semibold">Holder Name:</span>{" "}
                    {currentDetails.bankAccount?.useraccountHolderName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Bank:</span>{" "}
                    {currentDetails.bankAccount?.bankName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Account Number:</span>{" "}
                    {currentDetails.bankAccount?.useraccountNo || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">IFSC:</span>{" "}
                    {currentDetails.bankAccount?.userifscCode || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <button
                  onClick={() => {
                    const detailsText = `User Id: ${currentDetails.user?.username}\nAmount: ₹${currentDetails.amount}\nHolder Name: ${currentDetails.bankAccount?.useraccountHolderName}\nBank: ${currentDetails.bankAccount?.bankName}\nAccount Number: ${currentDetails.bankAccount?.useraccountNo}\nIFSC: ${currentDetails.bankAccount?.userifscCode}`;
                    navigator.clipboard.writeText(detailsText);
                    toast.success("All details copied to clipboard");

                    // Update button text temporarily
                    const button = document.getElementById("copyButton");
                    if (button) {
                      button.textContent = "Copied!";
                      setTimeout(() => {
                        button.textContent = "All Copy";
                      }, 2000);
                    }
                  }}
                  id="copyButton"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  All Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showApproveForm && (
        <div
          className="fixed inset-0 backdrop-blur-[3px] z-0"
          onClick={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Withdraw;
