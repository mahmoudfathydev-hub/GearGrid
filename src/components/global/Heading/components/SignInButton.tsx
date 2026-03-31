import { User } from "lucide-react";
import { useRouter } from "next/navigation";

interface SignInButtonProps {
  userName?: string;
  onClick?: () => void;
  className?: string;
  isLoggedIn?: boolean;
}

export const SignInButton = ({
  userName = "Account",
  onClick,
  className = "",
  isLoggedIn = false,
}: SignInButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (!isLoggedIn) {
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 ${className}`}
    >
      <User className="w-4 h-4" />
      <span>{isLoggedIn ? "Sign out" : "Sign in"}</span>
    </button>
  );
};
