"use client";

import { useState } from "react";
import { toast } from "react-toastify";

const PointsModal = ({
  isOpen,
  onClose,
  onSubmit,
  action,
  creditpoint,
  user,
}) => {
  const [points, setPoints] = useState(creditpoint || "");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const pointsValue = parseInt(points);
    if (isNaN(pointsValue)) {
      toast.error("Please enter a valid number");
      return;
    }
    onSubmit(pointsValue);
    setPoints("");
    onClose();
  };

  const getTitle = () => {
    switch (action) {
      case "add":
        return "Add Points";
      case "withdraw":
        return "Withdraw Points";
      case "credit":
        return "Credit Points";
      default:
        return "Manage Points";
    }
  };

  const getDisplayPoints = () => {
    if (action === "add" || action === "withdraw") {
      return user.points; // Show user points for add/withdraw
    } else if (action === "credit") {
      return user.credit; // Show user credit for credit action
    }
    return 0; // Default to 0 if action is unknown
  };

  return (
    <div className="w-full pb-3 overflow-hidden bg-[#D9D9D9] text-black">
      <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
        {getTitle()}
      </div>
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label
            htmlFor="points"
            className="block text-sm font-medium text-black mb-1"
          >
            {`Enter points to ${action}:`}
          </label>
          <p className="text-black mb-2">
            Current {action === "credit" ? "Credit" : "Points"}:{" "}
            {getDisplayPoints()}
          </p>
          <input
            type="number"
            id="points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-full text-black px-3 py-2 border border-black rounded-md focus:outline-none"
            placeholder="0"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700"
          >
            {action === "add"
              ? "Add"
              : action === "withdraw"
              ? "Withdraw"
              : "Credit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PointsModal;
