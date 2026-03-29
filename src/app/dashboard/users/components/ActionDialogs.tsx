"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Phone, Calendar, ShieldAlert, Ban, UserCheck, Trash2, X } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  number: string;
  created_at: string;
  is_banned: boolean;
}

interface ActionDialogsProps {
  mode: "view" | "edit" | "delete" | "ban" | null;
  selectedUser: UserProfile | null;
  onClose: () => void;
  onConfirm: (mode: string, data?: any) => Promise<void>;
  loading: boolean;
  onUserUpdate?: (user: UserProfile) => void;
}

export default function ActionDialogs({ 
  mode, 
  selectedUser, 
  onClose, 
  onConfirm, 
  loading,
  onUserUpdate 
}: ActionDialogsProps) {
  if (!selectedUser) return null;

  return (
    <>
      <Dialog open={mode === "view"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-white border-none shadow-2xl max-w-lg rounded-3xl p-8 animate-in zoom-in-95 duration-300">
          <DialogHeader className="pb-6 border-b border-slate-50">
            <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
              User Profile
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium tracking-tight">
               Full identity overview and metadata synchronization.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100/60 shadow-inner group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-black text-3xl shadow-sm group-hover:rotate-3 transition-transform duration-500">
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors uppercase">{selectedUser.name}</h3>
                <StatusBadge type="role" value={selectedUser.role} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <InfoCard icon={<Mail />} label="Email Address" value={selectedUser.email} />
               <InfoCard icon={<Phone />} label="Phone Identity" value={selectedUser.number || "Not indexed"} />
               <InfoCard 
                  icon={<Calendar />} 
                  label="Registered On" 
                  value={new Date(selectedUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
               />
               <InfoCard 
                  icon={<ShieldAlert />} 
                  label="System Integrity" 
                  value={selectedUser.is_banned ? "Account Banned" : "Account Active"} 
                  valueClass={selectedUser.is_banned ? "text-rose-600" : "text-emerald-600"}
               />
            </div>
          </div>

          <DialogFooter className="pt-8">
            <Button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[11px] h-14 rounded-2xl transition-all shadow-xl active:scale-95">
              Confirm & Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mode === "edit"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-white border-none shadow-2xl max-w-lg rounded-3xl p-8 animate-in zoom-in-95 duration-300">
          <form onSubmit={(e) => { e.preventDefault(); onConfirm("edit"); }}>
            <DialogHeader className="pb-6 border-b border-slate-50">
              <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
                Modify Identity
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">
                 Overwrite base user parameters and access levels.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-8">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Full Identity Name</Label>
                <Input 
                  value={selectedUser.name || ""}
                  onChange={(e) => onUserUpdate?.({...selectedUser, name: e.target.value})}
                  className="h-14 bg-slate-50/50 border-slate-200/60 text-slate-900 placeholder:text-slate-400 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Phone Protocol</Label>
                <Input 
                  value={selectedUser.number || ""}
                  onChange={(e) => onUserUpdate?.({...selectedUser, number: e.target.value})}
                  className="h-14 bg-slate-50/50 border-slate-200/60 text-slate-900 placeholder:text-slate-400 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all font-bold"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Administrative Role</Label>
                <div className="grid grid-cols-2 gap-4">
                   <RoleOption 
                      active={selectedUser.role === "user"} 
                      label="Standard User" 
                      onClick={() => onUserUpdate?.({...selectedUser, role: "user"})} 
                   />
                   <RoleOption 
                      active={selectedUser.role === "admin"} 
                      label="Administrator" 
                      onClick={() => onUserUpdate?.({...selectedUser, role: "admin"})} 
                   />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3 sm:flex-row">
              <Button 
                type="button"
                variant="ghost" 
                onClick={onClose} 
                className="flex-1 h-14 border border-slate-200/60 text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl transition-all"
              >
                Abort
              </Button>
              <Button 
                type="submit"
                disabled={loading}
                className="flex-[2] h-14 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Commit Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={mode === "delete" || mode === "ban"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-white border-none shadow-2xl max-w-sm rounded-3xl p-8 animate-in zoom-in-95 duration-300">
           <DialogHeader className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all duration-700 animate-pulse ${
                 mode === "delete" ? "bg-rose-50 text-rose-500 shadow-rose-200/20" : (selectedUser.is_banned ? "bg-emerald-50 text-emerald-500 shadow-emerald-200/20" : "bg-orange-50 text-orange-500 shadow-orange-200/20")
              }`}>
                 {mode === "delete" ? <Trash2 className="w-8 h-8" /> : (selectedUser.is_banned ? <UserCheck className="w-8 h-8" /> : <Ban className="w-8 h-8" />)}
              </div>
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter text-center">
                 {mode === "delete" ? "Delete Node" : (selectedUser.is_banned ? "Restore Node" : "Ban Identity")}
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium text-center pt-2">
                 {mode === "delete" 
                    ? `Permanent removal of ${selectedUser.name} from global index? This action is irreversible.` 
                    : (selectedUser.is_banned 
                       ? `Restore full platform privileges for ${selectedUser.name}?` 
                       : `Indefinite restriction for ${selectedUser.name} security protocol.`)
                 }
              </DialogDescription>
           </DialogHeader>
           <DialogFooter className="pt-8 sm:flex-row gap-3">
              <Button variant="ghost" onClick={onClose} className="flex-1 h-12 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 font-black uppercase text-[10px] rounded-xl transition-all">Cancel</Button>
              <Button 
                onClick={() => onConfirm(mode!)} 
                disabled={loading}
                className={`flex-1 h-12 font-black uppercase text-[10px] rounded-xl transition-all shadow-lg active:scale-95 ${
                   mode === "delete" ? "bg-rose-600 hover:bg-rose-500 text-white" : (selectedUser.is_banned ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-orange-600 hover:bg-orange-500 text-white")
                }`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Action"}
              </Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function InfoCard({ icon, label, value, valueClass }: any) {
   return (
      <div className="bg-slate-50/50 border border-slate-100/60 p-4 rounded-2xl flex items-center gap-4 hover:bg-white hover:border-blue-200/50 transition-all duration-300 group">
         <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/40 flex items-center justify-center text-blue-500 shadow-sm transition-transform">
            {icon}
         </div>
         <div className="space-y-0.5">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">{label}</p>
            <p className={`text-xs font-bold tracking-tight ${valueClass || "text-slate-900"}`}>{value}</p>
         </div>
      </div>
   )
}

function RoleOption({ active, label, onClick }: any) {
   return (
      <button 
         type="button"
         onClick={onClick}
         className={`p-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-95 relative overflow-hidden group ${
            active ? "bg-blue-600/10 border-blue-500 text-blue-700 shadow-xl shadow-blue-500/10" : "bg-slate-50/50 border-slate-100/80 text-slate-400 hover:border-slate-200 hover:text-slate-600"
         }`}
      >
         {label}
         {active && (
            <div className="absolute right-2 top-2 p-1 bg-blue-500 rounded-lg shadow-lg">
               <UserCheck className="w-3 h-3 text-white" />
            </div>
         )}
      </button>
   )
}
