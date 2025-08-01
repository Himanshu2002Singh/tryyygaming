import API_URL from "@/config";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FaRegCopy, FaSearch } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

const MyPanelsContent = () => {
  const router = useRouter();

  const [myPanels, setMyPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPanels, setFilteredPanels] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open by panel ID
  const menuRefs = useRef({}); // Object to store refs for each panel's menu

  const toggleMenu = (panelId) => {
    setOpenMenuId(openMenuId === panelId ? null : panelId);
  };

  const handlewithdrawclick = (purchase) => {
    console.log("withdraw clicked");
    if (purchase?.rateType !== "purchase") {
      router.push(`/panel/panel-withdraw?panelId=${purchase?.id}`);
    }
  };

  const handledepositeclick = (purchase) => {
    console.log("deposite clicked");
    router.push(`/panel/panel-deposite?panelId=${purchase?.id}`);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click was outside all menu containers
      let clickedInsideAnyMenu = false;
      Object.values(menuRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          clickedInsideAnyMenu = true;
        }
      });

      if (!clickedInsideAnyMenu) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchMyPanels();
  }, []);

  useEffect(() => {
    if (myPanels.length > 0) {
      filterMyPanels();
    }
  }, [searchTerm, myPanels]);

  const fetchMyPanels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/userpanel/my-panel-purchases`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMyPanels(response.data.data || []);
      setFilteredPanels(response.data.data || []);
    } catch (error) {
      console.error("Error fetching my panels:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMyPanels = () => {
    if (!searchTerm) {
      setFilteredPanels(myPanels);
      return;
    }

    const filtered = myPanels.filter(
      (panel) =>
        panel.panelDetails?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        panel.panelDetails?.website
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredPanels(filtered);
  };

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      // You could add a toast notification here
    }
  };

  return (
    <>
      {/* Search Bar for My Panels */}
      <div className="p-3 bg-[#171717]">
        <div className="rounded-xl flex items-center border-4 border-[var(--color-secondary)] bg-[var(--color-secondary)] px-2 py-0.5">
          <div className="relative flex items-center w-full">
            <FaSearch className="absolute left-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search my IDs..."
              className="bg-[#171717] text-white pl-10 pr-2 py-2 rounded-md outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* My Panels List */}
      <div className="my-3">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : filteredPanels.length > 0 ? (
          filteredPanels
            .filter((purchase) => purchase.status === "completed")
            .map((purchase, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[var(--color-secondary)] rounded-lg px-2 mb-2"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center overflow-hidden">
                    {purchase.panelDetails?.logo ? (
                      <img
                        src={purchase.panelDetails.logo}
                        alt={purchase.loginurl}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="font-bold text-xs text-center">
                        {purchase.Panel?.name?.substring(0, 1) || "P"}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-xs">
                      {purchase?.loginurl || "Panel"}
                    </div>
                    <div className="flex text-[10px] items-center ">
                      {purchase.username || "N/A"}
                    </div>
                  </div>
                </div>
                <div
                  className="relative w-max font-sans p-4"
                  ref={(el) => (menuRefs.current[purchase.id] = el)}
                >
                  <div className="flex items-center space-x-5">
                    <button
                      onClick={() => handledepositeclick(purchase)}
                      className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold"
                    >
                      D
                    </button>
                    <button
                      type="button"
                      onClick={() => handlewithdrawclick(purchase)}
                      disabled={purchase?.rateType === "purchase"}
                      className={`bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                        purchase?.rateType === "purchase"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      W
                    </button>
                    <div className="ml-auto">
                      <button className="text-white focus:outline-none cursor-pointer">
                        <div className="flex flex-col items-center justify-center h-8">
                          <HiDotsVertical
                            onClick={(e) => {
                              e.stopPropagation(); // Stop event from bubbling up
                              toggleMenu(purchase.id);
                            }}
                          />
                        </div>
                      </button>
                    </div>
                  </div>

                  {openMenuId === purchase.id && (
                    <div className="absolute rounded-2xl right-0 w-max bg-black text-gray-300 z-10">
                      <ul className="py-1 text-sm">
                        <li
                          onClick={() => handledepositeclick(purchase)}
                          className="px-4 py-2 cursor-pointer hover:font-bold"
                        >
                          Deposit
                        </li>
                        <li
                          onClick={() => handlewithdrawclick(purchase)}
                          className={`px-4 py-2 cursor-pointer hover:font-bold ${
                            purchase?.rateType === "purchase"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Withdraw
                        </li>
                        <Link
                          href={`/panel/panel-transactions?panelId=${purchase?.id}`}
                        >
                          <li className="px-4 py-2 cursor-pointer hover:font-bold">
                            View Transaction
                          </li>
                        </Link>
                        <a
                          href={
                            purchase?.loginurl?.startsWith("http")
                              ? purchase.loginurl
                              : `https://${purchase?.loginurl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <li className="px-4 py-2 cursor-pointer hover:font-bold">
                            Change Password
                          </li>
                        </a>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className="flex flex-col justify-center items-center h-40">
            <p className="text-gray-400 mb-4">
              You haven't purchased any IDs yet
            </p>
            <button
              onClick={() => router.push("/panel/browse")} // Make sure this path is correct
              className="bg-[var(--color-primary)] hover:bg-yellow-600 text-black text-xs py-2 px-6 rounded-xl"
            >
              Browse IDs
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MyPanelsContent;
