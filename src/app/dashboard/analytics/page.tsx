"use client";

import React from "react";
import { PageHeader } from "./components/PageHeader";
import { StatCard } from "./components/StatCard";
import { ChartCard } from "./components/ChartCard";
import { MonthlySalesChart } from "./components/MonthlySalesChart";
import { TopBrandsChart } from "./components/TopBrandsChart";
import { useSalesData } from "./hooks/useSalesData";
import { useCarsCount } from "./hooks/useCarsCount";
import { useUserStats } from "./hooks/useUserStats";
import { useInstallmentAnalytics } from "./hooks/useInstallmentAnalytics";
import { useCombinedAnalytics } from "./hooks/useCombinedAnalytics";
import { mockBrandSales } from "./data/mockAnalytics";
import { Car, Users, TrendingUp, Activity } from "lucide-react";
import { InstallmentStatsCard } from "./components/InstallmentStatsCard";
import { InstallmentTrendsChart } from "./components/InstallmentTrendsChart";
import { CombinedSalesChart } from "./components/CombinedSalesChart";

export default function AnalyticsPage() {
  const { data: salesData, loading: salesLoading } = useSalesData();
  const { data: carsData, loading: carsLoading } = useCarsCount();
  const { data: userData, loading: usersLoading } = useUserStats();
  const { data: installmentData, loading: installmentLoading } =
    useInstallmentAnalytics();
  const { data: combinedData, loading: combinedLoading } =
    useCombinedAnalytics();

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const calculateTotalSales = () => {
    if (!salesData || salesData.length === 0) return 0;
    // Return current month's sales or the latest month available
    const currentMonthSales = salesData[salesData.length - 1]?.total_sales || 0;
    return currentMonthSales;
  };

  const calculateTotalSalesLabel = () => {
    if (!salesData || salesData.length === 0) return "Monthly Sales";
    // Show the actual month name for the latest data
    const latestMonth = salesData[salesData.length - 1]?.month || "This Month";
    return `${latestMonth} Sales`;
  };

  const calculateSalesTrend = () => {
    if (!salesData || salesData.length < 2)
      return { value: "0%", isPositive: true };
    const currentMonth = salesData[salesData.length - 1].total_sales;
    const previousMonth = salesData[salesData.length - 2].total_sales;
    const change = ((currentMonth - previousMonth) / previousMonth) * 100;
    return {
      value: `${Math.abs(change).toFixed(1)}%`,
      isPositive: change >= 0,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Analytics"
          description="Track your car marketplace performance and business metrics"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={calculateTotalSalesLabel()}
            value={`$${formatNumber(calculateTotalSales())}`}
            icon={TrendingUp}
            trend={calculateSalesTrend()}
          />

          <StatCard
            title="Cars in Stock"
            value={formatNumber(carsData?.cars_in_stock || 0)}
            icon={Car}
            description="All cars in database"
          />

          <StatCard
            title="Total Customers"
            value={formatNumber(userData?.total_customers || 0)}
            icon={Users}
            description="Users in database"
          />

          <StatCard
            title="Installment Revenue"
            value={`${combinedData?.installment_revenue_percentage.toFixed(1) || 0}%`}
            icon={TrendingUp}
            description="Of total sales"
          />

          <StatCard
            title="Active Users"
            value={formatNumber(userData?.active_users || 0)}
            icon={Activity}
            description="Currently online"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title="Sales Breakdown"
            description="Cash vs Installment sales trends"
          >
            <CombinedSalesChart data={combinedData} loading={combinedLoading} />
          </ChartCard>

          <ChartCard
            title="Monthly Sales"
            description="Revenue trends over the past 12 months"
          >
            {salesLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <MonthlySalesChart data={salesData || []} />
            )}
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard
            title="Top Selling Brands"
            description="Most popular car brands by sales volume"
          >
            <TopBrandsChart data={mockBrandSales} />
          </ChartCard>

          <ChartCard
            title="Installment Trends"
            description="New vs completed installment plans"
          >
            <InstallmentTrendsChart
              data={[
                {
                  month: "Jan",
                  new_installments: 12,
                  completed_installments: 8,
                  monthly_revenue: 15000,
                },
                {
                  month: "Feb",
                  new_installments: 15,
                  completed_installments: 10,
                  monthly_revenue: 18500,
                },
                {
                  month: "Mar",
                  new_installments: 18,
                  completed_installments: 12,
                  monthly_revenue: 22000,
                },
                {
                  month: "Apr",
                  new_installments: 14,
                  completed_installments: 15,
                  monthly_revenue: 19500,
                },
                {
                  month: "May",
                  new_installments: 20,
                  completed_installments: 11,
                  monthly_revenue: 25000,
                },
                {
                  month: "Jun",
                  new_installments: 16,
                  completed_installments: 18,
                  monthly_revenue: 21000,
                },
              ]}
            />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="Revenue Growth"
            description="Year-over-year comparison"
            className="lg:col-span-1"
          >
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Coming soon</p>
                <p className="text-sm mt-1">Advanced revenue analytics</p>
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Conversion Rate"
            description="Visitor to customer conversion"
            className="lg:col-span-1"
          >
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Coming soon</p>
                <p className="text-sm mt-1">Conversion funnel analysis</p>
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="User Growth"
            description="New user acquisition trends"
            className="lg:col-span-1"
          >
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Coming soon</p>
                <p className="text-sm mt-1">User engagement metrics</p>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
