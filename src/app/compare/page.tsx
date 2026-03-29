"use client";

import { useState, useEffect } from "react";
import { useCarComparison } from "@/hooks/useCarComparison";
import { useCars } from "@/hooks/useCars";
import { fetchCars } from "@/store/Cars/CarsSlice";
import { useDispatch } from "react-redux";
import { useAIChatBot } from "@/components/global/AIChatBot";
import {
  CarSelectionSection,
  ComparisonTable,
  FollowUpQuestions,
  ComparePageHeader,
  LoadingState,
} from "./components";

export default function ComparePage() {
  const dispatch = useDispatch();
  const { cars, loading } = useCars();
  const {
    availableCars,
    selectedCarIds,
    addCarToComparison,
    removeCarFromComparison,
    clearComparison,
    generateComparison,
    answerFollowUpQuestion,
  } = useCarComparison();

  const { setComparisonData, setHasComparison } = useAIChatBot();
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    dispatch(fetchCars() as any);
  }, [dispatch]);

  // Update global AI chatbot with comparison data
  useEffect(() => {
    if (comparisonResult) {
      setComparisonData(comparisonResult);
      setHasComparison(true);
    } else {
      setComparisonData(null);
      setHasComparison(false);
    }
  }, [comparisonResult, setComparisonData, setHasComparison]);

  const handleCompare = () => {
    const result = generateComparison();
    if (result) {
      setComparisonResult(result);
    }
  };

  const handleAskQuestion = (question: string) => {
    if (question && comparisonResult) {
      const response = answerFollowUpQuestion(question, comparisonResult);
      setAnswer(response);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

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
          onCompare={handleCompare}
        />

        {comparisonResult && (
          <>
            <div className="mb-8">
              <ComparisonTable comparisonResult={comparisonResult} />
            </div>

            <FollowUpQuestions
              onAskQuestion={handleAskQuestion}
              answer={answer}
            />
          </>
        )}
      </div>
    </div>
  );
}
