"use client";

import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownWithCreateOption } from "./DropdownWithCreateOption";
import { CarFormData } from "../../validation/carSchema";

interface BasicInfoFieldsProps {
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
  setValue: UseFormSetValue<CarFormData>;
  watch: UseFormWatch<CarFormData>;
  carTypes: string[];
  brands: string[];
  onAddCarType?: (newCarType: string) => Promise<void>;
  onAddBrand?: (newBrand: string) => Promise<void>;
  disabled?: boolean;
}

export function BasicInfoFields({
  register,
  errors,
  setValue,
  watch,
  carTypes,
  brands,
  onAddCarType,
  onAddBrand,
  disabled = false,
}: BasicInfoFieldsProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Basic Information
        </h2>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label
              htmlFor="name"
              className="text-base font-semibold text-gray-700 dark:text-gray-300"
            >
              Car Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter car name"
              className="h-12 text-lg px-4 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={disabled}
            />
            {errors.name && (
              <p className="text-base text-red-500 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <DropdownWithCreateOption
              label="Car Type"
              placeholder="Select car type"
              options={carTypes}
              value={watch("car-type") || ""}
              onChange={(value) => setValue("car-type", value)}
              onAddNew={onAddCarType || (async () => {})}
              disabled={disabled}
              error={errors["car-type"]?.message}
            />
          </div>

          <div className="space-y-3">
            <DropdownWithCreateOption
              label="Brand"
              placeholder="Select brand"
              options={brands}
              value={watch("brand") || ""}
              onChange={(value) => setValue("brand", value)}
              onAddNew={onAddBrand || (async () => {})}
              disabled={disabled}
              error={errors.brand?.message}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter detailed car description"
              rows={4}
              className="text-base resize-none"
              disabled={disabled}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
