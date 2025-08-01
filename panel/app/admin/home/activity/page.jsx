"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/config";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);

  // Filters
  const [adminFilter, setAdminFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState("");
  const [targetIdFilter, setTargetIdFilter] = useState("");

  // Filter options
  const [admins, setAdmins] = useState([]);
  const [modules, setModules] = useState([]);
  const [actions, setActions] = useState([]);
  const [targetTypes, setTargetTypes] = useState([]);

  // Fetch activities based on current filters and pagination
  const fetchActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `${API_URL}/admin/logs?page=${page}&limit=${limit}`;

      // Add filters to URL if they exist
      if (adminFilter)
        url = `${API_URL}/admin/logs/admin/${adminFilter}?page=${page}&limit=${limit}`;
      else if (moduleFilter)
        url = `${API_URL}/admin/logs/module/${moduleFilter}?page=${page}&limit=${limit}`;
      else if (actionFilter)
        url = `${API_URL}/admin/logs/action/${actionFilter}?page=${page}&limit=${limit}`;
      else if (targetTypeFilter && targetIdFilter) {
        url = `${API_URL}/admin/logs/target/${targetTypeFilter}/${targetIdFilter}?page=${page}&limit=${limit}`;
      } else if (startDate && endDate) {
        url = `${API_URL}/admin/logs/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });

      setActivities(response.data.logs);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);

      // Extract unique values for filter options if this is the first load
      if (
        page === 1 &&
        !adminFilter &&
        !moduleFilter &&
        !actionFilter &&
        !targetTypeFilter &&
        !startDate
      ) {
        const uniqueModules = [
          ...new Set(response.data.logs.map((log) => log.module)),
        ];
        const uniqueActions = [
          ...new Set(response.data.logs.map((log) => log.action)),
        ];
        const uniqueTargetTypes = [
          ...new Set(
            response.data.logs
              .filter((log) => log.targetType)
              .map((log) => log.targetType)
          ),
        ];

        setModules(uniqueModules);
        setActions(uniqueActions);
        setTargetTypes(uniqueTargetTypes);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to load activities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch list of admins for the admin filter
  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/admins`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
        },
      });

      setAdmins(response.data.admins);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchActivities();
    fetchAdmins();
  }, [page, limit]);

  // When filters change, reset to page 1 and fetch data
  useEffect(() => {
    setPage(1);
    fetchActivities();
  }, [
    adminFilter,
    moduleFilter,
    actionFilter,
    targetTypeFilter,
    targetIdFilter,
    startDate,
    endDate,
  ]);

  // Reset all filters
  const resetFilters = () => {
    setAdminFilter("");
    setModuleFilter("");
    setActionFilter("");
    setStartDate("");
    setEndDate("");
    setTargetTypeFilter("");
    setTargetIdFilter("");
    setPage(1);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Get action color based on action type
  const getActionColor = (action) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "APPROVE":
        return "bg-emerald-100 text-emerald-800";
      case "REJECT":
        return "bg-orange-100 text-orange-800";
      case "VIEW":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  return (
    <div className="bg-[#D9D9D9] text-black container mx-auto py-6 px-4">
      <div className="bg-[#D9D9D9] text-black rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Activity Logs</h1>
            <p className="text-black mt-1">
              Monitor all admin actions and activities in the system
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="mt-4 text-black md:mt-0 flex items-center gap-2 px-4 py-2 bg-white  rounded-md  transition-colors shadow-2xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Filters
          </button>
        </div>

        {/* Filters Section */}
        <div className="p-6 border-b border-gray-200 bg-white rounded-md shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Admin Filter */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Admin
              </label>
              <select
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
                className="w-full bg-gray-100 rounded-md border border-gray-300 shadow-sm px-3 py-2  text-black focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-black-500"
              >
                <option value="">All Admins</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id.toString()}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Module Filter */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Module
              </label>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full  rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-black-500"
              >
                <option value="">All Modules</option>
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Action
              </label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Actions</option>
                {actions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Target Filter */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-black mb-1">
                Target
              </label>
              <div className="flex gap-2">
                <select
                  value={targetTypeFilter}
                  onChange={(e) => setTargetTypeFilter(e.target.value)}
                  className="w-2/3 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {targetTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="ID"
                  value={targetIdFilter}
                  onChange={(e) => setTargetIdFilter(e.target.value)}
                  className="w-1/3 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Rows per page */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Rows per page
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="10">10 rows</option>
                <option value="25">25 rows</option>
                <option value="50">50 rows</option>
                <option value="100">100 rows</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="px-6 py-3 bg-white border-b border-gray-200 text-sm text-black">
          Showing {activities.length} of {totalCount} activities
        </div>

        {/* Activity Table */}
        {loading ? (
          // Loading state
          <div className="p-6 space-y-4 bg-white rounded-md shadow-2xl">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-bg-black h-12 w-12"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchActivities}
              className="mt-4 px-4 py-2 bg-black  rounded-md text-black transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : activities.length === 0 ? (
          // Empty state
          <div className="text-center py-10">
            <p className="text-black">
              No activities found matching your filters.
            </p>
          </div>
        ) : (
          // Data table
          <div className="overflow-x-auto bg-white rounded-md shadow-2xl">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-[var(--color-primary)] text-black">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Admin
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Action
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Module
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Target
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Date & Time (m/d/y)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-100 divide-y divide-gray-200 bg-white rounded-md shadow-2xl">
                {activities.map((activity) => (
                  <tr key={activity.id} className="">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-black">
                        {activity.Admin?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(
                          activity.action
                        )}`}
                      >
                        {activity.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {activity.module}
                    </td>
                    <td className="px-6 py-4 text-sm text-black max-w-xs truncate">
                      {activity.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {activity.targetType && activity.targetId ? (
                        <span>
                          {activity.targetType} #{activity.targetId}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {formatDate(activity.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="px-6 py-4 bg-white rounded-md shadow-2xl border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-black hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    page === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-black hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-black">
                    Showing{" "}
                    <span className="font-medium">
                      {(page - 1) * limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(page * limit, totalCount)}
                    </span>{" "}
                    of <span className="font-medium">{totalCount}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    {/* Previous Page Button */}
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-gray-100 text-sm font-medium ${
                        page === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-black hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* First Page */}
                    {page > 2 && (
                      <button
                        onClick={() => setPage(1)}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-100 text-sm font-medium text-black hover:bg-gray-50"
                      >
                        1
                      </button>
                    )}

                    {/* Ellipsis if needed */}
                    {page > 3 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-100 text-sm font-medium text-black">
                        ...
                      </span>
                    )}

                    {/* Previous page if not first */}
                    {page > 1 && (
                      <button
                        onClick={() => setPage(page - 1)}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-100 text-sm font-medium text-black hover:bg-gray-50"
                      >
                        {page - 1}
                      </button>
                    )}

                    {/* Current page */}
                    <button
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600"
                      aria-current="page"
                    >
                      {page}
                    </button>

                    {/* Next page if not last */}
                    {page < totalPages && (
                      <button
                        onClick={() => setPage(page + 1)}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-100 text-sm font-medium text-black hover:bg-gray-50"
                      >
                        {page + 1}
                      </button>
                    )}

                    {/* Ellipsis if needed */}
                    {page < totalPages - 2 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-100 text-sm font-medium text-black">
                        ...
                      </span>
                    )}

                    {/* Last page */}
                    {page < totalPages - 1 && (
                      <button
                        onClick={() => setPage(totalPages)}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-100 text-sm font-medium text-black hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    )}

                    {/* Next Page Button */}
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-gray-100 text-sm font-medium ${
                        page === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-black hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity Details Modal (could be added later) */}
    </div>
  );
};

export default Activity;
