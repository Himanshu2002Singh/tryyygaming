"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import { IoIosAddCircle, IoIosWallet, IoMdLock } from "react-icons/io";
import {
  FaArrowCircleRight,
  FaArrowRight,
  FaUser,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Link from "next/link";
import { AuthContext } from "../../context/authprovider";
import axios from "axios";
import API_URL from "@/config";
import { BsArrowDown, BsArrowUp, BsPlus, BsPlusCircle } from "react-icons/bs";
import { useBottomSheet } from "../../context/BottomSheet";
import LoginAlert from "../notloggedalert";
import DemoUseralert from "../demouser";
import Deposit from "../depositWithdraw/deposit";
import BannerCreate from "../banner/banner";

const MyPanelHome = () => {
  const { user, Logout, loginWithDemoAccount } = useContext(AuthContext);
  const [panelPurchases, setPanelPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openBottomSheet } = useBottomSheet();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (user && !user.isDemo) {
      fetchPanelPurchases();
    } else {
      // Set an empty array for non-logged-in users or demo users
      setPanelPurchases([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPanelPurchases = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/userpanel/my-panel-purchases`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setPanelPurchases(response.data.data || []);
      }
    } catch (error) {
      console.log("Error fetching panel purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 250,
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -250,
        behavior: "smooth",
      });
    }
  };

  const completedPanels = panelPurchases.filter(
    (panel) => panel.status === "completed"
  );

  return (
    <div
      className={`relative ${
        completedPanels && completedPanels.length > 0 ? "flex flex-col" : "flex"
      } sm:gap-2`}
    >
      {/* Banner */}
      <div className="flex-1">
        <BannerCreate />
      </div>

      {/* Create Panel */}
      {!loading &&
        (!user || user.isDemo || (user && completedPanels.length === 0)) && (
          <div className=" flex-1 mx-2 my-3">
            <Link href="/paneldashboard">
              <div className="flex justify-between items-center bg-[var(--color-primary)] mb-1 p-2 rounded-2xl">
                <div className="flex items-center gap-2 py-1">
                  <IoIosAddCircle className="text-black text-xl" />
                  <h3 className="text-black text-sm">Create ID</h3>
                </div>
                <div>
                  <FaArrowRight className="text-black text-xl" />
                </div>
              </div>
            </Link>
          </div>
        )}

      {/* Panel Purchases Grid - Only show if there are purchases */}
      {!loading && completedPanels.length > 0 && (
        <div className="px-2 md:px-4 my-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white text-sm md:text-base font-semibold">
              My IDs
            </h3>
            <div className="flex items-center gap-4 justify-between">
              <Link
                href="/paneldashboard"
                className="text-[var(--color-primary)] flex items-center gap-1"
              >
                <BsPlusCircle />
                <h3 className=" text-xs md:text-sm">Create IDs</h3>
              </Link>
              <Link href="/paneldashboard">
                <h3 className="text-white text-xs md:text-sm">View all</h3>
              </Link>
            </div>
          </div>

          {/* Panel Container with Horizontal Scroll */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth gap-3"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {completedPanels.map((panel) => (
                <div
                  key={panel.id}
                  className="min-w-[240px] max-w-[280px] flex-shrink-0 snap-start bg-[var(--color-secondary)] rounded-lg p-3 md:p-4"
                >
                  {/* First row: Logo, Website, Redirect */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center overflow-hidden mr-2 md:mr-3">
                        {panel.panelDetails?.logo ? (
                          <img
                            src={panel.panelDetails.logo}
                            alt={panel.panelDetails?.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="font-bold text-xs text-center text-white">
                            {panel.panelDetails?.name?.substring(0, 1) || "P"}
                          </div>
                        )}
                      </div>
                      <div className="text-white">
                        <div className=" text-xs md:text-sm">
                          {panel.panelDetails?.name || "Panel"}
                        </div>
                        <div className="text-xs text-gray-400 truncate max-w-24 md:max-w-32">
                          {panel.panelDetails?.website || "N/A"}
                        </div>
                      </div>
                    </div>
                    <a
                      href={
                        panel?.loginurl?.startsWith("http")
                          ? panel.loginurl
                          : `https://${panel?.loginurl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaExternalLinkAlt size={14} className="md:text-lg" />
                    </a>
                  </div>

                  {/* Second row: Profile icon and username */}
                  <div className="flex items-center p-1 md:px-2 rounded">
                    <FaUser className="text-gray-400 mr-2" size={14} />
                    <div className="text-white">
                      <div className="font-medium text-xs md:text-sm">
                        {panel.username}
                      </div>
                    </div>
                  </div>

                  {/* Third row: Password with lock icon */}
                  <div className="flex items-center mb-1 p-1 md:px-2 rounded">
                    <IoMdLock className="text-gray-400 mr-2" size={14} />
                    <div className="text-white">
                      <div className="font-medium text-xs md:text-sm">
                        {panel.password}
                      </div>
                    </div>
                  </div>
                  <Link href={`/panel/panel-transactions?panelId=${panel?.id}`}>
                    <div className="border border-gray-400 text-center text-xs rounded-lg px-2 py-1 my-1 font-semibold">
                      View Transactions
                    </div>
                  </Link>
                  {/* Password change notice */}
                  <div className="text-xs text-white mb-2">
                    Change password on first login
                  </div>

                  {/* Deposit and Withdraw buttons */}
                  <div className="grid grid-cols-2 gap-2 bg-gray-950 p-2 rounded-lg">
                    <Link href={`/panel/panel-deposite?panelId=${panel?.id}`}>
                      <button
                        // onClick={() => {
                        //   !user
                        //     ? openBottomSheet(LoginAlert)
                        //     : user.isDemo
                        //     ? openBottomSheet(DemoUseralert)
                        //     : openBottomSheet(Deposit);
                        // }}
                        className="w-full bg-[#171717] text-white py-2 rounded-lg flex flex-col items-center justify-center"
                      >
                        <BsArrowUp size={14} className="mb-1 text-green-400" />
                        <span className="text-xs">Deposit</span>
                      </button>
                    </Link>
                    <Link href={`/panel/panel-withdraw?panelId=${panel?.id}`}>
                      <button className="w-full bg-[#171717] text-white py-2 rounded-lg flex flex-col items-center justify-center">
                        <BsArrowDown size={14} className="mb-1 text-red-500" />
                        <span className="text-xs">Withdraw</span>
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {completedPanels.length > 4 && (
              <>
                <button
                  onClick={scrollLeft}
                  className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 bg-[var(--color-primary)] rounded-full p-2 text-white shadow-lg hover:bg-opacity-80 transition z-10 hidden md:block"
                >
                  <FaChevronLeft size={16} />
                </button>
                <button
                  onClick={scrollRight}
                  className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 bg-[var(--color-primary)] rounded-full p-2 text-white shadow-lg hover:bg-opacity-80 transition z-10"
                >
                  <FaChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Custom CSS to hide scrollbar */}
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

// Add this in your global CSS to ensure the scrollbar is hidden across browsers

export default MyPanelHome;
