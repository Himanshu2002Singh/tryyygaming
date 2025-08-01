"use client";
import API_URL from "@/config";
import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import Image from "next/image";
const PanelList = ({ title, matches }) => {
  return (
    <div className="mb-6">
      <div className="px-2 flex justify-between items-center mb-2">
        <h2 className="text-md font-bold">{title}</h2>
        <button className="text-blue-600 flex items-center text-sm">
          View All <FaChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="border text-gray-800 bg-gray-100 rounded">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-1 text-center mx-auto w-20">
                <CiClock2 className="h-4 w-4 text-gray-500" />
              </th>
              <th className="p-1 text-left text-sm flex-1">Teams</th>
              <th className="p-1 text-center text-sm w-20">Back</th>
              <th className="p-1 text-center text-sm w-20">Lay</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index} className="border-t">
                <td className="p-1 border-r text-[10px]">
                  starts at 3:30am IST
                </td>
                <td className="p-1 border-r">
                  <div className="font-medium">{match.teams}</div>
                </td>
                <td className="p-1 text-center border-r">
                  <div className="bg-blue-100 text-sm rounded p-1">
                    {match.back}
                  </div>
                </td>
                <td className="p-1 text-center">
                  <div className="bg-pink-100 text-sm rounded p-1">
                    {match.lay}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SportsBettingInterface = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/admin/banners`);
        if (response.data.success) {
          // Filter only active banners
          setBanners(response.data.data);
        } else {
          setError("Failed to fetch banners");
        }
      } catch (error) {
        console.log("Error fetching banners:", error);
        setError("Error loading banners");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (banners.length <= 1) return; // Don't auto-scroll if there's only one or no banners

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Navigation functions
  const nextSlide = () => {
    if (isTransitioning || banners.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning || banners.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + banners.length) % banners.length
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Fallback content for loading and error states
  if (isLoading) {
    return (
      // <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-800 animate-pulse rounded-lg">
      <div className="absolute inset-0 flex items-center justify-center text-white">
        {/* Loading banners... */}
      </div>
      // </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-800 rounded-lg">
  //       <div className="absolute inset-0 flex items-center justify-center text-white">
  //         {error}
  //       </div>
  //     </div>
  //   );
  // }

  // If no banners are available, show a fallback
  if (banners.length === 0) {
    return (
      <></>
      // <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-800 rounded-lg">
      //   <div className="absolute inset-0 flex items-center justify-center text-white">
      //     No active banners available
      //   </div>
      // </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
      {/* Main carousel container */}
      <div className="relative w-full h-64 md:h-80 lg:h-96">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{
              backgroundImage: `url(${banner.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {banner.text && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-bold mt-1">{banner.text}</h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Navigation arrows - now positioned relative to the carousel container */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
              aria-label="Previous slide"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
              aria-label="Next slide"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>

            {/* Indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SportsBettingInterface;
