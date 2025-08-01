"use client";
import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminAuthContext } from "../context/adminAuthcontext";

// Mapping of routes to required permissions
const routePermissions = {
  "/admin/home/dashboard": "View Dashboard",
  "/admin/home/request": "View Employees",
  "/admin/home/banking-request": "Deposit",
  "/admin/home/sitepanel-request": "View Employees",
  "/admin/home/users": "View Users",
  "/admin/home/banks": "Deposit",
  "/admin/home/banners": "Manage Banners",
  "/admin/home/posters": "Manage Posters",
  "/admin/home/panels": "View Employees",
  "/admin/home/employees": "View Employees",
  "/admin/home/members": "View Employees",
  "/admin/home/coins-request": "Deposit",
  "/admin/home/activity": "See Activity",
  "/admin/home/chatmessages": "View Employees",
};

export function RouteProtection({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useContext(AdminAuthContext);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("admintoken");

    // If no token or no user, redirect to auth
    if (user && !user) {
      router.push("/admin/auth");
      return;
    }

    // Check route permissions
    const requiredPermission = routePermissions[pathname];
    console.log("Required Permission:", requiredPermission);
    console.log("User Permissions:", user?.permissions);
    // If a permission is required for this route
    if (requiredPermission) {
      // Check if user has the permission
      const hasPermission = user?.permissions?.includes(requiredPermission);

      // If user doesn't have permission, redirect
      if (!hasPermission) {
        const availableRoute = Object.entries(routePermissions).find(
          ([route, permission]) => user?.permissions?.includes(permission)
        );

        if (availableRoute) {
          // Redirect to the first available route with user's permissions
          router.push(availableRoute[0]);
        }
        return;
      }
    }
  }, [user, loading, router, pathname]);

  // Show loading while checking
  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return children;
}
