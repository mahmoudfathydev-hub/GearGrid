import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { InstallmentCustomer } from "../types/sales";

export const useFetchInstallmentCustomers = () => {
  const [customers, setCustomers] = useState<InstallmentCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);

      // Check if Supabase is configured
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        throw new Error(
          "Supabase is not configured. Check environment variables.",
        );
      }

      console.log("Fetching installment customers...");

      // Fetch installment customers from Monthly_Sales table
      const { data, error } = await supabase
        .from("Monthly_Sales")
        .select("*")
        .eq("cash_or_no", "installment")
        .order("created_at", { ascending: false });

      console.log("Supabase response for installment customers:", {
        data,
        error,
      });

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        // Provide more specific error messages
        if (
          error.message.includes("relation") ||
          error.message.includes("table")
        ) {
          throw new Error(
            'Database error: "Monthly_Sales" table does not exist. Please create the table in your Supabase database.',
          );
        } else if (error.message.includes("permission")) {
          throw new Error(
            'Permission error: Check RLS policies on "Monthly_Sales" table.',
          );
        } else if (error.message.includes("JWT")) {
          throw new Error(
            "Authentication error: Check your Supabase configuration.",
          );
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }

      setCustomers(data || []);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch installment customers";
      setError(errorMessage);
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { customers, loading, error, refetch };
};
