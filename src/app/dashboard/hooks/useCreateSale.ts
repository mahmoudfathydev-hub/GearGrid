import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  MonthlySale,
  SaleFormData,
  InstallmentCalculation,
  ApiResponse,
} from "../types/sales";

export const useCreateSale = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createSale = async (
    formData: SaleFormData,
    calculation?: InstallmentCalculation,
  ): Promise<ApiResponse<MonthlySale>> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Check if Supabase is configured
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        throw new Error(
          "Supabase is not configured. Check environment variables.",
        );
      }

      const saleData = {
        name: formData.name,
        money: formData.carPrice,
        brand: formData.brand,
        car_name: formData.carName,
        cash_or_no: formData.paymentType,
        sale_type: formData.saleType,
        customer_phone: formData.customerPhone,
        notes: formData.notes || null,
        created_at: new Date().toISOString(),
        ...(formData.paymentType === "installment" &&
          calculation && {
            Number_of_installment_months: calculation.numberOfMonths,
            money_for_installment_monthly: calculation.monthlyPayment,
            down_payment: calculation.downPayment,
            total_price_with_interest: calculation.totalPriceWithInterest,
            remaining_balance: calculation.totalPriceWithInterest,
            is_fully_paid: false,
          }),
        ...(formData.paymentType === "cash" && {
          is_fully_paid: true,
          remaining_balance: 0,
        }),
      };

      console.log("Attempting to insert sale data:", saleData);

      const { data, error } = await supabase
        .from("Monthly_Sales")
        .insert([saleData])
        .select()
        .single();

      console.log("Supabase response:", { data, error });

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

      if (!data) {
        throw new Error("No data returned from database");
      }

      // Track the car as sold
      try {
        const supabaseResponse = await supabase
          .from("Sold_Cars")
          .insert({
            car_id: formData.carId,
            sold_at: new Date().toISOString(),
          })
          .select();

        if (supabaseResponse.error) {
          console.error(
            "Warning: Could not track car as sold:",
            supabaseResponse.error,
          );
        } else {
          console.log("Car successfully tracked as sold");
        }
      } catch (trackError) {
        console.error("Warning: Error tracking sold car:", trackError);
      }

      setSuccess(true);
      return { data, message: "Sale created successfully" };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create sale";
      setError(errorMessage);
      console.error("Error creating sale:", err);
      return { data: null as any, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { createSale, loading, error, success, reset };
};
