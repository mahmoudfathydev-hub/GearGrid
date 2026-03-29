import { User } from "lucide-react";

interface SignInButtonProps {
  userName?: string;
  onClick?: () => void;
  className?: string;
}

export const SignInButton = ({ 
  userName = "Account", 
  onClick, 
  className = "" 
}: SignInButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 ${className}`}
    >
      <User className="w-4 h-4" />
      <span>Sign out</span>
    </button>
  );
};
