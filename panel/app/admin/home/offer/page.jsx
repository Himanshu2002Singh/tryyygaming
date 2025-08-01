"use client";
import React, { useState, useEffect } from "react";
import { FiSearch, FiX, FiEdit, FiTrash2, FiImage, FiVideo } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import API_URL from "@/config";
import { toast } from "react-toastify";

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    websiteurl: "",
    mediaType: "image",
    isActive: true
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

 
  // Fetch offers
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/admin/offers`);
      if (data.success) {
        setOffers(data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle media file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result);
      reader.readAsDatawebsiteurl(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      heading: "",
      description: "",
      websiteurl: "",
      mediaType: "image",
      isActive: true
    });
    setMediaFile(null);
    setMediaPreview(null);
    setEditingId(null);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("heading", formData.heading);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("websiteurl", formData.websiteurl);
      formDataToSend.append("mediaType", formData.mediaType);
      formDataToSend.append("isActive", formData.isActive);
      if (mediaFile) formDataToSend.append("media", mediaFile);

      let response;
      if (editingId) {
        response = await axios.put(
          `${API_URL}/admin/offers/${editingId}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(
          `${API_URL}/admin/offers`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (response.data.success) {
        toast.success(`Offer ${editingId ? "updated" : "created"} successfully`);
        fetchOffers();
        setShowForm(false);
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // Edit offer
  const handleEdit = (offer) => {
    setFormData({
      heading: offer.heading,
      description: offer.description,
      websiteurl: offer.websiteurl,
      mediaType: offer.mediaType || "image",
      isActive: offer.isActive
    });
    setMediaPreview(offer.media);
    setEditingId(offer.id);
    setShowForm(true);
  };

  // Delete offer
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    setLoading(true);
    try {
      const { data } = await axios.delete(`${API_URL}/admin/offers/${id}`);
      if (data.success) {
        toast.success("Offer deleted successfully");
        fetchOffers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete offer");
    } finally {
      setLoading(false);
    }
  };

  // Toggle status
  const toggleStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      const { data } = await axios.patch(
        `${API_URL}/admin/offers/${id}/toggle-status`
      );
      if (data.success) {
        toast.success(`Offer ${currentStatus ? "deactivated" : "activated"}`);
        fetchOffers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle status");
    } finally {
      setLoading(false);
    }
  };

  // Filter offers based on search
  const filteredOffers = offers.filter(offer =>
    offer.heading.toLowerCase().includes(search.toLowerCase()) ||
    offer.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offer Management</h1>
        <button
          onClick={() => { setShowForm(true); resetForm(); }}
          className="bg-white text-black px-4 py-2 rounded shadow-2xl flex items-center gap-2"
          disabled={loading}
        >
          <FaPlus /> Add Offer
        </button>
      </div>

      <div className="mb-6 relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search offers..."
          className="w-full pl-10 pr-4 py-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Media</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heading</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            )}
            {!loading && filteredOffers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No offers found
                </td>
              </tr>
            )}
            {!loading && filteredOffers.map((offer, index) => (
              <tr key={offer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="w-16 h-16 rounded overflow-hidden">
                    {offer.mediaType === 'video' ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <FiVideo className="text-white text-xl" />
                      </div>
                    ) : (
                      <img 
                        src={offer.media} 
                        alt={offer.heading} 
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = '/placeholder-image.png'}
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{offer.heading}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{offer.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleStatus(offer.id, offer.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      offer.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        offer.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="ml-2 text-sm">
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="text-blue-600 hover:text-blue-800"
                      disabled={loading}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
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

      {/* Offer Form Modal */}
   {showForm && (
  <div className="fixed inset-0 bg-transparent bg-opacity-80 flex items-center justify-center p-4 z-50">
    <div className="bg-black text-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center border-b border-gray-700 p-4">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Offer" : "Add New Offer"}
        </h2>
        <button onClick={() => { setShowForm(false); resetForm(); }}>
          <FiX size={20} className="text-white" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="block mb-1">Media Type</label>
          <div className="flex gap-4">
            <label className="flex items-center color-white">
              <input
                type="radio"
                name="mediaType"
                value="image"
                checked={formData.mediaType === "image"}
                onChange={handleChange}
                className="mr-2"
              />
              Image
            </label>
            <label className="flex items-center color-white">
              <input
                type="radio"
                name="mediaType"
                value="video"
                checked={formData.mediaType === "video"}
                onChange={handleChange}
                className="mr-2"
              />
              Video
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-1">
            {formData.mediaType === 'video' ? 'Video' : 'Image'} Upload
          </label>
          {mediaPreview && (
            <div className="mb-2 w-full h-40 bg-white rounded flex items-center justify-center overflow-hidden">
              {formData.mediaType === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <FiVideo className="text-white text-2xl"/>
                </div>
              ) : (
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          )}
          <input
            type="file"
            accept={formData.mediaType === 'video' ? 'video/*' : 'image/*'}
            onChange={handleFileChange}
            className="block border-white w-full text-sm text-white
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0 border-white
              file:text-sm file:font-semibold
              file:bg-yellow-100 file:text-black
              hover:file:bg-yellow-200"
          />
        </div>

        <div>
          <label className="block mb-1">Heading*</label>
          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-white"
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded text-white"
          />
        </div>

        <div>
          <label className="block mb-1">Website URL</label>
          <input
            type="text"
            name="websiteurl"
            value={formData.websiteurl}
            onChange={handleChange}
            className="w-full p-2 border rounded text-white"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Active</label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={() => { setShowForm(false); resetForm(); }}
            className="px-4 py-2 border border-white rounded text-white"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500"
            disabled={loading}
          >
            {loading ? "Processing..." : editingId ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default OfferManagement;