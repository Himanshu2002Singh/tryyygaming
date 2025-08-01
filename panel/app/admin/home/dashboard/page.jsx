"use client";
import React, { useContext, useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import AdminPaymentsidebar from "../../components/payment/sidebar";
import AdminPaymentheader from "../../components/payment/header";
import { BsGraphUp } from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { AdminAuthContext } from "../../context/adminAuthcontext";
import API_URL from "@/config";

const PaymentDashBoard = () => {
  const { user } = useContext(AdminAuthContext);

  // Helper function to get first day of current month (avoiding timezone issues)
  const getFirstDayOfMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}-01`;
  };

  // Helper function to get current date (avoiding timezone issues)
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [dashboardData, setDashboardData] = useState(null);
  const [topUsersData, setTopUsersData] = useState([]);
  const [weeklyRequestData, setWeeklyRequestData] = useState([]);
  const [panelStatsData, setPanelStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get admin token from localStorage
      const adminToken = localStorage.getItem("admintoken");

      if (!adminToken) {
        console.error("No admin token found");
        setLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      };

      // Fetch dashboard stats
      const [
        statsResponse,
        topUsersResponse,
        weeklyResponse,
        panelStatsResponse,
      ] = await Promise.all([
        fetch(
          `${API_URL}/admin/dashboard/stats?startDate=${startDate}&endDate=${endDate}`,
          { headers }
        ),
        fetch(
          `${API_URL}/admin/dashboard/top-users?startDate=${startDate}&endDate=${endDate}`,
          { headers }
        ),
        fetch(
          `${API_URL}/admin/dashboard/weekly-requests?startDate=${startDate}&endDate=${endDate}`,
          { headers }
        ),
        fetch(
          `${API_URL}/admin/dashboard/panel-stats?startDate=${startDate}&endDate=${endDate}`,
          { headers }
        ),
      ]);

      const [statsData, topUsersResult, weeklyResult, panelStatsResult] =
        await Promise.all([
          statsResponse.json(),
          topUsersResponse.json(),
          weeklyResponse.json(),
          panelStatsResponse.json(),
        ]);

      // Check for authentication errors
      if (
        statsResponse.status === 401 ||
        topUsersResponse.status === 401 ||
        weeklyResponse.status === 401 ||
        panelStatsResponse.status === 401
      ) {
        console.error("Authentication failed");
        localStorage.removeItem("admintoken");
        return;
      }

      if (statsData.success) {
        setDashboardData(statsData.data);
      }

      if (topUsersResult.success) {
        setTopUsersData(
          topUsersResult.data.map((user) => ({
            name: user.username || user.name,
            requests: user.requests,
          }))
        );
      }

      if (weeklyResult.success) {
        setWeeklyRequestData(weeklyResult.data);
      }

      if (panelStatsResult.success) {
        setPanelStatsData(panelStatsResult.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleSubmit = () => {
    fetchDashboardData();
  };

  const handleReset = () => {
    setStartDate(getFirstDayOfMonth());
    setEndDate(getCurrentDate());
    setTimeout(() => {
      fetchDashboardData();
    }, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-[var(--color-primary)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-[var(--color-primary)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D9D9D9] text-black">
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Main Dashboard */}
        <main className="flex-1 p-6">
          {/* Date Filters */}
          <div className="flex flex-col sm:flex-row sm:justify-start justify-center gap-4 mb-6">
            <div className="flex items-center text-xs sm:text-base">
              <div className="mr-2">From Date</div>
              <div className="relative w-40">
                <input
                  type="date"
                  className="border rounded px-3 py-2 w-full cursor-pointer"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <div className="absolute right-2 top-3 text-gray-400 pointer-events-none">
                  <FaRegCalendarAlt size={18} />
                </div>
              </div>
            </div>

            <div className="flex items-center text-xs sm:text-base">
              <div className="mr-2">To Date</div>
              <div className="relative w-40">
                <input
                  type="date"
                  className="border rounded px-3 py-2 w-full cursor-pointer"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <div className="absolute right-2 top-3 text-gray-400 pointer-events-none">
                  <FaRegCalendarAlt size={18} />
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                className="shadow-2xl bg-indigo-500 text-white px-8 py-1 sm:py-2 rounded hover:bg-indigo-600 transition-colors"
              >
                Submit
              </button>

              <button
                onClick={handleReset}
                className="shadow-2xl bg-red-100 text-red-500 px-8 py-1 sm:py-2 rounded hover:bg-red-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-2xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Quick Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-500">Pending Amount</div>
                <div className="font-semibold text-blue-600">
                  {formatCurrency(
                    (dashboardData?.pendingDepositAmount || 0) +
                      (dashboardData?.pendingWithdrawalAmount || 0)
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Total Processed</div>
                <div className="font-semibold text-green-600">
                  {formatCurrency(
                    (dashboardData?.totalDepositAmount || 0) +
                      (dashboardData?.totalWithdrawalAmount || 0)
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Net Flow</div>
                <div
                  className={`font-semibold ${
                    (dashboardData?.profitLoss || 0) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(dashboardData?.profitLoss)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Active Users</div>
                <div className="font-semibold text-purple-600">
                  {(dashboardData?.totalUsers || 0) -
                    (dashboardData?.suspiciousUsers || 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">ID Revenue</div>
                <div className="font-semibold text-indigo-600">
                  {formatCurrency(
                    dashboardData?.panelPurchaseStats?.totalAmount
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">ID Actions</div>
                <div className="font-semibold text-orange-600">
                  {dashboardData?.panelActionStats?.totalActions || 0}
                </div>
              </div>
            </div>
          </div>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Total Pending Requests */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Total Pending Requests</div>
                <div className="bg-gray-100 px-2 text-black rounded-full">
                  {dashboardData?.totalPendingRequests || 0}
                </div>
              </div>
              <div className="text-xl font-semibold">
                {formatCurrency(
                  (dashboardData?.pendingDepositAmount || 0) +
                    (dashboardData?.pendingWithdrawalAmount || 0)
                )}
              </div>
            </div>

            {/* D-Amount (Pending Deposits) */}
            {/* D-Amount (Pending Deposits) */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">D-Amount (Pending)</div>
                <div className="text-green-500 font-bold">🟢</div>
              </div>
              <div className="text-xl font-semibold text-green-500">
                {formatCurrency(dashboardData?.pendingDepositAmount)}
              </div>
            </div>

            {/* W-Amount (Pending Withdrawals) */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">W-Amount (Pending)</div>
                <div className="text-red-500 font-bold">🔴</div>
              </div>
              <div className="text-xl font-semibold text-red-500">
                {formatCurrency(dashboardData?.pendingWithdrawalAmount)}
              </div>
            </div>

            {/* Total Deposit */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Total Deposit</div>
                <BsGraphUp size={18} className="text-green-400" />
              </div>
              <div className="text-xl font-semibold text-green-500">
                {formatCurrency(dashboardData?.totalDepositAmount)}
              </div>
            </div>
          </div>

          {/* Panel Purchase Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Total Panel Purchases */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Total ID Requests</div>
                <div className="bg-blue-100 px-2 text-blue-600 rounded-full">
                  {dashboardData?.panelPurchaseStats?.totalRequests || 0}
                </div>
              </div>
              <div className="text-xl font-semibold text-blue-600">
                {dashboardData?.panelPurchaseStats?.totalRequests || 0}
              </div>
            </div>

            {/* Pending Panel Purchases */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Pending ID Requests</div>
                <div className="bg-yellow-100 px-2 text-yellow-600 rounded-full">
                  {dashboardData?.panelPurchaseStats?.pending || 0}
                </div>
              </div>
              <div className="text-xl font-semibold text-yellow-600">
                {dashboardData?.panelPurchaseStats?.pending || 0}
              </div>
            </div>

            {/* Completed Panel Purchases */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Completed ID Requests</div>
                <div className="bg-green-100 px-2 text-green-600 rounded-full">
                  {dashboardData?.panelPurchaseStats?.completed || 0}
                </div>
              </div>
              <div className="text-xl font-semibold text-green-600">
                {dashboardData?.panelPurchaseStats?.completed || 0}
              </div>
            </div>

            {/* Total Panel Purchase Amount */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Total ID Purchase Amount</div>
                <BsGraphUp size={18} className="text-purple-400" />
              </div>
              <div className="text-xl font-semibold text-purple-600">
                {formatCurrency(dashboardData?.panelPurchaseStats?.totalAmount)}
              </div>
            </div>
          </div>

          {/* Panel Actions Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Total Panel Actions */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Total Panel Actions</div>
                <div className="bg-indigo-100 px-2 text-indigo-600 rounded-full">
                  {dashboardData?.panelActionStats?.totalActions || 0}
                </div>
              </div>
              <div className="text-xl font-semibold text-indigo-600">
                {dashboardData?.panelActionStats?.totalActions || 0}
              </div>
            </div>

            {/* Panel Deposits */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Panel Deposits</div>
                <div className="bg-green-100 px-2 text-green-600 rounded-full">
                  {dashboardData?.panelActionStats?.deposits || 0}
                </div>
              </div>
              <div className="text-xl font-semibold text-green-600">
                {formatCurrency(
                  dashboardData?.panelActionStats?.totalDepositAmount
                )}
              </div>
            </div>

            {/* Panel Withdrawals */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Panel Withdrawals</div>
                <div className="bg-red-100 px-2 text-red-600 rounded-full">
                  {dashboardData?.panelActionStats?.withdrawals || 0}
                </div>
              </div>
              <div className="text-xl font-semibold text-red-600">
                {formatCurrency(
                  dashboardData?.panelActionStats?.totalWithdrawalAmount
                )}
              </div>
            </div>

            {/* Pending Panel Actions */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Pending Panel Actions</div>
                <div className="bg-orange-100 px-2 text-orange-600 rounded-full">
                  {dashboardData?.panelActionStats?.pending || 0}
                </div>
              </div>
              <div className="text-xl font-semibold text-orange-600">
                {formatCurrency(
                  (dashboardData?.panelActionStats?.pendingDepositAmount || 0) +
                    (dashboardData?.panelActionStats?.pendingWithdrawalAmount ||
                      0)
                )}
              </div>
            </div>
          </div>

          {/* Traditional Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Total Withdrawal */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Total Withdrawal</div>
                <BsGraphUp size={18} className="text-red-400" />
              </div>
              <div className="text-xl font-semibold text-red-500">
                {formatCurrency(dashboardData?.totalWithdrawalAmount)}
              </div>
            </div>

            {/* New Users Count */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">New Users Count</div>
                <div className="bg-blue-100 px-2 text-blue-600 rounded-full">
                  {dashboardData?.newUsersCount || 0}
                </div>
              </div>
              <div className="text-xl font-semibold">
                {dashboardData?.newUsersCount || 0}
              </div>
            </div>

            {/* First Time Deposit User */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">First Time Deposit User</div>
                <div className="bg-gray-100 px-2 text-black rounded-full">
                  {dashboardData?.firstTimeDepositUsers?.count || 0}
                </div>
              </div>
              <div className="text-xl font-semibold text-green-500">
                {formatCurrency(dashboardData?.firstTimeDepositUsers?.amount)}
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Total Users</div>
                <BsGraphUp size={18} className="text-gray-400" />
              </div>
              <div className="text-xl font-semibold">
                {dashboardData?.totalUsers || 0}
              </div>
            </div>
          </div>

          {/* Profit/Loss Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Profit / Loss */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Profit / Loss</div>
                <BsGraphUp size={18} className="text-gray-400" />
              </div>
              <div
                className={`text-xl font-semibold ${
                  (dashboardData?.profitLoss || 0) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(dashboardData?.profitLoss)}
              </div>
            </div>

            {/* Panel Purchase Success Rate */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">ID Success Rate</div>
                <BsGraphUp size={18} className="text-blue-400" />
              </div>
              <div className="text-xl font-semibold text-blue-600">
                {dashboardData?.panelPurchaseStats?.totalRequests > 0
                  ? `${Math.round(
                      (dashboardData?.panelPurchaseStats?.completed /
                        dashboardData?.panelPurchaseStats?.totalRequests) *
                        100
                    )}%`
                  : "0%"}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Users Chart */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-gray-600">Top 10 Request Users</div>
                <button
                  onClick={fetchDashboardData}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <IoIosRefresh size={20} />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topUsersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, "Requests"]}
                      labelFormatter={(label) => `User: ${label}`}
                    />
                    <Bar dataKey="requests" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Requests Chart */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-gray-600">Weekly Total Requests</div>
                <button
                  onClick={fetchDashboardData}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <IoIosRefresh size={20} />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyRequestData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, "Requests"]}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Bar dataKey="requests" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Popular Panels Section */}
          {dashboardData?.popularPanels &&
            dashboardData.popularPanels.length > 0 && (
              <div className="bg-white rounded-lg shadow-2xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Most Popular Panels
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardData.popularPanels.map((panel, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center mb-2">
                        {panel.panelLogo && (
                          <img
                            src={panel.panelLogo}
                            alt={panel.panelName}
                            className="w-8 h-8 rounded mr-2"
                          />
                        )}
                        <div className="font-semibold text-gray-800">
                          {panel.panelName}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Purchases: {panel.purchaseCount}</div>
                        <div>Total Coins: {panel.totalCoins}</div>
                        <div>Amount: {formatCurrency(panel.totalAmount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Top Panel Users Section */}
          {dashboardData?.topPanelUsers &&
            dashboardData.topPanelUsers.length > 0 && (
              <div className="bg-white rounded-lg shadow-2xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Top Panel Users
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          User
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Purchases
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Total Coins
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Total Spent
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.topPanelUsers.map((user, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-blue-600 font-semibold">
                            {user.panelPurchases}
                          </td>
                          <td className="px-4 py-2 text-green-600">
                            {user.totalCoins}
                          </td>
                          <td className="px-4 py-2 text-purple-600">
                            {formatCurrency(user.totalSpent)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* Panel Actions Status Chart */}
          {dashboardData?.panelActionStats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Panel Actions Status Pie Chart */}
              <div className="bg-white rounded-lg shadow-2xl p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Panel Actions Status
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Pending",
                            value: dashboardData.panelActionStats.pending,
                            color: "#FFBB28",
                          },
                          {
                            name: "Approved",
                            value: dashboardData.panelActionStats.approved,
                            color: "#00C49F",
                          },
                          {
                            name: "Rejected",
                            value: dashboardData.panelActionStats.rejected,
                            color: "#FF8042",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          {
                            name: "Pending",
                            value: dashboardData.panelActionStats.pending,
                            color: "#FFBB28",
                          },
                          {
                            name: "Approved",
                            value: dashboardData.panelActionStats.approved,
                            color: "#00C49F",
                          },
                          {
                            name: "Rejected",
                            value: dashboardData.panelActionStats.rejected,
                            color: "#FF8042",
                          },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Actions"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Panel Purchase Status Pie Chart */}
              <div className="bg-white rounded-lg shadow-2xl p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  ID Purchase Status
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Pending",
                            value: dashboardData.panelPurchaseStats.pending,
                            color: "#FFBB28",
                          },
                          {
                            name: "Completed",
                            value: dashboardData.panelPurchaseStats.completed,
                            color: "#00C49F",
                          },
                          {
                            name: "Failed",
                            value: dashboardData.panelPurchaseStats.failed,
                            color: "#FF8042",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          {
                            name: "Pending",
                            value: dashboardData.panelPurchaseStats.pending,
                            color: "#FFBB28",
                          },
                          {
                            name: "Completed",
                            value: dashboardData.panelPurchaseStats.completed,
                            color: "#00C49F",
                          },
                          {
                            name: "Failed",
                            value: dashboardData.panelPurchaseStats.failed,
                            color: "#FF8042",
                          },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Purchases"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Additional Stats Summary */}

          {/* Panel Stats Table */}
          {panelStatsData && panelStatsData.length > 0 && (
            <div className="bg-white rounded-lg shadow-2xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Panel Performance Details
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Panel
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Total
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Pending
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Completed
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Failed
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Revenue
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {panelStatsData.map((panel, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            {panel.logo && (
                              <img
                                src={panel.logo}
                                alt={panel.name}
                                className="w-6 h-6 rounded mr-2"
                              />
                            )}
                            <div>
                              <div className="font-medium">{panel.name}</div>
                              <div className="text-xs text-gray-500">
                                {panel.website}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 font-semibold">
                          {panel.totalPurchases}
                        </td>
                        <td className="px-4 py-2 text-yellow-600">
                          {panel.pendingPurchases}
                        </td>
                        <td className="px-4 py-2 text-green-600">
                          {panel.completedPurchases}
                        </td>
                        <td className="px-4 py-2 text-red-600">
                          {panel.failedPurchases}
                        </td>
                        <td className="px-4 py-2 text-purple-600">
                          {formatCurrency(panel.totalAmount)}
                        </td>
                        <td className="px-4 py-2 text-blue-600">
                          {panel.totalActions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Error State */}
          {!dashboardData && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-600 text-center">
                Failed to load dashboard data. Please try refreshing the page.
              </div>
              <div className="text-center mt-2">
                <button
                  onClick={fetchDashboardData}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PaymentDashBoard;
