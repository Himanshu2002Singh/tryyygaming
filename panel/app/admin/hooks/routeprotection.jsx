"use client";
import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminAuthContext } from "../context/adminAuthcontext";

// Mapping of routes to required permissions
const routePermissions = {
  "/admin/home/dashboard": "View Dashboard", // VIEW_DASHBOARD
  // "/admin/home/request": "View Employees", // VIEW_EMPLOYEES
  // "/admin/home/banking-request": "Deposit", // DEPOSIT
  // "/admin/home/banking-request": "View Banking Requests",
  "/admin/home/banking-request": "View Banking Requests",
  "/admin/home/sitepanel-request": "View Panel Requests",

  "/admin/home/users": "View Users", // VIEW_USERS
  "/admin/home/banks": "Add Bank", // DEPOSIT
  "/admin/home/banners": "Manage Banners", // MANAGE_BANNERS
  // "/admin/home/posters": "Manage Posters", // MANAGE_POSTERS
  "/admin/home/panels": "View Panel", // VIEW_PANEL
  "/admin/home/employees": "View Employees", // VIEW_EMPLOYEES
  "/admin/home/members": "View Employees", // VIEW_EMPLOYEES
  "/admin/home/coins-request": "Deposit", // DEPOSIT
  "/admin/home/activity": "See Activity", // SEE_ACTIVITY
  "/admin/home/whatsapp": "WhatsApp Access", // SEE_ACTIVITY
  "/admin/home/add-buttons": "Add Button", // SEE_ACTIVITY
  "/admin/home/offer": "View Offers", // SEE_ACTIVITY

  "/admin/home/chatmessages": "View Chat Messages", // VIEW_EMPLOYEES (Assuming internal messaging by employees)
  "/admin/home/socialmedia": "Social Media Access", // SOCIAL_MEDIA_ACCESS
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
