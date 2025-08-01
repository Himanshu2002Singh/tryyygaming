"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermission } from "../hooks/usepermission";

export default function ProtectedRoute({
  children,
  requiredPermission = null,
}) {
  const router = useRouter();
  const { hasPermission, loading } = usePermission();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (!loading) {
      if (requiredPermission && !hasPermission(requiredPermission)) {
        router.push("/admin/unauthorized");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [loading, hasPermission, requiredPermission, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return isAuthorized ? children : null;
}
