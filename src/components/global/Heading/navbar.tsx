"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { toggleTheme } from "@/store/themeSlice";
import { useCartAndFavorites } from "@/hooks/useCartAndFavorites";
import {
  Logo,
  NavigationLinks,
  ThemeToggle,
  MobileMenuButton,
  MobileMenu,
  CartIcon,
  HeartIcon,
  SignInButton,
  SearchInput,
} from "./components";
import { createClient } from "@/lib/supabaseBrowser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();
  const { cartCount, favoriteCount } = useCartAndFavorites();
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCartClick = () => {
    window.location.href = "/Cart";
  };

  const handleHeartClick = () => {
    window.location.href = "/Favorites";
  };

  const handleSignOut = async () => {
    const loadingToast = toast.loading("Signing out...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Signed out successfully.", {
        id: loadingToast,
      });
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong during sign out.", {
        id: loadingToast,
      });
      console.error("Sign out error:", error);
    }
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      handleSignOut();
    } else {
      router.push("/login");
    }
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);

    if (window.location.pathname === "/Cars") {
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      if (query.trim()) {
        url.searchParams.set("search", query);
      } else {
        url.searchParams.delete("search");
      }
      window.history.pushState({}, "", url.toString());

      window.dispatchEvent(new CustomEvent("search", { detail: query }));
    } else {
      if (query.trim().length >= 3 || query.trim().length === 0) {
        window.location.href = `/Cars${query.trim() ? `?search=${encodeURIComponent(query)}` : ""}`;
      }
    }
  };

  useEffect(() => {
    setMounted(true);

    // Check initial session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email || null);
    };
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email || null);
    });

    const currentTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    document.documentElement.classList.toggle("dark", currentTheme === "dark");

    return () => subscription.unsubscribe();
  }, [supabase]);

  const links = [
    { id: 1, name: "Home", href: "/" },
    { id: 2, name: "Services", href: "/Services" },
    { id: 3, name: "Cars", href: "/Cars" },
    { id: 4, name: "Compare", href: "/compare" },
    { id: 5, name: "Book Test Drive", href: "/bookTestDrive" },
  ];

  return (
    <nav className="bg-white dark:bg-black  border-b border-gray-200 dark:border-gray-800">
      <div className="container max-w-8xl mx-auto mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchInput onSearch={handleSearch} />
          </div>

          <div className="hidden md:block px-4">
            <NavigationLinks links={links} />
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle
              theme={theme}
              onToggle={handleToggleTheme}
              mounted={mounted}
            />

            <CartIcon itemCount={cartCount} onClick={handleCartClick} />

            <div className="hidden sm:flex items-center space-x-2">
              <HeartIcon itemCount={favoriteCount} onClick={handleHeartClick} />

              <SignInButton
                isLoggedIn={isLoggedIn}
                onClick={handleAuthAction}
              />
            </div>

            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={handleMobileMenuToggle}
            />
          </div>
        </div>
      </div>

      <MobileMenu links={links} isOpen={isMobileMenuOpen}>
        <div className="flex flex-col space-y-4">
          <div className="px-2">
            <SearchInput onSearch={handleSearch} />
          </div>
          <div className="flex items-center space-x-4">
            <HeartIcon
              itemCount={favoriteCount}
              onClick={handleHeartClick}
              className="bg-gray-100 dark:bg-gray-800"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Favorites
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <CartIcon
              itemCount={cartCount}
              onClick={handleCartClick}
              className="bg-gray-100 dark:bg-gray-800"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Cart
            </span>
          </div>
          <SignInButton
            isLoggedIn={isLoggedIn}
            onClick={handleAuthAction}
            className="w-full justify-center"
          />
        </div>
      </MobileMenu>
    </nav>
  );
};

export default Navbar;
