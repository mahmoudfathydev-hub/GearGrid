"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginValues,
} from "../../signup/validation/validation";
import { createClient } from "@/lib/supabaseBrowser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function SigninForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const supabase = createClient();

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    try {
      // Check if user is banned
      const { data: bannedCheck, error: checkError } = await supabase
        .from("User")
        .select("is_banned")
        .eq("email", values.email)
        .single();

      if (bannedCheck?.is_banned) {
        throw new Error(
          "This account has been banned. Please contact support.",
        );
      }

      // Sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast.success("Welcome back!");

      // Get user role from metadata or database
      const metadataRole = data.user?.user_metadata?.role;

      // Fallback to database if metadata doesn't have role
      let role = metadataRole;
      if (!role) {
        const { data: profile } = await supabase
          .from("User")
          .select("role")
          .eq("email", values.email)
          .single();
        role = profile?.role;
      }

      // Redirect based on role
      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }

      reset();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 lg:p-6 space-y-4 animate-in fade-in duration-500">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Welcome Back
        </h1>
        <p className="text-sm text-neutral-400">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className={`w-full bg-neutral-900 border ${
                errors.email ? "border-red-500" : "border-neutral-800"
              } text-white rounded-xl px-10 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-neutral-600`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 mt-1 ml-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full bg-neutral-900 border ${
                errors.password ? "border-red-500" : "border-neutral-800"
              } text-white rounded-xl px-10 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-neutral-600`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400 mt-1 ml-1 leading-relaxed">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full relative overflow-hidden group bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all duration-300 mt-2 h-12"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing In...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Sign In
              <LogIn className="w-5 h-5" />
            </span>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-neutral-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
