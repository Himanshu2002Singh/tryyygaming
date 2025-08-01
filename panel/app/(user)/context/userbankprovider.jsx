"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API_URL from "@/config";

// Create the context
const UserBankContext = createContext();

// Custom hook to use the context
export const useUserBank = () => useContext(UserBankContext);

// Provider component
export const UserBankProvider = ({ children }) => {
  const [activeBanks, setActiveBanks] = useState([]);
  const [deletedBanks, setDeletedBanks] = useState([]);
  const [bankHistory, setBankHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to refresh bank data
  const refreshBankData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Fetch active bank accounts
  const fetchActiveBanks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/banks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setActiveBanks(response.data.userBanks || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching active bank accounts:", error);
      setError("Failed to load active bank accounts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch deleted bank accounts
  const fetchDeletedBanks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/bank/deleted`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDeletedBanks(response.data.userBanks || []);
      setError(null);
    } catch (error) {
      console.log("Error fetching deleted bank accounts:", error);
      setError("Failed to load deleted bank accounts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bank history
  const fetchBankHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/bank/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBankHistory(response.data.userBanks || []);
      setError(null);
    } catch (error) {
      console.log("Error fetching bank history:", error);
      setError("Failed to load bank history");
    } finally {
      setLoading(false);
    }
  };

  // Add a new bank account
  const addBankAccount = async (bankData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required");
        setLoading(false);
        return false;
      }

      await axios.post(`${API_URL}/adduserbank`, bankData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Bank account added successfully");
      refreshBankData();
      return true;
    } catch (error) {
      console.error("Error adding bank account:", error);
      toast.error(
        error.response?.data?.message || "Failed to add bank account"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a bank account
  const deleteBankAccount = async (bankId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required");
        setLoading(false);
        return false;
      }

      await axios.delete(`${API_URL}/bank/delete/${bankId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Bank account deleted successfully");

      // Update the active banks list
      setActiveBanks((prevBanks) =>
        prevBanks.filter((bank) => bank.id !== bankId)
      );
      refreshBankData();
      return true;
    } catch (error) {
      console.error("Error deleting bank account:", error);
      toast.error("Failed to delete bank account");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all bank data when the component mounts or refreshTrigger changes
  useEffect(() => {
    const fetchAllBankData = async () => {
      await fetchActiveBanks();
      await fetchDeletedBanks();
      await fetchBankHistory();
    };

    fetchAllBankData();
  }, [refreshTrigger]);

  // Value to be provided by the context
  const value = {
    activeBanks,
    deletedBanks,
    bankHistory,
    loading,
    error,
    refreshBankData,
    addBankAccount,
    deleteBankAccount,
    fetchActiveBanks,
    fetchDeletedBanks,
    fetchBankHistory,
  };

  return (
    <UserBankContext.Provider value={value}>
      {children}
    </UserBankContext.Provider>
  );
};
