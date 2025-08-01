"use client"; // Ensure this is a client component

import { usePathname } from "next/navigation";
import BottomNavBar from "../components/Footer/footer";

export default function ClientWrapper() {
  const pathname = usePathname();

  // Define static and dynamic routes where BottomNavBar should be hidden
  const hideBottomNavRoutes = [
    "/login",
    "/signup",
    "/dashboard",
    "/rules",
    // "/helpsupport",
  ];
  const dynamicHidePatterns = [
    /^\/posts\/\d+$/,
    /^\/posts\/id\/\d+$/,
    /^\/paneldashboard\/create\/[^/]+\/?$/,
  ];

  const shouldHideBottomNav =
    hideBottomNavRoutes.includes(pathname) ||
    dynamicHidePatterns.some((pattern) => pattern.test(pathname));

  return !shouldHideBottomNav ? <BottomNavBar /> : null;
}
