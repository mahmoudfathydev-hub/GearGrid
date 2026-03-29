"use client";

import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownWithCreateOption } from "./DropdownWithCreateOption";
import { CarFormData } from "../../validation/carSchema";

interface CarSpecificationsFieldsProps {
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
  setValue: UseFormSetValue<CarFormData>;
  watch: UseFormWatch<CarFormData>;
  fuelTypes: string[];
  transmissions: string[];
  onAddFuelType: (newFuelType: string) => Promise<void>;
  onAddTransmission: (newTransmission: string) => Promise<void>;
  disabled?: boolean;
}

export function CarSpecificationsFields({
  register,
  errors,
  setValue,
  watch,
  fuelTypes,
  transmissions,
  onAddFuelType,
  onAddTransmission,
  disabled = false,
}: CarSpecificationsFieldsProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-purple-600 dark:text-purple-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Technical Specifications
        </h2>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label
              htmlFor="engine"
              className="text-base font-semibold text-gray-700 dark:text-gray-300"
            >
              Engine
            </Label>
            <Input
              id="engine"
              {...register("engine")}
              placeholder="e.g., 2.0L Turbo"
              className="h-12 text-lg px-4 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={disabled}
            />
            {errors.engine && (
              <p className="text-base text-red-500 font-medium">
                {errors.engine.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="horse_power"
              className="text-base font-semibold text-gray-700 dark:text-gray-300"
            >
              Horse Power
            </Label>
            <Input
              id="horse_power"
              type="number"
              {...register("horse_power", { valueAsNumber: true })}
              placeholder="0"
              className="h-12 text-lg px-4 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={disabled}
            />
            {errors.horse_power && (
              <p className="text-base text-red-500 font-medium">
                {errors.horse_power.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="color"
              className="text-base font-semibold text-gray-700 dark:text-gray-300"
            >
              Color
            </Label>
            <Input
              id="color"
              {...register("color")}
              placeholder="e.g., Black"
              className="h-12 text-lg px-4 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={disabled}
            />
            {errors.color && (
              <p className="text-base text-red-500 font-medium">
                {errors.color.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="miles"
              className="text-base font-semibold text-gray-700 dark:text-gray-300"
            >
              Miles
            </Label>
            <Input
              id="miles"
              type="number"
              {...register("miles", { valueAsNumber: true })}
              placeholder="0"
              className="h-12 text-lg px-4 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={disabled}
            />
            {errors.miles && (
              <p className="text-base text-red-500 font-medium">
                {errors.miles.message}
              </p>
            )}
          </div>

          <DropdownWithCreateOption
            label="Fuel Type"
            placeholder="Select fuel type"
            options={fuelTypes}
            value={watch("fuel_type") || ""}
            onChange={(value) => setValue("fuel_type", value)}
            onAddNew={onAddFuelType}
            disabled={disabled}
            error={errors.fuel_type?.message}
          />

          <DropdownWithCreateOption
            label="Transmission"
            placeholder="Select transmission"
            options={transmissions}
            value={watch("transmission") || ""}
            onChange={(value) => setValue("transmission", value)}
            onAddNew={onAddTransmission}
            disabled={disabled}
            error={errors.transmission?.message}
          />
        </div>
      </div>
    </div>
  );
}
