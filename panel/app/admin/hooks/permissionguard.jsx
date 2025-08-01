"use client";
import { useContext } from "react";
import { AdminAuthContext } from "../context/adminAuthcontext";

const PermissionGuard = ({ requiredPermission, children }) => {
  const { user, permissions } = useContext(AdminAuthContext);

  if (!user) return null;

  // Super admin has all permissions
  if (user.Role && user.Role.name === "super_admin") {
    return children;
  }

  // Check if user has the required permission
  if (permissions.includes(requiredPermission)) {
    return children;
  }

  // User doesn't have permission
  return null;
};

export default PermissionGuard;
