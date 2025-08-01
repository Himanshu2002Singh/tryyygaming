import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  FaSearch,
  FaFileAlt,
  FaFileExcel,
  FaSync,
  FaEye,
  FaCheck,
  FaTimes,
  FaRegCalendarAlt,
  FaSyncAlt,
  FaCalendarAlt,
  FaTimesCircle,
  FaRegTimesCircle,
} from "react-icons/fa";
import axios from "axios";
import API_URL from "@/config";

// Set the app element for accessibility
// Modal.setAppElement  ("#__next");
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function PanelActionsContentWithdraw() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rejectModalIsOpen, setRejectModalIsOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [panelActions, setPanelActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("withdraw");
  const [searchTerm, setSearchTerm] = useState("");
  const [userIdSearch, setUserIdSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [rejectReason, setRejectReason] = useState("");

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

  const fetchPanelActions = async () => {
    try {
      setLoading(true);
      // Build query parameters
      const params = new URLSearchParams();
      params.append("type", "withdraw");
      // Add filters to query params
      if (statusFilter !== "All") {
        if (statusFilter === "Pending") {
          params.append("status", "Pending"); // ✅ Correct
        } else if (statusFilter === "Approved") {
          params.append("status", "Approved"); // ✅ Fixed
        } else if (statusFilter === "Rejected") {
          params.append("status", "Rejected"); // ✅ Fixed
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

      const response = await axios.get(
        `${API_URL}/userpanel/panel-actions?${params.toString()}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );
      setPanelActions(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching panel actions:", err);
      setError("Failed to load panel actions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanelActions();
  }, [currentPage, itemsPerPage, statusFilter, dateFilter]); // Re-fetch when these change

  const handleApproveAction = async (actionId) => {
    try {
      setProcessingId(actionId);
      setError(null);

      const response = await axios.put(
        `${API_URL}/userpanel/panel-actions/${actionId}/status`,
        { status: "Approved" },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );

      // Update the action in the local state
      setPanelActions((prevActions) =>
        prevActions.map((action) =>
          action.id === actionId ? { ...action, status: "Approved" } : action
        )
      );

      setSuccessMessage("Panel action approved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error approving panel action:", err);
      setError(err.response?.data?.message || "Failed to approve panel action");
    } finally {
      setProcessingId(null);
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

  const openRejectModal = (action) => {
    setCurrentAction(action);
    setRejectModalIsOpen(true);
  };

  const handleRejectAction = async () => {
    if (!rejectReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    try {
      setProcessingId(currentAction.id);
      setError(null);

      const response = await axios.put(
        `${API_URL}/userpanel/panel-actions/${currentAction.id}/status`,
        {
          status: "Rejected",
          remarks: rejectReason,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );

      // Update the action in the local state
      setPanelActions((prevActions) =>
        prevActions.map((action) =>
          action.id === currentAction.id
            ? { ...action, status: "Rejected" }
            : action
        )
      );

      setSuccessMessage("Panel action rejected successfully!");
      setRejectModalIsOpen(false);
      setRejectReason("");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error rejecting panel action:", err);
      setError(err.response?.data?.message || "Failed to reject panel action");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefresh = () => {
    fetchPanelActions();
  };

  const viewReceipt = (receiptUrl) => {
    setCurrentReceipt(receiptUrl);
    setModalIsOpen(true);
  };

  const filteredActions = panelActions.filter((action) => {
    // Filter by search term (if any)
    if (
      searchTerm &&
      !action.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by user ID search
    if (
      userIdSearch &&
      !action.User?.id?.toLowerCase().includes(userIdSearch.toLowerCase()) &&
      !action.User?.name?.toLowerCase().includes(userIdSearch.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

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
      fetchPanelActions(); // Fetch with new date range
    }
  };
  const clearDateRangeFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setDateFilter("All");
    setDateRangeLabel("Custom Date Range");
    setCurrentPage(1);
    fetchPanelActions();
  };

  // Handle key press for search inputs
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const startIndex = (currentPage - 1) * itemsPerPage; // Calculate start   return (

  return (
    <div className="space-y-4">
      {/* Receipt Modal */}
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
          content: { width: "40%", margin: "auto", padding: 0 },
        }}
      >
        <div className="relative w-full h-full">
          <img
            src={currentReceipt}
            alt="Receipt"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
          <button
            onClick={() => setModalIsOpen(false)}
            className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Reject Reason Modal */}
      <Modal
        ariaHideApp={false}
        isOpen={rejectModalIsOpen}
        onRequestClose={() => setRejectModalIsOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
          content: { width: "40%", margin: "auto" },
        }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Reject Panel Action</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Reason for Rejection:
            </label>
            <textarea
              className="w-full border border-black text-black  rounded-md p-2"
              rows="4"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please provide a reason for rejection"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setRejectModalIsOpen(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectAction}
              className="bg-red-500 text-white px-4 py-2 rounded"
              disabled={processingId === currentAction?.id}
            >
              {processingId === currentAction?.id ? "Processing..." : "Reject"}
            </button>
          </div>
        </div>
      </Modal>
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
          <label className="text-black mr-2">Remark (Min:3)</label>
          <input
            type="text"
            onChange={(e) => handleFilterChange(e, "remark")}
            placeholder="Search remark"
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

      <div className="flex justify-end items-center">
        <button className="text-blue-600" onClick={handleRefresh}>
          <FaSync size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-2xl border rounded-lg overflow-hidden">
          <thead className="bg-[var(--color-primary)] text-black">
            <tr>
              {[
                "S.No",
                // "ID",
                "User Name",
                "Id Name",
                // "Type",
                "Coins",
                // "Amount",
                "Status",
                "Receipt",
                "Created At",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="px-4 py-6 text-center text-black">
                  Loading...
                </td>
              </tr>
            ) : filteredActions.length === 0 ? (
              <tr>
                <td colSpan="11" className="px-4 py-6 text-center text-black">
                  No records found
                </td>
              </tr>
            ) : (
              filteredActions.map((action, index) => (
                <tr
                  key={action.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-[#E7E7E7]"
                  }  text-black`}
                >
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {index + 1}
                  </td>
                  {/* <td className="px-4 sm:py-3 text-ellipsis truncate break-all max-w-[100px]">
                    {action.id}
                  </td> */}
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {action.User?.username || "N/A"}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {action.PanelPurchase?.panelDetails?.name || "N/A"}
                  </td>
                  {/* <td className="px-4 sm:py-3 capitalize">{action.type}</td> */}
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {action.coins}
                  </td>
                  {/* <td className="px-4 sm:py-3 font-semibold">
                    {action.totalAmount} {action.currency}
                  </td> */}
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        action.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : action.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {action.status}
                    </span>
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {action.receipt ? (
                      <button
                        className="text-blue-400 hover:text-blue-600"
                        onClick={() => viewReceipt(action.receipt)}
                        title="View Receipt"
                      >
                        <FaEye />
                      </button>
                    ) : (
                      <span className="text-black-500">N/A</span>
                    )}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {new Date(action.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {action.status === "Pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveAction(action.id)}
                          disabled={processingId === action.id}
                          className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs flex items-center"
                        >
                          <FaCheck className="mr-1" />
                          {processingId === action.id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => openRejectModal(action)}
                          disabled={processingId === action.id}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs flex items-center"
                        >
                          <FaTimes className="mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                    {action.status === "Rejected" && action.rejectReason && (
                      <div className="text-xs text-gray-900">
                        Reason: {action.rejectReason.substring(0, 20)}
                        {action.rejectReason.length > 20 ? "..." : ""}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>{" "}
        {!loading && panelActions.length > 0 && (
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
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              entries
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
    </div>
  );
}

export default PanelActionsContentWithdraw;
