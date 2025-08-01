import React, { useContext, useState } from "react";
import axios from "axios";
import API_URL from "@/config";
import { BottomSheetContext } from "../../context/BottomSheet";
const UserEmail = () => {
  const { closeBottomSheet } = useContext(BottomSheetContext);
  const { user, setUser } = useContext(AuthContext);

  const [Email, setEmail] = useState("");

  const updateProfile = async () => {
    const token = localStorage.getItem("token");
    const updatedData = {
      email: Email,
    };

    try {
      const response = await axios.put(
        `${API_URL}/profile-update`,
        updatedData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setUser({
          ...user,
          email: Email,
        });

        // alert("Profile updated successfully");
        closeBottomSheet();
      }
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  return (
    <div className="w-full flex pb-4 items-center justify-center bg-[#393939]">
      <div className="w-full rounded-lg  text-white">
        <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
          <h2 className="text-sm ">Email</h2>
        </div>
        <div className="px-4">
          <p className=" mt-4 mb-2 text-xs text-gray-400 ">Email</p>
          <div className="relative">
            <input
              id="phone"
              className=" block text-xs bg-[#111111] w-full pl-3 py-3  text-white  rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Email ID"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            onClick={updateProfile}
            className="w-full mt-3 py-2 text-xs rounded-lg text-black hover:cursor-pointer bg-[var(--color-primary)] text-center"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEmail;
