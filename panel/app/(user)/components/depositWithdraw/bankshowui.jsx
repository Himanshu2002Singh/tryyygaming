import React, { useState, useEffect } from "react";
import { useUserBank } from "../../context/userbankprovider";

const BankingInfoUI = ({ selectedBankId, setSelectedBankId }) => {
  const { activeBanks, loading } = useUserBank();
  const [selectedBank, setSelectedBank] = useState(null);

  // Set the first bank as selected by default when banks are loaded
  useEffect(() => {
    if (activeBanks && activeBanks.length > 0) {
      setSelectedBankId(activeBanks[0].id);
      setSelectedBank(activeBanks[0]);
    }
  }, [activeBanks]);

  // Update selected bank when selectedBankId changes
  useEffect(() => {
    if (selectedBankId && activeBanks) {
      const bank = activeBanks.find((bank) => bank.id === selectedBankId);
      if (bank) {
        setSelectedBank(bank);
      }
    }
  }, [selectedBankId, activeBanks]);

  const handleBankSelect = (e) => {
    setSelectedBankId(e.target.value);
  };

  if (loading) {
    return (
      <div className="bg-black text-white p-4 rounded-md">
        <div className="text-center py-4">Loading bank details...</div>
      </div>
    );
  }

  if (!activeBanks || activeBanks.length === 0) {
    return (
      <div className="bg-[#1E1E1E] text-white p-4 rounded-md">
        <div className="text-center py-4">
          No bank accounts found. Please add a bank account.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E1E1E] text-white p-4 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <label className="text-gray-300 text-xs">Preferred Bank</label>
        <div className="relative w-64 ml-auto">
          <select
            className="w-full text-xs rounded-lg font-bold bg-[#1E1E1E] border border-white py-1 px-2 pr-8 appearance-none text-white"
            value={selectedBankId}
            onChange={handleBankSelect}
          >
            {activeBanks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.bankName || bank.useraccountHolderName}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {selectedBank && (
        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-xs">Account Holder</span>
            <span className="text-right  text-xs text-white px-2 py-0 rounded">
              {selectedBank.useraccountHolderName}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-xs">Account number</span>
            <span className="text-right text-xs text-white px-2 py-0 rounded">
              {selectedBank.useraccountNo}
              {/* Show only last 4 digits for security */}
              {/* {"X".repeat(Math.max(0, selectedBank.useraccountNo.length - 4)) +
                selectedBank.useraccountNo.slice(-4)} */}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-xs">IFSC</span>
            <span className="text-right text-xs text-white px-2 py-0 rounded">
              {selectedBank.userifscCode}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white text-xs">Bank Name</span>
            <span className="text-right text-xs text-white px-2 py-0 rounded">
              {selectedBank.bankName || "Not specified"}
            </span>
          </div>

          {selectedBank.branchName && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-300">Branch</span>
              <span className="text-right">{selectedBank.branchName}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BankingInfoUI;
