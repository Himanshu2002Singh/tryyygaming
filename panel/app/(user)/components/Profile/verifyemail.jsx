import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import API_URL from "@/config";
import { AuthContext } from "../../context/authprovider";

const VerifyEmail = ({ onClose }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.email && !user.emailVerified) {
      sendEmailOtp();
    }
  }, []);

  const sendEmailOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/auth/send_email_otp`,
        { email: user.email },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Verification code sent to your email");
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "Failed to send verification code"
      );
      console.error("Error sending email verification code:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 5) {
      setError("Please enter a valid 5-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/auth/verify_email_otp`,
        { email: user.email, otp: otp },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUser({
          ...user,
          emailverified: true,
        });

        alert("Email verified successfully!");
        if (onClose) onClose();
      }
    } catch (error) {
      setError(error.response?.data?.error || "Verification failed");
      console.error("Error verifying email code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex pb-4 items-center justify-center bg-[#393939]">
      <div className="w-full text-white">
        <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
          <h2 className="text-sm font-semibold">Verify Email</h2>
        </div>
        <div className="px-4">
          {user && user.email ? (
            <>
              <p className="mt-4 text-xs mb-2 text-gray-400">
                Verifying email:{" "}
                <span className="text-white">{user.email}</span>
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
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full mt-3 py-2 text-xs rounded-lg text-black hover:cursor-pointer bg-[var(--color-primary)] text-center disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <button
                onClick={sendEmailOtp}
                disabled={loading}
                className="w-full mt-2 py-2 text-xs rounded-lg text-white bg-transparent border border-white text-center"
              >
                Resend Code
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-red-500">
                No email found. Please add your email first.
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

export default VerifyEmail;
