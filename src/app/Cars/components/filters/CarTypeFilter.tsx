"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CarTypeFilterProps {
  value?: string;
  onChange: (value: string) => void;
  options?: string[];
}

export default function CarTypeFilter({ value, onChange, options = [] }: CarTypeFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full sm:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          {value || "Car Type"}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem onClick={() => onChange("")}>
          <span className="text-gray-500">All Types</span>
        </DropdownMenuItem>
        {options.map((type) => (
          <DropdownMenuItem
            key={type}
            onClick={() => onChange(type)}
            className={value?.toLowerCase() === type.toLowerCase() ? "bg-gray-100 dark:bg-gray-700" : ""}
          >
            {type}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
