"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CarFormData } from "../../validation/carSchema";

interface CarPricingFieldsProps {
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
  disabled?: boolean;
}

export function CarPricingFields({
  register,
  errors,
  disabled = false,
}: CarPricingFieldsProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-green-600 dark:text-green-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pricing Information
        </h2>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label
              htmlFor="price"
              className="text-base font-semibold text-gray-700 dark:text-gray-300"
            >
              Price ($)
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="0.00"
              className="h-12 text-lg px-4 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={disabled}
            />
            {errors.price && (
              <p className="text-base text-red-500 font-medium">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
