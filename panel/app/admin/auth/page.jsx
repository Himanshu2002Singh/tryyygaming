"use client";
import API_URL from "@/config";
import axios from "axios";
import React, { useContext, useState } from "react";
import { AdminAuthContext } from "../context/adminAuthcontext";
import { useRouter } from "next/navigation";

const AdminLoginPage = () => {
  const router = useRouter();

  const { fetchAdminDetails } = useContext(AdminAuthContext);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        userId,
        password,
      });

      console.log(response.data);
      if (response.status === 200) {
        console.log("here===>");
        localStorage.setItem("admintoken", response.data.token);

        let responseofadmin = await fetchAdminDetails();
        console.log(responseofadmin, "response");
        if (responseofadmin) {
          router.push("/admin/home/dashboard");
        } else {
          setError("Sorry something went wrong. Please try again later.");
        }
        console.log("Login successful");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          setError(
            "Invalid credentials. Please check your user ID and password."
          );
        } else {
          setError(
            `Login failed: ${
              error.response.data.message || "Please try again later."
            }`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError(
          "No response from server. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="py-8 px-6 bg-gradient-to-r from-[#555555] to-black text-center">
            <img
              src="/logo-gs.png"
              format="png"
              alt="Logo"
              className="w-44 mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-white">
              betfair Admin Panel
            </h2>
            <p className="text-blue-100 mt-2">Please sign in to continue</p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            {error && (
              <div
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                role="alert"
              >
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* User ID Field */}
              <div className="mb-6">
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  User ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="userId"
                    name="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full text-black border-gray-300 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Enter your user ID"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 text-black py-3 w-full border-gray-300 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {showPassword ? (
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M10 12a2 2 0 100-4 2 2 0 000 4z M10 3C5.522 3 1.732 5.943.458 10c1.274 4.057 5.064 7 9.542 7s8.268-2.943 9.542-7c-1.274-4.057-5.064-7-9.542-7z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[var(--color-primary)] text-black py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300 ease-in-out flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                    Loading...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Need help?{" "}
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-indigo-100">
            © 2025 betfair All rights reserved.
          </p>
          <p>
            Powered By{" "}
            <strong className="text-[var(--color-primary)]">
              {" "}
              betfair{" "}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
