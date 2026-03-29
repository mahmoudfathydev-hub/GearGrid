import { useAppSelector, useAppDispatch } from './index';
import { selectUsers, fetchUsers, deleteUser } from '@/store/User/UserSlice';
import { createClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Signed out successfully');
      router.push('/signin');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      console.error('Sign out error:', error);
    }
  };

  const handleDeleteAccount = async (userEmail: string) => {
    try {
      // Delete user from User table
      const { error: dbError } = await supabase
        .from('User')
        .delete()
        .eq('email', userEmail);
      
      if (dbError) throw dbError;

      // Sign out from auth
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;

      toast.success('Account deleted successfully');
      router.push('/signup');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
      console.error('Delete account error:', error);
    }
  };

  const getCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user;
  };

  return {
    users,
    fetchUsers: () => dispatch(fetchUsers()),
    deleteUser: (id: number) => dispatch(deleteUser(id)),
    signOut: handleSignOut,
    deleteAccount: handleDeleteAccount,
    getCurrentUser,
  };
};
