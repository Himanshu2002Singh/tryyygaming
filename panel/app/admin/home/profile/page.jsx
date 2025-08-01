"use client";
import API_URL from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiKey,
  FiClock,
  FiShield,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiEdit,
  FiSave,
  FiXOctagon,
} from "react-icons/fi";

export default function UserProfile() {
  // Sample data from your backend (in a real app, this would come from props or API)
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for edit mode
  const [editMode, setEditMode] = useState({
    userId: false,
    name: false,
    email: false,
    password: false,
  });

  // State for form inputs

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("admintoken");

        // Fetch profile data
        const response = await axios.get(`${API_URL}/admin/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const adminData = response.data.admin;
          setUserData(adminData);

          // Initialize form inputs with fetched data
          setFormInputs({
            userId: adminData.userId,
            name: adminData.name,
            email: adminData.email,
            password: "",
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const [formInputs, setFormInputs] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
  });

  // Format date to more readable format
  const formatDate = (dateString) => {
    // Check if dateString is null, undefined, or an empty string
    if (!dateString) {
      return "Not available";
    }

    try {
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC", // Optional: specify UTC to avoid timezone issues
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  // Handle edit mode toggle
  const toggleEditMode = (field) => {
    setEditMode({
      ...editMode,
      [field]: !editMode[field],
    });

    // Reset form input when canceling edit
    if (editMode[field]) {
      setFormInputs({
        ...formInputs,
        [field]: field === "password" ? "" : userData.admin[field],
      });
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs({
      ...formInputs,
      [name]: value,
    });
  };

  // Handle save changes
  const handleSave = async (field) => {
    try {
      const token = localStorage.getItem("adminToken");

      // Prepare update payload
      const updatePayload = { [field]: formInputs[field] };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/update-profile`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update local state
        setUserData({
          ...userData,
          [field]: formInputs[field],
        });

        toggleEditMode(field);
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      // Optionally show error to user
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#171717] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-primary)]  py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-blue-100 mt-2">
            Manage your account information and settings
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#171717] max-w-4xl mx-auto my-8 px-4">
        <div className="bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200 flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl">
              {userData?.admin?.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {userData?.admin?.name}
              </h2>
              {/* <div className="flex items-center text-gray-500 mt-1">
                <FiShield className="mr-1" />
                <span className="mx-2">•</span>
                <span
                  className={`inline-flex items-center text-sm ${
                    userData?.admin?.isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {userData?.admin?.isActive ? (
                    <FiCheckCircle className="mr-1" />
                  ) : (
                    <FiXCircle className="mr-1" />
                  )}
                  {userData?.admin?.isActive ? "Active" : "Inactive"}
                </span>
              </div> */}
            </div>
          </div>

          {/* User Details */}
          <div className="p-6 ">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Account Information
            </h3>

            <div className="space-y-4">
              {/* User ID */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <div className="flex items-center text-gray-700">
                    <FiUser className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        User ID
                      </p>
                      {!editMode.userId ? (
                        <p className="font-medium">{userData.admin?.userId}</p>
                      ) : (
                        <input
                          name="userId"
                          value={formInputs.userId}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    {!editMode.userId ? (
                      <button
                        onClick={() => toggleEditMode("userId")}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave("userId")}
                          className="text-green-600 hover:text-green-800 flex items-center"
                        >
                          <FiSave className="mr-1" /> Save
                        </button>
                        <button
                          onClick={() => toggleEditMode("userId")}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <FiXOctagon className="mr-1" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <div className="flex items-center text-gray-700">
                    <FiUser className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      {!editMode.name ? (
                        <p className="font-medium">{userData?.admin?.name}</p>
                      ) : (
                        <input
                          name="name"
                          value={formInputs.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    {!editMode.name ? (
                      <button
                        onClick={() => toggleEditMode("name")}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave("name")}
                          className="text-green-600 hover:text-green-800 flex items-center"
                        >
                          <FiSave className="mr-1" /> Save
                        </button>
                        <button
                          onClick={() => toggleEditMode("name")}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <FiXOctagon className="mr-1" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <div className="flex items-center text-gray-700">
                    <FiMail className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      {!editMode.email ? (
                        <p className="font-medium">{userData?.admin?.email}</p>
                      ) : (
                        <input
                          name="email"
                          value={formInputs.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    {!editMode.email ? (
                      <button
                        onClick={() => toggleEditMode("email")}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave("email")}
                          className="text-green-600 hover:text-green-800 flex items-center"
                        >
                          <FiSave className="mr-1" /> Save
                        </button>
                        <button
                          onClick={() => toggleEditMode("email")}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <FiXOctagon className="mr-1" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <div className="flex items-center text-gray-700">
                    <FiKey className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Password
                      </p>
                      {!editMode.password ? (
                        <p className="font-medium">••••••••</p>
                      ) : (
                        <input
                          type="password"
                          name="password"
                          value={formInputs.password}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter new password"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    {!editMode.password ? (
                      <button
                        onClick={() => toggleEditMode("password")}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiEdit className="mr-1" /> Change
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave("password")}
                          className="text-green-600 hover:text-green-800 flex items-center"
                        >
                          <FiSave className="mr-1" /> Save
                        </button>
                        <button
                          onClick={() => toggleEditMode("password")}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <FiXOctagon className="mr-1" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Coins */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-700">
                  <FiDollarSign className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Coins Balance
                    </p>
                    <p className="font-medium text-green-600">
                      {userData.admin?.coins.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Login */}
              {/* <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-700">
                  <FiClock className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Last Login
                    </p>
                    <p className="font-medium">
                      {formatDate(userData.admin?.lastLogin)}
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Created At */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-700">
                  <FiCalendar className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Account Created
                    </p>
                    <p className="font-medium">
                      {formatDate(userData.admin?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          {/* <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Permissions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {userData?.admin?.permissions.map((permission, index) => (
                <div
                  key={index}
                  className="bg-blue-50 rounded-lg px-3 py-2 flex items-center"
                >
                  <FiCheckCircle className="text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium text-sm">
                    {permission}
                  </span>
                </div>
              ))}
            </div>
          </div> */}

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-[#1e1e1e] text-right">
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 mr-2">
              Deactivate Account
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150">
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
