import { TrendingUp } from "lucide-react";

const InventoryCallout: React.FC = () => {
  return (
    <div className="mt-12 p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4 text-center md:text-left">
        <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600">
          <TrendingUp size={24} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">Looking for something specific?</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Browse our full inventory of over 200+ certified pre-owned vehicles.</p>
        </div>
      </div>
      <button className="whitespace-nowrap px-8 py-3 rounded-full border border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
        View All Inventory
      </button>
    </div>
  );
}

export default InventoryCallout;
