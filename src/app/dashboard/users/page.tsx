"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabaseBrowser";
import { toast } from "sonner";

// Modular Components
import UserHeader from "./components/UserHeader";
import UserTable from "./components/UserTable";
import ActionDialogs from "./components/ActionDialogs";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  number: string;
  created_at: string;
  is_banned: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "delete" | "ban" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to synchronize user profiles.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (mode: string) => {
    if (!selectedUser) return;
    
    setActionLoading(true);
    try {
      let error;
      if (mode === "edit") {
        ({ error } = await supabase
          .from("User")
          .update({
            name: selectedUser.name,
            role: selectedUser.role,
            number: selectedUser.number,
          })
          .eq("email", selectedUser.email));
      } else if (mode === "delete") {
        ({ error } = await supabase
          .from("User")
          .delete()
          .eq("email", selectedUser.email));
      } else if (mode === "ban") {
        ({ error } = await supabase
          .from("User")
          .update({ is_banned: !selectedUser.is_banned })
          .eq("email", selectedUser.email));
      }

      if (error) throw error;
      
      const actionVerb = mode === "edit" ? "updated" : (mode === "delete" ? "deleted" : (selectedUser.is_banned ? "restored" : "banned"));
      toast.success(`Identity protocol successfully ${actionVerb}.`);
      
      fetchUsers();
      setDialogMode(null);
    } catch (error: any) {
      toast.error(error.message || "Platform protocol error encountered.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [users, searchQuery]
  );

  return (
    <div className="p-10 min-h-screen bg-transparent animate-in fade-in duration-1000">
      <div className="max-w-[1400px] mx-auto">
        <UserHeader 
           searchQuery={searchQuery} 
           setSearchQuery={setSearchQuery} 
           totalUsers={users.length} 
        />
        
        <UserTable 
           users={filteredUsers} 
           loading={loading}
           onAction={(user, mode) => { setSelectedUser(user); setDialogMode(mode); }}
        />

        <ActionDialogs 
           mode={dialogMode}
           loading={actionLoading}
           selectedUser={selectedUser}
           onClose={() => { setDialogMode(null); if (!actionLoading) setSelectedUser(null); }}
           onConfirm={handleAction}
           onUserUpdate={(updated) => setSelectedUser(updated)}
        />
      </div>
    </div>
  );
}
