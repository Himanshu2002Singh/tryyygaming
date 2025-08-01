import React, { useState } from "react";
import axios from "axios";
import API_URL from "@/config";
const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const updateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const updatedData = {
      newPassword: password,
    };

    try {
      const response = await axios.put(
        `${API_URL}/update-password`,
        updatedData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Profile updated successfully");
      }
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };
  return (
    <div className="w-full flex pb-4 items-center justify-center bg-[#393939]">
      <div className="w-full  text-white">
        <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
          <h2 className="text-sm font-semibold">Change Password</h2>
        </div>
        <form onSubmit={updateProfile}>
          <div className="px-4">
            <p className=" mt-4 text-xs mb-2 text-gray-400">Change Password</p>
            <div className="relative">
              <input
                type="text"
                id="password"
                className=" block bg-[#111111] text-xs w-full pl-2 pr-3 py-3  text-white  rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="w-full mt-3 py-2 text-xs rounded-lg text-black  hover:cursor-pointer bg-[var(--color-primary)] text-center">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
