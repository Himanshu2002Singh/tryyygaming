"use client";
import React, { useContext, useEffect, useState } from "react";
import { IoIosAddCircle, IoIosWallet, IoMdLock } from "react-icons/io";
import {
  FaArrowCircleRight,
  FaArrowRight,
  FaUser,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { TfiWallet } from "react-icons/tfi";
import { GiWallet } from "react-icons/gi";

import WalletInterface from "./mainBox";
import { FaDollarSign } from "react-icons/fa";
import { FaCoins } from "react-icons/fa6";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import Link from "next/link";
import BannerCreate from "../banner/banner";
import { AuthContext } from "../../context/authprovider";
import axios from "axios";
import API_URL from "@/config";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

const Panlecreate = () => {
  const { user, Logout, loginWithDemoAccount } = useContext(AuthContext);
  const [panelPurchases, setPanelPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="">
      <div className="relative bg-[var(--color-primary)]  text-center flex justify-center overflow-hidden">
        {/* Wallet icon at top most right side, rotated 30 deg, behind hamburger menu */}
        <GiWallet
          className="absolute top-[40%] left-[-2%] text-white text-6xl sm:text-7xl z-10"
          style={{ transform: "rotate(30deg)" }}
        />
        <GiWallet
          className="absolute top-[-19%] left-[-6%] text-white text-6xl sm:text-7xl z-10"
          style={{ transform: "rotate(30deg)" }}
        />
        <GiWallet
          className="absolute top-[-1%] left-[15%] text-white text-6xl sm:text-7xl z-10"
          style={{ transform: "rotate(30deg)" }}
        />

        {/* Wallet at 70% from the left top side, rotated 10 deg */}
        <GiWallet
          className="absolute top-[7%] right-[-2%] text-white text-6xl sm:text-7xl"
          style={{ transform: "rotate(10deg)" }}
        />
        <GiWallet
          className="absolute top-[-8%] right-[22%] text-white text-6xl sm:text-7xl"
          style={{ transform: "rotate(10deg)" }}
        />

        {/* Wallet at top right but half visible */}
        <GiWallet className="absolute bottom-[1%] right-[35%] text-white text-6xl sm:text-7xl" />

        {/* Wallet at 20% from bottom and 20% from right, slightly rotated */}
        <TfiWallet
          className="absolute bottom-[10%] right-[10%] text-white text-6xl sm:text-7xl"
          style={{ transform: "rotate(-15deg)" }}
        />

        {/* Coin icon at 20% from bottom and 20% from left, no rotation */}
        <TfiWallet className="absolute bottom-[1%] left-[20%] text-white text-6xl sm:text-7xl" />

        <div className="z-30 w-2/6">
          <WalletInterface />
        </div>
      </div>

      {user && user.isDemo && (
        <div className="w-full text-xs">
          <button
            onClick={loginWithDemoAccount}
            className="w-full bg-[#C44141] text-black py-2"
          >
            This is a Demo ID.
          </button>
        </div>
      )}

      {/* <div className="bg-black mx-2">
        <Link href="/paneldashboard">
          <div
            className="flex justify-between items-center bg-[var(--color-primary)]
             my-3 p-2 rounded-lg"
          >
            <div className="flex items-center gap-2 py-1">
              <IoIosAddCircle className="text-black text-xl" />
              <h3 className="text-black text-sm">Create Panel</h3>
            </div>
            <div>
              <FaArrowRight className="text-black text-xl" />
            </div>
          </div>
        </Link>
      </div> */}

      {/* Panel Purchases Grid */}

      {/* <BannerCreate /> */}
    </div>
  );
};

export default Panlecreate;
