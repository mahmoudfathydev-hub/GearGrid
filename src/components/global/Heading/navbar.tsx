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
import { TriangleAlertIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleAuthAction = async () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteDialogOpen(false);
    const loadingToast = toast.loading("Processing account deletion...");
    try {
      if (userEmail) {
        const { error: dbError } = await supabase
          .from("User")
          .delete()
          .eq("email", userEmail);

        if (dbError) throw dbError;
      }

      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;

      toast.success("Account deleted and signed out successfully.", {
        id: loadingToast,
      });
      router.push("/signup");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong during deletion.", {
        id: loadingToast,
      });
      console.error("Sign out error:", error);
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
    { id: 6, name: "Dashboard", href: "/dashboard" },
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

              <SignInButton onClick={handleAuthAction} />
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
            onClick={handleAuthAction}
            className="w-full justify-center"
          />
        </div>
      </MobileMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-900 border-red-500/50 p-0 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <TriangleAlertIcon className="w-8 h-8 text-red-500" />
            </div>

            <div className="space-y-2">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white text-center">
                  Critical Action
                </DialogTitle>
                <DialogDescription className="text-red-400 font-medium text-center text-base">
                  Are you sure you want to sign out? This will{" "}
                  <span className="underline decoration-2 font-bold">
                    permanently delete
                  </span>{" "}
                  your account data from GearGrid.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleConfirmDelete}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-red-500/20"
              >
                Confirm Delete & Sign out
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-4 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
