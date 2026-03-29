import { Heart } from "lucide-react";

interface HeartIconProps {
  isLiked?: boolean;
  itemCount?: number;
  onClick?: () => void;
  className?: string;
}

export const HeartIcon = ({ isLiked = false, itemCount = 0, onClick, className = "" }: HeartIconProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg transition-colors flex items-center outline-none ${
        isLiked 
          ? "text-red-500" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
      } ${className}`}
      aria-label="Wishlist"
    >
      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
};
