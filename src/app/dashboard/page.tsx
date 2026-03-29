"use client";

import {
  BarChart3,
  PlusCircle,
  Users,
  ArrowRight,
  Car,
  ShoppingCart,
  TrendingUp,
  Activity,
  DollarSign,
  Eye,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CarData {
  id: string;
  description: string;
  created_at: string;
}

interface RecentActivity {
  id: string;
  description: string;
  time: string;
}

export default function DashboardPage() {
  const [adminName, setAdminName] = useState<string>("");
  const [stats, setStats] = useState({
    totalCars: 0,
    totalSales: 0,
    activeUsers: 0,
    monthlyRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.user_metadata?.name) {
        setAdminName(user.user_metadata.name);
      }
    };

    const fetchStats = async () => {
      setStats({
        totalCars: 156,
        totalSales: 89,
        activeUsers: 1247,
        monthlyRevenue: 1250000,
      });
    };

    const fetchRecentActivity = async () => {
      const { data, error } = await supabase
        .from("Cars")
        .select("id, description, created_at")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) {
        console.error(error);
      } else {
        setRecentActivity(
          data.map((car: CarData) => ({
            id: car.id,
            description: car.description,
            time: new Date(car.created_at).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }),
          })),
        );
      }
    };

    fetchUser();
    fetchStats();
    fetchRecentActivity();
  }, [supabase]);

  const quickActions = [
    {
      id: "analytics",
      title: "View Analytics",
      description:
        "Monitor car sales, user engagement, and platform performance metrics",
      icon: <BarChart3 className="w-8 h-8" />,
      href: "/dashboard/analytics",
      color: "blue",
    },
    {
      id: "add-car",
      title: "Add New Car",
      description:
        "List a new vehicle in the inventory with detailed specifications",
      icon: <PlusCircle className="w-8 h-8" />,
      href: "/dashboard/add-car",
      color: "green",
    },
    {
      id: "users",
      title: "Manage Users",
      description: "Administer user accounts, permissions, and access controls",
      icon: <Users className="w-8 h-8" />,
      href: "/dashboard/users",
      color: "purple",
    },
    {
      id: "sales",
      title: "Record Sales",
      description: "Track and manage car sales transactions",
      icon: <ShoppingCart className="w-8 h-8" />,
      href: "/dashboard/sales",
      color: "orange",
    },
    {
      id: "cars",
      title: "Manage Inventory",
      description: "View and manage your car inventory",
      icon: <Car className="w-8 h-8" />,
      href: "/dashboard/cars",
      color: "red",
    },
    {
      id: "customers",
      title: "Customer Finance",
      description: "Manage installment customers and financing",
      icon: <TrendingUp className="w-8 h-8" />,
      href: "/dashboard/installment-customers",
      color: "indigo",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                Welcome back, {adminName || "Admin"}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                Manage your car dealership business with comprehensive analytics
                and tools.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Quick Actions
                </h2>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.id} href={action.href}>
                    <Card className="h-full hover:shadow-md transition-all duration-200 cursor-pointer group border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800 hover:from-gray-100 hover:to-white dark:hover:from-gray-700/50 dark:hover:to-gray-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div
                            className={`p-3 rounded-xl bg-${action.color}-100 dark:bg-${action.color}-900/50 text-${action.color}-600 dark:text-${action.color}-300 group-hover:scale-105 transition-transform duration-200`}
                          >
                            {action.icon}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                          {action.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {action.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                  </CardTitle>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div className="p-2 rounded-lg mt-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                        <Car className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No recent car additions
                    </p>
                  </div>
                )}
                <div className="pt-2">
                  <Link
                    href="/dashboard/cars"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    View all cars
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
