import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Car } from "../types/sales";

export const useFetchBrands = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
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

        console.log("Fetching brands from Cars table...");

        // Fetch distinct brands from Cars table
        const { data, error } = await supabase
          .from("Cars")
          .select("brand")
          .not("brand", "is", null);

        console.log("Supabase response for brands:", { data, error });

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
              'Database error: "Cars" table does not exist. Please create the table in your Supabase database.',
            );
          } else if (error.message.includes("permission")) {
            throw new Error(
              'Permission error: Check RLS policies on "Cars" table.',
            );
          } else if (error.message.includes("JWT")) {
            throw new Error(
              "Authentication error: Check your Supabase configuration.",
            );
          } else {
            throw new Error(`Database error: ${error.message}`);
          }
        }

        // Extract unique brands
        const uniqueBrands = [
          ...new Set(data?.map((item) => item.brand).filter(Boolean) || []),
        ];
        console.log("Unique brands found:", uniqueBrands);
        setBrands(uniqueBrands.sort());
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch brands";
        setError(errorMessage);
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error };
};
