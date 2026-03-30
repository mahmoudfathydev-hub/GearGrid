import { Cars } from "@/store/Cars/types";

export const mockCars: Cars[] = [
  {
    id: 1,
    created_at: "2024-01-15T10:00:00Z",
    name: "Luxury Sedan",
    car_type: "Sedan",
    brand: "Mercedes",
    price: 75000,
    fuel_type: "Gasoline",
    description: "Premium luxury sedan with advanced features",
    features_amenities: "Leather seats, Sunroof, Navigation, Premium audio",
    engine: "V6 Twin Turbo",
    horse_power: 362,
    transmission: "Automatic",
    color: "Black",
    miles: 15000,
    year_of_manufacture: 2023,
    image_urls: '["https://example.com/car1.jpg", "https://example.com/car1-2.jpg"]',
  },
  {
    id: 2,
    created_at: "2024-01-20T14:30:00Z",
    name: "Sports Coupe",
    car_type: "Coupe",
    brand: "BMW",
    price: 85000,
    fuel_type: "Gasoline",
    description: "High-performance sports coupe",
    features_amenities: "Sport seats, M package, Adaptive suspension",
    engine: "Inline-6 Twin Turbo",
    horse_power: 503,
    transmission: "Automatic",
    color: "Blue",
    miles: 8000,
    year_of_manufacture: 2024,
    image_urls: ["https://example.com/car2.jpg"],
  },
  {
    id: 3,
    created_at: "2024-02-01T09:15:00Z",
    name: "Electric SUV",
    car_type: "SUV",
    brand: "Tesla",
    price: 95000,
    fuel_type: "Electric",
    description: "All-electric luxury SUV with autopilot",
    features_amenities: "Autopilot, Premium audio, Full self-driving",
    engine: "Electric Dual Motor",
    horse_power: 670,
    transmission: "Single-speed",
    color: "White",
    miles: 5000,
    year_of_manufacture: 2024,
    image_urls: ["https://example.com/car3.jpg", "https://example.com/car3-2.jpg"],
  },
];

export const mockEmptyCars: Cars[] = [];

export const mockLargeCarsDataset: Cars[] = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  created_at: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
  name: `Car ${index + 1}`,
  car_type: ["Sedan", "SUV", "Coupe", "Truck"][index % 4],
  brand: ["Mercedes", "BMW", "Tesla", "Audi"][index % 4],
  price: 50000 + index * 2000,
  fuel_type: ["Gasoline", "Electric", "Hybrid"][index % 3],
  description: `Description for car ${index + 1}`,
  features_amenities: `Feature ${index + 1}, Feature ${index + 2}`,
  engine: `Engine ${index + 1}`,
  horse_power: 200 + index * 10,
  transmission: "Automatic",
  color: ["Black", "White", "Blue", "Red"][index % 4],
  miles: index * 1000,
  year_of_manufacture: 2020 + (index % 5),
  image_urls: [`https://example.com/car${index + 1}.jpg`],
}));

export const mockMalformedCars: (Partial<Cars> & { id: number })[] = [
  {
    id: 1,
    name: "Car with missing fields",
    // Missing many required fields
    price: 50000,
  },
  {
    id: 2,
    name: "Car with null values",
    brand: null as any,
    price: null as any,
    image_urls: null as any,
  },
  {
    id: 3,
    name: "Car with invalid image_urls",
    image_urls: "invalid json string",
    price: 60000,
  },
];

export const mockSearchParams = {
  unauthorized: { error: "unauthorized" },
  normal: {},
  multiple: { error: "unauthorized", other: "value" },
};
