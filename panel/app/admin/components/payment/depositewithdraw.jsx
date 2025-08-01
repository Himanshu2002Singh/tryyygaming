"use client";
import React, { useState } from "react";

const DepositeWithdraw = () => {
  const [dateRange, setDateRange] = useState("");
  const [transactionType, setTransactionType] = useState("All Transaction");

  // Sample data for the dashboard
  const timeframes = [
    {
      title: "Today",
      transactions: [
        { type: "Withdraw :-", count: 0, amount: 0 },
        { type: "Wallet Deposit :-", count: 0, amount: 0 },
        { type: "Total :-", count: 0, amount: 0 },
      ],
    },
    {
      title: "Yesterday",
      transactions: [
        { type: "Withdraw :-", count: 0, amount: 0 },
        { type: "Wallet Deposit :-", count: 0, amount: 0 },
        { type: "Total :-", count: 0, amount: 0 },
      ],
    },
    {
      title: "This Week",
      transactions: [
        { type: "Withdraw :-", count: 0, amount: 0 },
        { type: "Wallet Deposit :-", count: 0, amount: 0 },
        { type: "Total :-", count: 0, amount: 0 },
      ],
    },
    {
      title: "Last Week",
      transactions: [
        { type: "Withdraw :-", count: 0, amount: 0 },
        { type: "Wallet Deposit :-", count: 0, amount: 0 },
        { type: "Total :-", count: 0, amount: 0 },
      ],
    },
  ];

  // Summary cards data
  const summaryCards = [
    { icon: "💰", title: "Deposits - Till date", value: 0 },
    { icon: "📤", title: "Withdraw - Till date", value: 0 },
    { icon: "📊", title: "Total - Till date", value: 0 },
  ];

  return (
    <div className="sm:p-6 bg-black text-white ">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-[var(--color-secondary)] p-4 rounded-lg shadow-sm flex items-center"
          >
            <div className="text-3xl mr-4 text-gray-700">{card.icon}</div>
            <div>
              <div className="text-xl font-bold">{card.value}</div>
              <div className="text-gray-400 text-sm">{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-white">From - To Date</span>
          <input
            style={{ colorScheme: "dark" }}
            type="date"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 text-white rounded p-2 w-40"
            placeholder="Select date range"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white">Select Transaction</span>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="border border-gray-300 bg-[var(--color-secondary)] rounded p-2 w-40"
          >
            <option>All Transaction</option>
            <option>Withdraw</option>
            <option>Deposit</option>
          </select>
        </div>
      </div>

      {/* Transaction Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {timeframes.map((timeframe, index) => (
          <div key={index} className="mb-6">
            <div className="bg-[var(--color-primary)] text-black p-3 rounded-t-lg font-medium text-center">
              {timeframe.title}
            </div>
            <div className="overflow-x-auto bg-[var(--color-secondary)] rounded-b-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--color-secondary)] text-[var(--color-primary)]">
                    <th className="text-left p-3 border-b ">
                      Transaction Type
                    </th>
                    <th className="text-right p-3 border-b ">
                      Transaction Count
                    </th>
                    <th className="text-right p-3 border-b ">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {timeframe.transactions.map((transaction, idx) => (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="p-3 text-white">{transaction.type}</td>
                      <td className="p-3 text-right text-white">
                        {transaction.count}
                      </td>
                      <td className="p-3 text-right text-white">
                        {transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepositeWithdraw;
