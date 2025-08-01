import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import {
  FaSearch,
  FaFileAlt,
  FaFileExcel,
  FaSync,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import API_URL from "@/config";
import { AdminAuthContext } from "../../context/adminAuthcontext";

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

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/deposits`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });
      setDeposits(response.data.deposits);
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
  }, []);

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

  // Handle reject deposit
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
            className="absolute top-2 right-2 bg-red-500 text-black px-4 py-2 rounded"
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

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 items-center text-sm">
        <div className="flex flex-col items-start w-full sm:w-auto">
          <label className="text-black mr-2">Status</label>
          <select
            className="border bg-white  rounded-md px-3 py-2 w-full sm:w-32"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex flex-col items-start w-full sm:w-auto">
          <label className="text-black mr-2">Select by Date</label>
          <select className="bg-white border rounded-md px-3 py-2 w-full sm:w-32">
            <option>Today</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>

        <div className="flex flex-col items-start w-full sm:w-auto">
          <label className="text-black mr-2">UTR Search</label>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-md bg-white text-black pl-10 pr-3 py-2 w-full sm:w-32"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-black" />
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
              onChange={(e) => setUserIdSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-black" />
          </div>
        </div>

        <div className="flex flex-col items-start w-full sm:w-auto">
          <label className="text-black mr-2">Remark (Min:3)</label>
          <input
            type="text"
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
                    {index + 1}
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
                          className="px-2 py-1 bg-green-500 hover:bg-green-600 text-black rounded text-xs"
                        >
                          {processingId === deposit.id
                            ? "Processing..."
                            : " Approve"}
                        </button>
                        <button
                          onClick={() => handleRejectClick(deposit)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-black rounded text-xs"
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
             <div className="mb-6 bg-gray shadow-2xl p-4 rounded-lg">
             <h3 className="text-black font-semibold mb-2">Request Details</h3>
             
           <div className="text-sm text-gray-300 space-y-2">
                <p className="text-black">
                  <span className="text-black">Amount:</span> ₹
                  {selectedDeposit.amount}
                </p>
                <p className="text-black">
                  <span className="text-black">User:</span>{" "}
                  {selectedDeposit.User.name}
                </p>
                <p className="text-black">
                  <span className="text-black">Phone:</span>{" "}
                  {selectedDeposit.User.phone}
                </p>
                <p className="text-black">
                  <span className="text-black">Bank:</span>{" "}
                  {selectedDeposit.Bankmodel.bankName}
                </p>
                <p className="text-black">
                  <span className="text-black">UTR:</span>{" "}
                  {selectedDeposit.utr}
                </p>
                <p className="text-black">
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
                  className="px-4 py-2 bg-red-500 text-black rounded-md hover:bg-red-600 transition"
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
                <h3 className="text-black font-semibold mb-2">
                  Processing Details
                </h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>
                    <span className="text-black">Status:</span>{" "}
                    {selectedDeposit.status}
                  </p>
                  <p>
                    <span className="text-black">Processed At:</span>{" "}
                    {selectedDeposit.processedAt
                      ? new Date(selectedDeposit.processedAt).toLocaleString()
                      : "N/A"}
                  </p>
                  {selectedDeposit.transactionId && (
                    <p>
                      <span className="text-black">Transaction ID:</span>{" "}
                      {selectedDeposit.transactionId}
                    </p>
                  )}
                  {selectedDeposit.remarks && (
                    <p>
                      <span className="text-black">Remarks:</span>{" "}
                      {selectedDeposit.remarks}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 bg-gray-500 text-black rounded-md hover:bg-gray-600 transition"
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
}

export default WalletRequestsContent;
