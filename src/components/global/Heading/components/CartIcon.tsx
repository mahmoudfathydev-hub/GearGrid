import { ShoppingCart } from "lucide-react";

interface CartIconProps {
  itemCount?: number;
  onClick?: () => void;
  className?: string;
}

export const CartIcon = ({ 
  itemCount = 0, 
  onClick, 
  className = "" 
}: CartIconProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors ${className}`}
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
};
