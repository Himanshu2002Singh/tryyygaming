"use client";
import React, { useState, useEffect } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";

const CustomPosters = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
  try {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/offers`
    );
    const data = await response.json();

    if (data.success) {
      // Filter offers with status "active"
      const activeOffers = data.data.filter((offer) => offer.isActive);

      console.log("Active Offers:", activeOffers);
      setOffers(activeOffers);
      setError(null);
    } else {
      setError("Failed to fetch offers");
    }
  } catch (err) {
    console.error("Error fetching offers:", err);
    setError("Error loading offers");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchOffers();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-transparent border-t-yellow-400 border-r-yellow-400"
        ></motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-500 flex flex-col justify-center items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-500 to-black rounded-xl p-8 text-center shadow-2xl max-w-md w-full border border-yellow-500/20"
        >
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchOffers}
            className="flex items-center justify-center mx-auto space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium rounded-lg hover:shadow-lg transition-all"
          >
            <FiRefreshCw className="w-5 h-5 mr-2" />
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // No Offers State
  if (offers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex flex-col justify-center items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-8 max-w-md w-full shadow-2xl border border-yellow-500/20"
        >
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            No Offers Available
          </h2>
          <p className="text-gray-300">
            Check back later for exciting new offers!
          </p>
        </motion.div>
      </div>
    );
  }

  // Offers View
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center text-white mb-8"
        >
          Premium Offers
        </motion.h1>

        <div className="grid gap-8 overflow-hidden max-h-[calc(100vh-12rem)] pr-2 hide-scrollbar mb-26">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 hover:border-yellow-400 transition-all duration-300"
            >
              <div className="flex flex-col overflow-hidden lg:flex-row">
                {/* Media Section */}
                <div className="lg:w-2/5 relative">
                  {offer.mediaType === "video" ? (
                    <div className="relative h-64 lg:h-full">
                      <video
                        src={offer.media}
                        className="w-full h-full object-cover"
                        controls
                        muted
                        poster="/video-poster-dark.jpg"
                        autoPlay
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/70 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium border border-yellow-400/50">
                          ▶ WATCH OFFER
                        </div>
                      </div>
                    </div>
                  ) : (
                    <motion.img
                      src={offer.media}
                      alt={offer.heading}
                      className="w-full overflow-hidden h-64 lg:h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-offer-dark.jpg";
                      }}
                    />
                  )}
                </div>

                {/* Content Section */}
                <div className="lg:w-3/5 p-8 flex flex-col justify-center">
                  <motion.h2
                    whileHover={{ x: 5 }}
                    className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4"
                  >
                    {offer.heading}
                  </motion.h2>

                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    {offer.description}
                  </p>

                  {offer.websiteurl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={offer.websiteurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 mt-auto self-start bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium rounded-lg hover:shadow-lg transition-all"
                    >
                      Explore Offer
                      <BsArrowUpRight className="w-5 h-5 ml-2" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .hide-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .hide-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }

        .hide-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CustomPosters;
