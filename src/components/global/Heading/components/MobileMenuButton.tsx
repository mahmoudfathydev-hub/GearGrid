import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen?: boolean;
  onClick?: () => void;
}

export const MobileMenuButton = ({ isOpen = false, onClick }: MobileMenuButtonProps) => {
  return (
    <div className="flex items-center md:hidden">
      <button
        onClick={onClick}
        type="button"
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        <span className="sr-only">Toggle menu</span>
        {isOpen ? (
          <X className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};
