"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import API_URL from "@/config";

const PanelsPage = () => {
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPanels();
  }, []);

  const fetchPanels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/panels`);
      setPanels(response.data.data);
    } catch (error) {
      console.error("Error fetching panels:", error);
      toast.error("Failed to fetch panels");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this panel?")) {
      try {
        await axios.delete(`/api/admin/panels/${id}`);
        toast.success("Panel deleted successfully");
        fetchPanels();
      } catch (error) {
        console.error("Error deleting panel:", error);
        toast.error("Failed to delete panel");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panels Management</h1>
        <Link
          href="/admin/panels/createpanel"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Panel
        </Link>
      </div>

      {loading ? (
        <p>Loading panels...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Logo</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Starting Price</th>
                <th className="py-2 px-4 border-b">Max Price</th>
                <th className="py-2 px-4 border-b">Website</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {panels.length > 0 ? (
                panels.map((panel) => (
                  <tr key={panel.id}>
                    <td className="py-2 px-4 border-b">
                      <img
                        src={panel.logo}
                        alt={panel.name}
                        className="h-10 w-auto object-contain"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">{panel.name}</td>
                    <td className="py-2 px-4 border-b">
                      {panel.startingprice}
                    </td>
                    <td className="py-2 px-4 border-b">{panel.maxprice}</td>
                    <td className="py-2 px-4 border-b">
                      <a
                        href={panel.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Visit
                      </a>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <Link
                        href={`/admin/panels/createpanel?id=${panel.id}`}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(panel.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center">
                    No panels found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PanelsPage;
