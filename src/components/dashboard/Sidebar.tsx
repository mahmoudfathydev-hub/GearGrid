"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  PlusCircle,
  Users,
  Menu,
  X,
  ShoppingCart,
  CreditCard,
  Car,
  Eye,
  LogOut,
  Trash2,
  User,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "analytics",
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: "cars",
    label: "Cars",
    href: "/dashboard/cars",
    icon: <Car className="w-5 h-5" />,
  },
  {
    id: "sold-cars",
    label: "Sold Cars",
    href: "/dashboard/sold-cars",
    icon: <Eye className="w-5 h-5" />,
  },
  {
    id: "sales",
    label: "Record Sales",
    href: "/dashboard/sales",
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    id: "installment-customers",
    label: "Installment Customers",
    href: "/dashboard/installment-customers",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    id: "add-car",
    label: "Add A New Car",
    href: "/dashboard/add-car",
    icon: <PlusCircle className="w-5 h-5" />,
  },
  {
    id: "book-test-drives",
    label: "Book Test Drives",
    href: "/dashboard/bookTestDrives",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    id: "users",
    label: "Users",
    href: "/dashboard/users",
    icon: <Users className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const { signOut, deleteAccount, getCurrentUser } = useUser();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleDeleteAccount = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = () => {
    if (currentUserEmail) {
      deleteAccount(currentUserEmail);
      setIsDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      const user = await getCurrentUser();
      setCurrentUserEmail(user?.email || null);
    };
    getCurrentUserInfo();
  }, [getCurrentUser]);

  return (
    <div
      className={`bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full flex items-center justify-center"
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Actions Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-300`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Sign Out</span>}
            </button>

            {/* Delete Account Button */}
            <button
              onClick={handleDeleteAccount}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-300`}
            >
              <Trash2 className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">Delete Account</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-900 border-red-500/50 p-0 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <TriangleAlertIcon className="w-8 h-8 text-red-500" />
            </div>

            <div className="space-y-2">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white text-center">
                  Delete Account
                </DialogTitle>
                <DialogDescription className="text-red-400 font-medium text-center text-base">
                  Are you sure you want to delete your account? This action will{" "}
                  <span className="underline decoration-2 font-bold">
                    permanently delete
                  </span>{" "}
                  your account data from GearGrid and cannot be undone.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={confirmDeleteAccount}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-red-500/20"
              >
                Confirm Delete Account
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
    </div>
  );
}
