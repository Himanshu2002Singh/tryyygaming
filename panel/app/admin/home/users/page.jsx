"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_URL from "@/config";
import { FaInfo } from "react-icons/fa";
import PointsModal from "../../components/pointsmodal";
import UserInfoModal from "../../components/userinfomodal";
import { useBottomSheet } from "../../context/BottomSheetAdmin";
import ReactPaginate from "react-paginate";
import PurchasesUserModal from "../../components/userpaneldetails";
import AccountStatementUser from "../../components/payment/accountstatementuser";

// Add this component to your AdminUsersPage file
function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    // email: "",
    username: "",
    phone: "",
    password: "",
    // alternateNumber: "",
    points: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admintoken");
      const response = await axios.post(
        `${API_URL}/admin/manageuser/createuser`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("User created successfully");
        onUserAdded();
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create user";
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
        Add New User
      </div>

      <form onSubmit={handleSubmit} className="p-4 ">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black-300">
            Name*
          </label>
          <input
            type="text"
            name="name"
            className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black-300">
            User Name*
          </label>
          <input
            type="text"
            name="username"
            className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={formData.email}
            onChange={handleChange}
          />
        </div> */}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black-300">
            Phone*
          </label>
          <input
            type="text"
            name="phone"
            className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black-300">
            Password*
          </label>
          <input
            type="password"
            name="password"
            className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black-300">
              Alternate Number
            </label>
            <input
              type="text"
              name="alternateNumber"
              className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={formData.alternateNumber}
              onChange={handleChange}
            />
          </div> */}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black-300">
            Points
          </label>
          <input
            type="number"
            name="points"
            className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={formData.points}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              className="form-checkbox h-5 w-5 text-cyan-500 rounded focus:ring-cyan-400 border-gray-600 bg-gray-700"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span className="ml-2 text-black-300">Active</span>
          </label>
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
            className="px-4 py-2 bg-[var(--color-primary)]  text-black rounded transition-colors flex items-center"
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
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Modifications to the main AdminUsersPage component
// Replace your existing AdminUsersPage with this updated version

