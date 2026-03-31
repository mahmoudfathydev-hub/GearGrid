"use client";

import { Cars } from "@/store/Cars/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Fuel,
  DollarSign,
  Check,
  X,
} from "lucide-react";

interface ComparisonTableProps {
  comparisonResult: {
    cars: Cars[];
    comparison: any[];
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
  };
}

export function ComparisonTable({ comparisonResult }: ComparisonTableProps) {
  const getPerformanceRating = (horsepower: number) => {
    if (horsepower > 250) return { text: "Excellent", color: "bg-green-500" };
    if (horsepower > 200) return { text: "Good", color: "bg-blue-500" };
    if (horsepower > 150) return { text: "Average", color: "bg-yellow-500" };
    return { text: "Below Average", color: "bg-red-500" };
  };

  const getFuelEfficiencyRating = (miles: number) => {
    if (miles < 30000) return { text: "Excellent", color: "bg-green-500" };
    if (miles < 60000) return { text: "Good", color: "bg-blue-500" };
    if (miles < 100000) return { text: "Average", color: "bg-yellow-500" };
    return { text: "High Mileage", color: "bg-red-500" };
  };

  const getPriceRating = (price: number) => {
    if (price < 15000) return { text: "Excellent", color: "bg-green-500" };
    if (price < 25000) return { text: "Good", color: "bg-blue-500" };
    if (price < 35000) return { text: "Average", color: "bg-yellow-500" };
    return { text: "Expensive", color: "bg-red-500" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Side-by-Side Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-4 font-semibold text-gray-900">Category</th>
                {comparisonResult.cars.map((car: Cars) => (
                  <th key={car.id} className="text-left p-4 font-semibold text-gray-900">
                    {car.brand} {car.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Performance Row */}
              <tr className="border-b">
                <td className="p-4 font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Performance
                  </div>
                </td>
                {comparisonResult.comparison.map((comp: any, index: number) => {
                  const rating = getPerformanceRating(comp.performance.horsepower);
                  const isBest = comparisonResult.bestPerformers.performance === comparisonResult.cars[index].brand + " " + comparisonResult.cars[index].name;
                  const isWorst = comparisonResult.worstPerformers.performance === comparisonResult.cars[index].brand + " " + comparisonResult.cars[index].name;
                  
                  return (
                    <td key={index} className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">{comp.performance.engine}</span>
                        </p>
                        <p className="text-sm">
                          {comp.performance.horsepower} HP
                          {isBest && <TrendingUp className="inline w-4 h-4 text-green-500 ml-1" />}
                          {isWorst && <TrendingDown className="inline w-4 h-4 text-red-500 ml-1" />}
                        </p>
                        <p className="text-sm">{comp.performance.transmission}</p>
                        <Badge className={rating.color}>
                          {rating.text}
                        </Badge>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Fuel Efficiency Row */}
              <tr className="border-b">
                <td className="p-4 font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4" />
                    Fuel Efficiency
                  </div>
                </td>
                {comparisonResult.comparison.map((comp: any, index: number) => {
                  const rating = getFuelEfficiencyRating(comp.fuelEfficiency.mileage);
                  const isBest = comparisonResult.bestPerformers.fuelEfficiency === comparisonResult.cars[index].brand + " " + comparisonResult.cars[index].name;
                  const isWorst = comparisonResult.worstPerformers.fuelEfficiency === comparisonResult.cars[index].brand + " " + comparisonResult.cars[index].name;
                  
                  return (
                    <td key={index} className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium capitalize">{comp.fuelEfficiency.fuelType}</p>
                        <p className="text-sm">
                          {comp.fuelEfficiency.mileage.toLocaleString()} miles
                          {isBest && <TrendingUp className="inline w-4 h-4 text-green-500 ml-1" />}
                          {isWorst && <TrendingDown className="inline w-4 h-4 text-red-500 ml-1" />}
                        </p>
                        <Badge className={rating.color}>
                          {rating.text}
                        </Badge>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Price Row */}
              <tr className="border-b">
                <td className="p-4 font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price
                  </div>
                </td>
                {comparisonResult.comparison.map((comp: any, index: number) => {
                  const rating = getPriceRating(comp.price);
                  const isBest = comparisonResult.bestPerformers.price === comparisonResult.cars[index].brand + " " + comparisonResult.cars[index].name;
                  const isWorst = comparisonResult.worstPerformers.price === comparisonResult.cars[index].brand + " " + comparisonResult.cars[index].name;
                  
                  return (
                    <td key={index} className="p-4">
                      <div className="space-y-2">
                        <p className="text-lg font-bold">
                          ${comp.price.toLocaleString()}
                          {isBest && <TrendingUp className="inline w-4 h-4 text-green-500 ml-1" />}
                          {isWorst && <TrendingDown className="inline w-4 h-4 text-red-500 ml-1" />}
                        </p>
                        <Badge className={rating.color}>
                          {rating.text}
                        </Badge>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Pros Row */}
              <tr className="border-b">
                <td className="p-4 font-medium text-gray-700">Pros</td>
                {comparisonResult.comparison.map((comp: any, index: number) => (
                  <td key={index} className="p-4">
                    <div className="space-y-1">
                      {comp.pros.map((pro: string, proIndex: number) => (
                        <div key={proIndex} className="flex items-center gap-2 text-sm text-green-700">
                          <Check className="w-3 h-3" />
                          {pro}
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Cons Row */}
              <tr>
                <td className="p-4 font-medium text-gray-700">Cons</td>
                {comparisonResult.comparison.map((comp: any, index: number) => (
                  <td key={index} className="p-4">
                    <div className="space-y-1">
                      {comp.cons.map((con: string, conIndex: number) => (
                        <div key={conIndex} className="flex items-center gap-2 text-sm text-red-700">
                          <X className="w-3 h-3" />
                          {con}
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}