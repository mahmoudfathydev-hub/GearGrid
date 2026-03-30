"use client";

import { useState, useEffect } from "react";
import { useCarComparison } from "@/hooks/useCarComparison";
import { fetchCars } from "@/store/Cars/CarsSlice";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CarSelectionSection,
  ComparePageHeader,
} from "./components";
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
  bestPerformers: Cars[];
  worstPerformers: Cars[];
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

  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [answer, setAnswer] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const handleAskQuestion = () => {
    if (input && comparisonResult) {
      const response = answerFollowUpQuestion(input, comparisonResult);
      setAnswer(response);
    }
  };

  const handleComparison = () => {
    const result = generateComparison();
    if (result) {
      setComparisonResult({
        ...result,
        bestPerformers: Array.isArray(result.bestPerformers)
          ? (result.bestPerformers as Cars[])
          : [],
        worstPerformers: Array.isArray(result.worstPerformers)
          ? (result.worstPerformers as Cars[])
          : [],
      });
    }
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
            <h2 className="text-xl font-bold mb-4">AI Chatbot</h2>
            <div className="flex gap-4">
              <Input
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                placeholder="Ask the AI about your comparison..."
                className="flex-1"
              />
              <Button onClick={handleAskQuestion} className="bg-blue-600 hover:bg-blue-700">
                Ask
              </Button>
            </div>
            {answer && <p className="mt-4 text-gray-700">{answer}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
