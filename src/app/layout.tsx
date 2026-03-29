import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutProvider from "@/components/providers/LayoutProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { Toaster } from "@/components/ui/sonner";
import { GlobalAIChatBot } from "./components/GlobalAIChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GearGrid - Automotive Platform",
  description: "Admin dashboard for GearGrid automotive platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <LayoutProvider>{children}</LayoutProvider>
          <GlobalAIChatBot />
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
