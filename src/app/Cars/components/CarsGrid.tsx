import { Car } from "@/types/car";
import CarCard from "./CarCard";

interface CarsGridProps {
  cars: Car[];
  onCarClick: (car: Car) => void;
  onAddToCart?: (car: Car) => void;
  onAddToFavorites?: (car: Car) => void;
  favoriteCars?: string[];
  cartCars?: string[];
}

export default function CarsGrid({
  cars,
  onCarClick,
  onAddToCart,
  onAddToFavorites,
  favoriteCars = [],
  cartCars = [],
}: CarsGridProps) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No cars found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          onClick={() => onCarClick(car)}
          onAddToCart={onAddToCart}
          onAddToFavorites={onAddToFavorites}
          isFavorite={favoriteCars.includes(car.id)}
          isInCart={cartCars.includes(car.id)}
        />
      ))}
    </div>
  );
}
