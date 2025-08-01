import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
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
import axios from "axios";
import API_URL from "@/config";
import { AdminAuthContext } from "../../context/adminAuthcontext";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function WalletRequestsContent() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [userIdSearch, setUserIdSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { user, setUser } = useContext(AdminAuthContext);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [isloadingreq, setIsloadingreq] = useState(false);
  const [formData, setFormData] = useState({
    // transactionId: "",
    remarks: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [dateFilter, setDateFilter] = useState("All");
  const [remarkSearch, setRemarkSearch] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRangeLabel, setDateRangeLabel] = useState("Custom Date Range");

  const fetchDeposits = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();

      // Add filters to query params
      if (statusFilter !== "All") params.append("status", statusFilter);

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

      // Make API request with query params
      const response = await axios.get(
        `${API_URL}/admin/deposits?${params.toString()}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );

      setDeposits(response.data.deposits);

      // Update pagination state
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching deposits:", err);
      setError("Failed to load deposit requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [currentPage, itemsPerPage, statusFilter, dateFilter]); // Re-fetch when these change

  // Function to handle search when user clicks search or presses enter
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchDeposits();
  };

  // Function to handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage.selected + 1); // Set the new current page
  };
  const handleApproveDeposit = async (depositId) => {
    try {
      setProcessingId(depositId);
      setError(null);

      const response = await axios.put(
        `${API_URL}/admin/deposits/${depositId}/approve`,
        formData,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );

      // Update the deposit in the local state
      setDeposits((prevDeposits) =>
        prevDeposits.map((deposit) =>
          deposit.id === depositId
            ? {
                ...deposit,
                status: "Approved",
                // transactionId: formData.transactionId,
                remarks: formData.remarks,
              }
            : deposit
        )
      );

      setSuccessMessage("Deposit approved successfully!");
      setUser({
        ...user,
        coins: response?.data?.adminCoinsRemaining,
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // Close the form
      handleCloseForm();
    } catch (err) {
      console.error("Error approving deposit:", err);
      setError(err.response?.data?.message || "Failed to approve deposit");
    } finally {
      setProcessingId(null);
    }
  };
  const handleRejectDeposit = async (depositId) => {
    try {
      setProcessingId(depositId);
      setError(null);

      const response = await axios.put(
        `${API_URL}/admin/deposits/${depositId}/reject`,
        formData,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );

      // Update the deposit in the local state
      setDeposits((prevDeposits) =>
        prevDeposits.map((deposit) =>
          deposit.id === depositId
            ? {
                ...deposit,
                status: "Rejected",
                remarks: formData.remarks,
              }
            : deposit
        )
      );

      setSuccessMessage("Deposit rejected successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // Close the form
      handleCloseForm();
    } catch (err) {
      console.error("Error rejecting deposit:", err);
      setError(err.response?.data?.message || "Failed to reject deposit");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefresh = () => {
    fetchDeposits();
  };

  const viewReceipt = (receiptUrl) => {
    setCurrentReceipt(receiptUrl);
    setModalIsOpen(true);
  };

  const handleApproveClick = (deposit) => {
    setSelectedDeposit(deposit);
    setFormData({
      // transactionId: "",
      remarks: "",
    });
    setShowApproveForm(true);
  };

  const handleRejectClick = (deposit) => {
    setSelectedDeposit(deposit);
    setFormData({
      // transactionId: "",
      remarks: "",
    });
    setShowApproveForm(true);
  };

  const handleCloseForm = () => {
    setShowApproveForm(false);
    setSelectedDeposit(null);
    setFormData({
      // transactionId: "",
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
      fetchDeposits(); // Fetch with new date range
    }
  };
  const clearDateRangeFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setDateFilter("All");
    setDateRangeLabel("Custom Date Range");
    setCurrentPage(1);
    fetchDeposits();
  };

  // Handle key press for search inputs
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const startIndex = (currentPage - 1) * itemsPerPage; // Calculate start   return (

  const filteredDeposits = deposits.filter((deposit) => {
    // Filter by status
    if (statusFilter !== "All" && deposit.status !== statusFilter) {
      return false;
    }

    // Filter by user ID search
    if (
      userIdSearch &&
      !deposit.User.id.toLowerCase().includes(userIdSearch.toLowerCase()) &&
      !deposit.User.name.toLowerCase().includes(userIdSearch.toLowerCase())
    ) {
      return false;
    }

    // Filter by UTR search
    if (
      searchTerm &&
      !deposit.utr.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 relative h-screen">
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

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {/* Receipt Modal - Enhanced UI */}
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: { zIndex: 50, backgroundColor: "rgba(0, 0, 0, 0.8)" },
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
      {/* Date Range Picker Modal - Enhanced UI */}
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
        <div className="flex flex-col items-start w-full sm:w-auto">
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
          <thead className="bg-[var(--color-primary)] text-black">
            <tr>
              {[
                "S.No",
                // "Phone Number",
                "User Name",
                "Bank Name",
                "Request Amount",
                "Status",
                "Receipt",
                "UTR",
                "Requested At",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="px-4 py-6 text-center text-black">
                  Loading...
                </td>
              </tr>
            ) : filteredDeposits.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-4 py-6 text-center text-black">
                  No records found
                </td>
              </tr>
            ) : (
              filteredDeposits.map((deposit, index) => (
                <tr
                  key={deposit.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-[#E7E7E7]"
                  }  text-black`}
                >
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {startIndex + index + 1}
                  </td>
                  {/* <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {deposit.User.phone}
                  </td> */}
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {deposit.User.username}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {deposit.Bankmodel.bankName}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    ₹{deposit.amount}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        deposit.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : deposit.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {deposit.status}
                    </span>
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    <button
                      className="text-blue-400 hover:text-blue-600"
                      onClick={() => viewReceipt(deposit.receipt)}
                      title="View Receipt"
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {deposit.utr}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {new Date(deposit.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {deposit.status === "Pending" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveDeposit(deposit.id)}
                          // onClick={() => handleApproveClick(deposit)}
                          className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
                        >
                          {processingId === deposit.id
                            ? "Processing..."
                            : " Approve"}
                        </button>
                        <button
                          onClick={() => handleRejectClick(deposit)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                        >
                          {processingId === deposit.id
                            ? "Processing..."
                            : "Reject"}
                        </button>
                      </div>
                    ) : (
                      <span className="text-green-500">completed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && deposits.length > 0 && (
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

      {/* Side form for approval/rejection */}
      {showApproveForm && (
        <div className="fixed right-0 top-0 sm:w-96 h-full bg-white shadow-lg border-l border-gray-200 z-10 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              {selectedDeposit
                ? `${
                    selectedDeposit.status === "Pending" ? "Process" : "View"
                  } Deposit Request`
                : "Process Deposit"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-black hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {selectedDeposit && (
            <div className="mb-6 bg-white p-4 rounded-lg">
              <h3 className="text-black font-semibold mb-2">Request Details</h3>
              <div className="text-sm text-black space-y-2">
                <p>
                  <span className="text-black">Amount:</span> ₹
                  {selectedDeposit.amount}
                </p>
                <p>
                  <span className="text-black">User:</span>{" "}
                  {selectedDeposit.User.name}
                </p>
                <p>
                  <span className="text-black">Phone:</span>{" "}
                  {selectedDeposit.User.phone}
                </p>
                <p>
                  <span className="text-black">Bank:</span>{" "}
                  {selectedDeposit.Bankmodel.bankName}
                </p>
                <p>
                  <span className="text-black">UTR:</span> {selectedDeposit.utr}
                </p>
                <p>
                  <span className="text-black">Requested:</span>{" "}
                  {new Date(selectedDeposit.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {selectedDeposit && selectedDeposit.status === "Pending" && (
            <form>
              <div className="mb-4">
                {/* <label className="block text-[var(--color-text)] mb-2">
                  Transaction ID
                </label>
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
                </p> */}
              </div>

              <div className="mb-4">
                <label className="block text-[var(--color-text)] mb-2">
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
                  className="px-4 py-2 bg-gray-500 text-black rounded-md hover:bg-gray-600 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleRejectDeposit(selectedDeposit.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  disabled={loading || processingId === selectedDeposit.id}
                >
                  {processingId === selectedDeposit.id
                    ? "Processing..."
                    : "Reject"}
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveDeposit(selectedDeposit.id)}
                  className="px-4 py-2 bg-green-500 text-black rounded-md hover:bg-green-300 transition"
                  disabled={
                    loading ||
                    !formData.transactionId ||
                    processingId === selectedDeposit.id
                  }
                >
                  {processingId === selectedDeposit.id
                    ? "Processing..."
                    : "Approve"}
                </button>
              </div>
            </form>
          )}

          {selectedDeposit && selectedDeposit.status !== "Pending" && (
            <div>
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-2">
                  Processing Details
                </h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>
                    <span className="text-gray-400">Status:</span>{" "}
                    {selectedDeposit.status}
                  </p>
                  <p>
                    <span className="text-gray-400">Processed At:</span>{" "}
                    {selectedDeposit.processedAt
                      ? new Date(selectedDeposit.processedAt).toLocaleString()
                      : "N/A"}
                  </p>
                  {selectedDeposit.transactionId && (
                    <p>
                      <span className="text-gray-400">Transaction ID:</span>{" "}
                      {selectedDeposit.transactionId}
                    </p>
                  )}
                  {selectedDeposit.remarks && (
                    <p>
                      <span className="text-gray-400">Remarks:</span>{" "}
                      {selectedDeposit.remarks}
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
          className="fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={handleCloseForm}
        />
      )}
    </div>
  );
}

export default WalletRequestsContent;
