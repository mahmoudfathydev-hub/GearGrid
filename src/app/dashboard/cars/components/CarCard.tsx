import React from "react";
import Image from "next/image";
import { Car } from "../types/cars";
import { Calendar, Fuel, Settings, Tag } from "lucide-react";

interface CarCardProps {
  car: Car;
  isRecentlyAdded?: boolean;
  forceSoldStatus?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  isRecentlyAdded = false,
  forceSoldStatus = false,
}) => {
  // Since we're using Redux stores and filtering sold cars in useReduxCars,
  // we don't need to check sold status here
  const availabilityStatus = forceSoldStatus ? "sold" : "available";

  // Helper function to validate and get proper image URL
  const getImageUrl = (image?: string, images?: string[]) => {
    console.log("getImageUrl called with:", { image, images });

    // Try single image first
    if (image && typeof image === "string" && image.trim() !== "") {
      console.log("Using single image:", image);

      // Check if it's a JSON array string
      if (image.startsWith("[")) {
        try {
          const parsed = JSON.parse(image);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log("Parsed JSON array, using first image:", parsed[0]);
            return parsed[0];
          }
        } catch (e) {
          console.log("Failed to parse JSON array");
        }
      }

      // Skip malformed URLs that start with { or other invalid characters
      if (image.startsWith("{") || !image.includes("/")) {
        console.log("Invalid image format, using placeholder");
        return "/images/1.png";
      }
      return image;
    }

    // Try images array
    if (images && Array.isArray(images) && images.length > 0) {
      const firstImage = images[0];
      console.log("Using images array, first image:", firstImage);
      if (
        firstImage &&
        typeof firstImage === "string" &&
        firstImage.trim() !== ""
      ) {
        // Skip malformed URLs
        if (
          firstImage.startsWith("[") ||
          firstImage.startsWith("{") ||
          !firstImage.includes("/")
        ) {
          console.log("Invalid array image format, using placeholder");
          return "/images/1.png";
        }
        return firstImage;
      }
    }

    console.log("No valid image found, using placeholder");
    return "/images/1.png"; // Test with known working image
  };

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
        return "bg-blue-100 text-blue-800 border-blue-200";
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
        return "Available";
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
        {(() => {
          const imageUrl = getImageUrl(car.image, car.images);
          const isLocalImage = imageUrl.startsWith("/images/");

          if (isLocalImage) {
            return (
              <img
                src={imageUrl}
                alt={`${car.brand} ${car.name}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder.png";
                }}
              />
            );
          }

          return (
            <Image
              src={imageUrl}
              alt={`${car.brand} ${car.name}`}
              width={400}
              height={192}
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder.png";
              }}
            />
          );
        })()}
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full border ${getAvailabilityColor(
              availabilityStatus,
            )}`}
          >
            {getAvailabilityText(availabilityStatus)}
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
