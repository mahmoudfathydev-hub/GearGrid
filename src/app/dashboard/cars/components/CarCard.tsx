import React, { useState, useEffect } from "react";
import { Car } from "../types/cars";
import { Calendar, DollarSign, Fuel, Settings, Tag } from "lucide-react";

interface CarCardProps {
  car: Car;
  isRecentlyAdded?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  isRecentlyAdded = false,
}) => {
  const [availabilityStatus, setAvailabilityStatus] =
    useState<string>("available");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSoldStatus = async () => {
      try {
        setLoading(true);
        // Check if car exists in Sold_Cars table
        const { checkIfCarSold } = await import("../../../../lib/supabase");
        const isSold = await checkIfCarSold(Number(car.id));
        setAvailabilityStatus(isSold ? "sold" : "available");
      } catch (error) {
        console.error("Error checking sold status:", error);
        setAvailabilityStatus("available");
      } finally {
        setLoading(false);
      }
    };

    checkSoldStatus();
  }, [car.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAvailabilityColor = (status?: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "sold":
        return "bg-red-100 text-red-800 border-red-200";
      case "reserved":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAvailabilityText = (status?: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "sold":
        return "Sold";
      case "reserved":
        return "Reserved";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {isRecentlyAdded && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            New
          </span>
        </div>
      )}

      {/* SOLD Badge - Prominent red badge */}
      {availabilityStatus === "sold" && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg">
            SOLD
          </span>
        </div>
      )}

      <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative overflow-hidden">
        {car.image ? (
          <img
            src={car.image}
            alt={`${car.brand} ${car.name}`}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/placeholder.png";
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg"></div>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full border ${getAvailabilityColor(
              availabilityStatus,
            )}`}
          >
            {loading ? (
              <span className="animate-pulse">Checking...</span>
            ) : (
              getAvailabilityText(availabilityStatus)
            )}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {car.brand} {car.name}
          </h3>
          {car.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {car.description}
            </p>
          )}
        </div>

        <div className="mb-3">
          <div className="flex items-center text-2xl font-bold text-gray-900">
            <DollarSign className="w-5 h-5 mr-1 text-gray-500" />
            {formatPrice(car.price)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          {car.year && (
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {car.year}
            </div>
          )}
          {car.mileage !== undefined && (
            <div className="flex items-center text-gray-600">
              <Settings className="w-4 h-4 mr-1" />
              {car.mileage.toLocaleString()} mi
            </div>
          )}
          {car.fuel_type && (
            <div className="flex items-center text-gray-600">
              <Fuel className="w-4 h-4 mr-1" />
              {car.fuel_type}
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center text-gray-600">
              <Settings className="w-4 h-4 mr-1" />
              {car.transmission}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          {car.color && (
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-1 border border-gray-300"
                style={{ backgroundColor: car.color.toLowerCase() }}
              ></div>
              <span>{car.color}</span>
            </div>
          )}
          <div className="flex items-center">
            <Tag className="w-3 h-3 mr-1" />
            Added {formatDate(car.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};
