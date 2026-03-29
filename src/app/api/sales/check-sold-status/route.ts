import { createClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get("carId");

    if (!carId) {
      return NextResponse.json({ error: "Car ID is required" }, { status: 400 });
    }

    // Check if car is already sold (using your actual schema)
    const { data, error } = await supabase
      .from("Sold_Cars")
      .select("*")
      .eq("car_id", carId) // Using text type as per your schema
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error("Error checking sold status:", error);
      return NextResponse.json({ error: "Failed to check sold status" }, { status: 500 });
    }

    return NextResponse.json({ 
      isSold: !!data,
      soldAt: data?.sold_at 
    });
  } catch (error) {
    console.error("Error in check-sold-status API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
