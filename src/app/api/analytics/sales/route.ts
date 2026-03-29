import { createClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

interface Sale {
  created_at: string;
  total_amount: number;
}

interface MonthlySale {
  month: string;
  total_sales: number;
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Get monthly sales data from the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const { data: salesData, error } = await supabase
      .from("Sales")
      .select("created_at, total_amount")
      .gte("created_at", twelveMonthsAgo.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching sales data:", error);
      return NextResponse.json(
        { error: "Failed to fetch sales data" },
        { status: 500 },
      );
    }

    // Get sold cars count
    const { count: soldCarsCount, error: soldCarsError } = await supabase
      .from("Sold_Cars")
      .select("*", { count: "exact", head: true });

    if (soldCarsError) {
      console.error("Error fetching sold cars count:", soldCarsError);
      return NextResponse.json(
        { error: "Failed to fetch sold cars data" },
        { status: 500 },
      );
    }

    // Group sales by month
    const monthlySales =
      salesData?.reduce((acc: MonthlySale[], sale: Sale) => {
        const date = new Date(sale.created_at);
        const monthKey = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });

        const existingMonth = acc.find((item) => item.month === monthKey);
        if (existingMonth) {
          existingMonth.total_sales += sale.total_amount;
        } else {
          acc.push({
            month: monthKey,
            total_sales: sale.total_amount,
          });
        }
        return acc;
      }, []) || [];

    return NextResponse.json({
      monthlySales,
      soldCarsCount: soldCarsCount || 0,
    });
  } catch (error) {
    console.error("Error in sales API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
