"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";

function SuspiciousAccountContent() {
  const [showSideForm, setShowSideForm] = useState(false);
  const handleAddRange = () => {
    setShowSideForm(true);
  };
  const [formData, setFormData] = useState({
    searchQuery: "",
    userName: "",
    matchAccount: "",
    accountType: "",
    agentName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetForm();
    console.log("Form submitted:", formData);
  };

  const handleSearch = () => {
    console.log("Searching for:", formData.searchQuery);
    // Implement search functionality here
  };

  const handleCloseForm = () => {
    setShowSideForm(false);
    resetForm();
  };

  const resetForm = () => {
    setShowSideForm(false);
    setFormData({
      searchQuery: "",
      userName: "",
      matchAccount: "",
      accountType: "",
      agentName: "",
    });
  };

  return (
    <div className="space-y-4">
      <div
        className={`w-full flex-1 sm:p-6 transition-all duration-300 ${
          showSideForm ? "" : ""
        }`}
      >
        <div className="flex flex-col gap-y-2.5 sm:gap-y-2.5 sm:flex-row  justify-between mb-6">
          <div className="relative sm:w-64">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border rounded-md sm:pr-10"
            />
            <FiSearch className="absolute right-3 top-3 text-gray-500" />
          </div>
          <button
            onClick={handleAddRange}
            className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-md"
          >
            Add Suspicious Account
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-[var(--color-secondary)] border">
            <thead>
              <tr className="bg-[var(--color-primary)] text-black">
                <th className="px-6 sm:py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-6 sm:py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 sm:py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Account Type
                </th>
                <th className="px-6 sm:py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Account Holder Name
                </th>
                <th className="px-6 sm:py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Account No.
                </th>
                <th className="px-6 sm:py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  No Record Found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {showSideForm && (
        <div className="fixed right-0 top-0 sm:w-96 h-full bg-black shadow-lg border-l border-gray-200 z-10 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-[var(--color-primary)]">
              Add Suspicious user
            </h2>
            <button className="text-gray-500 hover:text-gray-700">
              <IoCloseOutline className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Search user accounts */}
            <div className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  name="searchQuery"
                  value={formData.searchQuery}
                  onChange={handleInputChange}
                  placeholder="Search user accounts"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-r-md  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                >
                  <FiSearch className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>

            {/* User Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-1">
                User Name
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="User Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Match Account */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-1">
                Match Account
              </label>
              <input
                type="text"
                name="matchAccount"
                value={formData.matchAccount}
                onChange={handleInputChange}
                placeholder="Match Account"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Account Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-1">
                Account Type
              </label>
              <input
                type="text"
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                placeholder="Account Type"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Agent Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-1">
                Agent Name
              </label>
              <input
                type="text"
                name="agentName"
                value={formData.agentName}
                onChange={handleInputChange}
                placeholder="Agent name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={resetForm}
                type="button"
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      {showSideForm && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-30 z-0"
          onClick={handleCloseForm}
        />
      )}
    </div>
  );
}

export default SuspiciousAccountContent;
