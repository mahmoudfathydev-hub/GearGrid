import { createClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get total count of cars in the database
    const { count, error } = await supabase
      .from("Cars")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching cars count:", error);
      return NextResponse.json(
        { error: "Failed to fetch cars data" },
        { status: 500 },
      );
    }

    const carsData = {
      cars_in_stock: count || 0,
      total_cars: count || 0,
    };

    return NextResponse.json(carsData);
  } catch (error) {
    console.error("Error in cars API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
