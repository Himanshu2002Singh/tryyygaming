"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_URL from "@/config";
import ReactPaginate from "react-paginate";

const CreatePanel = () => {
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isB2B, setIsB2B] = useState(false); // Default is B2C
  const [showModal, setShowModal] = useState(false); // New state for modal visibility
  //   const [currentPage, setCurrentPage] = useState(1);
  const [panelsPerPage] = useState(10); // Number of panels per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  useEffect(() => {
    fetchPanels();
  }, [currentPage, searchTerm]); // Add currentPage and searchTerm to dependency array
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    website: "",
    apiurl: "",
    image: null,
    rateChart: [
      { coins: "10000", minRate: "16", maxRate: "80" },
      { coins: "100000", minRate: "155", maxRate: "80" },
      { coins: "1000000", minRate: "150", maxRate: "80" },
      { coins: "10000000", minRate: "15", maxRate: "80" },
    ],
    purchaserate: "",
    accounttype: "Admin",
    panelType: "B2B", // Default panel type
  });
  const [editMode, setEditMode] = useState(false);
  const [currentPanelId, setCurrentPanelId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [totalPages, setTotalPages] = useState(0); // Total pages for pagination
  // Predefined categories
  const [selectedPanelRateChart, setSelectedPanelRateChart] = useState(null);
  const [showRateChartModal, setShowRateChartModal] = useState(false);

  const predefinedCategories = [
    "World",
    "Diamond",
    "Premium",
    "Standard",
    "Basic",
  ];

  // useEffect(() => {
  //   fetchPanels();
  // }, []);
  const accountTypes = ["Admin", "Super Master", "Master", "Agent"];

  const fetchPanels = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/admin/panels`, {
        params: {
          page: currentPage,
          limit: panelsPerPage,
          search: searchTerm, // Include search term in request
        },
      });

      setPanels(response.data.data);
      setTotalPages(response.data.totalPages);
      setLoading(false);
      // Set total pages from response
    } catch (error) {
      console.error("Error fetching panels:", error);
      toast.error("Failed to fetch panels");
      setLoading(false);
    }
  };
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1); // Update current page
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePanelType = () => {
    const newType = isB2B ? "B2C" : "B2B";
    setIsB2B(!isB2B);
    setFormData({
      ...formData,
      panelType: newType,
    });
  };

  const handleRateChartChange = (index, field, value) => {
    const updatedRateChart = [...formData.rateChart];
    updatedRateChart[index][field] = value;
    setFormData({
      ...formData,
      rateChart: updatedRateChart,
    });
  };

  const addRateChartRow = () => {
    setFormData({
      ...formData,
      rateChart: [
        ...formData.rateChart,
        { coins: "", minRate: "", maxRate: "" },
      ],
    });
  };

  const removeRateChartRow = (index) => {
    if (formData.rateChart.length > 1) {
      const updatedRateChart = formData.rateChart.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        rateChart: updatedRateChart,
      });
    } else {
      toast.error("At least one rate chart row is required");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("apiurl", formData.apiurl);
      // formDataToSend.append("rateChart", JSON.stringify(formData.rateChart));
      formDataToSend.append("purchaserate", formData.purchaserate / 100);
      formDataToSend.append("accounttype", formData.accounttype);
      formDataToSend.append("panelType", formData.panelType);
      const modifiedRateChart = formData.rateChart.map((rate) => ({
        coins: rate.coins,
        minRate: rate.minRate / 100,
        maxRate: rate.maxRate / 100,
      }));

      // Append the modified rateChart as JSON string
      formDataToSend.append("rateChart", JSON.stringify(modifiedRateChart));

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editMode) {
        await axios.put(
          `${API_URL}/admin/update-panels/${currentPanelId}`,
          formDataToSend
        );
        toast.success("Panel updated successfully");
      } else {
        await axios.post(`${API_URL}/admin/create-panel`, formDataToSend);
        toast.success("Panel created successfully");
      }

      resetForm();
      setShowModal(false); // Close modal after submission
      fetchPanels();
    } catch (error) {
      console.error("Error saving panel:", error);
      toast.error(error.response?.data?.message || "Failed to save panel");
    } finally {
      setLoading(false);
    }
  };
  const filteredPanels = panels.filter((panel) =>
    panel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (panel) => {
    // Convert panel's rate chart data to our format if needed
    let rateChartData = panel.rateChart || [
      { coins: "10000", minRate: "16", maxRate: "80" },
      { coins: "100000", minRate: "155", maxRate: "80" },
      { coins: "1000000", minRate: "150", maxRate: "80" },
      { coins: "10000000", minRate: "15", maxRate: "80" },
    ];

    // If rateChart is a string, parse it
    if (typeof rateChartData === "string") {
      try {
        rateChartData = JSON.parse(rateChartData);
      } catch (e) {
        console.error("Error parsing rate chart data:", e);
      }
    }

    // Set B2B/B2C toggle based on panel data
    setIsB2B(panel.panelType === "B2B");

    setFormData({
      name: panel.name,
      category: panel.category || "",
      website: panel.website,
      apiurl: panel.apiurl,
      image: null,
      rateChart: rateChartData.map((rate) => ({
        ...rate,
        minRate: parseFloat(rate.minRate) * 100, // Multiply by 100
        maxRate: parseFloat(rate.maxRate) * 100, // Multiply by 100
      })),
      purchaserate: parseFloat(panel.purchaserate) * 100, // Multiply by 100
      accounttype: panel.accounttype,
      panelType: panel.panelType || "B2C",
    });
    setPreviewImage(panel.logo);
    setEditMode(true);
    setCurrentPanelId(panel.id);
    setShowModal(true); // Open modal for editing
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this panel?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/admin/delete-panel/${id}`);
        toast.success("Panel deleted successfully");
        fetchPanels();
      } catch (error) {
        console.error("Error deleting panel:", error);
        toast.error("Failed to delete panel");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      website: "",
      apiurl: "",
      image: null,
      rateChart: [
        { coins: "10000", minRate: "16", maxRate: "80" },
        { coins: "100000", minRate: "155", maxRate: "80" },
        { coins: "1000000", minRate: "150", maxRate: "80" },
        { coins: "10000000", minRate: "15", maxRate: "80" },
      ],
      accounttype: "Admin",
      purchaserate: "",
      panelType: "B2B",
    });
    setIsB2B(true);
    setPreviewImage(null);
    setEditMode(false);
    setCurrentPanelId(null);
  };

  // Function to open modal for adding new panel
  const openAddPanelModal = () => {
    resetForm();
    setEditMode(false);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-6 bg-[#D9D9D9] text-black min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-black border-b border-gray-700 pb-4">
          Manage Ids
        </h1>

        <button
          onClick={openAddPanelModal}
          className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Add Panel
        </button>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black">
                  {editMode ? "Edit Panel" : "Create New Panel"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* B2B/B2C Toggle Switch */}
              <div className="mb-6 bg-black-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Panel Type:</span>
                  <div className="flex items-center">
                    <span
                      className={`mr-2 ${
                        !isB2B ? "text-green-500" : "text-black-400"
                      }`}
                    >
                      B2C
                    </span>
                    <div
                      className="relative inline-block w-12 h-6 cursor-pointer"
                      onClick={togglePanelType}
                    >
                      <div
                        className={`w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                          isB2B ? "bg-green-500" : "bg-gray-600"
                        }`}
                      >
                        <div
                          className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
                            isB2B ? "translate-x-6" : "translate-x-1"
                          } top-0.5`}
                        ></div>
                      </div>
                    </div>
                    <span
                      className={`ml-2 ${
                        isB2B ? "text-green-500" : "text-gray"
                      }`}
                    >
                      B2B
                    </span>
                  </div>
                </div>
                {/* <p className="text-sm text-gray-400 mt-2">
                  {isB2B
                    ? "B2B IDs are for business-to-business transactions with other service providers."
                    : "B2C IDs are for direct business-to-customer services."}
                </p> */}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label className="block text-black-300 mb-2 font-medium">
                      Panel Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border rounded bg-gray border-gray-600 text-black-100 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-black mb-2 font-medium">
                      Category
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        list="categoryOptions"
                        className="w-full p-3 border rounded bg-gray border-gray-600 text-black-100 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                        placeholder="Select or type a custom category"
                      />
                      <datalist id="categoryOptions">
                        {predefinedCategories.map((category, index) => (
                          <option key={index} value={category} />
                        ))}
                      </datalist>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Choose from predefined categories or add your own
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-black mb-2 font-medium">
                      Website URL
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full p-3 border rounded bg-gray border-gray-600 text-black-100 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-black mb-2 font-medium">
                      API URL (optional)
                    </label>
                    <input
                      type="url"
                      name="apiurl"
                      value={formData.apiurl}
                      onChange={handleChange}
                      className="w-full p-3 border rounded bg-gray border-gray-600 text-black-100 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div className="mb-4 col-span-2">
                    <label className="block text-black mb-2 font-medium">
                      Logo
                    </label>
                    <div className="flex items-center">
                      <div className="relative w-full flex items-center bg-gray border border-gray-600 rounded overflow-hidden">
                        {previewImage ? (
                          <div className="flex items-center w-full">
                            <div className="h-12 w-12 flex-shrink-0 bg-gray p-1">
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <span className="ml-3 text-gray flex-1 truncate">
                              {formData.image?.name || "Current logo"}
                            </span>
                            <label
                              className="p-3 bg-gray hover:bg-gray cursor-pointer h-full flex items-center"
                              title="Change image"
                            >
                              <svg
                                className="w-5 h-5 text-cyan-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                ></path>
                              </svg>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                required={!editMode && !previewImage}
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="w-full flex items-center p-3 cursor-pointer hover:bg-gray">
                            <svg
                              className="w-6 h-6 mr-2 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <span className="text-black">
                              Select panel logo
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              required={!editMode}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-black mb-2 font-medium">
                      Account Type
                    </label>
                    <select
                      name="accounttype"
                      value={formData.accounttype}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border bg-grey rounded-lg focus:outline-none focus:ring-2 "
                    >
                      {accountTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-black mb-2 font-medium">
                    Purchase Rate (%)
                  </label>
                  <input
                    type="number"
                    name="purchaserate"
                    value={formData.purchaserate}
                    step="1"
                    min="0"
                    onChange={handleChange}
                    className="w-full p-3 border rounded bg-gray border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                {/* Rate Chart Section */}
                <div className="mt-6 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                      Sharing Rate Chart (%)
                    </h3>
                    <button
                      type="button"
                      onClick={addRateChartRow}
                      className="bg-graytext-cyan-400 px-3 py-1 rounded hover:bg-gray-600 transition-colors flex items-center text-sm"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      Add Row
                    </button>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="grid grid-cols-12 gap-3 mb-2 text-gray-400 text-sm font-medium">
                      <div className="col-span-4">Coins</div>
                      <div className="col-span-3">Min Rate</div>
                      <div className="col-span-3">Max Rate</div>
                      <div className="col-span-2">Action</div>
                    </div>

                    {formData.rateChart.map((rate, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 mb-3">
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={rate.coins}
                            onChange={(e) =>
                              handleRateChartChange(
                                index,
                                "coins",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            placeholder="e.g. 10,000 +"
                            required
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            value={rate.minRate}
                            onChange={(e) =>
                              handleRateChartChange(
                                index,
                                "minRate",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            placeholder="Min Rate"
                            required
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            value={rate.maxRate}
                            onChange={(e) =>
                              handleRateChartChange(
                                index,
                                "maxRate",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            placeholder="Max Rate"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <button
                            type="button"
                            onClick={() => removeRateChartRow(index)}
                            className="bg-red-900 hover:bg-red-800 text-white p-2 rounded transition-colors"
                            title="Remove row"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="bg-[var(--color-primary)] text-black px-5 py-2 rounded hover:bg-cyan-700 transition-colors flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        {editMode ? (
                          <>
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              ></path>
                            </svg>
                            Update Panel
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              ></path>
                            </svg>
                            Create Panel
                          </>
                        )}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-graytransition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-[var(--color-primary)]">
          All Panels
        </h2>

        {loading && (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500 mr-2"></div>
            <span className="text-gray-400">Loading panels...</span>
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder="Search panels..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full bg-gray border-gray text-black focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-collapse">
          <thead className="bg-[var(--color-primary)]">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider border border-gray">
                Logo
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider border border-gray">
                Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider border border-gray">
                Type
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider border border-gray">
                Category
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider border border-gray">
                Rate Chart
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider border border-gray">
                Website
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider border border-gray">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {panels.length > 0 ? (
              panels.map((panel) => (
                <tr key={panel.id} className="hover:bg-gray transition-colors ">
                  <td className="py-3 px-4 text-white border-b border-gray-700">
                    <div className=" rounded">
                      <img
                        src={panel.logo}
                        alt={panel.name}
                        className="h-12  rounded-full w-12 object-contain"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 border border-gray font-medium">
                    {panel.name}
                  </td>
                  <td className="py-3 px-4 border border-gray">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        panel.panelType === "B2B"
                          ? "bg-blue-900 text-purple-200"
                          : "bg-orange-400 text-blue-200"
                      }`}
                    >
                      {panel.panelType || "B2C"}
                    </span>
                  </td>
                  <td className="py-3 px-4 border border-gray">
                    {panel.category || "N/A"}
                  </td>
                  <td className="py-3 px-4 border border-gray">
                    <button
                      onClick={() => {
                        setSelectedPanelRateChart(panel);
                        setShowRateChartModal(true);

                        // You could implement a modal to show the full rate chart
                        // alert(
                        //   "Rate Chart for " +
                        //     panel.name +
                        //     ":\n\n" +
                        //     (panel.rateChart
                        //       ? typeof panel.rateChart === "string"
                        //         ? panel.rateChart
                        //         : JSON.stringify(panel.rateChart, null, 2)
                        //       : "No rate chart available")
                        // );
                      }}
                      className="bg-graytext-cyan-400 px-2 py-1 rounded text-xs hover:bg-gray-600"
                    >
                      View Rates
                    </button>
                  </td>
                  <td className="py-3 px-4 border border-gray">
                    <a
                      href={panel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center w-max"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        ></path>
                      </svg>
                      Visit
                    </a>
                  </td>
                  <td className="py-3 px-4 border border-gray-700">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(panel)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(panel.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    No panels found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>{" "}
        <div className="flex justify-center mt-4">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            subContainerClassName={"pages pagination"}
            containerClassName="flex gap-1"
            pageClassName="pagination-item"
            pageLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-graydark:hover:text-white"
            previousClassName="pagination-item"
            previousLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-graydark:hover:text-white"
            nextClassName="pagination-item"
            nextLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-graydark:hover:text-white"
            breakClassName="pagination-item"
            breakLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-graydark:hover:text-white"
            activeClassName="z-10"
            activeLinkClassName="flex items-center justify-center px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-graydark:text-white"
            disabledClassName="opacity-50 cursor-not-allowed"
            // ... other styling classes as needed
          />
        </div>
      </div>
      {showRateChartModal && selectedPanelRateChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Rate Chart for {selectedPanelRateChart.name}
              </h2>
              <button
                onClick={() => setShowRateChartModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Coins</th>
                    <th className="border p-2">Min Rate (%)</th>
                    <th className="border p-2">Max Rate (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Parse rate chart if it's a string
                    const rateChart =
                      typeof selectedPanelRateChart.rateChart === "string"
                        ? JSON.parse(selectedPanelRateChart.rateChart)
                        : selectedPanelRateChart.rateChart;

                    return rateChart.map((rate, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{rate.coins}</td>
                        <td className="border p-2 text-center">
                          {(parseFloat(rate.minRate) * 100).toFixed(2)}%
                        </td>
                        <td className="border p-2 text-center">
                          {(parseFloat(rate.maxRate) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowRateChartModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePanel;
