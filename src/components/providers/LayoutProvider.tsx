"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/global/Heading/navbar";
import Footer from "@/components/global/Footer/footer";
import { CartAndFavoritesProvider } from "@/context/CartAndFavoritesContext";
import AuthNotifications from "@/components/global/AuthNotifications";
import { Suspense } from "react";
import { AIChatBotProvider } from "@/components/global/AIChatBot";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <CartAndFavoritesProvider>
      <AIChatBotProvider>
        <Suspense fallback={null}>
          <AuthNotifications />
        </Suspense>
        {!isDashboard && pathname !== "/signup" && pathname !== "/login" && (
          <Navbar />
        )}
        <main className="flex-grow">{children}</main>
        {!isDashboard && pathname !== "/signup" && pathname !== "/login" && (
          <Footer />
        )}
      </AIChatBotProvider>
    </CartAndFavoritesProvider>
  );
}
