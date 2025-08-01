import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import API_URL from "@/config";
import { AuthContext } from "../../context/authprovider";

const VerifyNumber = ({ onClose }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    console.log("User in VerifyNumber:", user);
    if (user && user.alternateNumber) {
      requestNewOtp();
    }
  }, []);
  const verifyOtp = async () => {
    if (!otp || otp.length !== 5) {
      setError("Please enter a valid 5-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/auth/verify_alternate_number_otp`,
        { alternateNumber: `${user.alternateNumber}`, otp },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update user in context if response contains updated user data

        setUser({
          ...user,
          alternateNumberverified: true,
        });

        alert("Alternate number verified successfully");
        if (onClose) onClose(); // Close the bottom sheet if applicable
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to verify code");
      console.error("Error verifying code:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to request a new OTP
  const requestNewOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/auth/send_alternate_number`,
        { phoneNumber: `${user.alternateNumber}` }, // No need to send phone number, backend will use the one from user's profile
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Verification code sent successfully");
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "Failed to send verification code"
      );
      console.error("Error sending verification code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex pb-4 items-center justify-center bg-[#393939]">
      <div className="w-full text-white">
        <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
          <h2 className="text-sm font-semibold">Verify Alternate Number</h2>
        </div>
        <div className="px-4">
          {user && user.alternateNumber ? (
            <>
              <p className="mt-4 text-xs mb-2 text-gray-400">
                Verifying number:{" "}
                <span className="text-white">{user.alternateNumber}</span>
              </p>
              <p className="mt-4 text-xs mb-2 text-gray-400">
                Verification Code
              </p>
              <input
                type="text"
                className="block bg-[#111111] text-xs w-full px-3 py-3 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter 5-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={5}
                required
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full mt-3 py-2 text-xs rounded-lg text-black hover:cursor-pointer bg-[var(--color-primary)] text-center disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <button
                onClick={requestNewOtp}
                disabled={loading}
                className="w-full mt-2 py-2 text-xs rounded-lg text-white hover:cursor-pointer bg-transparent border border-white text-center"
              >
                Resend Code
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-red-500">
                No alternate number found. Please add an alternate number first.
              </p>
              <button
                onClick={onClose}
                className="mt-3 py-2 px-4 text-xs rounded-lg text-black bg-[var(--color-primary)]"
              >
                Go Back
              </button>
            </div>
          )}

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default VerifyNumber;
