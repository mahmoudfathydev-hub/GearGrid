import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Swiper from "./components/Swiper";
import Form from "./components/form";

async function Signup() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // 1. Get role from metadata (faster, available immediately after signup)
    const metadataRole = user.user_metadata?.role;
    
    // 2. Get role from database (source of truth for existing accounts)
    const { data: profile } = await supabase
      .from("User")
      .select("role")
      .eq("email", user.email!)
      .single();

    const role = metadataRole || profile?.role;

    if (role === "admin") {
      redirect("/dashboard");
    } else {
      redirect("/");
    }
  }

  return (
    <main className="flex w-full h-screen bg-neutral-950 overflow-hidden">
      <div className="hidden lg:block lg:w-[65%] xl:w-[70%] h-full">
        <Swiper />
      </div>
      <div className="w-full lg:w-[35%] xl:w-[30%] flex items-center justify-center p-6 bg-neutral-950 border-l border-white/5 h-screen overflow-hidden">
        <div className="w-full max-w-md">
          <Form />
        </div>
      </div>
    </main>
  );
}

export default Signup;