"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  value?: string;
  onChange: (value: string) => void;
}

const sortOptions: SortOption[] = [
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "year-new", label: "Newest" },
  { value: "year-old", label: "Oldest" },
  { value: "mileage-low", label: "Mileage: Low to High" },
  { value: "mileage-high", label: "Mileage: High to Low" },
  { value: "name-az", label: "Name: A-Z" },
  { value: "name-za", label: "Name: Z-A" },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full sm:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          {sortOptions.find((opt) => opt.value === value)?.label || "Sort"}
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={
              value === option.value ? "bg-gray-100 dark:bg-gray-700" : ""
            }
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
