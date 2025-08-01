"use client";
import React, { useContext, useEffect } from "react";
import { AdminAuthContext } from "./context/adminAuthcontext";
import { useRouter } from "next/navigation";

const Admin = () => {
  const router = useRouter();
  const { user } = useContext(AdminAuthContext);

  useEffect(() => {
    if (user && !user) {
      router.push("/admin/auth");
    } else {
      router.push("/admin/home/dashboard");
    }
  }, [user, router]);

  return <div>loading...</div>;
};

export default Admin;
