"use client";
import Link from "next/link";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import axios from "axios";
import API_URL from "@/config";
import MyPanelsContent from "../components/PanelCreateLine/mypanel";
import { IoIosAddCircle } from "react-icons/io";

const ExchangePanelsUI = () => {
  const [activeTab, setActiveTab] = useState("CREATE PANEL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All Site");
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPanels, setFilteredPanels] = useState([]);
  const [paneltype, setPanelType] = useState("");
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Create refs for current state and DOM elements
  const loadingRef = useRef(false);
  const pageRef = useRef(1);
  const totalPagesRef = useRef(1);
  const panelsRef = useRef([]);
  const sentinelRef = useRef(null); // Reference to the sentinel element for infinite scrolling

  // Update refs when state changes
  useEffect(() => {
    pageRef.current = page;
    totalPagesRef.current = totalPages;
    panelsRef.current = panels;
  }, [page, totalPages, panels]);

  // Fetch panels when component mounts or when search/filter changes
  useEffect(() => {
    console.log("Search or panel type changed - resetting data");
    setPanels([]);
    setPage(1);
    pageRef.current = 1;
    setTotalPages(1);
    totalPagesRef.current = 1;
    setHasMore(true);
    fetchPanels(true);
  }, [searchTerm, paneltype]);

  // Filter panels when panels array or filters change
  useEffect(() => {
    if (panels.length > 0) {
      filterPanels();
    }
  }, [searchTerm, selectedOption, panels, paneltype]);

  const fetchPanels = useCallback(
    async (resetData = false) => {
      // Check if we're at the last page or already loading
      if (loadingRef.current || pageRef.current > totalPagesRef.current) {
        console.log(
          `Skipping fetch - Loading: ${loadingRef.current}, Page: ${pageRef.current}, Total: ${totalPagesRef.current}`
        );
        return;
      }

      // Get correct page to fetch
      const currentPage = resetData ? 1 : pageRef.current;

      // Set loading flags
      setLoading(true);
      loadingRef.current = true;

      console.log(
        `🔄 Fetching page ${currentPage} with search: "${searchTerm}", panel type: "${paneltype}"`
      );

      try {
        const response = await axios.get(`${API_URL}/admin/panels`, {
          params: {
            page: currentPage,
            limit: 10,
            search: searchTerm,
            paneltype: paneltype,
          },
        });

        // Extract data from response
        const newPanels = response.data.data;
        const apiTotalPages = response.data.totalPages || 1;

        console.log(
          `✅ Received ${newPanels.length} panels from API. Total pages: ${apiTotalPages}`
        );

        // Update total pages
        setTotalPages(apiTotalPages);
        totalPagesRef.current = apiTotalPages;

        // Set hasMore flag based on whether we've reached the last page
        const isLastPage = currentPage >= apiTotalPages;
        setHasMore(!isLastPage);

        // Update panels state
        setPanels((prevPanels) => {
          const updatedPanels = resetData
            ? newPanels
            : [...prevPanels, ...newPanels];
          console.log(
            `📊 Panel count: ${updatedPanels.length} (${
              resetData ? "reset" : "appended"
            })`
          );
          return updatedPanels;
        });

        // Update page for next fetch
        if (!resetData) {
          setPage((prev) => prev + 1);
          pageRef.current += 1;
        } else {
          setPage(2);
          pageRef.current = 2;
        }

        console.log(`📝 Next page will be: ${pageRef.current}`);
      } catch (error) {
        console.error("❌ Error fetching panels:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [searchTerm, paneltype]
  );

  // Set up infinite scrolling with Intersection Observer
  useEffect(() => {
    // Only set up observer if we're on the CREATE PANEL tab
    if (activeTab !== "CREATE PANEL") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // Check if sentinel is visible and we should load more data
        if (
          entry.isIntersecting &&
          !loadingRef.current &&
          hasMore &&
          pageRef.current <= totalPagesRef.current
        ) {
          console.log("🔎 Sentinel is visible - loading more data");
          fetchPanels(false);
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: "0px 0px 300px 0px", // Trigger 300px before sentinel becomes visible
        threshold: 0.1, // Trigger when 10% of sentinel is visible
      }
    );

    // Start observing the sentinel
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
      console.log("👁️ Observing sentinel for visibility");
    }

    // Clean up function
    return () => {
      console.log("🧹 Cleaning up intersection observer");
      observer.disconnect();
    };
  }, [activeTab, fetchPanels, hasMore]);

  // Reset and fetch data when switching to CREATE PANEL tab
  useEffect(() => {
    if (activeTab === "CREATE PANEL") {
      console.log("Switching to CREATE PANEL tab - fetching fresh data");
      setPanels([]);
      setPage(1);
      pageRef.current = 1;
      setHasMore(true);
      fetchPanels(true);
    }
  }, [activeTab]);

  const filterPanels = () => {
    let filtered = [...panels];

    // Filter by panel type
    if (paneltype) {
      filtered = filtered.filter((panel) =>
        panel?.panelType?.toLowerCase().includes(paneltype.toLowerCase())
      );
    }

    // Filter by search term
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
            activeTab === "MY PANELS"
              ? "border-b-2 border-[var(--color-primary)]"
              : ""
          }`}
          onClick={() => setActiveTab("MY PANELS")}
        >
          MY PANELS
        </div>
        <div
          className={`w-1/2 text-xs text-center py-3 cursor-pointer ${
            activeTab === "CREATE PANEL"
              ? "border-b-2 border-[var(--color-primary)]"
              : ""
          }`}
          onClick={() => setActiveTab("CREATE PANEL")}
        >
          CREATE PANEL
        </div>
      </div>

      {activeTab === "MY PANELS" ? (
        <div className="flex-1 bg-[#171717] overflow-y-auto px-3 pb-4 mb-24">
          <MyPanelsContent />
        </div>
      ) : (
        <>
          <div className="flex w-full items-center justify-center gap-x-3 px-5">
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
          </div>

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
          <div className="flex-1 bg-[#171717] overflow-y-auto px-3 pb-24">
            {filteredPanels.length > 0 ? (
              filteredPanels.map((panel, index) => (
                <div
                  key={`${panel.id}-${index}`}
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

                        <FaRegCopy
                          size={14}
                          className="ml-1 cursor-pointer"
                          onClick={() => copyToClipboard(panel.website)}
                        />
                      </div>
                      <div className="text-xs text-yellow-500">
                        Starting INR {panel.purchaserate * 100} %
                      </div>
                    </div>
                  </div>
                  <Link href={`paneldashboard/create/${panel.id}`}>
                    <button className="bg-[var(--color-primary)] hover:bg-yellow-300 text-black text-xs py-2 px-6 rounded-xl">
                      Create
                    </button>
                  </Link>
                </div>
              ))
            ) : !loading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-400">No panels found</p>
              </div>
            ) : null}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
              </div>
            )}

            {/* Sentinel element for infinite scroll */}
            <div
              ref={sentinelRef}
              className="h-4 w-full"
              aria-hidden="true"
            ></div>

            {/* End of results message */}
            {!hasMore && panels.length > 0 && (
              <div className="text-center text-gray-500 py-4">
                No more panels to load
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExchangePanelsUI;
