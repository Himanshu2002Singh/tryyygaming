"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  FaFacebookF,
  FaLinkedin,
  FaSearchPlus,
  FaSignOutAlt,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { MdOutlineLanguage } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { FaShield } from "react-icons/fa6";

import {
  FaUser,
  FaMoneyCheckAlt,
  FaFileInvoiceDollar,
  FaGamepad,
  FaBell,
  FaBook,
} from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoMdHelpCircle } from "react-icons/io";
import { TbFlag3 } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import editstake from "../stake/editstake";
import Globalsearchbottomsheet from "../bottomsheet/globalsearchbottomsheet";
import PhoneOtpScreen from "../../login/page";
import { useBottomSheet } from "../../context/BottomSheet";
import GoogleTranslate from "../../utils/googletranslate";
import { AuthContext } from "../../context/authprovider";
import LoginAlert from "../notloggedalert";
import DemoUseralert from "../demouser";
import MobileDownloadBanner from "../downloadapp";
import MobileDownloadButton from "../downloadappsidebar";
import Deposit from "../depositWithdraw/deposit";
import Help from "../help/help";
import axios from "axios";
import API_URL from "@/config";
import { BsInstagram } from "react-icons/bs";

const Navbar = () => {
  const { user, Logout, loginWithDemoAccount } = useContext(AuthContext);

  const pathname = usePathname();
  const router = useRouter();
  const handleDemoLogin = () => {
    loginWithDemoAccount();
    // Close sidebar if it's open
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };
  const [activeWhatsapp, setActiveWhatsapp] = useState(null);
  const [activeSocial, setActiveSocial] = useState(null);

  useEffect(() => {
    const fetchActiveWhatsapp = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/active-whatsapp`);
        setActiveWhatsapp(response.data.whatsapp);
      } catch (error) {
        console.error("Error fetching active WhatsApp:", error);
        // Handle error, e.g., set a default value or display an error message
        setActiveWhatsapp(null); // Or some default value
      }
    };
    const fetchActiveSocial = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/socials/active`);
        if (response.data.success) {
          setActiveSocial(response.data.socialMedia);
        }
      } catch (error) {
        console.log("Error fetching active social media:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchActiveWhatsapp();
    fetchActiveSocial();
  }, []);

  // Function to format social media URLs with proper domains
  const formatSocialUrl = (platform, username) => {
    if (!username) return null;

    // Remove any existing domain or protocol
    const cleanUsername = username
      .replace(/https?:\/\/(www\.)?/, "")
      .replace(/^[^\/]+\//, "")
      .trim();

    switch (platform) {
      case "instagram":
        return `https://www.instagram.com/${cleanUsername}`;
      case "telegram":
        return `https://t.me/${cleanUsername}`;
      case "facebook":
        return `https://www.facebook.com/${cleanUsername}`;
      case "twitter":
        return `https://twitter.com/${cleanUsername}`;
      default:
        return username.includes("://") ? username : `https://${username}`;
    }
  };

  const menuItems = [
    { name: "Profile", icon: <FaUser />, route: "/userprofile" },
    {
      name: "Withdrawal Details",
      icon: <FaMoneyCheckAlt />,
      route: "/withdraw/banking",
    },
    {
      name: "Account Statement",
      icon: <FaFileInvoiceDollar />,
      route: "/transactions",
    },
    // { name: "Active Bets", icon: <TbFlag3 />, route: "/profile" },
    { name: "Edit Stakes", icon: <MdEditSquare />, route: "/profile" },

    { name: "Notifications", icon: <FaBell />, route: "/profile" },
    { name: "Rules", icon: <FaShield />, route: "/rules" },
    { name: "Help", icon: <IoMdHelpCircle />, route: "/rules" },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { openBottomSheet } = useBottomSheet();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const toggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const instagramUrl = activeSocial
    ? formatSocialUrl("instagram", activeSocial.instagram)
    : null;
  const telegramUrl = activeSocial
    ? formatSocialUrl("telegram", activeSocial.telegram)
    : null;
  const facebookUrl = activeSocial
    ? formatSocialUrl("facebook", activeSocial.facebook)
    : null;
  const twitterUrl = activeSocial
    ? formatSocialUrl("twitter", activeSocial.twitter)
    : null;

  const shareUrl = "https://betfair.ind.in"; // Change this to your actual URL
  const handleMenuClick = (item) => {
    if (item.name === "Profile") {
      // Navigate directly for "Profile"
      router.push(item.route);
    } else if (item.name == "Edit Stakes") {
      openBottomSheet(editstake);
    } else if (item.name == "Rules") {
      // Show demo user alert if user is a demo account
      // openBottomSheet(DemoUseralert);
      router.push(item.route);
    } else if (item.name == "Help") {
      openBottomSheet(() => <Help activeWhatsapp={activeWhatsapp} />);
    } else if (!user) {
      // Show login alert if user is not logged in
      openBottomSheet(LoginAlert, { closeicon: false });
    } else if (user.isDemo) {
      // Show demo user alert if user is a demo account
      openBottomSheet(DemoUseralert, { closeicon: false });
    } else {
      // Navigate normally for other users
      router.push(item.route);
    }
    toggleSidebar(); // Close the sidebar after handling the click
  };
  const sidebarVariants = {
    open: {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)", // fully visible
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    closed: {
      opacity: 0,
      clipPath: "inset(0% 100% 0% 0%)", // hidden from right to left
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <>
      {/* Overlay for when sidebar is open */}{" "}
      <Globalsearchbottomsheet
        isBottomSheetOpen={isBottomSheetOpen}
        toggleBottomSheet={toggleBottomSheet}
      />
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-40 bg-transparent bg-opacity-50"
            onClick={toggleSidebar}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          ></motion.div>
        )}
      </AnimatePresence>
      {/* Sidebar (visible on all screen sizes) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={`fixed top-0 h-full w-4/6 max-[400px]:w-5/6  sm:w-5/11 md:w-[40%] lg:w-[20%] bg-[#111111] text-white z-50 transform ${
              isSidebarOpen ? "translate-x-0" : "hidden -translate-x-full"
            } transition-transform duration-300 ease-in-out flex flex-col`}
          >
            {/* Close button */}
            <div className="flex px-5 pt-6 pb-4  justify-between items-center">
              {" "}
              <img className="w-2/6  h-auto object-cover" src="/logo-gs.png" />
              {/* <video className="w-2/6 h-auto object-cover" autoPlay loop muted>
            <source src="logo-animated.mp4" type="video/mp4" />
          </video>{" "} */}
              {/* <img src="logo.png" className="w-28 h-10" alt="Logo" /> */}
              {/* <div className="flex p-4">
                <button onClick={toggleSidebar} className="text-gray-100">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div> */}
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              <div
                className={`mt-3 py-2 px-5 bg-[var(--color-secondary)] flex items-center ${
                  user && user.phone ? "justify-between" : "justify-start gap-2"
                }`}
              >
                <span className="text-sm flex items-center gap-1">
                  <FaUser />
                  {(user && user.username) || "Guest User"}
                </span>

                {user && !user.isDemo && user.phone && (
                  <span className="inline-flex text-sm items-center gap-1">
                    <img src="/india_svg.svg" width={23} />
                    {`+${user.phone}`}
                  </span>
                )}
              </div>

              <ul className="p-4">
                {menuItems.map(
                  (item, index) => (
                    // item.name === "Edit Stakes" ? (
                    //   <li
                    //     key={index}
                    //     onClick={() => {
                    //       openBottomSheet(editstake);
                    //       toggleSidebar();
                    //     }}
                    //     className="text-[var(--color-text)] flex items-center gap-3 p-2 rounded-lg hover:bg-black cursor-pointer transition"
                    //   >
                    //     <span className="text-sm">{item.icon}</span>
                    //     <span className="text-sm font-semibold">{item.name}</span>
                    //   </li>
                    // ) : (
                    // : item.name === "Withdrawal Details" ? (
                    //   <li
                    //     key={index}
                    //     onClick={() => {
                    //       {
                    //         if (!user) {
                    //           openBottomSheet(LoginAlert);
                    //         } else if (user.isDemo) {
                    //           openBottomSheet(DemoUseralert);
                    //           // Show a demo-specific message or limited functionality
                    //           // openBottomSheet(() => (
                    //           //   <div className="p-4">
                    //           //     <h3 className="text-lg font-bold">Demo Account</h3>
                    //           //     <p>
                    //           //       This feature has limited functionality in demo
                    //           //       mode.
                    //           //     </p>
                    //           //     {/* Show demo version of the feature */}
                    //           //   </div>
                    //           // ));
                    //         } else {
                    //           openBottomSheet(editstake);
                    //           toggleSidebar();
                    //         }
                    //       }
                    //     }}
                    //     className="text-[var(--color-text)] flex items-center gap-3 p-2 rounded-lg hover:bg-black cursor-pointer transition"
                    //   >
                    //     <span className="text-sm">{item.icon}</span>
                    //     <span className="text-sm font-semibold">{item.name}</span>
                    //   </li>
                    // )
                    // <Link onClick={toggleSidebar} href={item.route} key={index}>
                    <li
                      key={index}
                      onClick={() => handleMenuClick(item)}
                      className="text-[var(--color-text)] flex items-center gap-3 p-2 rounded-lg hover:bg-black cursor-pointer transition"
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-sm font-semibold">{item.name}</span>
                    </li>
                  )
                  // </Link>
                  // )
                )}
              </ul>
            </div>
            {/* <div className="px-4 py-1 mt-auto">
              <div className="text-black text-xs py-3 w-full flex flex-col items-center justify-center gap-3 p-2 rounded-lg  transition">

                <div className="flex gap-3">
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0077b5] text-white p-2 rounded-full text-xl hover:opacity-80"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0088cc] text-white p-2 rounded-full text-xl hover:opacity-80"
                  >
                    <FaTelegramPlane />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1877f2] text-white p-2 rounded-full text-xl hover:opacity-80"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25d366] text-white p-2 rounded-full text-xl hover:opacity-80"
                  >
                    <FaWhatsapp />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1da1f2] text-white p-2 rounded-full text-xl hover:opacity-80"
                  >
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </div> */}

            <div className="px-4 py-1 mt-auto">
              <div className="text-black text-xs py-3 w-full flex flex-col items-center justify-center gap-3 p-2 rounded-lg transition">
                <div className="flex gap-3">
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#FF2967] text-white p-2 rounded-full text-xl hover:opacity-80"
                    >
                      <BsInstagram />
                    </a>
                  )}
                  {telegramUrl && (
                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0088cc] text-white p-2 rounded-full text-xl hover:opacity-80"
                    >
                      <FaTelegramPlane />
                    </a>
                  )}
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1877f2] text-white p-2 rounded-full text-xl hover:opacity-80"
                    >
                      <FaFacebookF />
                    </a>
                  )}
                  {twitterUrl && (
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1da1f2] text-white p-2 rounded-full text-xl hover:opacity-80"
                    >
                      <FaTwitter />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <MobileDownloadButton />

            {/* Logout Button - Fixed to Bottom */}
            {!user ? (
              <div className="px-4 py-1 mt-auto">
                <button className="text-black text-xs py-3 w-full flex items-center justify-center gap-3 p-2 rounded-lg bg-[var(--color-primary)]  cursor-pointer transition">
                  {/* <FaSignOutAlt className="text-lg" /> */}
                  <span>Login | Signup</span>
                </button>
              </div>
            ) : (
              <div className="px-4 py-1 mt-auto">
                <button
                  onClick={Logout}
                  className="text-black text-xs py-3 w-full flex items-center justify-center gap-3 p-2 rounded-lg bg-[var(--color-primary)]  cursor-pointer transition"
                >
                  {/* <FaSignOutAlt className="text-lg" /> */}
                  <span>Logout</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Navbar */}
      <nav
        className={`py-1 shadow-lg ${
          pathname == "/"
            ? "bg-[var(--color-primary)]"
            : "bg-[var(--color-bg-gray)]"
        } `}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Hamburger Button (Always Visible) */}
            {pathname === "/" ? (
              <button
                onClick={toggleSidebar}
                className="p-2 bg-white rounded-full  focus:outline-none"
              >
                <svg
                  className="h-3 w-3 text-[var(--color-primary)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            ) : (
              // Back Button (On other routes)
              <div className=" flex justify-between items-center  py-1 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.back()}
                    className="p-2 max-[400px]:p-1 bg-transparent border-1 border-[var(--color-primary)] rounded-full focus:outline-none"
                  >
                    <svg
                      className="h-3 w-3 text-[var(--color-primary)]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </button>{" "}
                  <img src="/logo-gs.png" alt="Logo" className="h-6" />
                </div>
              </div>
            )}
            {/* Right Section (Icons & Buttons) */}
            <div className="gap-0.5 flex items-center space-x-2">
              <FaSearchPlus
                className={pathname == "/" ? `text-black` : "text-white"}
                size={16}
                onClick={toggleBottomSheet}
              />
              {!user && (
                <>
                  <button
                    onClick={() =>
                      openBottomSheet(
                        () => (
                          <PhoneOtpScreen activeWhatsapp={activeWhatsapp} />
                        ),
                        { bgColor: "#1E1E1E" }
                      )
                    }
                    className="py-1.5 px-2 max-[450px]:text-[10px] text-xs border border-black text-black bg-white rounded-lg transition duration-300 shadow-lg"
                  >
                    Login | Signup
                  </button>
                  <button
                    onClick={handleDemoLogin}
                    className={`py-1.5 px-2 max-[450px]:text-[10px] text-xs border border-white
                      text-black
                    bg-[var(--color-primary)] rounded-lg transition duration-300 shadow-sm`}
                  >
                    Demo Id
                  </button>
                </>
              )}
              {pathname == "/" && <GoogleTranslate />}
              {pathname != "/" && user && (
                <div className="flex items-center gap-2">
                  <div>
                    <h4 className="text-[10px]">{user && user?.points} Bal</h4>
                    <h4 className="text-[10px]">{user && user?.expense} Exp</h4>
                  </div>
                  <button
                    onClick={() => openBottomSheet(Deposit)}
                    className="bg-white py-1 px-2 text-xs border border-white 
                     text-black
                      rounded-lg transition duration-300 shadow-sm"
                  >
                    Deposit
                  </button>
                </div>
              )}
              {/* <MdOutlineLanguage size={20} /> */}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
