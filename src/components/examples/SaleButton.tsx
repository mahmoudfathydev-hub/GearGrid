import React from "react";
import { useSales } from "../../hooks/useSales";
import { Cars } from "../../store/Cars/types";

interface SaleButtonProps {
  car: Cars;
}

export const SaleButton: React.FC<SaleButtonProps> = ({ car }) => {
  const { sellCar, loading, error, lastSale, clearError, clearLastSaleSuccess } = useSales();

  const handleSellCar = async () => {
    if (!window.confirm(`Are you sure you want to sell ${car.name}?`)) {
      return;
    }

    try {
      const result = await sellCar(car.id);
      
      if (result.meta.requestStatus === 'fulfilled') {
        console.log('Car sold successfully!');
        // You can show a success message here
        // The sold car will automatically be removed from the cars list
        // and the sold cars list will be updated
      } else if (result.meta.requestStatus === 'rejected') {
        console.error('Failed to sell car:', error);
        // You can show an error message here
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  React.useEffect(() => {
    if (lastSale) {
      console.log('Last sale:', lastSale);
      // Clear the success message after 3 seconds
      const timer = setTimeout(() => {
        clearLastSaleSuccess();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [lastSale, clearLastSaleSuccess]);

  return (
    <div>
      <button
        onClick={handleSellCar}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
      >
        {loading ? 'Selling...' : 'Sell Car'}
      </button>
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          Error: {error}
          <button
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
      
      {lastSale && (
        <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
          {lastSale.message}
        </div>
      )}
    </div>
  );
};
