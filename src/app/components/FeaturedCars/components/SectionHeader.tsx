import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  highlight: string;
  description: string;
  prevEl: string;
  nextEl: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  highlight, 
  description, 
  prevEl, 
  nextEl 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
      <div className="max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
          {title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
            {highlight}
          </span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      
      <div className="flex gap-3">
        <button className={`${prevEl.replace('.', '')} w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300`}>
          <ChevronLeft size={20} />
        </button>
        <button className={`${nextEl.replace('.', '')} w-12 h-12 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300`}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default SectionHeader;
