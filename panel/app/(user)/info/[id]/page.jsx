"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import API_URL from "@/config";

const InfoDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [buttonData, setButtonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchButtonData();
    }
  }, [id]);

  const fetchButtonData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/addbuttons/${id}`);
      setButtonData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching button data:", error);
      setError("Failed to load content. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!buttonData) {
    return (
      <div className="flex justify-center items-center h-screen">
        No data found
      </div>
    );
  }

  const { media, mediaType, heading, description } = buttonData;

  return (
    <div className="bg-bg-[#28282B]  mx-auto p-4">
      <div className=" rounded-lg shadow-md overflow-hidden">
        {/* Media display based on type */}
        {mediaType === "video" ? (
          <video
            src={media}
            controls
            className="w-full h-auto"
            controlsList="nodownload"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={media}
            alt={heading}
            className="w-full h-auto object-cover"
          />
        )}

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl text-[var(--color-primary)] font-bold mb-4">
            {heading}
          </h1>
          <p className="text-white">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoDetails;
