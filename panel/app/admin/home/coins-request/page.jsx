"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_URL from "@/config";
import { AdminAuthContext } from "../../context/adminAuthcontext";

const CoinRequestsPage = () => {
  const [coinRequests, setCoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const { user } = useContext(AdminAuthContext);

  const isSuperAdmin = user?.Role?.name === "super_admin";

  useEffect(() => {
    fetchCoinRequests();
  }, []);

  const fetchCoinRequests = async () => {
    try {
      setLoading(true);
      const endpoint = isSuperAdmin
        ? `${API_URL}/admin/coin-request/all`
        : `${API_URL}/admin/coin-request/my-requests`;
      const response = await axios.get(endpoint, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });
      setCoinRequests(response.data.coinRequests);
    } catch (error) {
      console.error("Error fetching coin requests:", error);
      toast.error("Failed to load coin requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${API_URL}/admin/coin-request/${id}/approve`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );
      toast.success("Coin request approved successfully");
      fetchCoinRequests();
    } catch (error) {
      console.error("Error approving coin request:", error);
      toast.error(error.response?.data?.message || "Failed to approve request");
    }
  };

  const openRejectModal = (id) => {
    setSelectedRequestId(id);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    try {
      await axios.put(
        `${API_URL}/admin/coin-request/${selectedRequestId}/reject`,

        {
          reason: rejectionReason,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );
      toast.success("Coin request rejected");
      setShowRejectModal(false);
      fetchCoinRequests();
    } catch (error) {
      console.error("Error rejecting coin request:", error);
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <div className="p-6 bg-[#D9D9D9] text-black">
        <h1 className="text-2xl font-bold mb-6">
          {isSuperAdmin ? "All Coin Requests" : "My Coin Requests"}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : coinRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-black">No coin requests found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-600 shadow-2xl">
              <thead className="bg-[var(--color-primary)] text-black text-sm border-b border-gray-600">
                <tr>
                  <th className="px-4 sm:py-3 text-left border-r border-gray-600 last:border-r-0">
                    ID
                  </th>
                  {isSuperAdmin && (
                    <th className="px-4 sm:py-3 text-left border-r border-gray-600 last:border-r-0">
                      Admin
                    </th>
                  )}
                  <th className="px-4 sm:py-3 text-left border-r border-gray-600 last:border-r-0">
                    Amount
                  </th>
                  <th className="px-4 sm:py-3 text-left border-r border-gray-600 last:border-r-0">
                    Reason
                  </th>
                  <th className="px-4 sm:py-3 text-left border-r border-gray-600 last:border-r-0">
                    Status
                  </th>
                  <th className="px-4 sm:py-3 text-left border-r border-gray-600 last:border-r-0">
                    Created At
                  </th>
                  {isSuperAdmin && (
                    <th className="px-4 sm:py-3 text-left border-r border-gray-600 last:border-r-0">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coinRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 sm:py-3 text-white border-r border-gray-700">
                      {request.id.substring(0, 8)}...
                    </td>
                    {isSuperAdmin && (
                      <td className="px-4 sm:py-3 text-white border-r border-gray-700">
                        <div className="text-sm font-medium text-gray-900">
                          {request.requestingAdmin?.name}
                        </div>
                        <div className="text-sm text-white">
                          {request.requestingAdmin?.email}
                        </div>
                      </td>
                    )}
                    <td className="px-4 sm:py-3 text-white border-r border-gray-700">
                      {request.amount}
                    </td>
                    <td className="px-4 sm:py-3 text-white border-r border-gray-700">
                      {request.reason || "-"}
                    </td>
                    <td className="px-4 sm:py-3 text-white border-r border-gray-700">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-4 sm:py-3 text-white border-r border-gray-700">
                      {formatDate(request.createdAt)}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-4 sm:py-3 text-white border-r border-gray-700">
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectModal(request.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {request.status !== "pending" && (
                          <span className="text-gray-400">Processed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-[#D9D9D9] text-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Reject Coin Request</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Reason for Rejection (Optional)
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoinRequestsPage;
