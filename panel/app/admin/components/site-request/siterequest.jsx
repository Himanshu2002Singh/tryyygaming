"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

import {
  FiSearch,
  FiX,
  FiCheck,
  FiX as FiReject,
  FiFilter,
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
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Siterequest = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All"); // Default to pending
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    loginurl: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [userIdSearch, setUserIdSearch] = useState("");

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

  // Fetch panel purchase requests on component mount and when status filter changes
  useEffect(() => {
    fetchPanelRequests();
  }, [currentPage, itemsPerPage, statusFilter, dateFilter, userIdSearch]); // Re-fetch when these change

  const fetchPanelRequests = async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();

      // Add filters to query params
      if (statusFilter !== "All") {
        if (statusFilter === "Pending") {
          params.append("status", "pending");
        } else if (statusFilter === "Approved") {
          params.append("status", "completed");
        } else if (statusFilter === "Rejected") {
          params.append("status", "failed");
        }
      }

      // Handle date filtering
      if (startDate && endDate) {
        // Format dates for API
        params.append("startDate", startDate.toISOString().split("T")[0]);
        params.append("endDate", endDate.toISOString().split("T")[0]);
      } else if (dateFilter !== "All") {
        params.append("dateFilter", dateFilter);
      }

      if (searchTerm) params.append("utrSearch", searchTerm);
      if (userIdSearch) params.append("userNameSearch", userIdSearch);
      if (remarkSearch && remarkSearch.length >= 3)
        params.append("remark", remarkSearch);

      // Add pagination
      params.append("page", currentPage);
      params.append("limit", itemsPerPage);

      // Use the status filter in the API call, or omit it to get all requests
      const endpoint = `${API_URL}/userpanel/panel-purchases?${params.toString()}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });

      if (response.data.success) {
        setRequests(response.data.data);
      } else {
        toast.error("Failed to fetch panel requests");
      }
    } catch (error) {
      console.error("Error fetching panel requests:", error);
      toast.error("Error fetching panel requests");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchPanelRequests();
  };

  // Function to handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage.selected + 1); // Set the new current page
  };

  const handleApproveRequest = (request) => {
    setSelectedRequest(request);
    setFormData({
      username: request.username || "",
      password: request.password || "",
      loginurl: request.loginurl || "",
    });
    setShowApproveForm(true);
  };

  const handleRejectRequest = async (request) => {
    if (!window.confirm("Are you sure you want to reject this ID request?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/userpanel/panel-purchases/${request.id}`,
        {
          status: "failed",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Panel request rejected successfully");
        fetchPanelRequests();
      } else {
        toast.error(response.data.message || "Failed to reject panel request");
      }
    } catch (error) {
      console.error("Error rejecting panel request:", error);
      toast.error(
        error.response?.data?.message || "Error rejecting panel request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowApproveForm(false);
    setSelectedRequest(null);
    setFormData({
      username: "",
      password: "",
      loginurl: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitApproval = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.username || !formData.password || !formData.loginurl) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/userpanel/panel-purchases/${selectedRequest.id}`,
        {
          status: "completed",
          username: formData.username,
          password: formData.password,
          loginurl: formData.loginurl,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Panel request approved successfully");
        handleCloseForm();
        fetchPanelRequests();
      } else {
        toast.error(response.data.message || "Failed to approve panel request");
      }
    } catch (error) {
      console.error("Error approving panel request:", error);
      toast.error(
        error.response?.data?.message || "Error approving panel request"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
      case "remark":
        setRemarkSearch(value);
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
      fetchPanelRequests(); // Fetch with new date range
    }
  };
  const clearDateRangeFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setDateFilter("All");
    setDateRangeLabel("Custom Date Range");
    setCurrentPage(1);
    fetchPanelRequests();
  };

  // Handle key press for search inputs
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const startIndex = (currentPage - 1) * itemsPerPage; // Calculate start   return (

  // Filter requests based on search query
  const filteredRequests = requests.filter((request) => {
    return (
      request.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.panelDetails?.name &&
        request.panelDetails.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="w-full bg-[#D9D9D9] ">
      {" "}
      {/* Main content area */}
      <ToastContainer />
      <div className="w-full flex-1 sm:px-6  sm:py-6 p-2 transition-all duration-300">
        <div className="rounded-lg bg-white shadow-2xl">
          <div className="p-0 sm:p-6">
            <h1 className="text-xl font-semibold text-black mb-6">
              IDs Purchase Requests
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
            {/* Search and Filter bar */}
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

              <div className="flex ml-auto">
                <button className="p-2 text-black hover:text-gray-700">
                  <FaFileAlt size={20} />
                </button>
                <button className="p-2 text-black hover:text-gray-700">
                  <FaFileExcel size={20} />
                </button>
              </div>
            </div>

            {/* Requests Display */}
            {isLoading && (
              <div className="text-center py-8 text-black">
                Loading requests...
              </div>
            )}

            {!isLoading && filteredRequests.length === 0 && (
              <div className="text-center py-8 text-black">
                No IDs purchase requests found.
              </div>
            )}

            {!isLoading && filteredRequests.length > 0 && (
              <div className="overflow-x-auto mt-5">
                <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                  <thead className="bg-[var(--color-primary)] text-sm text-black border-b border-gray-600">
                    <tr>
                      {[
                        "S.no",
                        // "Request ID",
                        "User Name",
                        // "Phone no",
                        "IDs name",
                        "IDs Username",
                        // "Rate Type",
                        // "Account Type",
                        // "Coins",
                        // "Rate",
                        // "Total Amount",
                        "Status",
                        "Created At",
                        "Actions",
                      ].map((header, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-700">
                    {filteredRequests.map((request, index) => (
                      <tr
                        key={request.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-[#E7E7E7]"
                        }  text-black`}
                      >
                        <td className="px-4 py-3 text-black border-r border-gray-700">
                          {index + 1}
                        </td>
                        {/* <td className="px-4 py-3 text-black border-r border-gray-700">
                          {request.id.substring(0, 8)}...
                        </td> */}
                        <td className="px-4 py-3 text-black border-r border-gray-700">
                          {request?.User?.username}
                        </td>
                        {/* <td className="px-4 py-3 text-black border-r border-gray-700">
                          {request?.User?.phone}
                        </td> */}
                        <td className="px-4 py-3 text-black border-r border-gray-700">
                          {request.panelDetails?.name || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-black border-r border-gray-700">
                          {request.username}
                        </td>
                        {/* <td className="px-4 py-3 text-black border-r border-gray-700">
                          {request.rateType}
                        </td>
                        <td className="px-4 py-3 text-black border-r border-gray-700">
                          {request.accountType}
                        </td>
                        <td className="px-4 py-3 text-black border-r border-gray-700">
                          {request.coins}
                        </td>
                        <td className="px-4 py-3 text-black border-r border-gray-700">
                          {request.rate}
                        </td>
                        <td className="px-4 py-3 text-black border-r border-gray-700">
                          {request.totalAmount}
                        </td> */}
                        <td className="px-4 py-3 border-r border-gray-700">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              request.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : request.status === "failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-black border-r border-gray-700">
                          {new Date(request.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            {request.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApproveRequest(request)}
                                  className="bg-green-500 p-1.5 rounded-md text-black hover:bg-green-600"
                                  title="Approve"
                                >
                                  <FiCheck size={16} />
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(request)}
                                  className="bg-red-500 p-1.5 rounded-md text-black hover:bg-red-600"
                                  title="Reject"
                                >
                                  <FiReject size={16} />
                                </button>
                              </>
                            )}
                            {request.status === "completed" && (
                              <button
                                onClick={() => handleApproveRequest(request)}
                                className="bg-blue-500 p-1.5 rounded-md text-black hover:bg-blue-600"
                                title="View Details"
                              >
                                <FiCheck size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!isLoading && requests.length > 0 && (
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
      {/* Side form for approval */}
      {showApproveForm && (
        <div className="fixed right-0 top-0 sm:w-96 h-full bg-white shadow-lg border-l border-gray-200 z-10 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              {selectedRequest?.status === "completed"
                ? "Panel Request Details"
                : "Approve Panel Request"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmitApproval}>
            <div className="mb-4">
              <label className="block text-[var(--color-text)] mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
                readOnly={selectedRequest?.status === "completed"}
              />
            </div>

            <div className="mb-4">
              <label className="block text-[var(--color-text)] mb-2">
                Password
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
                readOnly={selectedRequest?.status === "completed"}
              />
            </div>

            <div className="mb-4">
              <label className="block text-[var(--color-text)] mb-2">
                Login URL
              </label>
              <input
                type="text"
                name="loginurl"
                value={formData.loginurl}
                onChange={handleInputChange}
                placeholder="Enter login URL"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
                readOnly={selectedRequest?.status === "completed"}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 bg-gray-500 text-black rounded-md hover:bg-gray-600 transition"
                disabled={isLoading}
              >
                Close
              </button>
              {selectedRequest?.status !== "completed" && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-black rounded-md hover:bg-green-300 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Approve"}
                </button>
              )}
            </div>
          </form>
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

export default Siterequest;
