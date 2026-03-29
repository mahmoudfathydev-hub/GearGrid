"use client";

import { useState, useMemo } from "react";
import { useCars } from "./useCars";
import { Cars } from "@/store/Cars/types";

interface ComparisonData {
  performance: {
    engine: string;
    horsepower: number;
    transmission: string;
  };
  fuelEfficiency: {
    fuelType: string;
    mileage: number;
  };
  price: number;
  pros: string[];
  cons: string[];
}

interface ComparisonResult {
  cars: Cars[];
  comparison: ComparisonData[];
  bestPerformers: {
    performance: string;
    fuelEfficiency: string;
    price: string;
  };
  worstPerformers: {
    performance: string;
    fuelEfficiency: string;
    price: string;
  };
}

export const useCarComparison = () => {
  const { cars } = useCars();
  const [selectedCarIds, setSelectedCarIds] = useState<string[]>([]);

  const availableCars = useMemo(() => {
    return cars;
  }, [cars]);

  const addCarToComparison = (carId: number) => {
    if (selectedCarIds.length >= 3) {
      return {
        success: false,
        message: "You can compare a maximum of 3 cars.",
      };
    }
    if (selectedCarIds.includes(carId.toString())) {
      return {
        success: false,
        message: "Car already selected for comparison.",
      };
    }
    setSelectedCarIds((prev) => [...prev, carId.toString()]);
    return { success: true, message: "Car added to comparison." };
  };

  const removeCarFromComparison = (carId: number) => {
    setSelectedCarIds((prev) => prev.filter((id) => id !== carId.toString()));
  };

  const clearComparison = () => {
    setSelectedCarIds([]);
  };

  const generateComparison = (): ComparisonResult | null => {
    if (selectedCarIds.length < 2) {
      return null;
    }

    const selectedCars = availableCars.filter((car) =>
      selectedCarIds.includes(car.id.toString()),
    );

    const comparison: ComparisonData[] = selectedCars.map((car) => ({
      performance: {
        engine: car.engine || "Unknown",
        horsepower: car.horse_power || 0,
        transmission: car.transmission || "Unknown",
      },
      fuelEfficiency: {
        fuelType: car.fuel_type || "Unknown",
        mileage: car.miles || 0,
      },
      price: car.price || 0,
      pros: generatePros(car),
      cons: generateCons(car),
    }));

    // Find best and worst performers
    const bestPerformers = {
      performance: findBestPerformer(selectedCars, "horse_power"),
      fuelEfficiency: findBestPerformer(selectedCars, "miles"),
      price: findBestPerformer(selectedCars, "price", "lowest"),
    };

    const worstPerformers = {
      performance: findWorstPerformer(selectedCars, "horse_power"),
      fuelEfficiency: findWorstPerformer(selectedCars, "miles"),
      price: findWorstPerformer(selectedCars, "price", "highest"),
    };

    return {
      cars: selectedCars,
      comparison,
      bestPerformers,
      worstPerformers,
    };
  };

  const generatePros = (car: Cars): string[] => {
    const pros: string[] = [];

    if (car.horse_power > 200) pros.push("High performance");
    if (car.fuel_type === "electric" || car.fuel_type === "hybrid")
      pros.push("Eco-friendly");
    if (car.miles < 50000) pros.push("Low mileage");
    if (car.year_of_manufacture > 2020) pros.push("Recent model");
    if (car.price < 20000) pros.push("Affordable");
    if (car.transmission === "automatic") pros.push("Easy to drive");
    if (car.car_type === "suv") pros.push("Spacious");
    if (car.car_type === "sedan") pros.push("Comfortable");

    return pros.length > 0 ? pros : ["Standard features"];
  };

  const generateCons = (car: Cars): string[] => {
    const cons: string[] = [];

    if (car.horse_power < 150) cons.push("Lower performance");
    if (car.fuel_type === "gasoline") cons.push("Higher emissions");
    if (car.miles > 100000) cons.push("High mileage");
    if (car.year_of_manufacture < 2018) cons.push("Older model");
    if (car.price > 30000) cons.push("Expensive");
    if (car.transmission === "manual") cons.push("Requires more skill");

    return cons.length > 0 ? cons : ["No major drawbacks"];
  };

  const findBestPerformer = (
    cars: Cars[],
    criteria: keyof Cars,
    direction: "highest" | "lowest" = "highest",
  ): string => {
    if (cars.length === 0) return "";

    let bestCar = cars[0];
    let bestValue = bestCar[criteria] as number;

    for (let i = 1; i < cars.length; i++) {
      const currentValue = cars[i][criteria] as number;
      if (direction === "highest" && currentValue > bestValue) {
        bestCar = cars[i];
        bestValue = currentValue;
      } else if (direction === "lowest" && currentValue < bestValue) {
        bestCar = cars[i];
        bestValue = currentValue;
      }
    }

    return `${bestCar.brand} ${bestCar.name}`;
  };

  const findWorstPerformer = (
    cars: Cars[],
    criteria: keyof Cars,
    direction: "highest" | "lowest" = "highest",
  ): string => {
    return findBestPerformer(
      cars,
      criteria,
      direction === "highest" ? ("lowest" as "highest" | "lowest") : "highest",
    );
  };

  const answerFollowUpQuestion = (
    question: string,
    comparisonResult: ComparisonResult,
  ): string => {
    const { cars, comparison, bestPerformers, worstPerformers } =
      comparisonResult;

    const lowerQuestion = question.toLowerCase();

    // City driving considerations
    if (lowerQuestion.includes("city") || lowerQuestion.includes("urban")) {
      const bestForCity = cars.reduce((best, car) => {
        const carScore =
          (car.fuel_type === "hybrid" || car.fuel_type === "electric" ? 2 : 0) +
          (car.transmission === "automatic" ? 1 : 0) +
          (car.car_type === "hatchback" || car.car_type === "sedan" ? 1 : 0);
        const bestScore =
          (best.fuel_type === "hybrid" || best.fuel_type === "electric"
            ? 2
            : 0) +
          (best.transmission === "automatic" ? 1 : 0) +
          (best.car_type === "hatchback" || best.car_type === "sedan" ? 1 : 0);
        return carScore > bestScore ? car : best;
      });

      return `For city driving, I recommend the ${bestForCity.brand} ${bestForCity.name}. It's ${bestForCity.fuel_type === "hybrid" || bestForCity.fuel_type === "electric" ? "eco-friendly" : "efficient"} with ${bestForCity.transmission} transmission, making it ideal for stop-and-go traffic. Its ${bestForCity.car_type} body style is also perfect for urban driving.`;
    }

    // Maintenance costs
    if (
      lowerQuestion.includes("maintenance") ||
      lowerQuestion.includes("cost")
    ) {
      const lowestMaintenance = cars.reduce((lowest, car) => {
        const carScore =
          (car.fuel_type === "gasoline" ? 2 : 0) +
          (car.miles < 50000 ? 1 : 0) +
          (car.year_of_manufacture > 2018 ? 1 : 0);
        const lowestScore =
          (lowest.fuel_type === "gasoline" ? 2 : 0) +
          (lowest.miles < 50000 ? 1 : 0) +
          (lowest.year_of_manufacture > 2018 ? 1 : 0);
        return carScore > lowestScore ? car : lowest;
      });

      return `The ${lowestMaintenance.brand} ${lowestMaintenance.name} likely has the lowest maintenance costs. It's a ${lowestMaintenance.fuel_type} vehicle with ${lowestMaintenance.miles < 50000 ? "low mileage" : "reasonable mileage"} and being a ${lowestMaintenance.year_of_manufacture} model, parts are readily available.`;
    }

    // Long trips
    if (
      lowerQuestion.includes("long") ||
      lowerQuestion.includes("highway") ||
      lowerQuestion.includes("trip")
    ) {
      const bestForTrips = cars.reduce((best, car) => {
        const carScore =
          (car.horse_power > 200 ? 2 : 0) +
          (car.car_type === "suv" || car.car_type === "sedan" ? 1 : 0) +
          (car.fuel_type === "gasoline" || car.fuel_type === "hybrid" ? 1 : 0);
        const bestScore =
          (best.horse_power > 200 ? 2 : 0) +
          (best.car_type === "suv" || best.car_type === "sedan" ? 1 : 0) +
          (best.fuel_type === "gasoline" || best.fuel_type === "hybrid"
            ? 1
            : 0);
        return carScore > bestScore ? car : best;
      });

      return `For long trips, the ${bestForTrips.brand} ${bestForTrips.name} is your best bet. With ${bestForTrips.horse_power} HP, it has plenty of power for highway driving. The ${bestForTrips.car_type} body style offers comfort and space, and its ${bestForTrips.fuel_type} engine provides good range.`;
    }

    // Default response
    return (
      "Based on the comparison data, consider your specific needs. The " +
      bestPerformers.performance +
      " offers the best performance, the " +
      bestPerformers.fuelEfficiency +
      " is most fuel-efficient, and the " +
      bestPerformers.price +
      " provides the best value."
    );
  };

  return {
    selectedCarIds,
    availableCars,
    addCarToComparison,
    removeCarFromComparison,
    clearComparison,
    generateComparison,
    answerFollowUpQuestion,
  };
};
