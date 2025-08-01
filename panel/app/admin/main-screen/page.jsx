"use client";
import Link from "next/link";
import React, { useContext } from "react";
import Sidebar from "./sidebar";
import { AdminAuthContext } from "../context/adminAuthcontext";

const AdminMainScreen = () => {
  const { user } = useContext(AdminAuthContext);

  return (
    <div className="bg-neutral-900 min-h-screen flex">
      {/* Sidebar */}
      <div className="">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="w-full flex flex-col items-center py-4 mt-8">
          <img src="/logo-gs.png" alt="Logo" className="h-8" />
        </div>

        {/* Content Container */}
        <div className="max-w-3xl mx-auto px-4 pb-8">
          {/* Date Card */}
          <div className="w-full border border-gray-100 bg-[var(--color-secondary)] rounded-lg shadow p-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-medium">Today</p>
              <p className="text-sm text-gray-600">Mar 18, 2025, 5:58 PM</p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="w-full border border-gray-100 bg-[var(--color-secondary)] rounded-lg shadow mb-4">
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Deposit</span>
                <span>0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Withdraw</span>
                <span>0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">P/L</span>
                <span>0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Registered Clients</span>
                <span>1</span>
              </div>
            </div>
          </div>

          {/* Grid of Feature Cards */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {/* Row 1 */}
            <FeatureCard
              icon={<DashboardIcon />}
              label="Dashboard"
              url="/admin/payment/dashboard"
            />
            <FeatureCard
              url="/admin/payment/dashboard"
              icon={<UsersIcon />}
              label="My Users"
            />
            <FeatureCard
              url="/admin/payment/dashboard"
              icon={<TransactionsIcon />}
              label="All Transactions"
            />

            {/* Row 2 */}
            <FeatureCard
              url="/admin/payment/dashboard"
              icon={<LeadsIcon />}
              label="Leads"
            />
            <FeatureCard
              url="/admin/payment/dashboard"
              icon={<ReportIcon />}
              label="Sitewise Report"
            />
            <FeatureCard
              url="/admin/payment/dashboard"
              icon={<TeamIcon />}
              label="My Team"
            />

            {/* Row 3 */}
            <FeatureCard
              url="/admin/payment/dashboard"
              icon={<EarningsIcon />}
              label="My Earnings"
            />
            <FeatureCard
              url="/admin/payment/dashboard"
              icon={<ScreenshotsIcon />}
              label="Payout Screenshots"
            />
            <FeatureCard
              url="/admin/payment/dashboard"
              icon={<PostersIcon />}
              label="Promotional Posters"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, label, url }) => {
  return (
    <Link href={url}>
      <div className="border border-gray-100 bg-[var(--color-secondary)] rounded-lg shadow flex flex-col items-center justify-center p-4">
        <div className="mb-2">{icon}</div>
        <div className="text-center text-xs font-medium">{label}</div>
      </div>
    </Link>
  );
};

// Icons Components
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
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
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
  </svg>
);

const TransactionsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
    <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
  </svg>
);

const LeadsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2c-4.97 0-9 4.03-9 9 0 4.17 2.84 7.67 6.69 8.69V22L12 20l2.31 2v-2.31C18.16 18.67 21 15.17 21 11c0-4.97-4.03-9-9-9zm0 16c-1.1 0-2-.9-2-2 0-1.1.9-2 2-2s2 .9 2 2c0 1.1-.9 2-2 2zm0-5c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1z" />
  </svg>
);

const ReportIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
    <path d="M7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
  </svg>
);

const TeamIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <circle cx="9" cy="8" r="2" />
    <path d="M9 12c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" />
    <circle cx="15" cy="8" r="2" />
    <path d="M15 12c-1.67 0-3.14.85-4 2.13.86 1.28 2.33 2.13 4 2.13 1.67 0 3.14-.85 4-2.13-.86-1.28-2.33-2.13-4-2.13z" />
  </svg>
);

const EarningsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z" />
  </svg>
);

const ScreenshotsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z" />
  </svg>
);

const PostersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
  </svg>
);

export default AdminMainScreen;
