"use client";
import React, { useContext, useState } from "react";
import {
  FaUser,
  FaChartBar,
  FaTrophy,
  FaHistory,
  FaGift,
} from "react-icons/fa";
import AlternateNumber from "../components/Profile/alternatenumber";
import { useBottomSheet } from "../context/BottomSheet";
import UserEmail from "../components/Profile/Email";
import CompleteProfile from "../components/Profile/completeProfile";
import Link from "next/link";
import { AuthContext } from "../context/authprovider";
import LoginAlert from "../components/notloggedalert";
import DemoUseralert from "../components/demouser";
import Deposit from "../components/depositWithdraw/deposit";
import Withdraw from "../components/depositWithdraw/withdraw";
import ChangePassword from "../components/Profile/changepassword";
import VerifyAlternateNumber from "../components/Profile/verifynumber";
import { MdOutlineVerified } from "react-icons/md";
import VerifyEmail from "../components/Profile/verifyemail";

const UserProfile = () => {
  const { user, Logout } = useContext(AuthContext);
  // let [token, setToken] = useState("kdsfsdf"); // Initialize with null or undefined
  const { openBottomSheet } = useBottomSheet();
  return (
    <>
      {user ? (
        <div className="relative px-4 bg-[#111111] h-full text-white overflow-auto flex flex-col">
          {/* Header */}
          <div className="bg-[#1E1E1E] rounded-lg mt-3">
            <div className="flex  justify-between items-center p-4">
              <div className="flex flex-col items-center ">
                {/* <img
                src="/api/placeholder/24/24"
                alt="India flag"
                className="mr-2 rounded"
              /> */}
                <span className="text-gray-300 text-sm ">
                  {" "}
                  {(user && user.name) || ""}
                </span>
                <span className="text-gray-300 text-sm ">
                  {" "}
                  {(user && `+${user.phone}`) || "+91 - 0123456789"}
                </span>
              </div>
              <button
                onClick={() => openBottomSheet(ChangePassword)}
                className="bg-black text-white px-4 py-2 rounded-lg text-xs"
              >
                Change Password
              </button>
            </div>

            {/* Balance Card */}
            <div className="bg-[#5F5F5F] mb-2 mx-4 p-3 rounded-lg">
              <div className="text-gray-400 text-xs sm:text-sm">Balance</div>
              <div className="text-base sm:text-2xl mb-4">{user.points}</div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    !user
                      ? openBottomSheet(LoginAlert, { closeicon: false })
                      : user.isDemo
                      ? openBottomSheet(DemoUseralert, { closeicon: false })
                      : openBottomSheet(Deposit);
                  }}
                  className="bg-black text-xs text-white py-2 rounded"
                >
                  Deposit
                </button>
                <button
                  onClick={() => {
                    !user
                      ? openBottomSheet(LoginAlert, { closeicon: false })
                      : user.isDemo
                      ? openBottomSheet(DemoUseralert, { closeicon: false })
                      : openBottomSheet(Withdraw);
                  }}
                  className="bg-black text-xs text-white py-2  rounded"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
          {/* Scrollable Navigation Menu */}
          <div className="flex-1 overflow-y-auto my-2 text-[10px] sm:text-xs">
            <nav className="my-2">
              <ul>
                <li className="bg-[#1E1E1E] rounded-lg px-2 my-2 border-b border-gray-800">
                  <div className="flex items-center justify-between py-2  sm:py-3">
                    <div
                      onClick={() => openBottomSheet(AlternateNumber)}
                      className="flex items-between "
                    >
                      <svg
                        className="w-4 h-4 mr-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>{" "}
                      Alternate Number
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="pr-1">{user && user.alternateNumber}</div>
                      {!user.alternateNumberverified ? (
                        <button
                          onClick={() => openBottomSheet(VerifyAlternateNumber)}
                          className="border z-48 rounded-lg px-2 border-[var(--color-primary)]"
                        >
                          Verify
                        </button>
                      ) : (
                        <>
                          {" "}
                          <MdOutlineVerified className="text-lg text-green-400" />
                          <button
                            onClick={() => openBottomSheet(AlternateNumber)}
                            className="border z-48 rounded-lg px-2 border-[var(--color-primary)]"
                          >
                            Change
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>{" "}
                <li className="bg-[#1E1E1E]  rounded-lg px-2 my-2 border-b border-gray-800">
                  <div className="flex items-center justify-between py-2  sm:py-3">
                    <div
                      onClick={() => openBottomSheet(UserEmail)}
                      className="flex items-between "
                    >
                      <svg
                        className="w-4 h-4 mr-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Add Email
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="pr-1">{user && user.email}</div>
                      {user && !user.emailverified && user.email ? (
                        <button
                          onClick={() => openBottomSheet(VerifyEmail)}
                          className="border z-48 rounded-lg px-2 border-[var(--color-primary)]"
                        >
                          Verify
                        </button>
                      ) : (
                        <>
                          {" "}
                          <MdOutlineVerified className="text-lg text-green-400" />
                          <button
                            onClick={() => openBottomSheet(UserEmail)}
                            className="border z-48 rounded-lg px-2 border-[var(--color-primary)]"
                          >
                            Change
                          </button>
                        </>
                        // user.emailverified && (
                        //   <MdOutlineVerified className="text-lg text-green-400" />
                        // )
                      )}
                    </div>
                  </div>
                </li>{" "}
                {!user?.profilecompleted && (
                  <li className=" bg-[#1E1E1E]  rounded-lg px-2   my-2 border-b border-gray-800">
                    <div
                      onClick={() => openBottomSheet(CompleteProfile)}
                      className="flex items-center py-2 sm:py-3 "
                    >
                      <svg
                        className="w-4 h-4 mr-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Complete Profile
                    </div>
                  </li>
                )}
                <li className="bg-[#1E1E1E]  rounded-lg px-2  my-2 border-b border-gray-800">
                  <a href="#" className="flex items-center py-2 sm:py-3 ">
                    <svg
                      className="w-4 h-4 mr-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Active Bets
                  </a>
                </li>
                <li className="bg-[#1E1E1E]  rounded-lg px-2 my-2 border-b border-gray-800">
                  <Link
                    href="/transactions"
                    className="flex items-center py-2 sm:py-3"
                  >
                    <svg
                      className="w-4 h-4 mr-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Account Statement
                  </Link>
                </li>
                <li className="bg-[#1E1E1E]  rounded-lg px-2 my-2 border-b border-gray-800">
                  <Link
                    href="/rules"
                    className="flex items-center py-2 sm:py-3 "
                  >
                    <svg
                      className="w-4 h-4 mr-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Rules
                  </Link>
                </li>
                <li className="bg-[#1E1E1E]  rounded-lg px-2 my-2 border-b border-gray-800">
                  <Link
                    href="/withdraw/banking"
                    className="flex items-center py-2 sm:py-3"
                  >
                    <svg
                      className="w-4 h-4 mr-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Banking
                  </Link>
                </li>
                {/* Add more list items here */}
              </ul>
            </nav>
          </div>
          <div className="relative bottom-0">
            <button
              onClick={Logout}
              className=" w-full absolute bottom-20 bg-[var(--color-primary)] hover:cursor-pointer text-black py-2 sm:py-3 rounded-lg text-xs"
            >
              Logout
            </button>
          </div>

          {/* Logout Button */}
        </div>
      ) : (
        <div className="flex  flex-col h-full w-full text-white">
          <div className="flex-1 p-3 overflow-y-auto">
            {/* Guest User Section - Triple Height */}
            <div className="flex items-center justify-center bg-[var(--color-secondary)] rounded-lg p-4 mb-4 h-36">
              {/* <FaUser size={32} className="text-gray-400 mr-3" /> */}
              <span className="text-xs ">Guest User</span>
            </div>

            {/* Second Div - Active Bets */}
            <div className="flex items-center bg-[var(--color-secondary)] rounded-lg p-4 mb-4 h-12">
              <FaChartBar size={20} className="text-blue-400 mr-3" />
              <span className="text-xs">Active Bets</span>
            </div>

            {/* Third Div */}
            <div className="flex items-center bg-[var(--color-secondary)] rounded-lg p-4 mb-4 h-12">
              <FaTrophy size={20} className="text-green-400 mr-3" />
              <span className="text-xs">Your Winnings</span>
            </div>

            {/* Fourth Div */}
            <div className="flex items-center bg-[var(--color-secondary)] rounded-lg p-4 mb-4 h-12">
              <FaHistory size={20} className="text-yellow-400 mr-3" />
              <span className="text-xs">Bet History</span>
            </div>

            {/* Fifth Div */}
            <div className="flex items-center bg-[var(--color-secondary)] rounded-lg p-4 mb-4 h-12">
              <FaGift size={20} className="text-purple-400 mr-3" />
              <span className="text-xs">Promotions</span>
            </div>
          </div>

          {/* Bottom Login Button - Full Width and Sticky */}
          <div className="w-full  px-6">
            <button className="bg-[var(--color-primary)] text-white py-3 px-4 rounded-xl font-bold w-full transition duration-200">
              LOGIN
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
