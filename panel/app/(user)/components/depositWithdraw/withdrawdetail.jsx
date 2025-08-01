import React from "react";

const Withdrawdetail = () => {
  const [activeTab, setActiveTab] = useState("ACTIVE BANKS");
  const tabs = ["ACTIVE BANKS", "DELETED", "HISTORY"];
  const phoneNumber = "+91-8382835630";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Tabs Navigation */}
      <div className="flex justify-between border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-4 px-6 font-medium ${
              activeTab === tab ? "border-b-4 border-yellow-400" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4">
        {/* Phone Number with Flag */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4 flex items-center justify-center">
          <div className="flex items-center">
            <div className="mr-2">
              <img
                src="/api/placeholder/24/16"
                alt="India Flag"
                className="rounded-sm"
              />
            </div>
            <div className="text-white text-lg">{phoneNumber}</div>
          </div>
        </div>

        {/* Add New Bank Button */}
        <button className="w-full bg-yellow-400 text-black font-medium py-4 rounded-lg mb-4">
          Add New Bank
        </button>

        {/* No Bank Details Message */}
        <div className="text-gray-400 text-sm text-center">
          No Bank Details found! Adding Bank Details is mandatory for processing
          withdrawals
        </div>
      </div>
    </div>
  );
};

export default Withdrawdetail;
