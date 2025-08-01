"use client";
import { createContext, useState, useEffect } from "react";
// import instance from "../axiosinterceptor";
import axios from "axios";
import API_URL from "@/config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data
  const [loading, setLoading] = useState(true);

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/auth/userdetail`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
      // setUser(response.data);
      return response.data.user;
    } catch (error) {
      console.log("Failed to fetch user details:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details on mount if accessToken exists
  useEffect(() => {
    console.log("Fetching user details...");
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const isDemo = localStorage.getItem("isDemo") === "true";

    if (token) {
      fetchUserDetails();
    } else if (isDemo && storedUser) {
      // Restore demo user from localStorage
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log("Failed to parse stored demo user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("isDemo");
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isDemo");
    setUser(null);
    window.location.reload(); // Reloads the current page
  };

  const loginWithDemoAccount = () => {
    // Create a demo user object with limited permissions
    const demoUser = {
      id: "demo-user",
      name: "Demo User",
      phone: "DEMO",
      email: "demo@example.com",
      points: 10000, // Demo balance
      expense: 0,
      isDemo: true, // Flag to identify demo users
      // Add any other necessary user properties
    };

    // Set the demo user in your state
    setUser(demoUser);

    // Store in localStorage to persist across refreshes
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("isDemo", "true");

    // You might want to show a notification
    // that this is a demo account with limited functionality
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchUserDetails,
        Logout,
        loginWithDemoAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
