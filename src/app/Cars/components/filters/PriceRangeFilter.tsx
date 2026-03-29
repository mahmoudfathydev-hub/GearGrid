interface PriceRangeFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onMinPriceChange: (value: number | undefined) => void;
  onMaxPriceChange: (value: number | undefined) => void;
}

export default function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceRangeFilterProps) {
  const isMinInvalid = minPrice !== undefined && minPrice < 1000;
  const isMaxInvalid = maxPrice !== undefined && maxPrice > 100000000;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice || ""}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : undefined;
            onMinPriceChange(val);
          }}
          className={`w-full sm:w-32 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors ${
            isMinInvalid
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        <span className="text-gray-500 dark:text-gray-400">-</span>
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice || ""}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : undefined;
            onMaxPriceChange(val);
          }}
          className={`w-full sm:w-32 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors ${
            isMaxInvalid
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
      </div>
      {(isMinInvalid || isMaxInvalid) && (
        <span className="text-[10px] text-red-500 px-1">
          {isMinInvalid ? "Min 1,000" : isMaxInvalid ? "Max 100M" : ""}
        </span>
      )}
    </div>
  );
}

