"use client";
import { useState } from "react";
import AdminPaymentheader from "../components/payment/header";
import AdminPaymentsidebar from "../components/payment/sidebar";

export default function AdminPaymentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminPaymentheader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block h-full overflow-y-auto z-40`}
        >
          <AdminPaymentsidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Overlay that closes sidebar when clicked - mobile only */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        <main className="flex-1 overflow-y-auto bg-[#D9D9D9] text-black">{children}</main>
      </div>
    </div>
  );
}
