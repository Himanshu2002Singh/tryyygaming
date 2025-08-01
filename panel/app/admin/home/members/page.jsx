"use client";
import React, { useState, useEffect } from "react";
import { FiSearch, FiX, FiEdit, FiTrash2 } from "react-icons/fi";
import { useContext } from "react";
import axios from "axios";
import API_URL from "@/config";
import { useRouter } from "next/navigation";
import { usePermission } from "../../hooks/usepermission";
import { AdminAuthContext } from "../../context/adminAuthcontext";

const Members = () => {
  const router = useRouter();
  const { user } = useContext(AdminAuthContext);
  const { hasPermission } = usePermission();
  const [showSideForm, setShowSideForm] = useState(false);
  const [ranges, setRanges] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    employeeName: "",
    userId: "",
    password: "",
    confirmPassword: "",
    email: "",
    roleId: "4",
    coins: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("admintoken");
        if (!token) {
          router.push("/admin/auth");
          return;
        }

        const [adminsResponse, rolesResponse] = await Promise.all([
          axios.get(`${API_URL}/admin/admins`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_URL}/admin/roles`, {
            headers: { authorization: `Bearer ${token}` },
          }),
        ]);

        setRanges(adminsResponse.data.admins);
        const filteredRoles = rolesResponse.data.roles.filter(
          (role) => role.name !== "super_admin" && role.name !== "admin"
        );

        setAvailableRoles(filteredRoles);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddRange = () => {
    if (hasPermission("manage_admins")) {
      setShowSideForm(true);
      setEditingMember(null);
      resetForm();
    }
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowSideForm(true);
    setFormData({
      employeeName: member.name,
      userId: member.userId,
      password: "",
      confirmPassword: "",
      email: member.email,
      roleId: member.roleId,
      coins: member.coins,
    });
    setSelectedPermissions(member.permissions || []);
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
      roleId: "4",
      coins: "",
    });
    setSelectedPermissions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("admintoken");
      const data = {
        name: formData.employeeName,
        userId: formData.userId,
        email: formData.email,
        roleId: formData.roleId,
        coins: formData.coins,
        permissions: selectedPermissions,
      };

      // Only include password if it's being changed
      if (formData.password) {
        data.password = formData.password;
      }

      if (editingMember) {
        // Update existing member
        await axios.put(`${API_URL}/admin/admins/${editingMember.id}`, data, {
          headers: { authorization: `Bearer ${token}` },
        });
        alert("Member updated successfully!");
      } else {
        // Create new member
        if (!formData.password) {
          alert("Password is required for new members!");
          return;
        }
        await axios.post(`${API_URL}/admin/admin/create`, data, {
          headers: { authorization: `Bearer ${token}` },
        });
        alert("Member created successfully!");
      }

      // Refresh member list
      const adminsResponse = await axios.get(`${API_URL}/admin/admins`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setRanges(adminsResponse.data.admins);
      handleCloseForm();
    } catch (error) {
      console.error("Error saving member:", error);
      alert(error.response?.data?.message || "Failed to save member");
    }
  };

  const handleDeleteMember = async (id) => {
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        const token = localStorage.getItem("admintoken");
        await axios.delete(`${API_URL}/admin/admins/${id}`, {
          headers: { authorization: `Bearer ${token}` },
        });

        // Refresh member list
        const adminsResponse = await axios.get(`${API_URL}/admin/admins`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setRanges(adminsResponse.data.admins);
        alert("Member deleted successfully!");
      } catch (error) {
        console.error("Error deleting member:", error);
        alert("Failed to delete member");
      }
    }
  };

  const toggleMemberStatus = async (member) => {
    try {
      const token = localStorage.getItem("admintoken");
      await axios.put(
        `${API_URL}/admin/admins/${member.id}`,
        { isActive: !member.isActive },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      // Refresh member list
      const adminsResponse = await axios.get(`${API_URL}/admin/admins`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setRanges(adminsResponse.data.admins);
    } catch (error) {
      console.error("Error toggling member status:", error);
      alert("Failed to update member status");
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

  if (loading) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen ">
      <div className={`w-full flex-1 p-6 transition-all duration-300`}>
        <div className="rounded-lg  ">
          <div className="p-0 sm:p-6">
            <h1 className="text-xl font-semibold text-black mb-6">
              Members List
            </h1>

            <div className="flex flex-col gap-y-2.5 sm:gap-y-2.5 sm:flex-row justify-between mb-6">
              <div className="relative sm:w-64">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 text-black border rounded-md sm:pr-10"
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
                  Add Members
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                <thead className="bg-[var(--color-primary)] text-black">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                      S.No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                      UserName
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                      Coins
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                      Status
                    </th>
                    {hasPermission("manage_admins") && (
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRanges.length > 0 ? (
                    filteredRanges.map((admin, index) => (
                      <tr
                        key={admin.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-[#E7E7E7]"
                        }  text-black`}
                      >
                        <td className="px-4 sm:py-3 whitespace-nowrap border">
                          {index + 1}
                        </td>
                        <td className="px-4 sm:py-3 whitespace-nowrap border">
                          {admin.userId}
                        </td>
                        <td className="px-4 sm:py-3 whitespace-nowrap border">
                          {admin.coins}
                        </td>
                        <td className="px-4 sm:py-3 whitespace-nowrap border">
                          <button
                            onClick={() => toggleMemberStatus(admin)}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                              admin.isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            <span
                              className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                                admin.isActive
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                        {hasPermission("manage_admins") && (
                          <td className="px-4 sm:py-3 whitespace-nowrap border">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditMember(admin)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Edit"
                              >
                                <FiEdit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(admin.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={hasPermission("manage_admins") ? "5" : "4"}
                        className="px-4 sm:py-3 whitespace-nowrap border"
                      >
                        {" "}
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

      {showSideForm && hasPermission("Create Employee") && (
        <div className="fixed right-0 top-0 sm:w-96 h-full bg-white shadow-lg border-l border-gray-200 z-10 p-6 overflow-y-auto">
          <div className="flex sm:mt-16 justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              {editingMember ? "Edit Member" : "Add New Member"}
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
              <label className="block text-black mb-2">Employee Name</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                placeholder="Enter Employee Name"
                className="w-full text-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">UserName</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                placeholder="Enter UserName"
                className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
                disabled={!!editingMember}
              />
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email"
                className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">
                {editingMember
                  ? "New Password (leave blank to keep current)"
                  : "Password"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter Password"
                className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required={!editingMember}
              />
            </div>

            {formData.password && (
              <div className="mb-4">
                <label className="block text-black mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required={!!formData.password}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-black mb-2">Coins</label>
              <input
                type="number"
                name="coins"
                value={formData.coins}
                onChange={handleInputChange}
                placeholder="Enter Coins"
                className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">Permissions</label>
              {Object.values(user?.permissions || []).map((permission) => (
                <div key={permission} className="flex items-center mb-3">
                  <label className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      id={permission}
                      className="opacity-0 w-0 h-0 peer"
                      checked={selectedPermissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([
                            ...selectedPermissions,
                            permission,
                          ]);
                        } else {
                          setSelectedPermissions(
                            selectedPermissions.filter((p) => p !== permission)
                          );
                        }
                      }}
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-red-500 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></span>
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-6"></span>
                  </label>
                  <label htmlFor={permission} className="ml-3 text-black">
                    {permission}
                  </label>
                </div>
              ))}
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
                {editingMember ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showSideForm && (
        <div
          className="fixed inset-0 backdrop-blur-[3px] z-0"
          onClick={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Members;
