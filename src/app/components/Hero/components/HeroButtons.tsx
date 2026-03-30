"use client";

import { useRouter } from "next/navigation";

interface HeroButtonsProps {
  onExplore?: () => void;
  onBook?: () => void;
}

export const HeroButtons = ({ onExplore, onBook }: HeroButtonsProps) => {
  const router = useRouter();

  const handleExplore = () => {
    router.push("/Cars");
    onExplore?.();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
      <button
        onClick={handleExplore}
        className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30"
      >
        Explore Models
      </button>
      <button
        onClick={onBook}
        className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-semibold text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        Book Test Drive
      </button>
    </div>
  );
};
