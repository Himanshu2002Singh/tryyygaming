"use client";
import React, { useContext, useEffect, useState } from "react";
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
} from "recharts";
import { AdminAuthContext } from "../../context/adminAuthcontext";

const PaymentDashBoard = () => {
  // Function to get the current date
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const { user } = useContext(AdminAuthContext);
  const [startDate, setStartDate] = useState("13-03-2025");
  const [endDate, setEndDate] = useState("13-03-2025");
  const topUsersData = [
    { name: "User 1", requests: 65 },
    { name: "User 2", requests: 85 },
    { name: "User 3", requests: 38 },
    { name: "User 4", requests: 72 },
    { name: "User 5", requests: 53 },
    { name: "User 6", requests: 42 },
    { name: "User 7", requests: 58 },
    { name: "User 8", requests: 34 },
    { name: "User 9", requests: 47 },
    { name: "User 10", requests: 60 },
  ];
  const getFirstDayOfMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDay.toLocaleDateString("en-CA"); // returns YYYY-MM-DD
  };

  useEffect(() => {
    setStartDate(getFirstDayOfMonth());
    setEndDate(getCurrentDate());
  }, []);
  const weeklyRequestData = [
    { day: "Mon", requests: 45 },
    { day: "Tue", requests: 63 },
    { day: "Wed", requests: 58 },
    { day: "Thu", requests: 72 },
    { day: "Fri", requests: 65 },
    { day: "Sat", requests: 30 },
    { day: "Sun", requests: 25 },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-[var(--color-primary)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full h-screen bg-[#D9D9D9] text-black">
      {/* Header */}
      {/* <AdminPaymentheader /> */}

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {/* <AdminPaymentsidebar /> */}
        {/* Main Dashboard */}
        <main className="flex-1 p-6">
          {/* Date Filters */}
          <div className="flex flex-col sm:flex-row  sm:justify-start  justify-center gap-4 mb-6">
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
              <button className="shadow-2xl bg-indigo-500 text-white px-8 py-1 sm:py-2 rounded">
                Submit
              </button>

              <button className="shadow-2xl bg-red-100 text-red-500 px-8 py-1 sm:py-2 rounded">
                Reset
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-col-2 md:grid-cols-4 gap-4 mb-6">
            {/* User Pending Request */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">User Pending Request</div>
                <div className="bg-gray-100 px-2 text-black rounded-full">
                  0
                </div>
              </div>
              <div className="text-xl font-semibold">₹0.00</div>
            </div>

            {/* Total Deposit */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Total Deposit</div>
              </div>
              <div className="text-xl font-semibold">₹0.00</div>
            </div>

            {/* Total Withdrawals */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Total Withdrawals</div>
              </div>
              <div className="text-xl font-semibold text-green-500">₹0.00</div>
            </div>

            {/* Profit / Loss */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Profit / Loss</div>
                <BsGraphUp size={18} className="text-gray-400" />
              </div>
              <div className="text-xl font-semibold">₹0.00</div>
            </div>
          </div>

          {/* Second Stats Grid */}
          <div className="grid grid-col-2 md:grid-cols-4 gap-4 mb-6">
            {/* First Time Deposit User */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">First Time Deposit User</div>
                <div className="bg-gray-100 px-2 text-black rounded-full">
                  0
                </div>
              </div>
              <div className="text-xl font-semibold text-green-500">₹0.00</div>
            </div>

            {/* First Time Withdrawal User */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">First Time Withdrawal User</div>
                <div className="bg-gray-100  text-black px-2 rounded-full">
                  0
                </div>
              </div>
              <div className="text-xl font-semibold text-green-500">₹0.00</div>
            </div>

            {/* Total Users */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Total Users</div>
                <BsGraphUp size={18} className="text-gray-400" />
              </div>
              <div className="text-xl font-semibold">0</div>
            </div>

            {/* Suspicious users */}
            <div className="bg-white rounded-lg shadow-2xl p-4">
              <div className="flex justify-between mb-2">
                <div className="text-gray-600">Suspicious users</div>
                <BsGraphUp size={18} className="text-gray-400" />
              </div>
              <div className="text-xl font-semibold">0</div>
            </div>
          </div>

          {/* Suspicious users request */}
          <div className="bg-white rounded-lg shadow-2xl p-4 mb-6">
            <div className="flex justify-between mb-2">
              <div className="text-gray-600">Suspicious users request</div>
              <div className="bg-gray-100 text-black px-2 rounded-full">0</div>
            </div>
            <div className="text-xl font-semibold">₹0.00</div>
          </div>
          <div className="flex justify-center flex-col sm:flex-row gap-3">
            {/* Charts Section */}
            <div className="w-full sm:w-3/6 bg-white rounded-lg shadow-2xl p-4">
              <div className="text-gray-600 mb-4">Top 10 Request Users</div>
              <div className="h-52 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topUsersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="requests" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Last 7 Days Total Request */}
            <div className="w-full sm:w-3/6 bg-white rounded-lg shadow-2xl p-4">
              <div className="text-gray-600 mb-4">
                Last 7 Days Total Request
              </div>
              <div className="h-52 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyRequestData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="requests" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentDashBoard;
