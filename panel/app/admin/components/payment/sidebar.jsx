"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import menuItems from "./menulistsidebar";
import { BsArrowLeft } from "react-icons/bs";
import { AdminAuthContext } from "../../context/adminAuthcontext";
import { usePermission } from "../../hooks/usepermission";

const AdminPaymentsidebar = ({ isOpen, toggleSidebar }) => {
  const { hasPermission } = usePermission();
  const { user, Logout } = useContext(AdminAuthContext);
  const filteredMenuItems = menuItems.filter(
    (item) =>
      // If no permission is specified, show the item
      !item.permission ||
      // Check if user has the required permission
      (user?.permissions || []).includes(item.permission)
  );
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-gray-950 text-white shadow-sm flex flex-col items-center py-4 transition-all duration-300 ease-in-out overflow-y-auto
          ${isOpen ? "w-24 translate-x-0" : "w-24 -translate-x-full"}
          md:translate-x-0 md:relative md:w-24`}
      >
        <div className="h-14 md:h-0" />{" "}
        {/* Spacer for mobile to avoid overlap with toggle button */}
        <div className="flex flex-col items-center w-full overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.route;
            return (
              <Link
                key={item.name}
                href={item.route}
                className="w-full"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
              >
                <div
                  className={`flex flex-col items-center mb-6 cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "text-white border-l-3 border-[var(--color-primary)] p-2 rounded-lg"
                      : "text-gray-400 hover:text-[var(--color-primary)]"
                  }`}
                >
                  <div className="p-3 rounded-lg mb-1">{item.icon}</div>
                  <span className="text-xs mt-1 text-center">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
        {/* Logout Button */}
        <div
          onClick={Logout}
          className="relative mt-auto mb-3 flex flex-col items-center text-gray-500 cursor-pointer hover:text-red-600"
        >
          <div className="p-3 rounded-lg mb-1">
            <BsArrowLeft className="text-red-400" size={24} />
          </div>
          <span className="text-xs mt-1 text-red-400">Logout</span>
        </div>
      </aside>
    </>
  );
};

export default AdminPaymentsidebar;
