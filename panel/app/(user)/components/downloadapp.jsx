"use client";
import React, { useState, useEffect } from "react";

const MobileDownloadBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [userClosed, setUserClosed] = useState(false);

  useEffect(() => {
    const bannerClosedStatus = sessionStorage.getItem("appBannerClosed");
    if (bannerClosedStatus === "true") {
      setUserClosed(true);
      setIsVisible(false);
    }

    const handleResize = () => {
      // Only show the banner if the user hasn't explicitly closed it
      if (!userClosed) {
        setIsVisible(window.innerWidth < 500);
      }
    };

    handleResize(); // Set initial state after mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [userClosed]);

  // Function to handle download
  const handleDownload = () => {
    alert("Launching soon");
  };

  // Function to close the banner
  const closeBanner = () => {
    setIsVisible(false);
    setUserClosed(true); // Track that user has explicitly closed the banner
    sessionStorage.setItem("appBannerClosed", "true");
  };

  return (
    <div className="z-[40] relative flex flex-col items-end gap-3 w-full">
      {/* WhatsApp Icon - Adjusts Position Dynamically */}
      {/* <img
        src="whatsapp-icon.png"
        alt="WhatsApp"
        className={`fixed bottom-4 right-3 lg:right-[26%] w-10 h-10 transition-all duration-300 ${
          isVisible ? "mb-36" : "mb-20"
        }`}
      /> */}

      {/* Mobile Download Banner */}
      {isVisible && (
        <div className="fixed w-11/12 border-2 border-[var(--color-primary)] rounded-xl max-w-md bottom-24 left-1/2 transform -translate-x-1/2 bg-black text-[var(--color-primary)] p-3 flex justify-between items-center shadow-lg sm:hidden">
          {" "}
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium">Download App Now</span>
          </div>
          <div className="flex gap-4">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="bg-[var(--color-primary)] text-black text-xs px-2 py-0.5 rounded-md"
            >
              Download
            </button>

            {/* Close Button */}
            <button
              onClick={closeBanner}
              className="text-[var(--color-primary)] focus:outline-none"
              aria-label="Close"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDownloadBanner;
