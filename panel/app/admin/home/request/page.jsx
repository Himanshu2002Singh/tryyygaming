"use client";
import React, { useState } from "react";
import MainTabs from "../../components/payment/Maintabs";
import WalletRequestsContent from "../../components/payment/WalletRequestsContent";
import MonitoringReportContent from "../../components/payment/MonitoringReportContent";
import SuspiciousAccountContent from "../../components/payment/SuspiciousAccountContent";
import Withdraw from "../(withdraw-request)/page";
import Siterequest from "../../components/site-request/siterequest";
import PanelActionsContent from "../../components/payment/purchasedpaneldeposite";
import PanelActionsContentWithdraw from "../../components/payment/purchasepanelwithdraw";

const RequestPayment = () => {
  const [activeTab, setActiveTab] = useState("wallet");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full bg-black">
      <MainTabs activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="px-6 py-4">
        {activeTab === "wallet" && <WalletRequestsContent />}
        {activeTab === "withdraw" && <Withdraw />}
        {activeTab === "siterequest" && <Siterequest />}

        {/* {activeTab === "bank" && <BankAccountsContent />} */}
        {activeTab === "sitedeposite" && <PanelActionsContent />}
        {activeTab === "sitewithdraw" && <PanelActionsContentWithdraw />}

        {/* {activeTab === "monitoring" && <MonitoringReportContent />}
        {activeTab === "suspicious" && <SuspiciousAccountContent />} */}
      </div>
    </div>
  );
};

export default RequestPayment;
