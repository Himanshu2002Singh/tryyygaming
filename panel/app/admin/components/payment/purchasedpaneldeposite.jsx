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
} from "react-icons/fa";
import axios from "axios";
import API_URL from "@/config";

// Set the app element for accessibility
// Modal.setAppElement  ("#__next");

function PanelActionsContent() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rejectModalIsOpen, setRejectModalIsOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [panelActions, setPanelActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [userIdSearch, setUserIdSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const fetchPanelActions = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (typeFilter !== "All") params.append("type", typeFilter.toLowerCase());

      const response = await axios.get(
        `${API_URL}/userpanel/panel-actions?type=deposit`,
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
  }, [statusFilter, typeFilter]);

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
          rejectReason: rejectReason,
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

  return (
    <div className="space-y-4">
      {/* Receipt Modal */}
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: { backgroundColor: "white" },
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
            <select
              className="w-full border rounded-md p-2 mb-3"
              value={rejectReason}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setRejectReason(
                  selectedValue === "custom" ? "" : selectedValue
                );
              }}
            >
              <option value="">Select a reason</option>
              <option value="Insufficient Documentation">
                Insufficient Documentation
              </option>
              <option value="Invalid Payment Proof">
                Invalid Payment Proof
              </option>
              <option value="Suspicious Transaction">
                Suspicious Transaction
              </option>
              <option value="Duplicate Request">Duplicate Request</option>
              <option value="Exceeded Limit">Exceeded Limit</option>
              <option value="custom">Custom Reason</option>
            </select>

            {rejectReason === "" && (
              <textarea
                className="w-full border rounded-md p-2"
                rows="4"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a custom reason for rejection"
              ></textarea>
            )}
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
              className="bg-red-500 text-black px-4 py-2 rounded"
              disabled={processingId === currentAction?.id}
            >
              {processingId === currentAction?.id ? "Processing..." : "Reject"}
            </button>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 items-center text-sm">
        <div className="flex flex-col items-start w-full sm:w-auto">
          <label className="text-black-500 mr-2">Action Type</label>
          <select
            className="border bg-white rounded-md px-3 py-2 w-full sm:w-32"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdraw">Withdraw</option>
          </select>
        </div>

        <div className="flex flex-col items-start w-full sm:w-auto">
          <label className="text-black-500 mr-2">Status</label>
          <select
            className="border  bg-white rounded-md px-3 py-2 w-full sm:w-32"
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
          <label className="text-gray-500 mr-2">ID Search</label>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by ID"
              className="border rounded-md pl-10 pr-3 py-2 w-full sm:w-32"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="flex flex-col items-start w-full sm:w-auto">
          <label className="text-black-500 mr-2">User Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by user"
              className="border rounded-md pl-10 pr-3 py-2 w-full sm:w-32"
              value={userIdSearch}
              onChange={(e) => setUserIdSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-black-400" />
          </div>
        </div>

        <div className="flex ml-auto">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <FaFileAlt size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
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
                "Panel Name",
                "Type",
                "Coins",
                "Amount",
                "Status",
                "Receipt",
                "Created At",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-black"
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
                    index % 2 === 0 ? "bg-[#dbd7d2]" : "bg-[#f5f5f5]"
                  } hover:bg-[#dbd7c2] text-black`}
                >
                  <td className="px-4 sm:py-3 whitespace-nowrap border border-black">
                    {index + 1}
                  </td>
                  {/* <td className="px-4 sm:py-3 text-ellipsis truncate break-all max-w-[100px]">
                    {action.id}
                  </td> */}
                  <td className="px-4 sm:py-3 border border-black">
                    {action.User?.username || "N/A"}
                  </td>
                  <td className="px-4 sm:py-3 border border-black">
                    {action.PanelPurchase?.panelDetails?.name || "N/A"}
                  </td>
                  <td className="px-4 sm:py-3 capitalize border border-black">
                    {action.type}
                  </td>
                  <td className="px-4 sm:py-3 border border-black">
                    {action.coins}
                  </td>
                  <td className="px-4 sm:py-3 font-semibold border border-black">
                    {action.totalAmount} {action.currency}
                  </td>
                  <td className="px-4 sm:py-3 border border-black">
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
                  <td className="px-4 py-3 border border-black">
                    {action.receipt ? (
                      <button
                        className="text-blue-400 hover:text-blue-600"
                        onClick={() => viewReceipt(action.receipt)}
                        title="View Receipt"
                      >
                        <FaEye />
                      </button>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap border border-black">
                    {new Date(action.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 border border-black">
                    {action.status === "Pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveAction(action.id)}
                          disabled={processingId === action.id}
                          className="px-2 py-1 bg-green-500 hover:bg-green-600 text-black rounded text-xs flex items-center"
                        >
                          <FaCheck className="mr-1" />
                          {processingId === action.id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => openRejectModal(action)}
                          disabled={processingId === action.id}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-black rounded text-xs flex items-center"
                        >
                          <FaTimes className="mr-1" />
                          Reject
                        </button>
                      </div>
                    )}

                    {action.status === "Approved" && (
                      <span className="text-green-500 text-xs font-semibold">
                        Accepted
                      </span>
                    )}

                    {action.status === "Rejected" && (
                      <div>
                        <span className="text-red-500 text-xs font-semibold">
                          Rejected
                        </span>
                        {action.rejectReason && (
                          <div className="text-xs text-gray-300">
                            Reason: {action.rejectReason.substring(0, 20)}
                            {action.rejectReason.length > 20 ? "..." : ""}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PanelActionsContent;
