import { z } from "zod";

export const carSchema = z.object({
  name: z
    .string()
    .min(1, "Car name is required")
    .min(2, "Name must be at least 2 characters"),
  "car-type": z.string().min(1, "Car type is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z
    .number()
    .min(0, "Price must be positive")
    .min(100, "Price must be at least $100"),
  fuel_type: z.string().min(1, "Fuel type is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  features_amenities: z
    .array(z.string())
    .min(1, "At least one feature is required"),
  engine: z
    .string()
    .min(1, "Engine details are required")
    .min(2, "Engine details must be at least 2 characters"),
  horse_power: z
    .number()
    .min(0, "Horse power must be positive")
    .min(50, "Horse power must be at least 50"),
  transmission: z.string().min(1, "Transmission type is required"),
  color: z
    .string()
    .min(1, "Color is required")
    .min(2, "Color must be at least 2 characters"),
  miles: z.number().min(0, "Miles must be positive"),
  year_of_manufacture: z
    .number()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the distant future"),
  image_urls: z
    .array(z.string().url("Invalid image URL"))
    .min(0, "At least one image is required"),
});

export type CarFormData = z.infer<typeof carSchema>;

export const initialCarTypes = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Pickup",
  "Electric",
];
export const initialFuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid"];
export const initialBrands = [
  "BMW",
  "Mercedes",
  "Toyota",
  "Tesla",
  "Audi",
  "Ford",
  "Honda",
  "Chevrolet",
  "Nissan",
  "Volkswagen",
];
export const initialTransmissions = ["Automatic", "Manual"];
