"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthNotifications() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    const welcome = searchParams.get("welcome");

    if (error === "unauthorized") {
      toast.error("Access Denied", {
        description: "You do not have permission to access the dashboard.",
        duration: 5000,
      });
    }

    if (message === "admin_redirect") {
      toast.info("Admin Access", {
        description: "Admins are automatically redirected to the dashboard.",
        duration: 4000,
      });
    }

    if (welcome === "true") {
      toast.success("Welcome aboard!", {
        description: "Your account has been successfully created.",
      });
    }

    // Clear params after showing toast to prevent re-triggering on refresh
    if (error || message || welcome) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      newParams.delete("message");
      newParams.delete("welcome");
      
      const newUrl = window.location.pathname + (newParams.toString() ? `?${newParams.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, router]);

  return null;
}
