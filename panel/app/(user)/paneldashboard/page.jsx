"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import axios from "axios";
import API_URL from "@/config";
import MyPanelsContent from "../components/PanelCreateLine/mypanel";
import { IoIosAddCircle } from "react-icons/io";
import { FaTrophy } from "react-icons/fa";

// Set the base URL for API requests

const ExchangePanelsUI = () => {
  const [activeTab, setActiveTab] = useState("CREATE ID");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All Site");
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPanels, setFilteredPanels] = useState([]);
  const [paneltype, setPanelType] = useState();
  const [options, setOptions] = useState([]);
  useEffect(() => {
    fetchPanels();
  }, []);
  function normalizeUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  }

  useEffect(() => {
    if (panels.length > 0) {
      filterPanels();
    }
  }, [searchTerm, selectedOption, panels, , paneltype]);

  const fetchPanels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/panels`);
      setPanels(response.data.data);
      setFilteredPanels(response.data.data);
      setOptions(["All Site", ...response.data.allcategories]);
    } catch (error) {
      console.error("Error fetching panels:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPanels = () => {
    let filtered = [...panels];

    // Filter by search term

    if (paneltype) {
      filtered = filtered.filter((panel) =>
        panel?.panelType?.toLowerCase().includes(paneltype.toLowerCase())
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (panel) =>
          panel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          panel?.website?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected option (if not "All Site")
    if (selectedOption && selectedOption !== "All Site") {
      // This is a placeholder - you'll need to adjust based on how you categorize panels
      const typeKeyword = selectedOption.split(" ")[0].toLowerCase();
      filtered = filtered.filter((panel) =>
        panel?.category?.toLowerCase().includes(typeKeyword)
      );
    }

    setFilteredPanels(filtered);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="text-sm flex flex-col h-screen bg-[var(--color-secondary)] text-white">
      {/* Header Tabs */}
      <div className="flex border-b border-gray-800">
        <div
          className={`w-1/2 text-xs text-center border-r-3 border-r-black py-3 cursor-pointer ${
            activeTab === "MY IDs"
              ? "border-b-2 border-[var(--color-primary)]"
              : ""
          }`}
          onClick={() => setActiveTab("MY IDs")}
        >
          MY IDs
        </div>
        <div
          className={`w-1/2 text-xs text-center py-3 cursor-pointer ${
            activeTab === "CREATE ID"
              ? "border-b-2 border-[var(--color-primary)]"
              : ""
          }`}
          onClick={() => setActiveTab("CREATE ID")}
        >
          CREATE ID
        </div>
      </div>

      {/* Search Bar */}
      {activeTab == "MY IDs" ? (
        <div className="flex-1 bg-[#171717] overflow-y-auto px-3 pb-4 mb-24">
          <MyPanelsContent />
        </div>
      ) : (
        <>
          {/* <div className="flex w-full items-center justify-center gap-x-3 px-5">
            <button
              onClick={() => setPanelType(paneltype === "B2B" ? "" : "B2B")}
              className={`flex-1 justify-center items-center ${
                paneltype === "B2B"
                  ? "bg-[var(--color-primary)] text-black"
                  : "bg-[#171717] text-white"
              } my-3 p-2 rounded-xl`}
            >
              <div className="flex items-center gap-2 justify-center py-1">
                <h3 className="text-sm">B2B</h3>
              </div>
            </button>
            <button
              onClick={() => setPanelType(paneltype === "B2C" ? "" : "B2C")}
              className={`flex-1 justify-center items-center ${
                paneltype === "B2C"
                  ? "bg-[var(--color-primary)] text-black"
                  : "bg-[#171717] text-white"
              } my-3 p-2 rounded-xl`}
            >
              <div className="flex items-center justify-center gap-2 py-1">
                <h3 className="text-sm">B2C</h3>
              </div>
            </button>
          </div> */}

          {/* {paneltype && (
            <h2 className="px-3 py-1">
              Showing results for {paneltype}.{" "}
              <span
                onClick={() => setPanelType()}
                className="text-red-600 hover:cursor-pointer"
              >
                Reset
              </span>
            </h2>
          )} */}
          <div className="p-3 bg-[#171717]">
            <div className="rounded-xl flex items-center border-4 border-[var(--color-secondary)] bg-[var(--color-secondary)] px-2 py-0.5">
              <div className="relative flex items-center w-full">
                <FaSearch className="absolute left-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-[#171717] text-white pl-10 pr-2 py-2 rounded-md outline-none w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Dropdown Trigger Button */}
              <div className="bg-[var(--color-secondary)] relative">
                <button
                  onClick={toggleDropdown}
                  className="flex text-xs items-center justify-between text-white px-4 py-1 min-w-32"
                >
                  {selectedOption}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 ml-2 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute text-xs right-0 mt-1 w-48 bg-[#171717] text-white shadow-lg z-10 max-h-60 overflow-y-auto">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                        onClick={() => selectOption(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panels List */}
          <div className="flex-1 bg-[#171717] overflow-y-auto px-3 pb-4 mb-24">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
              </div>
            ) : filteredPanels.length > 0 ? (
              filteredPanels.map((panel, index) => (
                <div
                  key={panel.id}
                  className="flex items-center justify-between bg-[var(--color-secondary)] rounded-lg p-2 mb-2"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center overflow-hidden">
                      {panel.logo ? (
                        <img
                          src={panel.logo}
                          alt={panel.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="font-bold text-xs text-center">
                          {panel.name.substring(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="">{panel.name}</div>
                      <div className="flex text-xs items-center text-gray-400">
  {panel.website.replace(/^https?:\/\//, '')}

                        {/* <FaRegCopy
                          size={14}
                          className="ml-1 cursor-pointer"
                          onClick={() => copyToClipboard(panel.website)}
                        /> */}
                      </div>
                      {/* {index < 4 && (
                        <div className="flex items-center gap-x-2 my-1">
                          <FaTrophy className="text-yellow-400" size={20} />
                          <span
                            className="font-bold text-[10px] text-yellow-400 uppercase border border-yellow-400 rounded-md px-2 flex items-center justify-center bg-transparent"
                            style={{
                              paddingTop: "0.2rem",
                              paddingBottom: "0rem",
                            }}
                          >
                            Trending
                          </span>
                        </div>
                      )} */}

                      {/* <div className="text-xs text-yellow-500">
                        Starting INR {panel.purchaserate * 100}
                      </div> */}
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <a
                      href={normalizeUrl(panel.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="bg-transparent border border-[var(--color-primary)] hover:bg-yellow-300 hover:text-black text-white text-xs py-1 px-3 sm:py-2 sm:px-6 rounded-xl">
                        Demo
                      </button>
                    </a>

                    <Link href={`paneldashboard/create/${panel.id}`}>
                      <button className="bg-[var(--color-primary)] hover:bg-yellow-300 text-black text-xs py-1 px-3 sm:py-2 sm:px-6 rounded-xl">
                        Create
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-400">No ID found</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExchangePanelsUI;
