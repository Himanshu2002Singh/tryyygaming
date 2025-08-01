import React, { useContext, useState } from "react";
import axios from "axios";
import API_URL from "@/config";
import { AuthContext } from "../../context/authprovider";
import PhoneInput from "react-phone-input-2";
import { useBottomSheet } from "../../context/BottomSheet";
import VerifyNumber from "./verifynumber";
const AlternateNumber = () => {
  const { user, setUser } = useContext(AuthContext);
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const [phoneNumber, setPhoneNumber] = useState("");
  const updateProfile = async () => {
    const token = localStorage.getItem("token");
    const updatedData = {
      alternateNumber: phoneNumber,
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
          alternateNumber: phoneNumber,
        });
        await closeBottomSheet();
        await openBottomSheet(VerifyNumber);
        // alert("Profile updated successfully");
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
          <h2 className="text-sm font-semibold">Alternate Number</h2>
        </div>
        <div className="px-4">
          <p className=" mt-4 text-xs mb-2 text-gray-400">Mobile Number</p>
          <div className="relative">
            <div className="text-white absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-xs">+91</span>
            </div>
            <div className="relative w-full max-w-md">
              <PhoneInput
                country={"in"}
                value={phoneNumber}
                onChange={(value) => {
                  console.log("Phone number:", value);
                  setPhoneNumber(value);
                }}
                inputProps={{
                  name: "phoneNumber",
                  required: true,
                  autoComplete: "off",
                  className:
                    "block bg-[#111111]  w-full py-3 border text-white border-gray-300 rounded-lg focus:outline-none",
                }}
                disableFormatting={true}
                containerClass="flex items-center rounded-lg bg-transparent"
                buttonClass="border-r rounded-lg bg-transparent"
                dropdownClass="absolute bg-[#111111] text-black dropup" // Added dropup class
                enableSearch={true}
                countryCodeEditable={false}
                inputStyle={{
                  paddingLeft: "45px",
                  width: "100%",
                  height: "48px",
                  borderLeft: "none",
                }}
                // Add this prop to make dropdown appear above
                dropdownStyle={{ bottom: "100%", top: "auto" }}
              />
            </div>
          </div>
          <button
            onClick={updateProfile}
            className="w-full mt-3 py-2 text-xs rounded-lg text-black  hover:cursor-pointer bg-[var(--color-primary)] text-center"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlternateNumber;
