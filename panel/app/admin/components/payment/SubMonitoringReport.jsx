"use client";
import React, { use, useState } from "react";
import {
  BsSearch,
  BsPhone,
  BsChatDots,
  BsFileText,
  BsShieldLock,
  BsPersonBadge,
  BsArrowDown,
} from "react-icons/bs";
import { HiOutlineChevronDown } from "react-icons/hi";
import { FaRegFilePdf, FaRegFileExcel } from "react-icons/fa";

const SubMonitoringDashboard = () => {
  const [dateFilter, setDateFilter] = useState("Today");
  const [userFilter, setUserFilter] = useState("All");
  const [hidefilter, setHideFilter] = useState(false);
  // Sample user data
  const users = [
    {
      id: 1,
      userId: "User123456",
      createdDate: "2025-03-18 00:22:37",
      lastLogin: "2025-03-18 00:22:37",
    },
    {
      id: 2,
      userId: "User123457",
      createdDate: "2025-03-18 00:22:04",
      lastLogin: "2025-03-18 00:22:41",
    },
    {
      id: 3,
      userId: "User123458",
      createdDate: "2025-03-18 00:21:55",
      lastLogin: "2025-03-18 00:21:55",
    },
    {
      id: 4,
      userId: "User12345",
      createdDate: "2025-03-18 00:18:52",
      lastLogin: "2025-03-18 00:19:26",
    },
    {
      id: 5,
      userId: "User123459",
      createdDate: "2025-03-18 00:18:06",
      lastLogin: "2025-03-18 00:18:06",
    },
    {
      id: 6,
      userId: "User123460",
      createdDate: "2025-03-18 00:16:32",
      lastLogin: "2025-03-18 00:16:32",
    },
    {
      id: 7,
      userId: "User12346",
      createdDate: "2025-03-18 00:16:07",
      lastLogin: "2025-03-18 00:16:07",
    },
    {
      id: 8,
      userId: "User123461",
      createdDate: "2025-03-18 00:16:01",
      lastLogin: "2025-03-18 00:16:01",
    },
  ];

  // Metrics data
  const metrics = [
    { title: "User Create Count", value: 31 },
    { title: "First Deposit Count", value: 0 },
    { title: "Total Amount of First Time Deposit", value: 0 },
    { title: "Recurring Deposit Count", value: 0 },
    { title: "Total Amount Of Recurring Deposit", value: 0 },
    { title: "Total Amount Deposit", value: 0 },
    { title: "Total Amount Withdraw", value: 0 },
    { title: "Day In/Out", value: 0 },
    { title: "User Monitoring Report", value: null },
    { title: "Total User", value: 31 },
    { title: "Last 24 Hours Active User", value: 1099 },
  ];

  return (
    <div className="bg-black sm:p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Layout */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Sidebar - Metrics */}
          <div className="w-full md:w-1/4 text-white bg-[var(--color-secondary)] rounded-lg shadow p-4">
            <div className="flex mb-6 sm:mb-0 justify-between items-center">
              <h1 className="text-lg font-semibold text-[var(--color-primary)] sm:mb-4">
                Monitoring Report
              </h1>
              <BsArrowDown
                className="sm:hidden"
                onClick={() => setHideFilter(!hidefilter)}
              />
            </div>

            <div className={`${hidefilter ? "hidden" : ""} space-y-2`}>
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center ${
                    metric.title === "User Monitoring Report"
                      ? "mt-4 pt-2 border-t"
                      : ""
                  }`}
                >
                  <span className="text-sm text-white">{metric.title}</span>
                  {metric.value !== null && (
                    <span className="bg-gray-200 text-black text-sm rounded px-2 py-1 min-w-8 text-center">
                      {metric.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - User Table */}
          <div className="w-full md:w-3/4">
            {/* Filter Controls */}
            <div className="bg-[var(--color-secondary)] p-4 rounded-lg shadow mb-4">
              <div className="flex flex-col md:flex-row justify-start items-center gap-4">
                <div className="sm:text-base text-sm">
                  <p className=" text-gray-400 mb-1">Select Data by Date</p>
                  <div className="relative">
                    <select
                      className="appearance-none sm:text-base text-sm bg-[var(--color-secondary)] border border-gray-300 rounded-md py-2 pl-3 pr-10 text-white w-48"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    >
                      <option>Today</option>
                      <option>Yesterday</option>
                      <option>Last 7 Days</option>
                      <option>This Month</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <HiOutlineChevronDown />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Users</p>
                  <div className="relative">
                    <select
                      className="appearance-none sm:text-base text-sm bg-[var(--color-secondary)] border border-gray-300 rounded-md py-2 pl-3 pr-10 text-white w-48"
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                    >
                      <option>All</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <HiOutlineChevronDown />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Search</p>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="border sm:text-base text-sm border-gray-300 rounded-md py-2 pl-3 pr-10 w-48"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <BsSearch />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 self-end">
                  <button className="border border-gray-300 rounded p-2 text-gray-500 hover:bg-gray-100">
                    <FaRegFileExcel size={20} />
                  </button>
                  <button className="border border-gray-300 rounded p-2 text-gray-500 hover:bg-gray-100">
                    <FaRegFilePdf size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-[var(--color-secondary)] rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full ">
                  <thead>
                    <tr className="bg-[var(--color-primary)] text-black">
                      <th className="px-4  sm:py-3 text-left text-sm font-medium ">
                        S.No
                      </th>
                      <th className="px-4 sm:py-3 text-left text-sm font-medium ">
                        User ID
                      </th>
                      <th className="px-4  sm:py-3 text-left text-sm font-medium ">
                        Created Date
                      </th>
                      <th className="px-4  sm:py-3 text-left text-sm font-medium ">
                        Last Login
                      </th>
                      <th className="px-4  sm:py-3 text-left text-sm font-medium ">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="text-white">
                        <td className="px-4 py-3 text-sm ">{user.id}</td>
                        <td className="px-4 py-3 text-sm ">
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-md">
                            {user.userId}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm ">
                          {user.createdDate}
                        </td>
                        <td className="px-4 py-3 text-sm ">{user.lastLogin}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-1">
                            <button className="p-1 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200">
                              <BsPhone size={18} />
                            </button>
                            <button className="p-1 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200">
                              <BsChatDots size={18} />
                            </button>
                            <button className="p-1 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200">
                              <BsFileText size={18} />
                            </button>
                            <button className="p-1 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200">
                              <BsShieldLock size={18} />
                            </button>
                            <button className="p-1 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200">
                              <BsPersonBadge size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubMonitoringDashboard;
