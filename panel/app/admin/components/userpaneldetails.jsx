import { useState } from "react";
import axios from "axios";
import API_URL from "@/config";
import { toast } from "react-hot-toast";

const PurchasesUserModal = ({
  user,
  onClose,
  onPurchaseDelete,
  onPurchaseUpdate,
}) => {
  const [purchaseSearchTerm, setPurchaseSearchTerm] = useState("");
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const handleDeletePurchase = async (purchaseId) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      try {
        const token = localStorage.getItem("admintoken");
        let resp = await axios.delete(
          `${API_URL}/userpanel/panel-purchases/${purchaseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (resp.status === 200) {
          onClose();
          onPurchaseDelete(purchaseId);

          toast.success("Panel purchase deleted successfully!");
        }
      } catch (error) {
        toast.error("Failed to delete panel purchase.");
        console.error("Error deleting purchase:", error);
      }
    }
  };

  const handleEditStart = (purchase) => {
    setEditingPurchase(purchase.id);
    setEditFormData({ ...purchase, password: "" });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (purchaseId) => {
    try {
      const token = localStorage.getItem("admintoken");
      const dataToUpdate = { ...editFormData };
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }

      const response = await axios.put(
        `${API_URL}/userpanel/panel-purchases/${purchaseId}/details`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Panel purchase updated successfully!");
        onPurchaseUpdate(response.data.data);
        setEditingPurchase(null);
        setEditFormData(null);
        onClose();
      } else {
        toast.error("Failed to update panel purchase.");
      }
    } catch (error) {
      toast.error("Failed to update panel purchase.");
      console.error("Error updating purchase:", error);
    }
  };

  const handleEditCancel = () => {
    setEditingPurchase(null);
    setEditFormData(null);
  };

  // Handle status toggle function
  const handleStatusToggle = async (purchase) => {
    try {
      setStatusUpdating(purchase.id);
      const token = localStorage.getItem("admintoken");

      // Toggle between "active" and "deleted" states
      const newStatus =
        purchase.deletionstatus === "deleted" ? "active" : "deleted";

      const response = await axios.put(
        `${API_URL}/userpanel/panel-purchases/${purchase.id}/details`,
        { deletestatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the purchase in the parent component
        const updatedPurchase = { ...purchase, deletionstatus: newStatus };
        onPurchaseUpdate(updatedPurchase);
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update purchase status");
      console.error("Error updating status:", error);
    } finally {
      setStatusUpdating(null);
    }
  };

  const filteredPurchases = user.panelPurchases.filter((purchase) =>
    Object.values(purchase).some(
      (value) =>
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(purchaseSearchTerm.toLowerCase())
    )
  );

  return (
    <div className="w-full pb-3 overflow-hidden bg-[#D9D9D9] text-black rounded-lg shadow-2xl">
      <div className="bg-black w-full rounded-t-lg text-white text-center p-3 text-sm">
        Panel Purchases for {user?.username}
      </div>
      <div className="p-4 w-full">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Panels..."
            className="p-2 border rounded w-full bg-gray border-gray-600 text-black focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent"
            value={purchaseSearchTerm}
            onChange={(e) => setPurchaseSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700 mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Panel name</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Coins</th>
                {/* <th className="px-4 py-2 text-left">Rate</th> */}
                <th className="px-4 py-2 text-left">Total Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                {/* <th className="px-4 py-2 text-left">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="border px-4 py-2">
                    {purchase?.panelDetails?.name}
                  </td>
                  <td className="border px-4 py-2">{purchase.username}</td>
                  <td className="border px-4 py-2">{purchase.coins}</td>
                  {/* <td className="border px-4 py-2">{purchase.rate}</td> */}
                  <td className="border px-4 py-2">{purchase.totalAmount}</td>
                  <td className="border px-4 py-2">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleStatusToggle(purchase)}
                        disabled={statusUpdating === purchase.id}
                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                          purchase.deletionstatus !== "deleted"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            purchase.deletionstatus !== "deleted"
                              ? "translate-x-7"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="ml-2">
                        {purchase.deletionstatus === "deleted" ? (
                          <span className="text-red-400">Inactive</span>
                        ) : (
                          <span className="text-green-400">Active</span>
                        )}
                      </span>
                      {statusUpdating === purchase.id && (
                        <span className="ml-2 animate-pulse">Updating...</span>
                      )}
                    </div>
                  </td>
                  {/* <td className="border px-4 py-2">
                    {editingPurchase === purchase.id ? (
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <input
                          type="number"
                          name="coins"
                          value={editFormData.coins}
                          onChange={handleEditFormChange}
                          className="p-1 border rounded bg-gray-700 border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mr-2 mb-2 sm:mb-0"
                        />
                        <input
                          type="password"
                          name="password"
                          value={editFormData.password}
                          onChange={handleEditFormChange}
                          placeholder="New Password (optional)"
                          className="p-1 border rounded bg-gray-700 border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mr-2 mb-2 sm:mb-0"
                        />
                        <div>
                          <button
                            onClick={() => handleEditSave(purchase.id)}
                            className="text-green-500 hover:underline mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="text-gray-400 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(purchase)}
                          className="text-blue-500 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePurchase(purchase.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => {
            onClose();
            setPurchaseSearchTerm("");
          }}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PurchasesUserModal;
