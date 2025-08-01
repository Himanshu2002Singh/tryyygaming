import React from "react";
import TabItem from "./TabItems";

const allTabs = [
  { key: "wallet", title: "Deposit Request" },
  { key: "withdraw", title: "Withdraw Request" },
  { key: "siterequest", title: "Site request" },
  { key: "sitedeposite", title: "Site Deposite" },
  { key: "sitewithdraw", title: "Site Withdraw Request" },
  // If you want to add others later like monitoring, suspicious etc.
];

function MainTabs({ activeTab, onTabChange, tabsToShow }) {
  const tabs = tabsToShow
    ? allTabs.filter((tab) => tabsToShow.includes(tab.key))
    : allTabs;

  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <TabItem
          key={tab.key}
          title={tab.title}
          isActive={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
        />
      ))}
    </div>
  );
}

export default MainTabs;
