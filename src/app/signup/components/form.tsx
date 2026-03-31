"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupSchema,
  loginSchema,
  type SignupValues,
  type LoginValues,
} from "../validation/validation";
import { createClient } from "@/lib/supabaseBrowser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  UserPlus,
} from "lucide-react";

type AuthMode = "signup" | "login";

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SignupValues | LoginValues>({
    resolver: zodResolver(mode === "signup" ? signupSchema : loginSchema),
    defaultValues: mode === "signup" ? { role: "user" } : {},
  });

  const selectedRole = mode === "signup" ? watch("role" as any) : undefined;
  const accessKey = mode === "signup" ? watch("accessKey" as any) : undefined;
  const supabase = createClient();

  const onSubmit = async (values: any) => {
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

      if (mode === "signup") {
        // 1. Sign up the user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: values.email,
            password: values.password,
            options: {
              data: {
                name: values.name,
                role: values.role,
                number: values.number,
              },
            },
          },
        );

        if (authError) throw authError;

        // 2. Insert additional user data into the "User" table
        const { error: dbError } = await supabase.from("User").insert([
          {
            name: values.name,
            email: values.email,
            role: values.role,
            number: values.number,
          },
        ]);

        if (dbError) throw dbError;

        toast.success("Account created successfully!");

        // Redirect based on role
        if (values.role === "admin") {
          router.push("/dashboard?welcome=true");
        } else {
          router.push("/?welcome=true");
        }
      } else {
        // Login Flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) throw error;

        toast.success("Welcome back!");

        const role = data.user?.user_metadata?.role;
        if (role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }
      reset();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signup" ? "login" : "signup");
    reset();
  };

  return (
    <div className="w-full p-4 lg:p-6 space-y-4 animate-in fade-in duration-500">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-sm text-neutral-400">
          {mode === "signup"
            ? "Experience automotive excellence"
            : "Sign in to your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {mode === "signup" && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                {...register("name" as any)}
                type="text"
                placeholder="John Doe"
                className={`w-full bg-neutral-900 border ${
                  (errors as any).name ? "border-red-500" : "border-neutral-800"
                } text-white rounded-xl px-10 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-neutral-600`}
              />
            </div>
            {(errors as any).name && (
              <p className="text-xs text-red-400 mt-1 ml-1">
                {(errors as any).name.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              {...register("email" as any)}
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

        {mode === "signup" && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
              Phone Number
            </label>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                {...register("number" as any)}
                type="text"
                placeholder="+1 234 567 890"
                className={`w-full bg-neutral-900 border ${
                  (errors as any).number
                    ? "border-red-500"
                    : "border-neutral-800"
                } text-white rounded-xl px-10 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-neutral-600`}
              />
            </div>
            {(errors as any).number && (
              <p className="text-xs text-red-400 mt-1 ml-1">
                {(errors as any).number.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              {...register("password" as any)}
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

        {mode === "signup" && (
          <div className="space-y-2 pt-1 animate-in slide-in-from-top-2 duration-300">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Select Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                  selectedRole === "user"
                    ? "bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                    : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    {...register("role" as any)}
                    type="radio"
                    value="user"
                    className="hidden"
                  />
                  <span
                    className={`text-sm font-medium transition-colors ${selectedRole === "user" ? "text-white" : "text-neutral-500"}`}
                  >
                    User
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedRole === "user"
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-neutral-800"
                  }`}
                >
                  {selectedRole === "user" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  )}
                </div>
              </label>

              <label
                className={`relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                  selectedRole === "admin"
                    ? "bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                    : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    {...register("role" as any)}
                    type="radio"
                    value="admin"
                    className="hidden"
                  />
                  <span
                    className={`text-sm font-medium transition-colors ${selectedRole === "admin" ? "text-white" : "text-neutral-500"}`}
                  >
                    Admin
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedRole === "admin"
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-neutral-800"
                  }`}
                >
                  {selectedRole === "admin" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  )}
                </div>
              </label>
            </div>
            {(errors as any).role && (
              <p className="text-xs text-red-400 mt-1 ml-1">
                {(errors as any).role.message}
              </p>
            )}
          </div>
        )}

        {mode === "signup" && selectedRole === "admin" && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
              Access Key
            </label>
            <div className="relative group">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                {...register("accessKey" as any)}
                type="password"
                placeholder="Enter admin key"
                className={`w-full bg-neutral-900 border ${
                  (errors as any).accessKey
                    ? "border-red-500"
                    : "border-neutral-800"
                } text-white rounded-xl px-10 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-neutral-600`}
              />
            </div>
            {(errors as any).accessKey && (
              <p className="text-xs text-red-400 mt-1 ml-1">
                {(errors as any).accessKey.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full relative overflow-hidden group bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all duration-300 mt-2 h-12"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>
                {mode === "signup" ? "Creating Account..." : "Signing In..."}
              </span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {mode === "signup" ? "Sign Up" : "Sign In"}
              {mode === "signup" ? (
                <UserPlus className="w-5 h-5" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
            </span>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-neutral-400">
          {mode === "signup"
            ? "Already have an account? "
            : "Don't have an account? "}
          <a
            href={mode === "signup" ? "/login" : "/signup"}
            className="text-blue-500 hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
          >
            {mode === "signup" ? "Sign In" : "Sign Up"}
          </a>
        </p>
      </div>
    </div>
  );
}
