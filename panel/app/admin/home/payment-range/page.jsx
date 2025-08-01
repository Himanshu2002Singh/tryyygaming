"use client";
import API_URL from "@/config";
import React, { useState, useEffect } from "react";
import { BsTrash } from "react-icons/bs";
import { FiDelete, FiSearch, FiX } from "react-icons/fi";

const PaymentRange = () => {
  const [showSideForm, setShowSideForm] = useState(false);
  const [ranges, setRanges] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    minimum: "",
    maximum: "",
    displayText: "",
  });

  const handleAddRange = () => {
    setShowSideForm(true);
  };

  const handleCloseForm = () => {
    setShowSideForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      minimum: "",
      maximum: "",
      displayText: "",
    });
  };
  useEffect(() => {
    const fetchPaymentRanges = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/admin/payment-range`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setRanges(data.paymentRanges || []);
        } else {
          console.error("Failed to fetch payment ranges");
        }
      } catch (error) {
        console.error("Error fetching payment ranges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentRanges();
  }, []);

  const handleDeleteRange = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment range?")) {
      try {
        const response = await fetch(`${API_URL}/admin/payment-range/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // Remove the deleted range from the state
          setRanges(ranges.filter((range) => range.id !== id));
          alert("Payment range deleted successfully");
        } else {
          console.error("Failed to delete payment range");
          alert("Failed to delete payment range");
        }
      } catch (error) {
        console.error("Error deleting payment range:", error);
        alert("Error deleting payment range");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:");
    const newRange = {
      minimum: formData.minimum,
      maximum: formData.maximum,
      displayText: formData.displayText,
      status: true, // Active status
    };

    try {
      const response = await fetch(`${API_URL}/admin/payment-range`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRange),
      });

      if (response.ok) {
        const data = await response.json();
        setRanges([...ranges, data]);
        handleCloseForm();
      } else {
        console.error("Failed to add payment range");
      }
    } catch (error) {
      console.error("Error adding payment range:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const filteredRanges = ranges.filter(
    (range) =>
      (range.minimum?.toString() || "").includes(searchQuery) ||
      (range.maximum?.toString() || "").includes(searchQuery) ||
      (range.displayText?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );
  useEffect(() => {
    console.log("Search query:", searchQuery);
    console.log("Filtered ranges:", filteredRanges);
  }, [searchQuery, filteredRanges]);

  return (
    <div className=" w-full h-screen bg-black">
      {/* Main content area */}
      <div
        className={`w-full flex-1 p-6 transition-all duration-300 ${
          showSideForm ? "" : ""
        }`}
      >
        <div className="  rounded-lg shadow">
          <div className="p-0 sm:p-6">
            <h1 className="text-xl font-semibold text-white mb-6">
              Payment Range
            </h1>

            {/* Search and Add bar */}
            <div className="flex flex-col gap-y-2.5 sm:gap-y-2.5 sm:flex-row  justify-between mb-6">
              <div className="relative sm:w-64">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 border rounded-md sm:pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute right-3 top-3 text-gray-500" />
              </div>

              <button
                onClick={handleAddRange}
                className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-md  transition"
              >
                Add Range
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[var(--color-secondary)]">
                <thead className="bg-[var(--color-primary)] text-black">
                  <tr>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium ">
                      S.No
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium ">
                      Minimum
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      Maximum
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium ">
                      Display Text
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium ">
                      Status
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium ">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white">
                  {filteredRanges.length > 0 ? (
                    filteredRanges.map((range, index) => (
                      <tr key={range.id} className="">
                        <td className="py-4 px-6 text-sm text-white">
                          {index + 1}
                        </td>
                        <td className="py-4 px-6 text-sm text-white">
                          {range.minimum}
                        </td>
                        <td className="py-4 px-6 text-sm text-white">
                          {range.maximum}
                        </td>
                        <td className="py-4 px-6 text-sm text-white">
                          {range.displayText}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {range.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm  cursor-pointer">
                          <div className="flex gap-x-2 items-center">
                            {" "}
                            <h2 className="text-blue-500 hover:text-blue-800">
                              Edit
                            </h2>
                            <BsTrash
                              onClick={() => handleDeleteRange(range.id)}
                              className="text-red-500"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-4 px-6 text-sm text-gray-500 text-center"
                      >
                        No Record Found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Side form */}
      {showSideForm && (
        <div className="fixed right-0 top-0 sm:w-96 h-full bg-black shadow-lg border-l border-gray-200 z-10 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              Add New Range
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[var(--color-text)] mb-2">
                Minimum
              </label>
              <input
                type="number"
                name="minimum"
                value={formData.minimum}
                onChange={handleInputChange}
                placeholder="Minimum Range"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[var(--color-text)] mb-2">
                Maximum
              </label>
              <input
                type="number"
                name="maximum"
                value={formData.maximum}
                onChange={handleInputChange}
                placeholder="Maximum Range"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-[var(--color-text)] mb-2">
                Display Text
              </label>
              <input
                type="text"
                name="displayText"
                value={formData.displayText}
                onChange={handleInputChange}
                placeholder="Display Text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-black rounded-md hover:bg-green-300 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Overlay for when side form is open */}
      {showSideForm && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-30 z-0"
          onClick={handleCloseForm}
        />
      )}
    </div>
  );
};

export default PaymentRange;
