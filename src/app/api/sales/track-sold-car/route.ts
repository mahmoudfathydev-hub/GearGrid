import { createClient } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { carId } = await request.json();

    if (!carId) {
      return NextResponse.json(
        { error: "Car ID is required" },
        { status: 400 },
      );
    }

    // First, get the car details to preserve data before deletion
    const { data: carData, error: fetchError } = await supabase
      .from("Cars")
      .select("*")
      .eq("id", carId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Insert the car into Sold_Cars table
    const { error: insertError } = await supabase.from("Sold_Cars").insert({
      car_id: carId,
    });

    if (insertError) {
      console.error("Error inserting into Sold_Cars:", insertError);
      return NextResponse.json(
        { error: "Failed to mark car as sold" },
        { status: 500 },
      );
    }

    // Delete the car from Cars table
    const { error: deleteError } = await supabase
      .from("Cars")
      .delete()
      .eq("id", carId);

    if (deleteError) {
      console.error("Error deleting from Cars:", deleteError);
      return NextResponse.json(
        { error: "Failed to remove car from inventory" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Car marked as sold successfully",
      car: carData,
    });
  } catch (error) {
    console.error("Error in track-sold-car:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
