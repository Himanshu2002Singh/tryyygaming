"use client";
import React, { useContext } from "react";
import { LiaCoinsSolid } from "react-icons/lia";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import Deposit from "../depositWithdraw/deposit";
import Withdraw from "../depositWithdraw/withdraw";
import { useBottomSheet } from "../../context/BottomSheet";
import { AuthContext } from "../../context/authprovider";
import LoginAlert from "../notloggedalert";
import DemoUseralert from "../demouser";

const WalletInterface = () => {
  const { user } = useContext(AuthContext);
  const { openBottomSheet } = useBottomSheet();

  return (
    <div className="flex items-center justify-center px-4 pb-3">
      <div className="flex items-center justify-center w-full max-w-2xl sm:max-w-4xl">
        {/* Left Box - Deposit */}
        {/* Left Box - Deposit */}
        <div
          onClick={() => {
            !user
              ? openBottomSheet(LoginAlert, { closeicon: false })
              : user.isDemo
              ? openBottomSheet(DemoUseralert, { closeicon: false })
              : openBottomSheet(Deposit, { bgColor: "#393939" });
          }}
          style={{
            width: "80px",
            flexShrink: 0,
            flexGrow: 0,
            boxSizing: "border-box",
            borderRadius: "1rem 0 0 1rem",

            position: "relative",
            zIndex: 1,
            background:
              "linear-gradient(145deg, rgb(10, 10, 10,1) 70%, rgba(40, 40, 40, 1.6) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)",
            border: "1px solid rgba(80, 80, 80, 0.4)",
            overflow: "hidden",
          }}
          className={`shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-300 p-3 h-28 flex flex-col items-center justify-center cursor-pointer sm:w-44`}
        >
          {/* Top glossy reflection */}
          <div
            className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, transparent 100%)",
              borderTopLeftRadius: "1rem",
              transform: "translateY(-5px) skewY(-3deg) scale(1.1)",
              opacity: 0.7,
            }}
          />

          {/* Diagonal shine line - mimics the glass reflection */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "200%",
              height: "15px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              transform: "rotate(-45deg) translateX(-50%)",
              top: "20%",
              left: "-50%",
              opacity: 0.6,
            }}
          />

          <div className="flex flex-col items-center justify-center w-full relative z-10">
            <span className="font-medium text-[10px] text-center w-full text-white">
              Deposit
            </span>
            <img src="/arrow-up.svg" className="h-11 w-auto mt-2" />
          </div>

          {/* Bottom gradient shadow */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 rounded-bl-[1rem] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(0,0,0,0.15))",
              opacity: 0.8,
            }}
          />

          {/* Side edge highlight */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.2), transparent)",
              opacity: 0.7,
            }}
          />
        </div>

        {/* Main Center Box with Logo, Balance, and Coin */}
        {/* Wallet Balance Box */}
        <div
          style={{
            position: "relative",
            zIndex: 2,

            // boxShadow: "2px 2px 2px rgba(0,0,0,0.7)",
            marginLeft: "-1px",
            marginRight: "-1px",
            background:
              "linear-gradient(145deg, rgb(10, 10, 10,1) 70%, rgba(40, 40, 40, 1.6) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)",
            border: "1px solid rgba(80, 80, 80, 0.4)",
            borderRadius: "17px",
          }}
          className="flex flex-col rounded-xl items-center justify-center bg-[var(--color-secondary)] p-7 sm:p-6 h-42 sm:w-56"
        >
          {/* Reflection overlay */}
          <div
            className="absolute  inset-0  overflow-hidden pointer-events-none"
            style={{
              // background:
              //   "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 50%)",
              opacity: 0.6,
            }}
          />

          {/* Logo */}
          <img
            className="w-full h-auto object-cover min-w-[7rem] relative z-10"
            src="logo-gs.png"
          />

          {/* Wallet Balance Text */}
          {user && (
            <>
              <h2 className="mt-6 text-xs text-white sm:text-xs relative z-10">
                Wallet Balance
              </h2>
              <div className="mt-1 flex items-center justify-center min-w-[6rem] gap-1 relative z-10">
                <LiaCoinsSolid className="text-white" size={20} />
                <span className="text-white text-base sm:text-xl font-bold">
                  {user && user.points}
                </span>
              </div>
              {user && user.expense > 0 && (
                <h2 className="mt-3 text-xs sm:text-xs text-white relative z-10">
                  exp {user.expense}
                </h2>
              )}
            </>
          )}

          {/* Bottom shadow layer */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 rounded-b-[10px] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(0,0,0,0.05))",
            }}
          />
        </div>

        {/* Withdraw Box */}
        {/* Left Box - Deposit */}
        <div
          onClick={() => {
            !user
              ? openBottomSheet(LoginAlert, { closeicon: false })
              : user.isDemo
              ? openBottomSheet(DemoUseralert, { closeicon: false })
              : openBottomSheet(Withdraw, { bgColor: "#393939" });
          }}
          style={{
            width: "80px",
            flexShrink: 0,
            flexGrow: 0,
            boxSizing: "border-box",
            borderRadius: "0 1rem 1rem 0",

            position: "relative",
            zIndex: 1,
            background:
              "linear-gradient(145deg, rgb(10, 10, 10,1) 70%, rgba(40, 40, 40, 1.6) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)",
            border: "1px solid rgba(80, 80, 80, 0.4)",
            overflow: "hidden",
          }}
          className={`shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-300 p-3 h-28 flex flex-col items-center justify-center cursor-pointer sm:w-44`}
        >
          {/* Top glossy reflection */}
          <div
            className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, transparent 100%)",
              borderTopLeftRadius: "1rem",
              transform: "translateY(-5px) skewY(-3deg) scale(1.1)",
              opacity: 0.7,
            }}
          />

          {/* Diagonal shine line - mimics the glass reflection */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "200%",
              height: "15px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              transform: "rotate(-45deg) translateX(-50%)",
              top: "20%",
              left: "-50%",
              opacity: 0.6,
            }}
          />

          <div className="flex flex-col items-center justify-center w-full relative z-10">
            <span className="font-medium text-[10px] text-center w-full text-white">
              Withdraw
            </span>
            <img src="/arrow-down.svg" className="h-11 w-auto mt-2" />
          </div>

          {/* Bottom gradient shadow */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 rounded-bl-[1rem] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(0,0,0,0.15))",
              opacity: 0.8,
            }}
          />

          {/* Side edge highlight */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.2), transparent)",
              opacity: 0.7,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WalletInterface;
