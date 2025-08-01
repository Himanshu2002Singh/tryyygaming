"use client";
import React, { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useContext } from "react";
import axios from "axios";
import API_URL from "@/config";
import { useRouter } from "next/navigation";
import { usePermission } from "../../hooks/usepermission";
import { AdminAuthContext } from "../../context/adminAuthcontext";

const PaymentEmployeeList = () => {
  const router = useRouter();
  const { user } = useContext(AdminAuthContext);
  const { hasPermission } = usePermission();
  const [showSideForm, setShowSideForm] = useState(false);
  const [ranges, setRanges] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employeeName: "",
    userId: "",
    password: "",
    confirmPassword: "",
    email: "",
    roleId: "",
    coins: "",
  });

  // Fetch employees and roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("admintoken");
        if (!token) {
          router.push("/admin/auth");
          return;
        }

        // Only fetch if user has permission
        if (hasPermission("view_admins")) {
          const [adminsResponse, rolesResponse] = await Promise.all([
            axios.get(`${API_URL}/admin/admins`, {
              headers: { authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/admin/roles`, {
              headers: { authorization: `Bearer ${token}` },
            }),
          ]);

          setRanges(adminsResponse.data.admins);
          setAvailableRoles(rolesResponse.data.roles);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddRange = () => {
    // Only allow if user has permission
    if (hasPermission("manage_admins")) {
      setShowSideForm(true);
    }
  };

  const handleCloseForm = () => {
    setShowSideForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      employeeName: "",
      userId: "",
      password: "",
      confirmPassword: "",
      email: "",
      roleId: "",
      coins: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("admintoken");

      // Create new admin
      const response = await axios.post(
        `${API_URL}/admin/admin/create`,
        {
          name: formData.employeeName,
          userId: formData.userId,
          password: formData.password,
          email: formData.email,
          roleId: formData.roleId,
          coins: formData.coins,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        // Refresh admin list
        const adminsResponse = await axios.get(`${API_URL}/admin/admins`, {
          headers: { authorization: `Bearer ${token}` },
        });

        setRanges(adminsResponse.data.admins);
        handleCloseForm();
        alert("Admin created successfully!");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      alert("Failed to create admin. Please try again.");
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
      range.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      range.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (range.Role?.name &&
        range.Role.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // If user doesn't have permission, redirect or show message
  if (!hasPermission("view_admins")) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-xl font-semibold mb-4">Access Denied</h1>
          <p>You don't have permission to view this page.</p>
          <button
            onClick={() => router.push("/admin/main-screen")}
            className="mt-4 bg-[var(--color-primary)] text-black px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black">
      {/* Main content area */}
      <div
        className={`w-full flex-1 p-6 transition-all duration-300 ${
          showSideForm ? "" : ""
        }`}
      >
        <div className="rounded-lg shadow">
          <div className="p-0 sm:p-6">
            <h1 className="text-xl font-semibold text-white mb-6">
              Employees List
            </h1>

            {/* Search and Add bar */}
            <div className="flex flex-col gap-y-2.5 sm:gap-y-2.5 sm:flex-row justify-between mb-6">
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

              {hasPermission("manage_admins") && (
                <button
                  onClick={handleAddRange}
                  className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-md transition"
                >
                  Add Employee
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[var(--color-secondary)]">
                <thead className="bg-[var(--color-primary)] text-black">
                  <tr>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      S.No
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      Name
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      UserName
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      Email
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      Role
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      Coins
                    </th>
                    <th className="sm:py-3 px-6 text-left text-sm font-medium">
                      Status
                    </th>
                    {hasPermission("manage_admins") && (
                      <th className="sm:py-3 px-6 text-left text-sm font-medium">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRanges.length > 0 ? (
                    filteredRanges.map((admin, index) => (
                      <tr key={admin.id} className="">
                        <td className="py-4 px-6 text-sm text-white">
                          {index + 1}
                        </td>
                        <td className="py-4 px-6 text-sm text-white">
                          {admin.name}
                        </td>
                        <td className="py-4 px-6 text-sm text-white">
                          {admin.userId}
                        </td>
                        <td className="py-4 px-6 text-sm text-white">
                          {admin.email}
                        </td>
                        <td className="py-4 px-6 text-sm text-white">
                          {admin.Role?.name}
                        </td>
                        <td className="py-4 px-6 text-sm text-white">
                          {admin.coins}
                        </td>

                        <td className="py-4 px-6 text-sm">
                          <span
                            className={`px-2 py-1 ${
                              admin.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            } rounded-full text-xs`}
                          >
                            {admin.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        {hasPermission("manage_admins") && (
                          <td className="py-4 px-6 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                            Edit
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={hasPermission("manage_admins") ? "7" : "6"}
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

      {/* Side form - only shown if user has manage_admins permission */}
      {showSideForm && hasPermission("manage_admins") && (
        <div className="fixed right-0 top-0 sm:w-96 h-full bg-black shadow-lg border-l border-gray-200 z-10 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              Add New Employee
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
              <label className="block text-white mb-2">Employee Name</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                placeholder="Enter Employee Name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">UserName</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                placeholder="Enter UserName"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Coins</label>
              <input
                type="number"
                name="coins"
                value={formData.coins}
                onChange={handleInputChange}
                placeholder="Enter Coins"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Role</label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              >
                <option value="">Select Role</option>
                {availableRoles.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                    className="bg-black text-white"
                  >
                    {role.name}
                  </option>
                ))}
              </select>
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

export default PaymentEmployeeList;
