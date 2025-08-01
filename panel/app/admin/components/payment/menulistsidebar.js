import { BsActivity, BsBank, BsChat, BsGlobe2 } from "react-icons/bs";
import { FaCoins, FaUser } from "react-icons/fa";
import { GiTargetPoster } from "react-icons/gi";
import { MdRequestPage } from "react-icons/md";
import { PiBankDuotone, PiFlagBanner, PiHandWithdraw } from "react-icons/pi";
import { TbWorldWww } from "react-icons/tb";
import { TfiPanel } from "react-icons/tfi";

// Add permission mapping for each menu item
const menuItems = [
  {
    name: "Dashboard",
    route: "/admin/home/dashboard",
    permission: "View Dashboard", // Add corresponding permission
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M20.4 14.5L16 10 4 20" />
      </svg>
    ),
  },
  // {
  //   name: "Request",
  //   route: "/admin/home/request",
  //   permission: "View Employees", // Example permission
  //   icon: (
  //     <svg
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
  //       <circle cx="9" cy="7" r="4" />
  //       <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
  //       <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  //     </svg>
  //   ),
  // },
  {
    name: "Banking Request",
    route: "/admin/home/banking-request",
    permission: "Deposit", // Add corresponding permission
    icon: <PiBankDuotone />,
  },
  {
    name: "Site Panel Request",
    route: "/admin/home/sitepanel-request",
    permission: "View Employees", // Example permission
    icon: <TbWorldWww />,
  },
  {
    name: "Users",
    route: "/admin/home/users",
    permission: "View Users", // Add corresponding permission
    icon: <FaUser />,
  },
  {
    name: "Banks",
    route: "/admin/home/banks",
    permission: "Deposit", // Add corresponding permission
    icon: <BsBank />,
  },
  {
    name: "Banner",
    route: "/admin/home/banners",
    permission: "Manage Banners", // Add corresponding permission
    icon: <PiFlagBanner />,
  },
  {
    name: "Posters",
    route: "/admin/home/posters",
    permission: "Manage Posters", // Add corresponding permission
    icon: <GiTargetPoster />,
  },
  {
    name: "Panels",
    route: "/admin/home/panels",
    permission: "View Employees", // Example permission
    icon: <TfiPanel />,
  },
  // {
  //   name: "Employees",
  //   route: "/admin/home/employees",
  //   permission: "View Employees", // Add corresponding permission
  //   icon: <FaUser />,
  // },
  {
    name: "Members",
    route: "/admin/home/members",
    permission: "View Employees", // Add corresponding permission
    icon: <FaUser />,
  },
  {
    name: "Coin Requests",
    route: "/admin/home/coins-request",
    permission: "Deposit", // Add corresponding permission
    icon: <FaCoins className="text-gray-500" />,
  },
  {
    name: "Activities",
    route: "/admin/home/activity",
    permission: "See Activity", // Add corresponding permission
    icon: <BsActivity className="text-gray-500" />,
  },
  {
    name: "Help Support Chat",
    route: "/admin/home/chatmessages",
    permission: "View Employees", // Example permission
    icon: <BsChat className="text-gray-500" />,
  },

  {
    name: "Social Media",
    route: "/admin/home/socialmedia",
    permission: "View Employees", // Example permission

    icon: <BsGlobe2 className="text-gray-500" />,
  },
];

export default menuItems;
