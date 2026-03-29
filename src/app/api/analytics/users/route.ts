import { createClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get total count of users from the auth.users table
    const {
      data: { users },
      error: authError,
    } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error("Error fetching users from auth:", authError);
    }

    // Get user profiles from your users table if it exists
    const { count: profileCount, error: profileError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 means table doesn't exist
      console.error("Error fetching profiles:", profileError);
    }

    const userData = {
      total_customers: users?.length || profileCount || 0,
      active_users: Math.floor((users?.length || profileCount || 0) * 0.7), // Estimate 70% active
      new_users_this_month: 0, // Could be calculated with date filtering
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error in users API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
