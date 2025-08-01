import React from "react";
import { FaCheckCircle, FaTimesCircle, FaUniversity } from "react-icons/fa";

export default function UserInfoModal({ onClose, user }) {
  // No need to check for isOpen since the parent BottomSheet handles visibility
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="w-full  pb-3 overflow-x-hidden overflow-y-auto bg-[#393939]">
      {/* Fixed header */}
      <div className="bg-[#171717] rounded-t-lg text-white text-center p-3 text-sm">
        User Information
      </div>

      {/* Scrollable content */}
      <div className="  flex-1 overflow-y-auto p-4 bg-[#393939]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-400 text-sm">User ID</h3>
              <p className="text-white font-medium break-all whitespace-normal">
                {user.id || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-gray-400 text-sm">Name</h3>
              <p className="text-white font-medium break-all whitespace-normal">
                {user.name || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-gray-400 text-sm">Phone</h3>

              <div className="flex items-center ">
                <p className="text-white font-medium break-all whitespace-normal">
                  {user.phone || "N/A"}
                </p>
                <img
                  src="/whatsapp-icon.png"
                  onClick={() => {
                    window.open(`https://wa.me/${user.phone}`, "_blank");
                  }}
                  className="w-5 h-5 ml-2 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <h3 className="text-gray-400 text-sm">Email</h3>
              <p className="text-white font-medium break-all whitespace-normal">
                {user.email || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-gray-400 text-sm">Alternate Number</h3>
              <p className="text-white font-medium break-all whitespace-normal">
                {user.alternateNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-gray-400 text-sm">Balance</h3>
              <p className="text-white font-medium break-all whitespace-normal">
                {user.points}
              </p>
            </div>

            <div>
              <h3 className="text-gray-400 text-sm">Credit</h3>
              <p className="text-white font-medium break-all whitespace-normal">
                {user.credit}
              </p>
            </div>

            <div>
              <h3 className="text-gray-400 text-sm">Exposure</h3>
              <p className="text-white font-medium break-all whitespace-normal">
                {user.expense}
              </p>
            </div>

            <div>
              <h3 className="text-gray-400 text-sm">Status</h3>
              <p
                className={`font-medium ${
                  user.isActive ? "text-green-400" : "text-red-400"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </p>
            </div>

            <div>
              <h3 className="text-gray-400 text-sm">Last Login</h3>
              <p className="text-white font-medium break-all whitespace-normal">
                {formatDate(user.lastLogin)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-gray-400 text-sm">Email Verified</h3>
            <div className="flex items-center mt-1">
              {user.emailverified ? (
                <FaCheckCircle className="text-green-400 mr-2" />
              ) : (
                <FaTimesCircle className="text-red-400 mr-2" />
              )}
              <span className="text-white">
                {user.emailverified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-gray-400 text-sm">Alternate Number Verified</h3>
            <div className="flex items-center mt-1">
              {user.alternateNumberverified ? (
                <FaCheckCircle className="text-green-400 mr-2" />
              ) : (
                <FaTimesCircle className="text-red-400 mr-2" />
              )}
              <span className="text-white">
                {user.alternateNumberverified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-gray-400 text-sm">Account Created</h3>
            <p className="text-white font-medium">
              {formatDate(user.createdAt)}
            </p>
          </div>

          <div>
            <h3 className="text-gray-400 text-sm">Last Updated</h3>
            <p className="text-white font-medium">
              {formatDate(user.updatedAt)}
            </p>
          </div>
        </div>

        {/* Enhanced Bank Accounts Section */}
        <div className="mt-6 mb-4">
          <div className="flex items-center mb-3">
            <FaUniversity className="text-blue-400 mr-2" />
            <h2 className="text-white font-semibold">Bank Accounts</h2>
          </div>

          {user.bankAccounts && user.bankAccounts.length > 0 ? (
            <div className="space-y-4">
              {user.bankAccounts.map((bank, index) => (
                <div
                  key={bank.id || index}
                  className="bg-[#2a2a2a] rounded-lg p-3 border border-gray-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-blue-300 font-medium">
                      {bank.bankName}
                    </h3>
                    <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded-md text-xs">
                      {index === 0 ? "Primary" : `Account ${index + 1}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-400 text-xs">Account Holder</p>
                      <p className="text-white text-sm">
                        {bank.useraccountHolderName}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs">Account Number</p>
                      <p className="text-white text-sm">{bank.useraccountNo}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs">IFSC Code</p>
                      <p className="text-white text-sm">{bank.userifscCode}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs">Location</p>
                      <p className="text-white text-sm">
                        {bank.city}, {bank.state}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
              <p className="text-gray-400">No bank accounts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
