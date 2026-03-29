import React, { useState } from "react";
import { useSales } from "../../../../hooks/useSales";
import { useReduxCars } from "../../../../hooks/useReduxCars";
import { Car as CarIcon } from "lucide-react";

export const RecordSaleForm: React.FC = () => {
  const { sellCar, loading, error, lastSale, clearError, clearLastSaleSuccess } = useSales();
  const { cars } = useReduxCars();
  const [selectedCarId, setSelectedCarId] = useState<string>("");

  const availableCars = cars.filter(car => car.id); // Filter out any invalid cars

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCarId) {
      alert("Please select a car to sell");
      return;
    }

    try {
      const result = await sellCar(Number(selectedCarId));
      
      if (result.meta.requestStatus === 'fulfilled') {
        setSelectedCarId(""); // Reset form
        // Success message will be shown via the hook
      }
    } catch (err) {
      console.error('Error selling car:', err);
    }
  };

  React.useEffect(() => {
    if (lastSale) {
      // Clear the success message after 3 seconds
      const timer = setTimeout(() => {
        clearLastSaleSuccess();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [lastSale, clearLastSaleSuccess]);

  if (availableCars.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CarIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No cars available to sell
        </h3>
        <p className="text-gray-600">
          Add cars to the inventory first before recording sales.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CarIcon className="w-6 h-6 text-blue-600" />
            Record New Sale
          </h2>
          <p className="text-gray-600 mt-1">
            Select a car to mark as sold
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="car-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Car to Sell
            </label>
            <select
              id="car-select"
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Choose a car...</option>
              {availableCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.name} - ${car.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading || !selectedCarId}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              {loading ? 'Processing Sale...' : 'Record Sale'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {lastSale && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
            <p className="text-green-700 text-sm font-medium">
              ✓ {lastSale.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
