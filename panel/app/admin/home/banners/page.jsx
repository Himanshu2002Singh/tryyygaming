"use client";
import React, { useState, useEffect } from "react";
import { FiSearch, FiX, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import API_URL from "@/config";

const Banner = () => {
  const [showSideForm, setShowSideForm] = useState(false);
  const [banners, setBanners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    text: "",
    url: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch all banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/banners`);
      if (response.data.success) {
        setBanners(response.data.data);
      } else {
        toast.error("Failed to fetch banners");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Error fetching banners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBanner = () => {
    setEditingBanner(null);
    resetForm();
    setShowSideForm(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setFormData({
      text: banner.text || "",
      url: banner.url || "",
      isActive: banner.isActive,
    });
    setImagePreview(banner.imageUrl);
    setShowSideForm(true);
  };

  const handleCloseForm = () => {
    setShowSideForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      text: "",
      url: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingBanner(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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
    if (!imageFile && !editingBanner) {
      toast.error("Please select an image");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("text", formData.text);
    formDataToSend.append("url", formData.url);
    formDataToSend.append("isActive", formData.isActive);

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    setIsLoading(true);
    try {
      let response;

      if (editingBanner) {
        // Update existing banner
        response = await axios.put(
          `${API_URL}/admin/banner/${editingBanner.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new banner
        response = await axios.post(
          `${API_URL}/admin/banners`,
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
          editingBanner
            ? "Banner updated successfully"
            : "Banner created successfully"
        );
        fetchBanners();
        handleCloseForm();
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.log("Error saving banner:", error);
      toast.error(error.response?.data?.message || "Error saving banner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/admin/banners/${id}`);
      if (response.data.success) {
        toast.success("Banner deleted successfully");
        fetchBanners();
      } else {
        toast.error(response.data.message || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error(error.response?.data?.message || "Error deleting banner");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBannerStatus = async (banner) => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("isActive", !banner.isActive);

      const response = await axios.put(
        `${API_URL}/admin/banners/${banner.id}`,
        formDataToSend
      );

      if (response.data.success) {
        toast.success("Banner status updated");
        fetchBanners();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating banner status:", error);
      toast.error(error.response?.data?.message || "Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter banners based on search query
  const filteredBanners = banners.filter(
    (banner) =>
      banner.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-screen bg-[#D9D9D9] text-black">
      {/* Main content area */}
      <div className="w-full flex-1 p-6 transition-all duration-300">
        <div className="">
          <div className="p-0 sm:p-6">
            <h1 className="text-xl font-semibold text-black mb-6">
              Banner Management
            </h1>

            {/* Search and Add bar */}
            <div className="flex flex-col gap-y-2.5 sm:gap-y-2.5 sm:flex-row justify-between mb-6">
              <div className="relative sm:w-64">
                <input
                  type="text"
                  placeholder="Search banners"
                  className="w-full px-4 py-2 border rounded-md sm:pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute right-3 top-3 text-black-500" />
              </div>

              <button
                onClick={handleAddBanner}
                className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-md transition flex items-center justify-center"
                disabled={isLoading}
              >
                <FaPlus className="mr-2" /> Add Banner
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                <thead className="bg-[var(--color-primary)] text-black">
                  <tr>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      S.No
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      Image
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      Text
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      URL
                    </th>

                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading && (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-4 px-6 text-sm text-center text-black"
                      >
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!isLoading && filteredBanners.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-4 px-6 text-sm text-center text-black"
                      >
                        No banners found.
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    filteredBanners.map((banner, index) => (
                      <tr
                        key={banner.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-[#E7E7E7]"
                        }  text-black`}
                      >
                        <td className="px-4 sm:py-3 whitespace-nowrap border">
                          {index + 1}
                        </td>
                        <td className="px-4 sm:py-3 whitespace-nowrap border">
                          <div className="w-16 h-16 overflow-hidden rounded">
                            <img
                              src={banner.image}
                              alt={banner.text || "Banner"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 sm:py-3 whitespace-nowrap border">
                          {banner.text || "-"}
                        </td>
                        <td className="px-4 sm:py-3 whitespace-nowrap border">
                          {banner.url ? (
                            <a
                              href={banner.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black-400 hover:underline"
                            >
                              {banner.url}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        {/* <td className="py-4 px-6 text-sm">
                          <button
                            onClick={() => toggleBannerStatus(banner)}
                            className={`px-2 py-1 rounded-full text-xs ${
                              banner.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {banner.isActive ? "Active" : "Inactive"}
                          </button>
                        </td> */}
                        <td className="px-4 sm:py-3 whitespace-nowrap border">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditBanner(banner)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Edit"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
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

      {/* Side form */}
      {showSideForm && (
        <div className="fixed right-0 top-0 sm:w-96 h-full bg-white shadow-2xl border-l border-gray-200 z-10 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              {editingBanner ? "Edit Banner" : "Add New Banner"}
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
                Banner Image
              </label>
              <div className="flex flex-col items-center space-y-3">
                {imagePreview && (
                  <div className="w-full h-40 overflow-hidden rounded-md border border-gray-300">
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <p className="text-xs text-gray-500">
                  {editingBanner
                    ? "Upload a new image or keep the existing one"
                    : "Please select an image file"}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[var(--color-text)] mb-2">
                Banner Text (Optional)
              </label>
              <input
                type="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                placeholder="Enter banner text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[var(--color-text)] mb-2">
                URL (Optional)
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Link where users will be directed when clicking the banner
              </p>
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
                Only active banners will be displayed on the site
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
                {isLoading ? "Saving..." : editingBanner ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Overlay for when side form is open */}
      {showSideForm && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-0"
          onClick={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Banner;
