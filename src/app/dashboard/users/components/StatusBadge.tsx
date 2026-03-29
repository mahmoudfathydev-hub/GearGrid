"use client";

import { ShieldCheck, UserCheck, Ban } from "lucide-react";

interface StatusBadgeProps {
  type: "role" | "status";
  value: string | boolean;
}

export default function StatusBadge({ type, value }: StatusBadgeProps) {
  if (type === "role") {
    const isAdmin = value === "admin";
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
        isAdmin 
          ? "bg-indigo-50 text-indigo-600 border border-indigo-100/80" 
          : "bg-slate-50 text-slate-600 border border-slate-100/80"
      }`}>
        {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
        {String(value)}
      </span>
    );
  }

  const isBanned = !!value;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
      isBanned 
        ? "bg-rose-50 text-rose-600 border border-rose-100/80" 
        : "bg-emerald-50 text-emerald-600 border border-emerald-100/80"
    }`}>
      {isBanned ? <Ban className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
      {isBanned ? "Banned" : "Active"}
    </span>
  );
}
