"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/global/Heading/navbar";
import Footer from "@/components/global/Footer/footer";
import { CartAndFavoritesProvider } from "@/context/CartAndFavoritesContext";
import AuthNotifications from "@/components/global/AuthNotifications";
import { Suspense } from "react";

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <CartAndFavoritesProvider>
      <Suspense fallback={null}>
        <AuthNotifications />
      </Suspense>
      {!isDashboard && pathname !== "/signup" && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isDashboard && pathname !== "/signup" && <Footer />}
    </CartAndFavoritesProvider>
  );
}

