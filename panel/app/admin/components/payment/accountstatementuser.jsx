import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/config";

const AccountStatementUser = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    itemsPerPage: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/admin/manageuser/history`,
          {
            params: {
              userId: user.id,
              page: pagination.currentPage,
              limit: pagination.itemsPerPage,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
            },
          }
        );

        if (response.data.success) {
          setTransactions(response.data.data);
          setPagination(response.data.pagination);
        }
      } catch (err) {
        setError("Failed to fetch transaction history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [user.id, pagination.currentPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-500";
      case "Pending":
        return "text-yellow-500";
      case "Rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const renderTransactionRow = (transaction) => {
    return (
      <tr
        key={transaction.id}
        className="border-b border-gray-700 hover:bg-gray-700/50"
      >
        <td className="px-4 py-2">{transaction.referenceId}</td>
        <td className="px-4 py-2">{transaction.description}</td>
        <td className="px-4 py-2 text-right">{transaction.coins}</td>
        {/* <td className="px-4 py-2 text-right">
          {transaction.amount} {transaction.currency}
        </td> */}
        <td
          className={`px-4 py-2 font-semibold ${getStatusColor(
            transaction.status
          )}`}
        >
          {transaction.status}
        </td>
        <td className="px-4 py-2">
          {new Date(transaction.createdAt).toLocaleString()}
        </td>
      </tr>
    );
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  if (loading)
    return <div className="text-center text-white p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="w-full pb-3 overflow-hidden bg-[#393939] rounded-lg">
      <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
        Account Statement
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-white text-sm">
          <thead className="bg-[#2c2c2c]">
            <tr>
              <th className="px-4 py-2 text-left">Reference ID</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-right">Coins</th>
             
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>{transactions.map(renderTransactionRow)}</tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 bg-[#2c2c2c] rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-4 py-2 bg-[#2c2c2c] rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AccountStatementUser;
