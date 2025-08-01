import { useContext } from "react";
import { AdminAuthContext } from "../context/adminAuthcontext";

export const usePermission = () => {
  const { user } = useContext(AdminAuthContext);

  const hasPermission = (requiredPermission) => {
    // Super admin has all permissions
    if (user?.userId === "superadmin") return true;

    // Check if user has the specific permission
    return user?.permissions?.includes(requiredPermission) || false;
  };

  return { hasPermission };
};
