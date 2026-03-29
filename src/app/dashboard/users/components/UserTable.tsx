"use client";

import { Eye, Edit, Ban, Trash2, Loader2, Mail, Phone, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  number: string;
  created_at: string;
  is_banned: boolean;
}

interface UserTableProps {
  users: UserProfile[];
  loading: boolean;
  onAction: (user: UserProfile, mode: "view" | "edit" | "delete" | "ban") => void;
}

export default function UserTable({ users, loading, onAction }: UserTableProps) {
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] animate-in fade-in duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100/80 transition-colors">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">User Identity</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Administrative Role</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Security Access</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact Protocol</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 font-medium">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 animate-in zoom-in-95 duration-500">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Platform Data...</p>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-24 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  No matching user identities found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/30 flex items-center justify-center text-slate-700 font-black shadow-sm group-hover:scale-105 transition-transform duration-300">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight uppercase">{user.name}</p>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium opacity-80">
                          <Mail className="w-3.5 h-3.5" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge type="role" value={user.role} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge type="status" value={user.is_banned} />
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-600 font-semibold tracking-tight">
                    <div className="flex items-center gap-2">
                       <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                       0{user.number || "Not indexed"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-9 h-9 text-slate-400 hover:text-slate-900 focus:ring-0">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white border-slate-100 shadow-xl rounded-xl p-1.5">
                        <DropdownItem onClick={() => onAction(user, "view")} icon={<Eye className="w-4 h-4" />} label="View Full Profile" />
                        <DropdownItem onClick={() => onAction(user, "edit")} icon={<Edit className="w-4 h-4" />} label="Modify Identity" />
                        <DropdownItem 
                           onClick={() => onAction(user, "ban")} 
                           icon={<Ban className="w-4 h-4 text-orange-500" />} 
                           label={user.is_banned ? "Restore Access" : "Enforce Ban"} 
                           className="text-orange-600"
                        />
                        <div className="my-1 border-t border-slate-50" />
                        <DropdownItem 
                           onClick={() => onAction(user, "delete")} 
                           icon={<Trash2 className="w-4 h-4 text-rose-500" />} 
                           label="Delete Account" 
                           className="text-rose-600"
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DropdownItem({ onClick, icon, label, className = "" }: any) {
  return (
    <DropdownMenuItem 
      onClick={onClick} 
      className={`flex items-center gap-2.5 px-3 py-2 text-[12px] font-bold uppercase tracking-wide rounded-lg cursor-pointer transition-colors active:scale-95 ${className}`}
    >
      {icon}
      {label}
    </DropdownMenuItem>
  );
}
