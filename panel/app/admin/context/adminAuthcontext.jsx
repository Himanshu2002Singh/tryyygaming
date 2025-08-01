"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/config";
import { useRouter } from "next/navigation";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null); // Stores user data
  const [permissions, setPermissions] = useState([]); // Store permissions
  const [loading, setLoading] = useState(true);

  // Function to fetch user details and permissions
  const fetchAdminDetails = async () => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        router.push("/admin/auth");
        setLoading(false);
        return false;
      }

      // Get admin profile
      const response = await axios.get(`${API_URL}/admin/auth/profile`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const adminData = response.data.admin;
        setUser(adminData);

        // Fetch permissions for this admin's role
        const permissionsResponse = await axios.get(
          `${API_URL}/admin/auth/role-permissions/${adminData.roleId}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (permissionsResponse.status === 200) {
          setPermissions(
            permissionsResponse.data.permissions.map((p) => p.name)
          );
        }
        // router.push("/admin/home/dashboard");
        // router.push("/admin/main-screen");
        return true;
      } else {
        router.push("/admin/auth");
        setUser(null);
        setPermissions([]);
        return false;
      }
    } catch (error) {
      console.log("Failed to fetch user details:", error);
      router.push("/admin/auth");
      setUser(null);
      setPermissions([]);
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details on mount if accessToken exists
  useEffect(() => {
    console.log("Fetching user details...");
    const token = localStorage.getItem("admintoken");
    if (token) {
      fetchAdminDetails();
    } else {
      router.push("/admin/auth");
      setLoading(false);
    }
  }, []);

  const Logout = () => {
    localStorage.removeItem("admintoken");
    setUser(null);
    window.location.href = "/admin/auth"; // Reloads the current page
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, permissions, setUser, loading, fetchAdminDetails, Logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
