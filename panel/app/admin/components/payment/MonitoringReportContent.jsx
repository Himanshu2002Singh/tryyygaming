import React, { useState } from "react";
import { FaSearch, FaFileAlt, FaFileExcel } from "react-icons/fa";
import DepositeWithdraw from "./depositewithdraw";
import SubMonitoringDashboard from "./SubMonitoringReport";

function MonitoringReportContent() {
  const [activeSubTab, setActiveSubTab] = useState("monitoring");

  const handleSubTabChange = (tab) => {
    setActiveSubTab(tab);
  };

  return (
    <div className="space-y-4">
      {/* Sub-tabs navigation */}
      <div className="flex border-b">
        <SubTabItem
          title="Monitoring Report"
          isActive={activeSubTab === "monitoring"}
          onClick={() => handleSubTabChange("monitoring")}
        />
        <SubTabItem
          title="Deposite and Withdraw Reports"
          isActive={activeSubTab === "deposite"}
          onClick={() => handleSubTabChange("deposite")}
        />
        <SubTabItem
          title="Bank Account total amount"
          isActive={activeSubTab === "amount"}
          onClick={() => handleSubTabChange("amount")}
        />
      </div>

      {/* Content for the selected sub-tab */}
      <div className="mt-4">
        {activeSubTab === "monitoring" && <SubMonitoringDashboard />}
        {activeSubTab === "deposite" && <DepositeWithdraw />}
        {activeSubTab === "amount" && <MonthlyReportContent />}
      </div>
    </div>
  );
}

function SubTabItem({ title, isActive, onClick }) {
  return (
    <button
      className={`sm:px-4 py-2 text-xs sm:text-base font-medium ${
        isActive
          ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
          : "text-white"
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

function WeeklyReportContent() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">Week Selection</span>
          <select className="border rounded-md px-3 py-2">
            <option>Current Week</option>
            <option>Last Week</option>
            <option>Two Weeks Ago</option>
          </select>
        </div>

        <div className="flex items-center ml-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Generate Report
          </button>
        </div>

        <div className="flex ml-auto">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <FaFileAlt size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <FaFileExcel size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Week
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Total Transactions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Success Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Platform Fee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Net Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="px-4 py-4 text-center">
                No record found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MonthlyReportContent() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">Month</span>
          <select className="border rounded-md px-3 py-2">
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
        </div>

        <div className="flex items-center ml-2">
          <span className="text-gray-500 mr-2">Year</span>
          <select className="border rounded-md px-3 py-2">
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>

        <div className="flex items-center ml-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Generate Report
          </button>
        </div>

        <div className="flex ml-auto">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <FaFileAlt size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <FaFileExcel size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Month
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Total Transactions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Success Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Platform Fee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Net Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="px-4 py-4 text-center">
                No record found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MonitoringReportContent;
