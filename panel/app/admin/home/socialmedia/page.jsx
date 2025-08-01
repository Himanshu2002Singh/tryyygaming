"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_URL from "@/config";
import { useBottomSheet } from "../../context/BottomSheetAdmin";
import ReactPaginate from "react-paginate";

function AddSocialMediaModal({ isOpen, onClose, onSocialAdded, socialToEdit }) {
  const [formData, setFormData] = useState({
    telegram: "",
    instagram: "",
    facebook: "",
    twitter: "",
    status: "active"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (socialToEdit) {
      setFormData({
        telegram: socialToEdit.telegram || "",
        instagram: socialToEdit.instagram || "",
        facebook: socialToEdit.facebook || "",
        twitter: socialToEdit.twitter || "",
        status: socialToEdit.status || "active"
      });
    } else {
      setFormData({
        telegram: "",
        instagram: "",
        facebook: "",
        twitter: "",
        status: "active"
      });
    }
  }, [socialToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admintoken");
      let response;

      if (socialToEdit) {
        // Update existing social media
        response = await axios.put(
          `${API_URL}/admin/update-social/${socialToEdit.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new social media and deactivate others
        response = await axios.post(
          `${API_URL}/admin/create-social`,
          { ...formData, deactivateOthers: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.status === 201 || response.status === 200) {
        toast.success(`Social media ${socialToEdit ? 'updated' : 'added'} successfully`);
        onSocialAdded();
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || `Failed to ${socialToEdit ? 'update' : 'add'} social media`;
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full pb-3 overflow-hidden bg-[#D9D9D9] text-black shadow-2xl">
      <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
        {socialToEdit ? 'Edit Social Media' : 'Add New Social Media'}
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black-300">
            Telegram Link
          </label>
          <input
            type="text"
            name="telegram"
            className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={formData.telegram}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black-300">
            Instagram Link
          </label>
          <input
            type="text"
            name="instagram"
            className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={formData.instagram}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black-300">
            Facebook Link
          </label>
          <input
            type="text"
            name="facebook"
            className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={formData.facebook}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black-300">
            Twitter Link
          </label>
          <input
            type="text"
            name="twitter"
            className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={formData.twitter}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-black-300">
            Status
          </label>
          <select
            name="status"
            className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700 transition-colors text-black-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--color-primary)] text-black rounded transition-colors flex items-center"
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
                {socialToEdit ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              socialToEdit ? 'Update Social Media' : 'Add Social Media'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminSocialMediaPage() {
  const { openBottomSheet } = useBottomSheet();
  const [socialMedias, setSocialMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchSocialMedias();
  }, [currentPage, searchTerm]);

  const fetchSocialMedias = async () => {
    const token = localStorage.getItem("admintoken");
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/socials`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSocialMedias(response.data.socialMedias);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      toast.error("Failed to fetch social media links");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const toggleSocialStatus = async (id, currentStatus) => {
    const token = localStorage.getItem("admintoken");
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await axios.patch(
        `${API_URL}/admin/socials/${id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Social media ${newStatus} successfully`);
      fetchSocialMedias();
    } catch (error) {
      toast.error("Failed to update social media status");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this social media link?")) {
      const token = localStorage.getItem("admintoken");
      try {
        await axios.delete(`${API_URL}/admin/delete-social/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Social media link deleted successfully");
        fetchSocialMedias();
      } catch (error) {
        toast.error("Failed to delete social media link");
        console.error(error);
      }
    }
  };

  const handleEdit = (social) => {
    openBottomSheet(({ onClose }) => (
      <AddSocialMediaModal
        isOpen={true}
        onClose={onClose}
        onSocialAdded={fetchSocialMedias}
        socialToEdit={social}
      />
    ));
  };

  const filteredSocialMedias = socialMedias.filter((social) =>
    Object.values(social).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="p-6 min-h-screen bg-[#D9D9D9] text-black-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="sm:text-lg text-xs font-bold text-black border-b border-gray-700 pb-4">
          Social Media Management
        </h1>
        <button
          onClick={() => {
            openBottomSheet(({ onClose }) => (
              <AddSocialMediaModal
                isOpen={true}
                onClose={onClose}
                onSocialAdded={fetchSocialMedias}
              />
            ));
          }}
          className="bg-white text-black font-medium px-4 py-2 rounded text-sm transition-colors flex items-center shadow-2xl"
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
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Social Media
        </button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search social media links..."
            className="p-3 pl-10 border rounded w-full md:w-1/3 bg-white border-black text-black-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-2xl">
          <table className="min-w-full bg-white-800 border-collapse">
            <thead className="bg-[var(--color-primary)] text-black">
              <tr className="text-sm">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  S.No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Telegram
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Instagram
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Facebook
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Twitter
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredSocialMedias.map((social, count) => (
                <tr
                  key={social.id}
                  className={`text-sm hover:bg-[#dbd7d2] transition-colors text-black ${
                    (startIndex + count) % 2 === 0 ? "bg-[#dbd7d2]" : "bg-[#f5f5f5]"
                  }`}
                >
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {startIndex + count + 1}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {social.telegram || "N/A"}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {social.instagram || "N/A"}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {social.facebook || "N/A"}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {social.twitter || "N/A"}
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        social.status === "active"
                          ? "bg-green-900 text-green-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {social.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(social)}
                        className="bg-[#009900] hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors flex items-center"
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
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => toggleSocialStatus(social.id, social.status)}
                        className={`${
                          social.status === "active"
                            ? "bg-[#ffef00] hover:bg-[#ffcc00] text-black"
                            : "bg-[#ce2029] hover:bg-red-700 text-white"
                        } px-3 py-1 rounded text-xs transition-colors flex items-center`}
                      >
                        {social.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(social.id)}
                        className="bg-[#ce2029] hover:bg-red-700 text-white px-3 py-2 rounded-full text-xs transition-colors flex items-center"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSocialMedias.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-black-400">
                    No social media links found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              forcePage={currentPage - 1}
              pageCount={totalPages}
              breakLabel={"..."}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="flex gap-1"
              pageClassName="pagination-item"
              pageLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-black-400 bg-white border border-black-300 hover:bg-black-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              previousClassName="pagination-item"
              previousLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-black-500 bg-white border border-black-300 hover:bg-black-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              nextClassName="pagination-item"
              nextLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              breakClassName="pagination-item"
              breakLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              activeClassName="z-10"
              activeLinkClassName="flex items-center justify-center px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              disabledClassName="opacity-50 cursor-not-allowed"
            />
          </div>
        </div>
      )}
    </div>
  );
}