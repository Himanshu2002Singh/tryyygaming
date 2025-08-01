"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsXLg,
} from "react-icons/bs";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { formatDate } from "../utils/dateformat";
import API_URL from "@/config";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // Categories for navigation tabs
  const categories = ["TRANSACTIONS"];
  const [activeCategory, setActiveCategory] = useState("TRANSACTIONS");

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/transactions/history?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setTransactions(
          response.data.data.map((tx) => ({ ...tx, isOpen: false }))
        );
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to load transactions");
        toast.error("Failed to load transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Error loading transactions. Please try again.");
      toast.error("Error loading transactions");
    } finally {
      setLoading(false);
    }
  };

  // Toggle transaction details
  const toggleTransaction = (id) => {
    setTransactions(
      transactions.map((tx) =>
        tx.id === id ? { ...tx, isOpen: !tx.isOpen } : tx
      )
    );
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return "💰";
      case "withdraw":
        return "💳";
      case "panel_purchase":
        return "🖥️";
      default:
        return "📝";
    }
  };

  // Format transaction description
  const formatDescription = (transaction) => {
    let description = transaction.description || "";

    // Add location/username if available in metadata
    if (transaction.metadata) {
      if (
        transaction.type === "panel_purchase" &&
        transaction.metadata.panelDetails
      ) {
        const { panelName, username } = transaction.metadata.panelDetails;
        if (username) {
          description += ` (${username})`;
        }
      }
    }

    return description;
  };

  // Format transaction amount with currency
  const formatAmount = (amount, currency = "₹") => {
    return `${currency}${Number(amount).toLocaleString()}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
      case "Completed":
        return "text-green-500";
      case "Rejected":
      case "Failed":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  // Open enlarged image view
  const openEnlargedImage = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  // Close enlarged image view
  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  return (
    <div className="flex flex-col bg-[#111111] text-white h-full overflow-auto">
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto bg-[var(--color-secondary)]">
        <div className="flex">
          {categories.map((category) => (
            <button
              key={category}
              className={`text-xs px-6 py-4 uppercase ${
                activeCategory === category
                  ? "border-b-2 border-yellow-500"
                  : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="p-4">
        <h2 className="text-xs font-bold mb-4">Transactions</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-sm py-8 text-gray-400">
            No transactions found
          </div>
        ) : (
          <>
            {/* Transaction List */}
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-[var(--color-secondary)] rounded-lg overflow-hidden"
                >
                  {/* Transaction Summary Row */}
                  <div
                    className="px-3 py-1 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleTransaction(transaction.id)}
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-xs">
                        {formatDescription(transaction)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {formatDate(transaction.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-[10px]">
                          {transaction.coins.toLocaleString()}
                        </div>
                        <div
                          className={`text-[10px] ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </div>
                      </div>
                      {transaction.isOpen ? (
                        <BsChevronDown size={20} className="text-gray-400" />
                      ) : (
                        <BsChevronRight size={20} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expandable Transaction Details */}
                  {transaction.isOpen && (
                    <div className="bg-[#171717] m-2 px-4 pb-1 pt-2 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-xs">
                          Reference no.
                        </span>
                        <span className="text-xs">
                          {transaction.referenceId}
                        </span>
                      </div>

                      <div className="text-xs flex justify-between items-center mb-2">
                        <span className="text-gray-400">Coins</span>
                        <span>{transaction.coins.toLocaleString()}</span>
                      </div>

                      {transaction.rate && (
                        <div className="text-xs flex justify-between items-center mb-2">
                          <span className="text-gray-400">Rate per coin</span>
                          <span>{formatAmount(transaction.rate)}</span>
                        </div>
                      )}

                      {transaction.amount && (
                        <div className="text-xs flex justify-between items-center mb-2">
                          <span className="text-gray-400">Amount</span>
                          <span>
                            {formatAmount(
                              transaction.amount,
                              transaction.currency
                            )}
                          </span>
                        </div>
                      )}

                      {transaction.processedAt && (
                        <div className="text-xs flex justify-between items-center mb-2">
                          <span className="text-gray-400">
                            {transaction.status === "Approved"
                              ? "Approved on"
                              : transaction.status === "Rejected"
                              ? "Rejected on"
                              : "Processed on"}
                          </span>
                          <span>{formatDate(transaction.processedAt)}</span>
                        </div>
                      )}

                      {transaction.status === "Rejected" &&
                        transaction.rejectReason && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Reason</span>
                            <span className="text-red-500">
                              {transaction.rejectReason}
                            </span>
                          </div>
                        )}

                      {transaction.metadata &&
                        transaction.metadata.rejectReason && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Reason</span>
                            <span className="text-red-500">
                              {transaction.metadata.rejectReason}
                            </span>
                          </div>
                        )}

                      {/* Display receipt image if available */}
                      {transaction.receipt && (
                        <div className="mt-4">
                          <p className="text-gray-400 mb-2">Receipt</p>
                          <div className="flex justify-start">
                            <div
                              className="relative w-1/11 max-w-xs h-12 bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEnlargedImage(transaction.receipt);
                              }}
                            >
                              <Image
                                src={transaction.receipt}
                                alt="Transaction Receipt"
                                fill
                                style={{ objectFit: "contain" }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Transaction icon */}
                      {/* <div className="flex mt-4">
                        <div className="bg-white p-2 rounded">
                          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">
                              {getTransactionIcon(transaction.type)}
                            </span>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`p-2 rounded ${
                    page === 1
                      ? "text-gray-500"
                      : "text-white hover:bg-gray-800"
                  }`}
                >
                  <BsChevronLeft size={16} />
                </button>

                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`p-2 rounded ${
                    page === totalPages
                      ? "text-gray-500"
                      : "text-white hover:bg-gray-800"
                  }`}
                >
                  <BsChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeEnlargedImage}
        >
          <div className="relative w-full max-w-3xl h-[80vh] p-4">
            <button
              className="absolute top-2 right-2 bg-gray-800 rounded-full p-2 text-white z-10"
              onClick={closeEnlargedImage}
            >
              <BsXLg size={20} />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={enlargedImage}
                alt="Enlarged Receipt"
                fill
                style={{ objectFit: "contain" }}
                quality={100}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
