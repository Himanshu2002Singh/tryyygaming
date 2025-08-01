import {
  BsActivity,
  BsBank,
  BsChat,
  BsGlobe2,
  BsWhatsapp,
} from "react-icons/bs";
import { FaCoins, FaUser } from "react-icons/fa";
import { GiTargetPoster } from "react-icons/gi";
import { PiBankDuotone, PiFlagBanner, PiHandWithdraw } from "react-icons/pi";
import { RxButton } from "react-icons/rx";
import { TbWorldWww } from "react-icons/tb";
import { TfiPanel } from "react-icons/tfi";

const menuItems = [
  {
    name: "Dashboard",
    route: "/admin/home/dashboard",
    permission: "View Dashboard",
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
  {
    name: "Banking Request",
    route: "/admin/home/banking-request",
    permission: "View Banking Requests",
    icon: <PiBankDuotone />,
  },
  {
    name: "ID Request",
    route: "/admin/home/sitepanel-request",
    permission: "View Panel Requests",
    icon: <TbWorldWww />,
  },
  {
    name: "Users",
    route: "/admin/home/users",
    permission: "View Users",
    icon: <FaUser />,
  },
  {
    name: "Banks",
    route: "/admin/home/banks",
    permission: "Add Bank",
    icon: <BsBank />,
  },
  {
    name: "Banner",
    route: "/admin/home/banners",
    permission: "Manage Banners",
    icon: <PiFlagBanner />,
  },
  {
    name: "Offer",
    route: "/admin/home/offer",
    permission: "View Offers",
    icon: <GiTargetPoster />,
  },
  {
    name: "IDs",
    route: "/admin/home/panels",
    permission: "View Panel",
    icon: <TfiPanel />,
  },
  {
    name: "Members",
    route: "/admin/home/members",
    permission: "View Employees",
    icon: <FaUser />,
  },
  {
    name: "Coin Requests",
    route: "/admin/home/coins-request",
    permission: "Deposit",
    icon: <FaCoins className="text-gray-500" />,
  },
  {
    name: "Activities",
    route: "/admin/home/activity",
    permission: "See Activity",
    icon: <BsActivity className="text-gray-500" />,
  },
  {
    name: "Help Support Chat",
    route: "/admin/home/chatmessages",
    permission: "View Chat Messages",
    icon: <BsChat className="text-gray-500" />,
  },
  {
    name: "Whatsapp",
    route: "/admin/home/whatsapp",
    permission: "WhatsApp Access",
    icon: <BsWhatsapp className="text-gray-500" />,
  },
  {
    name: "Social Media",
    route: "/admin/home/socialmedia",
    permission: "Social Media Access",
    icon: <BsGlobe2 className="text-gray-500" />,
  },
  {
    name: "Add Button",
    route: "/admin/home/add-buttons",
    permission: "Add Button",
    icon: <RxButton className="text-gray-500" />,
  },
];

export default menuItems;

// import {
//   BsActivity,
//   BsBank,
//   BsChat,
//   BsGlobe2,
//   BsWhatsapp,
// } from "react-icons/bs";
// import { FaCoins, FaUser } from "react-icons/fa";
// import { GiButterToast, GiTargetPoster } from "react-icons/gi";
// import { MdRequestPage } from "react-icons/md";
// import { PiBankDuotone, PiFlagBanner, PiHandWithdraw } from "react-icons/pi";
// import { RxButton } from "react-icons/rx";
// import { TbWorldWww } from "react-icons/tb";
// import { TfiPanel } from "react-icons/tfi";

// const menuItems = [
//   {
//     name: "Dashboard",
//     route: "/admin/home/dashboard",
//     permission: "View Dashboard", // Add corresponding permission

//     icon: (
//       <svg
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <rect x="3" y="3" width="18" height="18" rx="2" />
//         <circle cx="8.5" cy="8.5" r="1.5" />
//         <path d="M20.4 14.5L16 10 4 20" />
//       </svg>
//     ),
//   },
//   // {
//   //   name: "Request",
//   //   route: "/admin/home/request",
//   //   icon: (
//   //     <svg
//   //       width="24"
//   //       height="24"
//   //       viewBox="0 0 24 24"
//   //       fill="none"
//   //       stroke="currentColor"
//   //       strokeWidth="2"
//   //       strokeLinecap="round"
//   //       strokeLinejoin="round"
//   //     >
//   //       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//   //       <circle cx="9" cy="7" r="4" />
//   //       <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//   //       <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   //     </svg>
//   //   ),
//   // },
//   {
//     name: "Banking Request",
//     route: "/admin/home/banking-request",
//     permission: "Deposit", // Add corresponding permission

//     icon: <PiBankDuotone />,
//   },

//   {
//     name: "ID Request",
//     route: "/admin/home/sitepanel-request",
//     permission: "Deposit", // Add corresponding permission

//     icon: <TbWorldWww />,
//   },
//   // {
//   //   name: "Employees",
//   //   route: "/admin/payment/employees",
//   //   icon: (
//   //     <svg
//   //       width="24"
//   //       height="24"
//   //       viewBox="0 0 24 24"
//   //       fill="none"
//   //       stroke="currentColor"
//   //       strokeWidth="2"
//   //       strokeLinecap="round"
//   //       strokeLinejoin="round"
//   //     >
//   //       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//   //       <circle cx="9" cy="7" r="4" />
//   //       <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//   //       <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   //     </svg>
//   //   ),
//   // },
//   // {
//   //   name: "Payment Range",
//   //   route: "/admin/home/payment-range",
//   //   icon: (
//   //     <svg
//   //       width="24"
//   //       height="24"
//   //       viewBox="0 0 24 24"
//   //       fill="none"
//   //       stroke="currentColor"
//   //       strokeWidth="2"
//   //       strokeLinecap="round"
//   //       strokeLinejoin="round"
//   //     >
//   //       <rect x="2" y="5" width="20" height="14" rx="2" />
//   //       <line x1="2" y1="10" x2="22" y2="10" />
//   //     </svg>
//   //   ),
//   // },
//   {
//     name: "Users",
//     route: "/admin/home/users",
//     permission: "View Users", // Add corresponding permission

//     icon: <FaUser />,
//   },
//   // {
//   //   name: "Withdrawal Request",
//   //   route: "/admin/home/withdraw-request",
//   //   icon: <PiHandWithdraw />,
//   // },
//   {
//     name: "Banks",
//     route: "/admin/home/banks",
//     permission: "Deposit", // Add corresponding permission

//     icon: <BsBank />,
//   },
//   {
//     name: "Banner",
//     route: "/admin/home/banners",
//     permission: "Manage Banners", // Add corresponding permission
//     icon: <PiFlagBanner />,
//   },

//   {
//     name: "Offer",
//     route: "/admin/home/offer",
//     permission: "Manage Posters",
//     icon: <GiTargetPoster />,
//   },
//   {
//     name: "IDs",
//     route: "/admin/home/panels",
//     permission: "View Employees", // Example permission

//     icon: <TfiPanel />,
//   },

//   // {
//   //   name: "Employees",
//   //   route: "/admin/home/employees",
//   //   icon: <FaUser />,
//   // },
//   {
//     name: "Members",
//     route: "/admin/home/members",
//     permission: "View Employees", // Add corresponding permission

//     icon: <FaUser />,
//   },
//   {
//     name: "Coin Requests",
//     route: "/admin/home/coins-request",
//     permission: "Deposit", // Add corresponding permission

//     icon: <FaCoins className="text-gray-500" />,
//   },
//   {
//     name: "Activities",
//     route: "/admin/home/activity",
//     permission: "See Activity", // Add corresponding permission

//     icon: <BsActivity className="text-gray-500" />,
//   },
//   {
//     name: "Help Support Chat",
//     route: "/admin/home/chatmessages",
//     permission: "View Employees", // Example permission

//     icon: <BsChat className="text-gray-500" />,
//   },
//   {
//     name: "Whatsapp",
//     route: "/admin/home/whatsapp",
//     permission: "View Employees", // Example permission

//     icon: <BsWhatsapp className="text-gray-500" />,
//   },
//   {
//     name: "Social Media",
//     route: "/admin/home/socialmedia",
//     permission: "View Employees", // Example permission

//     icon: <BsGlobe2 className="text-gray-500" />,
//   },

//   {
//     name: "Add Button",
//     route: "/admin/home/add-buttons",
//     permission: "View Employees", // Example permission

//     icon: <RxButton className="text-gray-500" />,
//   },
// ];

// export default menuItems;
