"use client";

import { useState, useEffect } from "react";
import { MonthlySale } from "../../types/sales";
import { InstallmentCustomer } from "../../types/sales";

export interface CombinedAnalytics {
  total_sales: number;
  cash_sales: number;
  installment_sales: number;
  total_customers: number;
  installment_customers: number;
  cash_customers: number;
  average_installment_duration: number;
  installment_revenue_percentage: number;
  monthly_breakdown: {
    month: string;
    cash_revenue: number;
    installment_revenue: number;
    total_revenue: number;
    new_installments: number;
    completed_installments: number;
  }[];
}

export const useCombinedAnalytics = () => {
  const [data, setData] = useState<CombinedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        setLoading(true);

        // Fetch sales data
        const salesResponse = await fetch("/api/sales");
        let salesData: MonthlySale[] = [];

        if (salesResponse.ok) {
          salesData = await salesResponse.json();
        } else {
          // Fallback to empty array for now
          salesData = [];
        }

        // Fetch installment customers
        const installmentResponse = await fetch("/api/installment-customers");
        let installmentData: InstallmentCustomer[] = [];

        if (installmentResponse.ok) {
          installmentData = await installmentResponse.json();
        } else {
          // Fallback to empty array for now
          installmentData = [];
        }

        // Process combined analytics
        const cashSales = salesData.filter(
          (sale) => sale.cash_or_no === "cash",
        );
        const installmentSales = salesData.filter(
          (sale) => sale.cash_or_no === "installment",
        );

        const totalRevenue = salesData.reduce(
          (sum, sale) => sum + sale.money,
          0,
        );
        const cashRevenue = cashSales.reduce(
          (sum, sale) => sum + sale.money,
          0,
        );
        const installmentRevenue = installmentSales.reduce(
          (sum, sale) => sum + sale.money,
          0,
        );

        // Group by month
        const monthlyData = new Map<
          string,
          {
            cash_revenue: number;
            installment_revenue: number;
            new_installments: number;
            completed_installments: number;
          }
        >();

        salesData.forEach((sale) => {
          const month = new Date(sale.created_at || Date.now()).toLocaleString(
            "default",
            { month: "short" },
          );

          if (!monthlyData.has(month)) {
            monthlyData.set(month, {
              cash_revenue: 0,
              installment_revenue: 0,
              new_installments: 0,
              completed_installments: 0,
            });
          }

          const monthData = monthlyData.get(month)!;

          if (sale.cash_or_no === "cash") {
            monthData.cash_revenue += sale.money;
          } else {
            monthData.installment_revenue += sale.money;
            monthData.new_installments += 1;
          }
        });

        // Calculate completed installments from installment customers
        installmentData.forEach((customer) => {
          if (customer.remaining_balance === 0) {
            const month = new Date(customer.created_at).toLocaleString(
              "default",
              { month: "short" },
            );
            if (monthlyData.has(month)) {
              monthlyData.get(month)!.completed_installments += 1;
            }
          }
        });

        const monthlyBreakdown = Array.from(monthlyData.entries()).map(
          ([month, data]) => ({
            month,
            cash_revenue: data.cash_revenue,
            installment_revenue: data.installment_revenue,
            total_revenue: data.cash_revenue + data.installment_revenue,
            new_installments: data.new_installments,
            completed_installments: data.completed_installments,
          }),
        );

        const averageDuration =
          installmentData.length > 0
            ? installmentData.reduce(
                (sum, customer) => sum + customer.Number_of_installment_months,
                0,
              ) / installmentData.length
            : 0;

        const combinedData: CombinedAnalytics = {
          total_sales: totalRevenue,
          cash_sales: cashRevenue,
          installment_sales: installmentRevenue,
          total_customers: salesData.length,
          installment_customers: installmentSales.length,
          cash_customers: cashSales.length,
          average_installment_duration: Math.round(averageDuration),
          installment_revenue_percentage:
            totalRevenue > 0 ? (installmentRevenue / totalRevenue) * 100 : 0,
          monthly_breakdown: monthlyBreakdown,
        };

        setData(combinedData);
      } catch (err) {
        console.error("Error fetching combined analytics:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedData();
  }, []);

  const refetch = () => {
    const fetchCombinedData = async () => {
      try {
        setLoading(true);
        // Similar refetch logic here
      } catch (err) {
        console.error("Error refetching combined analytics:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedData();
  };

  return { data, loading, error, refetch };
};
