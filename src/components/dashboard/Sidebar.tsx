"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    id: "users",
    label: "Users",
    href: "/dashboard/users",
    icon: <Users className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

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
      </div>
    </div>
  );
}
