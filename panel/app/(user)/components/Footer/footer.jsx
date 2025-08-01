"use client";
import { FaHome } from "react-icons/fa";
import { MdOutlineCasino, MdSportsCricket, MdFileOpen } from "react-icons/md";
import { BsCart, BsWhatsapp } from "react-icons/bs";
import Link from "next/link";
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "../../context/authprovider";
import { RiCustomerService2Fill } from "react-icons/ri";
import Image from "next/image";

const BottomNavBar = () => {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState(null);

  // Define responsive icon sizes
  const getIconSize = () => {
    return { default: 24, mobile: 20 };
  };

  const iconSizes = getIconSize();

  const baseNavItems = [
    {
      id: "home",
      label: "Home",
      icon: (size) => <FaHome size={size} />,
      navigateto: "/",
      useCustomImage: false,
    },
    {
      id: "sports",
      label: "Sports",
      icon: (size) => <MdSportsCricket size={size} />,
      navigateto: "/sports",
      useCustomImage: false,
    },
    {
      id: "Casino",
      label: "Casino",
      icon: (size) => (
        <div className="relative w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]">
          <Image
            src="/casino_icon.png"
            alt="Casino"
            fill
            className="object-contain"
          />
        </div>
      ),
      navigateto: "/comingsoon",
      useCustomImage: true,
    },
    {
      id: "Panels",
      label: "Panels",
      icon: (size) => (
        <div className="relative w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]">
          <Image
            src="/panel_image.png"
            alt="Panels"
            fill
            className="object-contain"
          />
        </div>
      ),
      navigateto: "/paneldashboard",
      useCustomImage: true,
    },
    {
      id: "Whatsapp",
      label: "Help",
      icon: (size) => <RiCustomerService2Fill size={size} />,
      navigateto: "/helpsupport",
      useCustomImage: false,
    },
  ];

  const navItems = user ? [...baseNavItems] : baseNavItems;

  // Function to check if a navigation item should be selected based on the current path
  const isSelected = (itemPath) => {
    // Exact match for home page
    if (itemPath === "/" && pathname === "/") {
      return true;
    }
    // For other pages, check if the current path starts with the navigation item path
    // This handles sub-routes (e.g., /paneldashboard/settings would still highlight Panels)
    return itemPath !== "/" && pathname.startsWith(itemPath);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 pointer-events-none">
      <div className="relative flex justify-center w-full items-end pointer-events-auto overflow-visible">
        {/* Functional container for navigation (NOT clipped) */}
        <div className="relative w-full md:w-[50%] flex justify-center items-end overflow-visible z-10">
          <div className="flex bg-[#111111] justify-around items-center w-full px-2 py-2">
            {navItems.map((item) => (
              <Link key={item.id} href={item.navigateto} className="flex-1">
                <div
                  className="flex items-center justify-center"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div
                    className={`flex items-center transition-all duration-300 rounded-full ${
                      isSelected(item.navigateto)
                        ? "bg-[var(--color-primary)] shadow-md px-3 py-2"
                        : hoveredItem === item.id
                        ? "opacity-80"
                        : "opacity-60 p-2"
                    }`}
                  >
                    <div
                      className={`flex justify-center items-center ${
                        isSelected(item.navigateto)
                          ? "text-black"
                          : "text-gray-500"
                      }`}
                    >
                      {item.useCustomImage ? (
                        item.icon()
                      ) : (
                        <>
                          <div className="block sm:hidden">
                            {item.icon(iconSizes.mobile)}
                          </div>
                          <div className="hidden sm:block">
                            {item.icon(iconSizes.default)}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Only show label for selected item */}
                    {isSelected(item.navigateto) && (
                      <span className="ml-2 text-sm font-medium text-black">
                        {item.label}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;
