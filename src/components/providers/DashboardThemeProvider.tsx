"use client";

import { useEffect } from "react";

interface DashboardThemeProviderProps {
  children: React.ReactNode;
}

export default function DashboardThemeProvider({
  children,
}: DashboardThemeProviderProps) {
  useEffect(() => {
    // Remove dark class from document to force light mode
    document.documentElement.classList.remove("dark");

    // Also remove from body in case it was added elsewhere
    document.body.classList.remove("dark");

    // Force light mode color scheme
    document.documentElement.style.colorScheme = "light";
  }, []);

  return <div className="light-mode-dashboard">{children}</div>;
}
