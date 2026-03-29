"use client";

import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalUsers: number;
}

export default function UserHeader({ searchQuery, setSearchQuery, totalUsers }: UserHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-6 border-b border-neutral-100/80 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group hover:bg-blue-600 hover:text-white transition-all duration-300">
            <Users className="w-7 h-7" />
          </div>
          User Management
        </h2>
        <p className="text-slate-500 text-[13px] font-medium ml-1">
          Currently managing <span className="text-slate-900 font-bold">{totalUsers}</span> registered identities.
        </p>
      </div>
      
      <div className="relative w-full sm:w-80 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
        <Input 
          placeholder="Search identity or email..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 pl-12 bg-slate-50/50 border-slate-200/60 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all rounded-xl z-0"
        />
      </div>
    </div>
  );
}
