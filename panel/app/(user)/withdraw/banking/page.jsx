"use client";
import React, { useContext, useState } from "react";
import { useBottomSheet } from "../../context/BottomSheet";
import Withdraw from "../../components/depositWithdraw/withdraw";
import { AuthContext } from "../../context/authprovider";
import { useUserBank } from "../../context/userbankprovider";

const WithdrawBankdetail = () => {
  const { user } = useContext(AuthContext);
  const { openBottomSheet } = useBottomSheet();
  const {
    activeBanks,
    deletedBanks,
    bankHistory,
    loading,
    error,
    deleteBankAccount,
  } = useUserBank();

  const [activeTab, setActiveTab] = useState("ACTIVE BANKS");
  const tabs = ["ACTIVE BANKS", "DELETED", "HISTORY"];
  const [expandedId, setExpandedId] = useState(null);

  // Get the appropriate bank list based on the active tab
  const getBankList = () => {
    switch (activeTab) {
      case "ACTIVE BANKS":
        return activeBanks;
      case "DELETED":
        return deletedBanks;
      case "HISTORY":
        return bankHistory;
      default:
        return [];
    }
  };

  const bankAccounts = getBankList();

  // Toggle accordion expansion
  const toggleAccordion = (id) => {
    if (activeTab !== "HISTORY") {
      setExpandedId(expandedId === id ? null : id);
    }
  };

  return (
    <div className="bg-[#111111] text-white min-h-screen">
      {/* Tabs Navigation */}
      <div className="flex px-12 justify-between bg-[var(--color-secondary)]">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-3 text-[10px] sm:px-5 font-medium ${
              activeTab === tab
                ? "border-b-4 border-[var(--color-primary)]"
                : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="px-4 py-3">
        {/* User Info Card and Add New Bank Button - Only shown in ACTIVE BANKS tab */}
        {activeTab === "ACTIVE BANKS" && (
          <>
            <div className="bg-[var(--color-secondary)] rounded-lg p-4 mb-4 flex items-center justify-center">
              <div className="flex items-center">
                <div className="flex-col text-center items-center justify-center">
                  <div className="text-white text-sm">
                    {user?.name || "User"}
                  </div>
                  <div className="text-white text-sm">
                    {user?.phone || "No phone number"}
                  </div>
                </div>
              </div>
            </div>

            {/* Add New Bank Button */}
            <button
              onClick={() =>
                openBottomSheet(() => <Withdraw openbankform={true} />)
              }
              className="w-full bg-[var(--color-primary)] text-[10px] text-black py-3 rounded-lg mb-4"
            >
              Add New Bank
            </button>
          </>
        )}

        {/* Bank Accounts List */}
        {loading ? (
          <div className="text-center py-4">Loading bank accounts...</div>
        ) : bankAccounts.length > 0 ? (
          <div className="space-y-2">
            {activeTab === "HISTORY" && (
              <span className="text-xs text-white">
                <h3 className="text-white text-sm">Bank Details</h3>
              </span>
            )}
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="bg-[var(--color-secondary)] rounded-lg overflow-hidden"
              >
                {/* Accordion Header - Always visible */}
                <div
                  className={`flex items-center justify-between px-3 py-2 ${
                    activeTab !== "HISTORY" ? "cursor-pointer" : ""
                  }`}
                  onClick={() => toggleAccordion(account.id)}
                >
                  <div className="flex flex-col">
                    <span className="text-xs">
                      {account.bankName || "bank name not found"}
                    </span>

                    {/* Show account number below bank name for HISTORY tab */}
                    {activeTab === "HISTORY" && (
                      <span className="text-xs text-white">
                        A/C No. {account.useraccountNo || "N/A"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    {activeTab === "ACTIVE BANKS" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent accordion from toggling
                          deleteBankAccount(account.id);
                        }}
                        className="text-red-500 bg-[#171717] p-2 rounded-full"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}

                    {/* For HISTORY tab, show created date instead of accordion arrow */}
                    {activeTab === "HISTORY" ? (
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400">
                          {new Date(account.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-green-500">Add</span>
                      </div>
                    ) : (
                      /* Expand/Collapse Arrow for other tabs */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform duration-200 ${
                          expandedId === account.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Accordion Content - Visible when expanded (only for non-HISTORY tabs) */}
                {activeTab !== "HISTORY" && expandedId === account.id && (
                  <div className="px-3 pb-3 text-[10px] space-y-1 border-t border-gray-700 pt-2">
                    <div className="flex justify-between">
                      <p>Account Holder Name</p>
                      <p>{account.useraccountHolderName}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Account Number</p>
                      <p>{account.useraccountNo}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>IFSC Code</p>
                      <p>{account.userifscCode}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Account added on</p>
                      <p>{new Date(account.createdAt).toLocaleString()}</p>
                    </div>
                    {account.bankName && (
                      <div className="flex justify-between">
                        <p>Bank</p>
                        <p>{account.bankName}</p>
                      </div>
                    )}
                    {account.branchName && (
                      <div className="flex justify-between">
                        <p>Branch</p>
                        <p>{account.branchName}</p>
                      </div>
                    )}
                    {activeTab === "DELETED" && (
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-400">Last Updated</p>
                        <p className="text-xs text-gray-400">
                          {new Date(account.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-xs text-left">
            {activeTab === "ACTIVE BANKS"
              ? "No Bank Details found! Adding Bank Details is mandatory for processing withdrawals"
              : "No bank accounts found in this category"}
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawBankdetail;