export default function AdminUsersPage() {
  const [modalOpenpoints, setModalOpenpoints] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { openBottomSheet } = useBottomSheet();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(25); // Number of users per page
  const [totalPages, setTotalPages] = useState(1); // Initialize totalPages to 1
  const [totalCount, setTotalCount] = useState(0);
  const [showPurchasesModal, setShowPurchasesModal] = useState(false);
  const [selectedUserPurchases, setSelectedUserPurchases] = useState(null); // New state for storing selected user's purchases

  const [userInfoModalOpen, setUserInfoModalOpen] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const handleShowPurchases = (user) => {
    setSelectedUserPurchases(user.panelPurchases);
    setShowPurchasesModal(true);
    openBottomSheet(({ onClose }) => (
      <PurchasesUserModal
        user={user}
        onClose={onClose}
        onPurchaseDelete={fetchUsers}
        selectedUserPurchases={selectedUserPurchases} // Pass selected user purchases`
      /> // Pass user data
    ));
  };

  const [purchaseSearchTerm, setPurchaseSearchTerm] = useState("");
  const filteredPurchases = selectedUserPurchases
    ? selectedUserPurchases.filter((purchase) =>
        Object.values(purchase).some(
          (value) =>
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(purchaseSearchTerm.toLowerCase())
        )
      )
    : [];

  const handleShowUserInfo = (user) => {
    setCurrentUserInfo(user);
    // setUserInfoModalOpen(true);

    openBottomSheet(
      (
        { onClose } // Use parentheses for implicit return
      ) => (
        <UserInfoModal
          user={user}
          onClose={() => {
            setUserInfoModalOpen(false);
            onClose(); // Important: also call onClose provided by the bottom sheet
          }}
        />
      )
    ); // Closing parenthesis for openBottomSheet
  };
  useEffect(() => {
    // Add a debounce to avoid making too many requests
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300); // Adjust debounce time as needed

    return () => clearTimeout(debounceTimer); // Cleanup on unmount or search term change
  }, [searchTerm, currentPage]);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    points: "",
    isActive: true,
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, usersPerPage]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("admintoken");
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/manageuser`, {
        params: {
          // Use params for query parameters
          page: currentPage,
          limit: usersPerPage,
          search: searchTerm,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages); // Update totalPages
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1); // Set the new current page
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      points: user.points || 0,
      isActive: user.isActive,
      password: "",
      confirmPassword: "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editForm.password !== editForm.confirmPassword) {
        // Handle password mismatch, e.g., show an error message
        toast.error("Passwords do not match"); // Or any other error handling
        return; // Prevent form submission
      }
      const token = localStorage.getItem("admintoken");

      await axios.put(
        `${API_URL}/admin/manageuser/${selectedUser.id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("User updated successfully");
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const token = localStorage.getItem("admintoken");

      try {
        await axios.delete(`${API_URL}/admin/manageuser/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user");
        console.error(error);
      }
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const token = localStorage.getItem("admintoken");

    try {
      await axios.patch(
        `${API_URL}/admin/manageuser/${userId}/status`,
        {
          isActive: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(
        `User ${currentStatus ? "deactivated" : "activated"} successfully`
      );
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
      console.error(error);
    }
  };
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: null,
    userId: null,
    creditpoint: 0,
    user: null,
  });
  const openModal = async (action, userId, user) => {
    setModalState({
      isOpen: true,
      action,
      userId,
      creditpoint: user.credit,
      user,
    });

    // Then open the bottom sheet with PointsModal instead of AddUserModal
    await openBottomSheet(
      // This should be the component you want to show in the bottom sheet
      ({ onClose }) => (
        <PointsModal
          isOpen={true}
          onClose={() => {
            onClose(); // Close the bottom sheet
            closeModal(); // Also reset the modal state
          }}
          user={user}
          onSubmit={(points) => {
            // Directly call the handler functions with userId and points
            switch (action) {
              case "add":
                handleAddPoints(userId, points);
                break;
              case "withdraw":
                handleWithdrawPoints(userId, points);
                break;
              case "credit":
                handleCreditPoints(userId, points);
                break;
              default:
                break;
            }
            onClose();
          }}
          action={action}
          creditpoint={user.credit || 0}
        />
      ),
      // Optional props to pass to the bottom sheet
      { fullScreen: false }
    );
  };

  // Then update the return statement to remove the direct rendering of PointsModal
  // Remove or comment out this line in your return statement:
  {
    /* <PointsModal
    isOpen={modalState.isOpen}
    onClose={closeModal}
    onSubmit={handleSubmit}
    action={modalState.action}
    creditpoint={modalState?.creditpoint}
  /> */
  }

  // Close modal function
  const closeModal = () => {
    setModalState({
      isOpen: false,
      action: null,
      userId: null,
    });
  };
  // const addPoints = async (userId, points) => {
  //   const amount = window.prompt("Enter points to add:", "0");
  //   if (amount === null) return;
  //   const token = localStorage.getItem("admintoken");

  //   const pointsToAdd = parseInt(amount);
  //   if (isNaN(pointsToAdd)) {
  //     toast.error("Please enter a valid number");
  //     return;
  //   }

  //   try {
  //     await axios.post(
  //       `${API_URL}/admin/manageuser/${userId}/points`,
  //       {
  //         points: pointsToAdd,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     toast.success(`Added ${pointsToAdd} points to user`);
  //     fetchUsers();
  //   } catch (error) {
  //     toast.error("Failed to add points");
  //     console.error(error);
  //   }
  // };
  const handleAddPoints = async (userId, pointsToAdd) => {
    const token = localStorage.getItem("admintoken");
    // const userId = modalState.userId;

    try {
      await axios.post(
        `${API_URL}/admin/manageuser/${userId}/points`,
        { points: pointsToAdd },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Added ${pointsToAdd} points to user`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      toast.error("Failed to add points");
      console.error(error);
    }
  };
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.toString().includes(searchTerm))
  );

  const startIndex = (currentPage - 1) * usersPerPage; // Calculate start   return (

  // Withdraw points function
  const handleWithdrawPoints = async (userId, pointsToWithdraw) => {
    const token = localStorage.getItem("admintoken");
    // const userId = modalState.userId;

    try {
      await axios.post(
        `${API_URL}/admin/manageuser/${userId}/withdraw`,
        { points: pointsToWithdraw },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Withdrew ${pointsToWithdraw} points from user`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      toast.error("Failed to withdraw points");
      console.error(error);
    }
  };

  // Credit points function
  const handleCreditPoints = async (userId, pointsToCredit) => {
    const token = localStorage.getItem("admintoken");
    // const userId = modalState.userId;

    try {
      await axios.post(
        `${API_URL}/admin/manageuser/${userId}/credit`,
        { points: pointsToCredit },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Credited ${pointsToCredit} points to user`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      toast.error("Failed to credit points");
      console.error(error);
    }
  };
  const handleSubmit = (points) => {
    switch (modalState.action) {
      case "add":
        handleAddPoints(points);
        break;
      case "withdraw":
        handleWithdrawPoints(points);
        break;
      case "credit":
        handleCreditPoints(points);
        break;
      default:
        break;
    }
  };
  return (
    <div className="p-6 min-h-screen bg-[#D9D9D9] text-black-700">
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="sm:text-lg text-xs font-bold text-black  border-b border-gray-700 pb-4">
          User Management
        </h1>
        <button
          onClick={() => {
            openBottomSheet(
              ({ onClose }) => (
                <AddUserModal
                  isOpen={true}
                  onClose={onClose}
                  onUserAdded={() => {
                    fetchUsers();
                    onClose();
                  }}
                />
              ),
              { fullScreen: false }
            );
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
          Add User
        </button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="p-3 pl-10 border rounded w-full md:w-1/3 bg-white border-black text-black-400 focus:outline-none focus:ring-2 focus:ring-black  focus:border-transparent shadow-2xl"
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
                {/* <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  User Id
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  User Name
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Name
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Credit
                </th>
                {/* <th className="sm:py-3 px-4 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-600">
                  Phone
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Balance
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Exposure
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Banking
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Panels
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Last Login
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user, count) => (
                <tr
                  key={user.id}
                  className={`text-sm hover:bg-[#dbd7d2] transition-colors text-black ${
                    (startIndex + count) % 2 === 0
                      ? "bg-[#dbd7d2]"
                      : "bg-[#f5f5f5]"
                  }`}
                >
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {startIndex + count + 1}
                  </td>
                  {/* <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {user.id || "N/A"}
                  </td> */}
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {user.username || "N/A"}
                  </td>
                  {/* <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {user.name || "N/A"}
                  </td> */}

                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {user.credit || 0}
                  </td>
                  {/* <td className="py-3 px-4 whitespace-nowrap">
                    {user.email || "N/A"}
                  </td> */}
                  {/* <td className="py-3 px-4 whitespace-nowrap">
                    {user.phone || "N/A"}
                  </td> */}
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    <span className="font-bold font-semibold text-[#009900]">
                      {user.points}
                    </span>
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    <span className="font-bold font-semibold text-[#ff8c00]">
                      {user.expense}
                    </span>
                  </td>
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    <button
                      // onClick={() => openBottomSheet((<openModal user />)}
                      onClick={() => openModal("add", user.id, user)}
                      // onClick={() => addPoints(user.id, user.points)}
                      className=" px-3 py-1 mx-2 rounded-full bg-[#009900] text-white"
                    >
                      D
                    </button>
                    <button
                      onClick={() => openModal("withdraw", user.id, user)}
                      className=" px-3 py-1 mx-2 rounded-full bg-[#ce2029] text-white"
                    >
                      W
                    </button>
                    <button
                      onClick={() => openModal("credit", user.id, user)}
                      className=" px-3 py-1 mx-2 rounded-full bg-[#ffef00] text-black"
                    >
                      C
                    </button>
                    <button
                      onClick={() =>
                        openBottomSheet(() => (
                          <AccountStatementUser user={user} />
                        ))
                      }
                      className=" px-3 py-1 mx-2 rounded-full bg-blue-500 text-white"
                    >
                      A
                    </button>
                  </td>
                  {/* <td className="px-4 sm:py-3 whitespace-nowrap border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-900 text-green-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td> */}
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    <div className="flex items-center justify-between">
                      <span>{user.panelPurchases.length}</span>
                      <button
                        onClick={() => handleShowPurchases(user)}
                        className="text-black hover:underline text-left"
                      >
                        View
                      </button>
                    </div>
                  </td>
                  {/* <td className="px-4 sm:py-3 whitespace-nowrap border">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "Never"}
                  </td> */}
                  <td className="px-4 sm:py-3 whitespace-nowrap border">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-black  hover:bg-gray-950 text-white px-3 py-2 rounded-full text-xs transition-colors flex items-center"
                      >
                        P
                        {/* <svg
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
                        </svg> */}
                        {/* Edit */}
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`${
                          user.isActive
                            ? "bg-[#009900] hover:bg-[#ffef00]"
                            : "bg-[#ce2029] hover:bg-green-700"
                        } text-white px-3 py-1 rounded text-xs transition-colors flex items-center`}
                      >
                        {user.isActive ? (
                          <>
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
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                          </>
                        ) : (
                          <>
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                      {/* <button
                        onClick={() => addPoints(user.id, user.points)}
                        className="bg-black  hover:bg-gray-950 text-white px-3 py-2 rounded-full text-xs transition-colors flex items-center"
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button> */}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-[#ce2029] hover:bg-red-650 text-white px-3 py-2 rounded-full text-xs transition-colors flex items-center"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        {/* Delete */}
                      </button>
                      <button
                        onClick={() => handleShowUserInfo(user)}
                        // onClick={() => handleShowUserInfo(user)}
                        // onClick={() => handleDelete(user.id)}
                        className="bg-black  hover:bg-gray-950 text-white px-3 py-2 rounded-full  text-xs transition-colors flex items-center"
                      >
                        <FaInfo />

                        {/* Delete */}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-black">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              forcePage={currentPage - 1} // Force the current page
              pageCount={totalPages} // Correctly set total pages
              breakLabel={"..."}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="flex gap-1"
              pageClassName="pagination-item"
              pageLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              previousClassName="pagination-item"
              previousLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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

      {/* Edit User Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-lg bg-white py-6 px-4 rounded-lg shadow-2xl relative">
            <h2 className="text-xl font-bold mb-4 text-cyan-400 pb-2 border-b border-gray-700">
              Edit User
            </h2>

            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Name
              </label>
              <input
                type="text"
                disabled
                className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Email
              </label>
              <input
                type="email"
                disabled
                className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Phone
              </label>
              <input
                type="text"
                disabled
                className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
              />
            </div> */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-black-300">
                Password
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm({ ...editForm, password: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-black-300">
                Confirm Password
              </label>
              <input
                type="password" // Changed to password type for security
                className="w-full p-2 border rounded bg-black-700 border-black-600 text-black-400focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={editForm.confirmPassword} // Added confirmPassword to editForm state
                onChange={(e) =>
                  setEditForm({ ...editForm, confirmPassword: e.target.value })
                }
              />
              {/* Conditionally render error message */}
              {editForm.password &&
                editForm.confirmPassword &&
                editForm.password !== editForm.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Points
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={editForm.points}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    points: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div> */}

            {/* <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-cyan-500 rounded focus:ring-cyan-400 border-gray-600 bg-gray-700"
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isActive: e.target.checked })
                  }
                />
                <span className="ml-2 text-gray-300">Active</span>
              </label>
            </div> */}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700 transition-colors text-black-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {/* <AddUserModal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onUserAdded={fetchUsers}
      /> */}
      {/* <PointsModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        action={modalState.action}
        creditpoint={modalState?.creditpoint}
      /> */}
      {/* <UserInfoModal
        isOpen={userInfoModalOpen}
        onClose={() => setUserInfoModalOpen(false)}
        user={currentUserInfo}
      /> */}
    </div>
  );
}
