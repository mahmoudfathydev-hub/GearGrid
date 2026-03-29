import { Search } from "lucide-react";
import { FormEvent, useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({ 
  onSearch, 
  placeholder = "Search Cars...", 
  className = "" 
}: SearchInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      role="form"
      onSubmit={handleSubmit} 
      className={`relative ${className}`}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          const newQuery = e.target.value;
          setQuery(newQuery);
          onSearch(newQuery);
        }}
        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        placeholder={placeholder}
      />
    </form>
  );
};
