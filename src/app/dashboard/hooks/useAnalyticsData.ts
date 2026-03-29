import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { MonthlySale } from "../types/sales";

export interface MonthlySalesData {
  month: string;
  total: number;
  count: number;
}

export interface BrandData {
  brand: string;
  count: number;
  revenue: number;
}

export interface PaymentStats {
  cash: number;
  installment: number;
}

export const useAnalyticsData = () => {
  const [monthlySales, setMonthlySales] = useState<MonthlySalesData[]>([]);
  const [topBrands, setTopBrands] = useState<BrandData[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    cash: 0,
    installment: 0,
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);

        const { data: salesData, error: salesError } = await supabase
          .from("Monthly_Sales")
          .select("*")
          .order("created_at", { ascending: false });

        if (salesError) {
          throw salesError;
        }

        if (!salesData || salesData.length === 0) {
          setMonthlySales([]);
          setTopBrands([]);
          setPaymentStats({ cash: 0, installment: 0 });
          setTotalRevenue(0);
          return;
        }

        const typedSalesData = salesData as MonthlySale[];

        const salesByMonth = typedSalesData.reduce(
          (acc, sale) => {
            const month = new Date(sale.created_at!).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
              },
            );

            if (!acc[month]) {
              acc[month] = { month, total: 0, count: 0 };
            }
            acc[month].total += sale.money;
            acc[month].count += 1;
            return acc;
          },
          {} as Record<string, MonthlySalesData>,
        );

        const monthlySalesArray = Object.values(salesByMonth)
          .sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 12); 

        const brandStats = typedSalesData.reduce(
          (acc, sale) => {
            if (!acc[sale.brand]) {
              acc[sale.brand] = { brand: sale.brand, count: 0, revenue: 0 };
            }
            acc[sale.brand].count += 1;
            acc[sale.brand].revenue += sale.money;
            return acc;
          },
          {} as Record<string, BrandData>,
        );

        const topBrandsArray = Object.values(brandStats)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10); 

        const paymentData = typedSalesData.reduce(
          (acc, sale) => {
            if (sale.cash_or_no === "cash") {
              acc.cash += 1;
            } else {
              acc.installment += 1;
            }
            return acc;
          },
          { cash: 0, installment: 0 },
        );

        const revenue = typedSalesData.reduce(
          (sum, sale) => sum + sale.money,
          0,
        );

        setMonthlySales(monthlySalesArray);
        setTopBrands(topBrandsArray);
        setPaymentStats(paymentData);
        setTotalRevenue(revenue);
        setError(null);
      } catch (err) {
        setError("Failed to fetch analytics data");
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  return {
    monthlySales,
    topBrands,
    paymentStats,
    totalRevenue,
    loading,
    error,
  };
};
