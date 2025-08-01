"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiX,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiImage,
} from "react-icons/fi";
import { toast } from "react-toastify";
import API_URL from "@/config";

const Posters = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSideForm, setShowSideForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingPoster, setEditingPoster] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    isActive: true,
    coinCost: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch all posters on component mount
  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/posters`);
      if (response.data.success) {
        setCategories(response.data.data);

        // If we have categories, set the first one as selected by default
        if (response.data.data.length > 0 && !selectedCategory) {
          setSelectedCategory(response.data.data[0].name);
        }
      } else {
        toast.error("Failed to fetch posters");
      }
    } catch (error) {
      console.error("Error fetching posters:", error);
      toast.error("Error fetching posters");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPoster = () => {
    setEditingPoster(null);
    resetForm();
    setShowSideForm(true);
  };

  const handleEditPoster = (poster) => {
    setEditingPoster(poster);
    setFormData({
      categoryName: poster.categoryName || "",
      description: poster.description || "",
      isActive: poster.isActive,
      coinCost:
        poster.coinCost !== undefined
          ? Number(poster.coinCost)
          : poster.images && poster.images[0]?.coinCost
          ? Number(poster.images[0].coinCost)
          : 0, // Add more fallback options
    });
    setImagePreview(poster.src);
    setShowSideForm(true);
  };

  const handleCloseForm = () => {
    setShowSideForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      categoryName: selectedCategory || "",
      description: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingPoster(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "number"
          ? value === ""
            ? 0
            : Number(value) // Convert to number, default to 0 if empty
          : type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!imageFile && !editingPoster) {
      toast.error("Please select an image");
      return;
    }

    if (!formData.categoryName) {
      toast.error("Category name is required");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("categoryName", formData.categoryName);
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("isActive", formData.isActive);
    formDataToSend.append("coinCost", formData.coinCost || 0); // Add coin cost to form data

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    setIsLoading(true);
    try {
      let response;

      if (editingPoster) {
        // Update existing poster
        response = await axios.put(
          `${API_URL}/admin/posters/${editingPoster.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new poster
        response = await axios.post(
          `${API_URL}/admin/posters`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.data.success) {
        toast.success(
          editingPoster
            ? "Poster updated successfully"
            : "Poster created successfully"
        );
        fetchPosters();
        handleCloseForm();
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving poster:", error);
      toast.error(error.response?.data?.message || "Error saving poster");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePoster = async (id) => {
    if (!window.confirm("Are you sure you want to delete this poster?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/admin/poster/${id}`);
      if (response.data.success) {
        toast.success("Poster deleted successfully");
        fetchPosters();
      } else {
        toast.error(response.data.message || "Failed to delete poster");
      }
    } catch (error) {
      console.error("Error deleting poster:", error);
      toast.error(error.response?.data?.message || "Error deleting poster");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePosterStatus = async (poster) => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("isActive", !poster.isActive);

      const response = await axios.put(
        `${API_URL}/admin/posters/${poster.id}`,
        formDataToSend
      );

      if (response.data.success) {
        toast.success("Poster status updated");
        fetchPosters();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating poster status:", error);
      toast.error(error.response?.data?.message || "Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategoryExpand = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  // Filter categories and posters based on search query
  const filteredCategories = categories.filter((category) => {
    // Check if category name matches search
    const categoryMatches = category.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Check if any poster in this category matches search
    const posterMatches = category.images.some(
      (poster) =>
        poster.description &&
        poster.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return categoryMatches || posterMatches;
  });

  return (
    <div className="w-full h-screen bg-[#D9D9D9] flex flex-col sm:flex-row">  
      {/* Main content area */}
      <div className="w-full flex-1 p-6 transition-all duration-300">
        <div className="rounded-lg shadow">
          <div className="p-0 sm:p-6">
            <h1 className="text-xl font-semibold text-black mb-6">
              Poster Management
            </h1>

            {/* Search and Add bar */}
            <div className="flex flex-col gap-y-2.5 sm:gap-y-2.5 sm:flex-row justify-between mb-6">
              <div className="relative sm:w-64">
                <input
                  type="text"
                  placeholder="Search posters"
                  className="w-full px-4 py-2 border rounded-md sm:pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute right-3 top-3 text-gray-500" />
              </div>

              <button
                onClick={handleAddPoster}
                className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-md transition flex items-center justify-center"
                disabled={isLoading}
              >
                <FiPlus className="mr-2" /> Add Poster
              </button>
            </div>

            {/* Categories and Posters Display */}
            {isLoading && (
              <div className="text-center py-8 text-black">
                Loading posters...
              </div>
            )}

            {!isLoading && filteredCategories.length === 0 && (
              <div className="text-center py-8 text-black">
                No posters found.
              </div>
            )}

            {!isLoading && filteredCategories.length > 0 && (
              <div className="space-y-6">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-lg overflow-hidden shadow-2xl"
                  >
                    <div
                      className="bg-[var(--color-primary)] text-black p-3 flex justify-between items-center cursor-pointer shadow-2xl"
                      onClick={() => toggleCategoryExpand(category.id)}
                    >
                      <h2 className="text-lg font-semibold">{category.name}</h2>
                      ({category.coinCost} coins)
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">
                          {category.images.length} poster
                          {category.images.length !== 1 ? "s" : ""}
                        </span>
                        <span>
                          {expandedCategory === category.id ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>

                    {expandedCategory === category.id && (
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {category.images.map((poster) => (
                          <div
                            key={poster.id}
                            className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700"
                          >
                            <div className="relative h-40">
                              <img
                                src={poster.src}
                                alt={poster.description || category.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2 flex space-x-1">
                                <button
                                  onClick={() =>
                                    handleEditPoster({
                                      ...poster,
                                      categoryName: category.name,
                                      coinCost: poster.coinCost, // Explicitly pass coin cost
                                    })
                                  }
                                  className="bg-blue-500 p-1.5 rounded-full text-black hover:bg-blue-600"
                                  title="Edit"
                                >
                                  <FiEdit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeletePoster(poster.id)}
                                  className="bg-red-500 p-1.5 rounded-full text-black hover:bg-red-600"
                                  title="Delete"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                              <div
                                className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs ${
                                  poster.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                                onClick={() => togglePosterStatus(poster)}
                                style={{ cursor: "pointer" }}
                              >
                                {poster.isActive ? "Active" : "Inactive"}
                              </div>
                            </div>
                            {poster.description && (
                              <div className="p-3 text-black text-sm">
                                {poster.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side form */}
      {showSideForm && (
        <div className="fixed right-0 top-0 sm:w-96 h-full bg-[#D9D9D9] shadow-lg border-l border-gray-200 z-10 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              {editingPoster ? "Edit Poster" : "Add New Poster"}
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
                Category Name
              </label>
              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                placeholder="Enter category name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
              {categories.length > 0 && !editingPoster && (
                <div className="mt-2">
                  <label className="block text-[var(--color-text)] text-sm mb-1">
                    Or select existing category:
                  </label>
                  <select
                    className="w-full bg-white px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    onChange={(e) =>
                      setFormData({ ...formData, categoryName: e.target.value })
                    }
                    value={formData.categoryName}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-[var(--color-text)] mb-2">
                Coin Cost (Optional)
              </label>
              <input
                type="number"
                name="coinCost"
                value={formData.coinCost}
                onChange={handleInputChange}
                placeholder="Enter coin cost for this poster"
                min="0"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Coins required to use this poster template
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-[var(--color-text)] mb-2">
                Poster Image
              </label>
              <div className="flex flex-col items-center space-y-3">
                {imagePreview && (
                  <div className="w-full h-40 overflow-hidden rounded-md border border-black">
                    <img
                      src={imagePreview}
                      alt="Poster preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="w-full">
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray rounded-md cursor-pointer hover:bg-white">
                    <div className="flex flex-col items-center">
                      <FiImage size={24} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-400">
                        {editingPoster
                          ? "Upload a new image or keep the existing one"
                          : "Click to upload poster image"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[var(--color-text)] mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter poster description"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] h-24"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center text-[var(--color-text)]">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4"
                />
                Active
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Only active posters will be displayed on the site
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 bg-gray-500 text-black rounded-md hover:bg-gray-600 transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-black rounded-md hover:bg-green-300 transition"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : editingPoster ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Overlay for when side form is open */}
      {showSideForm && (
        <div
        className="fixed inset-0  backdrop-blur-[3px] z-0"
        onClick={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Posters;
