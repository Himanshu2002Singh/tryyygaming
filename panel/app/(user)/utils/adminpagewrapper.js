"use client";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children, navbar, bottomNav }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.includes("/admin");

  // Define routes where BottomNavBar should be hidden
  const hideBottomNavRoutes = [
    "/login",
    "/signup",
    "/dashboard",
    // "/helpsupport",
  ];
  const dynamicHidePatterns = [
    /^\/posts\/\d+$/,
    /^\/posts\/id\/\d+$/,
    /^\/paneldashboard\/create\/[^/]+\/?$/,
    /^\/panel\/panel-deposite(\?.*)?$/, // Add this pattern to match panel-deposite with query params
    /^\/panel\/panel-withdraw(\?.*)?$/, // Add this pattern to match panel-deposite with query params
  ];

  const shouldHideBottomNav =
    isAdminRoute ||
    hideBottomNavRoutes.includes(pathname) ||
    dynamicHidePatterns.some((pattern) => pattern.test(pathname));

  return (
    <div
      className={`m-auto w-full flex flex-col h-screen antialiased ${
        isAdminRoute ? "lg:w-full" : "lg:w-3/6"
      }`}
    >
      {!isAdminRoute && navbar}
      <main className={`flex-grow ${!isAdminRoute && "overflow-hidden"}`}>
        {children}
      </main>

      {/* Apply CSS classes conditionally to completely hide the element */}
      {!shouldHideBottomNav ? (
        <div
          className="
            fixed 
            bottom-0 
            left-0 
            right-0 
            z-10 
            lg:w-3/6 
            lg:m-auto
            h-[56px]
          "
        >
          {bottomNav}
        </div>
      ) : null}
    </div>
  );
}
