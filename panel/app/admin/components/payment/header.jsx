"use client";
import React, { useState, useContext } from "react";
import { FaArrowLeft, FaBars, FaTimes } from "react-icons/fa";
import { AdminAuthContext } from "../../context/adminAuthcontext";
import AddCoinsModal from "./addcoinsmodal";
import { toast } from "react-hot-toast";
import { useBottomSheet } from "../../context/BottomSheetAdmin";
import Link from "next/link";

const AdminPaymentheader = ({ toggleSidebar, isSidebarOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddCoinsModalOpen, setIsAddCoinsModalOpen] = useState(false);
  const { user } = useContext(AdminAuthContext);
  const { openBottomSheet } = useBottomSheet();

  const toggleMenu = () => {
    console.log("hi");
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAddCoinsSuccess = () => {
    toast.success("Coin request submitted successfully");
    // You might want to refresh user data here if needed
  };
  const handleAddCoinsClick = () => {
    openBottomSheet(({ onClose }) => (
      <AddCoinsModal
        isOpen={true} // Always open inside the bottom sheet
        onClose={() => {
          onClose();
          // Any additional logic after closing, like refreshing data
        }}
        adminId={user?.id}
        onSuccess={handleAddCoinsSuccess}
      />
    ));
  };

  return (
    <header className="w-full bg-[var(--color-secondary)]  shadow-2xl px-4 py-2 z-30">
      {/* Desktop View */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Sidebar toggle button on mobile */}
          <button
            className="mr-3 text-gray-500 md:hidden"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <div className=" text-black font-bold rounded-md p-1 mr-2">
            <img src="/logo-gs.png" alt="Logo" className="h-9" />
            {/* BET FAIR */}
          </div>
        </div>

        {/* Mobile Menu Button - this is for the header dropdown */}
        <button className="md:hidden text-gray-500" onClick={toggleMenu}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-gray-500">
            <FaArrowLeft size={20} />
          </button>
          <button className="text-gray-500">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <div className="text-right">
            <div className="text-sm text-white">Balance {user?.coins}</div>
          </div>
          <div className="text-right">
            <div
              className="text-sm text-white bg-emerald-500 px-3 py-1 rounded-full cursor-pointer hover:bg-emerald-600"
              onClick={handleAddCoinsClick}
              // onClick={() => setIsAddCoinsModalOpen(true)}
            >
              add coins
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">{(user && user.name) || "NA"}</div>
          </div>
          <Link href={"/admin/home/profile"}>
            <button className="bg-gray-200 rounded-full p-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 py-3 border-t border-gray-200">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <button className="text-gray-500">
                <FaArrowLeft size={20} />
              </button>
              <button className="text-gray-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Balance {user?.coins || 0}
              </div>
              <div
                className="text-sm text-white bg-emerald-500 px-3 py-1 rounded-full cursor-pointer hover:bg-emerald-600"
                onClick={() => setIsAddCoinsModalOpen(true)}
              >
                add coins
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Coins Modal */}
      {/* <AddCoinsModal
        isOpen={isAddCoinsModalOpen}
        onClose={() => setIsAddCoinsModalOpen(false)}
        adminId={user?.id}
        onSuccess={handleAddCoinsSuccess}
      /> */}
    </header>
  );
};

export default AdminPaymentheader;
