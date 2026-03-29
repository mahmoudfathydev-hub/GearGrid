export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
  transmission: "manual" | "automatic";
  carType: "sedan" | "suv" | "coupe" | "convertible" | "hatchback" | "truck";
  mileage: number;
  engine: string;
  horsepower: number;
  color: string;
  image: string;
  images?: string[]; // Add all images array
  description?: string;
  features?: string[];
}
