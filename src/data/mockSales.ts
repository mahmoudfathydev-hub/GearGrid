import {
  MonthlySale,
  Car,
  InstallmentCustomer,
} from "../app/dashboard/types/sales";

// This file now contains only helper functions for analytics
// Mock data is no longer needed as we use real Supabase data

export const calculateMonthlySales = (
  salesData: MonthlySale[],
): { month: string; total: number }[] => {
  const salesByMonth = salesData.reduce(
    (acc, sale) => {
      const month = new Date(sale.created_at!).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      acc[month] = (acc[month] || 0) + sale.money;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(salesByMonth).map(([month, total]) => ({
    month,
    total,
  }));
};

export const getTopSellingBrands = (
  salesData: MonthlySale[],
): { brand: string; count: number; revenue: number }[] => {
  const brandStats = salesData.reduce(
    (acc, sale) => {
      if (!acc[sale.brand]) {
        acc[sale.brand] = { count: 0, revenue: 0 };
      }
      acc[sale.brand].count++;
      acc[sale.brand].revenue += sale.money;
      return acc;
    },
    {} as Record<string, { count: number; revenue: number }>,
  );

  return Object.entries(brandStats)
    .map(([brand, stats]) => ({ brand, ...stats }))
    .sort((a, b) => b.revenue - a.revenue);
};

export const getCashVsInstallmentRatio = (
  salesData: MonthlySale[],
): { cash: number; installment: number } => {
  const stats = salesData.reduce(
    (acc, sale) => {
      if (sale.cash_or_no === "cash") {
        acc.cash++;
      } else {
        acc.installment++;
      }
      return acc;
    },
    { cash: 0, installment: 0 },
  );

  return stats;
};

export const getTotalRevenue = (salesData: MonthlySale[]): number => {
  return salesData.reduce((total, sale) => total + sale.money, 0);
};
