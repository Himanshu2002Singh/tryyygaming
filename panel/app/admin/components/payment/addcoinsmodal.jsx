import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_URL from "@/config";
import { AdminAuthContext } from "../../context/adminAuthcontext";

const AddCoinsModal = ({ isOpen, onClose, adminId, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(AdminAuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user", user);
    const isSuperAdmin = user?.Role?.name === "super_admin";
    // console.log("user", user, user?.Role?.name);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const endpoint = isSuperAdmin
      ? `${API_URL}/admin/coin-request/super_admin`
      : `${API_URL}/admin/coin-request`;

    try {
      setIsLoading(true);
      const response = await axios.post(
        endpoint,
        {
          amount: parseInt(amount),
          reason,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("admintoken")}`,
          },
        }
      );
      if (response.status === 200) {
        setUser((prevUser) => ({
          ...prevUser,
          coins: response.data?.admin?.newBalance,
        }));
      }
      toast.success("Coin request submitted successfully");
      setAmount("");
      setReason("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting coin request:", error);
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full pb-3 overflow-hidden bg-[#393939]">
      <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
        Request Coins
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="reason"
          >
            Reason (Optional)
          </label>
          <textarea
            id="reason"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why do you need these coins?"
            rows="3"
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            className="bg-gray-300 text-sm text-black font-bold py-2 px-4 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-emerald-500 text-sm hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoinsModal;
