"use client";
import React, { useState } from "react";
import Link from "next/link";
import { TbBrandInertia } from "react-icons/tb";
import { Drawer } from "vaul";
import { IoIosCloseCircle } from "react-icons/io";
// import Siterequest from "../components/site-request/siterequest";
import { MdAddPhotoAlternate } from "react-icons/md";
import { PiHandWithdraw } from "react-icons/pi";
import { usePermission } from "../hooks/usepermission";

const Sidebar = () => {
  const { hasPermission } = usePermission();
  const [isOpen, setIsOpen] = useState(true);
  const [openvaul, setOpenvaul] = useState(false);
  const [openvaulPosters, setOpenvaulPosters] = useState(false);
  const [openvaulSiteRequests, setOpenvaulSiteRequests] = useState(false);
  const [openvaulWithdraw, setOpenvaulWithdraw] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    if (window.innerWidth <= 768) {
      // Adjust breakpoint as needed
      toggleSidebar();
    }
  };

  // Define menu items with permission requirements
  const menuItems = [
    {
      icon: <DashboardIcon />,
      label: "Payment Request",
      url: "/admin/payment/dashboard",
      permission: "view_dashboard",
    },
    {
      icon: <PiHandWithdraw />,
      label: "Withdrawal Request",
      url: "/admin/payment/dashboard",
      permission: "manage_users",
      isDrawer: true,
      drawerAction: () => setOpenvaulWithdraw(true),
    },
    {
      icon: <TbBrandInertia />,
      label: "Add Banner",
      url: "/admin/payment/dashboard",
      permission: "manage_users",
      isDrawer: true,
      drawerAction: () => setOpenvaul(true),
    },
    {
      icon: <TbBrandInertia />,
      label: "Add Posters",
      url: "/admin/payment/dashboard",
      permission: "manage_users",
      isDrawer: true,
      drawerAction: () => setOpenvaulPosters(true),
    },
    {
      icon: <DashboardIcon />,
      label: "Add panels",
      url: "/admin/panels/createpanel",
      permission: "manage_users",
    },
    {
      icon: <UsersIcon />,
      label: "Users",
      url: "/admin/users",
      permission: "view_admins",
    },
    {
      icon: <UsersIcon />,
      label: "Site Request",
      url: "/admin/payment/dashboard",
      permission: "manage_users",
      isDrawer: true,
      drawerAction: () => setOpenvaulSiteRequests(true),
    },
    {
      icon: <MdAddPhotoAlternate />,
      label: "Add Employee",
      url: "/admin/employees",
      permission: "manage_admins",
    },
  ];

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter((item) =>
    hasPermission(item.permission)
  );

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 z-50 p-2 rounded-md bg-[var(--color-secondary)] text-white"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-40"
          onClick={handleClick}
          onTouchStart={handleClick} // Ensure it works on mobile touch
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-neutral-800 text-white w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Header */}
          <div className="flex items-center justify-center p-4 border-b border-neutral-700">
            <img src="/logo-gs.png" alt="Logo" className="h-8 mr-2" />
          </div>

          {/* Menu Items */}
          <div className="flex-grow overflow-y-auto py-4">
            <nav>
              <ul className="space-y-1">
                {filteredMenuItems.map((item, index) => (
                  <li key={index}>
                    {item.isDrawer ? (
                      <div
                        className="flex items-center px-4 py-3 hover:bg-neutral-700 transition-colors duration-200 cursor-pointer"
                        onClick={item.drawerAction}
                      >
                        <div className="mr-3">{item.icon}</div>
                        <span>{item.label}</span>
                      </div>
                    ) : (
                      <Link href={item.url}>
                        <div className="flex items-center px-4 py-3 hover:bg-neutral-700 transition-colors duration-200">
                          <div className="mr-3">{item.icon}</div>
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-700">
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-400">© 2025 Bet Fair</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <Drawer.Root open={openvaul} onOpenChange={setOpenvaul}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="z-[60] bg-black flex flex-col rounded-t-[10px] h-[90%] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-4 bg-black rounded-t-[10px] flex-1 overflow-auto relative">
              {/* Top Bar with Close Button */}
              <div className="flex items-center justify-between w-full mb-4">
                <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300" />
              </div>

              <div className="w-full mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <Drawer.Title className="font-bold text-2xl text-center">
                    Add Banner
                  </Drawer.Title>
                  <button
                    onClick={() => setOpenvaul(false)}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                  >
                    <IoIosCloseCircle className="w-6 h-6 text-white" />
                  </button>
                </div>
                {/* <Banner /> */}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Drawer.Root open={openvaulPosters} onOpenChange={setOpenvaulPosters}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="z-[60] bg-black flex flex-col rounded-t-[10px] h-[90%] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-4 bg-black rounded-t-[10px] flex-1 overflow-auto relative">
              {/* Top Bar with Close Button */}
              <div className="flex items-center justify-between w-full mb-4">
                <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300" />
              </div>

              <div className="w-full mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <Drawer.Title className="font-bold text-2xl text-center">
                    Add Banner
                  </Drawer.Title>
                  <button
                    onClick={() => setOpenvaulPosters(false)}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                  >
                    <IoIosCloseCircle className="w-6 h-6 text-white" />
                  </button>
                </div>
                {/* <Posters /> */}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Drawer.Root
        open={openvaulSiteRequests}
        onOpenChange={setOpenvaulSiteRequests}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="z-[60] bg-black flex flex-col rounded-t-[10px] h-[90%] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-4 bg-black rounded-t-[10px] flex-1 overflow-auto relative">
              {/* Top Bar with Close Button */}
              <div className="flex items-center justify-between w-full mb-4">
                <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300" />
              </div>

              <div className="w-full mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <Drawer.Title className="font-bold text-2xl text-center">
                    Site Requests
                  </Drawer.Title>
                  <button
                    onClick={() => setOpenvaulSiteRequests(false)}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                  >
                    <IoIosCloseCircle className="w-6 h-6 text-white" />
                  </button>
                </div>
                {/* <Siterequest /> */}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* New Withdraw Drawer */}
      <Drawer.Root open={openvaulWithdraw} onOpenChange={setOpenvaulWithdraw}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="z-[60] bg-black flex flex-col rounded-t-[10px] h-[90%] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-4 bg-black rounded-t-[10px] flex-1 overflow-auto relative">
              {/* Top Bar with Close Button */}
              <div className="flex items-center justify-between w-full mb-4">
                <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300" />
              </div>

              <div className="w-full mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <Drawer.Title className="font-bold text-2xl text-center">
                    Withdraw Requests
                  </Drawer.Title>
                  <button
                    onClick={() => setOpenvaulWithdraw(false)}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                  >
                    <IoIosCloseCircle className="w-6 h-6 text-white" />
                  </button>
                </div>
                {/* <Withdraw /> */}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};

// Reuse icon components from your existing code
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
  </svg>
);

export default Sidebar;
