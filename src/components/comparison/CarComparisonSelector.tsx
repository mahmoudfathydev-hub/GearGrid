"use client";

import { useState } from "react";
import { useCarComparison } from "@/hooks/useCarComparison";
import { Cars } from "@/store/Cars/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Scale, CheckCircle } from "lucide-react";

interface CarComparisonSelectorProps {
  car: Cars;
  variant?: "button" | "card";
  className?: string;
}

export function CarComparisonSelector({
  car,
  variant = "button",
  className = "",
}: CarComparisonSelectorProps) {
  const { selectedCarIds, addCarToComparison, removeCarFromComparison } =
    useCarComparison();
  const [message, setMessage] = useState("");

  const isSelected = selectedCarIds.includes(car.id.toString());

  const handleToggleComparison = () => {
    if (isSelected) {
      removeCarFromComparison(car.id);
      setMessage("Removed from comparison");
    } else {
      const result = addCarToComparison(car.id);
      setMessage(result.message);
    }

    // Clear message after 2 seconds
    setTimeout(() => setMessage(""), 2000);
  };

  if (variant === "card") {
    return (
      <Card className={`border-blue-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-sm">Compare</span>
              {selectedCarIds.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCarIds.length}/3
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleToggleComparison}
              disabled={!isSelected && selectedCarIds.length >= 3}
              variant={isSelected ? "secondary" : "default"}
              className="h-8"
            >
              {isSelected ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
          {message && <p className="text-xs text-gray-600 mt-2">{message}</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        size="sm"
        onClick={handleToggleComparison}
        disabled={!isSelected && selectedCarIds.length >= 3}
        variant={isSelected ? "secondary" : "outline"}
        className="h-8"
      >
        {isSelected ? (
          <>
            <CheckCircle className="w-3 h-3 mr-1" />
            Added to Compare
          </>
        ) : (
          <>
            <Scale className="w-3 h-3 mr-1" />
            Compare
          </>
        )}
      </Button>

      {selectedCarIds.length > 0 && (
        <Badge variant="secondary" className="text-xs">
          {selectedCarIds.length}/3
        </Badge>
      )}

      {message && <span className="text-xs text-gray-600">{message}</span>}
    </div>
  );
}
