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

const Siterequest = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // Default to pending
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    loginurl: "",
  });

  // Fetch panel purchase requests on component mount and when status filter changes
  useEffect(() => {
    fetchPanelRequests();
  }, [statusFilter]);

  const fetchPanelRequests = async () => {
    setIsLoading(true);
    try {
      // Use the status filter in the API call, or omit it to get all requests
      const endpoint =
        statusFilter === "all"
          ? `${API_URL}/userpanel/panel-purchases`
          : `${API_URL}/userpanel/panel-purchases?status=${statusFilter}`;

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
    if (
      !window.confirm("Are you sure you want to reject this panel request?")
    ) {
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
    <div className="w-full h-screen bg-[#D9D9D9] text-black">
      {/* Main content area */}
      <div className="w-full flex-1 sm:px-6  sm:py-6 p-2 transition-all duration-300">
        <div className="rounded-lg bg-white shadow-2xl">
          <div className="p-0 sm:p-6">
            <h1 className="text-xl font-semibold text-black mb-6">
              Panel Purchase Requests
            </h1>

            {/* Search and Filter bar */}
            <div className="flex flex-col gap-y-2.5 sm:gap-y-0 sm:flex-row justify-between mb-6">
              <div className="relative sm:w-64">
                <input
                  type="text"
                  placeholder="Search requests"
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
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
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
                No panel purchase requests found.
              </div>
            )}

            {!isLoading && filteredRequests.length > 0 && (
              <div className="overflow-x-auto">
                 <table className="min-w-full bg-[var(--color-secondary)] rounded-lg overflow-hidden border border-gray-600">
                  <thead className="bg-[var(--color-primary)] text-sm text-black border-b border-gray-600">
                       <tr>
                      {[
                        "S.no",
                        // "Request ID",
                        "User Name",
                        // "Phone no",
                        "Panel",
                        "Panel Username",
                        "Rate Type",
                        "Account Type",
                        "Coins",
                        "Rate",
                        "Total Amount",
                        "Status",
                        "Created At",
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
                        <td className="px-4 py-3 text-black border-r border-gray-700">
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
                        </td>
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
          className="fixed inset-0 bg-white bg-opacity-50 z-0"
          onClick={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Siterequest;
