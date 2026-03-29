"use client";

import { useState } from "react";
import { useCarComparison } from "@/hooks/useCarComparison";
import { Cars } from "@/store/Cars/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface CarSelectionSectionProps {
  availableCars: Cars[];
  selectedCarIds: string[];
  onAddCar: (carId: number) => void;
  onRemoveCar: (carId: number) => void;
  onClearComparison: () => void;
  onCompare: () => void;
}

export function CarSelectionSection({
  availableCars,
  selectedCarIds,
  onAddCar,
  onRemoveCar,
  onClearComparison,
  onCompare,
}: CarSelectionSectionProps) {
  const [selectedCarToAdd, setSelectedCarToAdd] = useState("");

  const handleAddCar = () => {
    if (selectedCarToAdd) {
      onAddCar(parseInt(selectedCarToAdd));
      setSelectedCarToAdd("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Select Cars to Compare
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex gap-2">
            <Select value={selectedCarToAdd} onValueChange={setSelectedCarToAdd}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose a car..." />
              </SelectTrigger>
              <SelectContent>
                {availableCars
                  .filter(car => !selectedCarIds.includes(car.id.toString()))
                  .map((car) => (
                    <SelectItem key={car.id} value={car.id.toString()}>
                      {car.brand} {car.name} (${car.price.toLocaleString()})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddCar} disabled={!selectedCarToAdd || selectedCarIds.length >= 3}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {selectedCarIds.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Selected Cars ({selectedCarIds.length}/3):</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedCarIds.map((carId) => {
                const car = availableCars.find(c => c.id.toString() === carId);
                if (!car) return null;
                return (
                  <div key={car.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-medium text-gray-900">{car.brand} {car.name}</p>
                      <p className="text-sm text-gray-600">${car.price.toLocaleString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveCar(car.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={onCompare} 
                disabled={selectedCarIds.length < 2}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Compare Cars
              </Button>
              <Button variant="outline" onClick={onClearComparison}>
                Clear All
              </Button>
            </div>
          </div>
        )}

        {selectedCarIds.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Select at least 2 cars to start comparing
          </p>
        )}
      </CardContent>
    </Card>
  );
}
