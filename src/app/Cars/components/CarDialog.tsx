import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car } from "@/types/car";
import { useCartAndFavorites } from "@/hooks/useCartAndFavorites";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CarDialogProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CarDialog({ car, isOpen, onClose }: CarDialogProps) {
  const router = useRouter();
  const { addToCart, addToFavorites, isFavorite, isInCart } = useCartAndFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!car) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const favorite = isFavorite(car.id);
  const inCart = isInCart(car.id);

  const handleBuyNow = () => {
    if (!inCart) {
      addToCart(car);
    }
    onClose();
    router.push("/Cart");
  };

  const allImages =
    car.images && car.images.length > 0 ? car.images : [car.image];
  const currentImage = allImages[currentImageIndex] || car.image;

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto mx-4 my-4 lg:mx-auto lg:my-8">
        <DialogHeader className="pb-4 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl lg:text-3xl font-bold">
                {car.brand} {car.model}
              </DialogTitle>
              <DialogDescription className="text-base lg:text-lg mt-1">
                {car.year} • {car.carType}
              </DialogDescription>
            </div>
            <div className="text-left lg:text-right">
              <div className="text-2xl lg:text-3xl font-bold text-green-600">
                ${formatNumber(car.price)}
              </div>
              <div className="text-sm text-gray-500">
                {formatNumber(car.mileage)} miles
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-6">
          <div className="lg:col-span-2">
            <div className="relative h-64 lg:h-96 w-full rounded-xl overflow-hidden shadow-md">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={`${car.brand} ${car.model} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    No Image Available
                  </span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${car.brand} ${car.model} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 space-y-6">
              {car.description && (
                <div>
                  <h3 className="text-lg lg:text-xl font-semibold mb-3 border-l-4 border-blue-500 pl-3">
                    Description
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    {car.description}
                  </p>
                </div>
              )}

              {car.features && car.features.length > 0 && (
                <div>
                  <h3 className="text-lg lg:text-xl font-semibold mb-3 border-l-4 border-green-500 pl-3">
                    Features & Amenities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg lg:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Specifications
              </h3>
              <div className="space-y-4">
                <SpecItem label="Engine" value={car.engine} />
                <SpecItem label="Horsepower" value={`${car.horsepower} hp`} />
                <SpecItem label="Fuel Type" value={car.fuelType} />
                <SpecItem label="Transmission" value={car.transmission} />
                <SpecItem label="Color" value={car.color} />
                <SpecItem label="Car Type" value={car.carType} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Buy Now <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(car)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all border-2 ${
                    inCart
                      ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <ShoppingCart className={`w-5 h-5 ${inCart ? "fill-current" : ""}`} />
                  {inCart ? "In Cart" : "Add to Cart"}
                </button>
                
                <button
                  onClick={() => addToFavorites(car)}
                  className={`p-4 rounded-xl font-semibold transition-all border-2 ${
                    favorite
                      ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600"
                  }`}
                  aria-label={favorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Heart className={`w-5 h-5 ${favorite ? "fill-current text-red-600" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
      <span className="text-sm lg:text-base text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </span>
      <span className="text-sm lg:text-base font-bold text-gray-900 dark:text-white capitalize">
        {value}
      </span>
    </div>
  );
}

