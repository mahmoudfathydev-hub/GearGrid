"use client";

import { useState, useEffect, useRef } from "react";
import { useCarComparison } from "@/hooks/useCarComparison";
import { fetchCars } from "@/store/Cars/CarsSlice";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CarSelectionSection, ComparePageHeader } from "./components";
import { Cars } from "@/store/Cars/types";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "redux";

interface PerformanceDetails {
  engine: string;
  horsepower: number;
  transmission: string;
}

interface FuelEfficiencyDetails {
  fuelType: string;
  mileage: number;
}

interface ComparisonData {
  performance: PerformanceDetails;
  fuelEfficiency: FuelEfficiencyDetails;
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

export default function ComparePage() {
  const dispatch: ThunkDispatch<unknown, unknown, AnyAction> = useDispatch();

  const {
    availableCars,
    selectedCarIds,
    addCarToComparison,
    removeCarFromComparison,
    clearComparison,
    generateComparison,
    answerFollowUpQuestion,
  } = useCarComparison();

  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; sender: "user" | "bot"; timestamp: Date }>
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const handleAskQuestion = async () => {
    if (!input.trim() || !comparisonResult) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = answerFollowUpQuestion(input, comparisonResult);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot" as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  // Add welcome message when comparison is generated
  useEffect(() => {
    if (comparisonResult && comparisonResult.cars.length > 0) {
      const welcomeMessage = {
        id: Date.now().toString(),
        text: `🚗 **Car Comparison AI Assistant**\n\nI've analyzed your comparison of ${comparisonResult.cars.map((car) => `${car.brand} ${car.name}`).join(" vs ")}. Feel free to ask me questions about:\n\n• Which car is better for city driving?\n• Maintenance costs comparison\n• Best choice for long trips\n• Overall value for money\n• Any specific features you're curious about`,
        sender: "bot" as const,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [comparisonResult]);

  const handleComparison = () => {
    const result = generateComparison();
    if (result) {
      setComparisonResult(result);
    }
  };

  const formatComparisonTable = (
    result: ComparisonResult,
  ): { headers: string[]; rows: string[][] } | string => {
    if (!result.cars || result.cars.length === 0) {
      return result.bestPerformers?.performance || "Select cars to compare.";
    }

    const headers = [
      "Category",
      ...result.cars.map((car) => `${car.brand} ${car.name}`),
    ];

    const rows = [
      [
        "Performance",
        ...result.comparison.map((comp, index) => {
          const carDetails = `${comp.performance.engine} ${comp.performance.horsepower} HP, ${comp.performance.transmission}`;
          const isBest =
            result.bestPerformers.performance ===
            `${result.cars[index].brand} ${result.cars[index].name}`;
          const isWorst =
            result.worstPerformers.performance ===
            `${result.cars[index].brand} ${result.cars[index].name}`;
          const rating = isBest ? "Best" : isWorst ? "Worst" : "Average";
          return `${comp.performance.horsepower} HP, ${comp.performance.transmission} (${rating})`;
        }),
      ],
      [
        "Fuel Efficiency",
        ...result.comparison.map((comp, index) => {
          const carDetails = `${comp.fuelEfficiency.fuelType}, ${comp.fuelEfficiency.mileage} miles`;
          const isBest =
            result.bestPerformers.fuelEfficiency ===
            `${result.cars[index].brand} ${result.cars[index].name}`;
          const isWorst =
            result.worstPerformers.fuelEfficiency ===
            `${result.cars[index].brand} ${result.cars[index].name}`;
          const rating = isBest ? "Best" : isWorst ? "Worst" : "Average";
          return `${comp.fuelEfficiency.fuelType}, ${comp.fuelEfficiency.mileage} miles (${rating})`;
        }),
      ],
      [
        "Price",
        ...result.comparison.map((comp, index) => {
          const carDetails = `$${comp.price.toLocaleString()}`;
          const isBest =
            result.bestPerformers.price ===
            `${result.cars[index].brand} ${result.cars[index].name}`;
          const isWorst =
            result.worstPerformers.price ===
            `${result.cars[index].brand} ${result.cars[index].name}`;
          const rating = isBest ? "Best" : isWorst ? "Worst" : "Average";
          return `$${comp.price.toLocaleString()} (${rating})`;
        }),
      ],
      ["Pros", ...result.comparison.map((comp) => comp.pros.join(", "))],
      ["Cons", ...result.comparison.map((comp) => comp.cons.join(", "))],
    ];

    return { headers, rows };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ComparePageHeader />

        <CarSelectionSection
          availableCars={availableCars}
          selectedCarIds={selectedCarIds}
          onAddCar={addCarToComparison}
          onRemoveCar={removeCarFromComparison}
          onClearComparison={clearComparison}
          onCompare={handleComparison}
        />

        {comparisonResult && (
          <div className="mt-8">
            {/* Comparison Table */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Comparison Table</h2>
              {(() => {
                const tableData = formatComparisonTable(comparisonResult);
                if (typeof tableData === "string") {
                  return <p className="text-gray-600">{tableData}</p>;
                }
                return (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          {tableData.headers.map(
                            (header: string, index: number) => (
                              <th
                                key={index}
                                className="text-left p-3 font-semibold text-gray-700"
                              >
                                {header}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.rows.map(
                          (row: string[], rowIndex: number) => (
                            <tr
                              key={rowIndex}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              {row.map((cell: string, cellIndex: number) => (
                                <td
                                  key={cellIndex}
                                  className="p-3 text-gray-600"
                                >
                                  {cellIndex === 0 ? (
                                    <span className="font-semibold">
                                      {cell}
                                    </span>
                                  ) : (
                                    <span
                                      className={
                                        cell.includes("(Best)")
                                          ? "text-green-600 font-semibold"
                                          : cell.includes("(Worst)")
                                            ? "text-red-600"
                                            : ""
                                      }
                                    >
                                      {cell}
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

           
          </div>
        )}
      </div>
    </div>
  );
}
