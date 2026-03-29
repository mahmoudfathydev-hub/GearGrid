"use client";

import { useState, useEffect } from "react";

export const usePageDetection = () => {
  const [isComparePage, setIsComparePage] = useState(false);

  useEffect(() => {
    const checkPage = () => {
      const pathname = window.location.pathname;
      setIsComparePage(pathname === "/compare");
    };

    // Check initial page
    checkPage();

    // Listen for route changes (for client-side navigation)
    const observer = new MutationObserver(() => {
      checkPage();
    });

    // Observe body changes to detect SPA navigation
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also listen to popstate events
    window.addEventListener("popstate", checkPage);

    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", checkPage);
    };
  }, []);

  return { isComparePage };
};
