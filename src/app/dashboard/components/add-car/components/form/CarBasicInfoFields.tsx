"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DropdownWithCreateOption } from "./DropdownWithCreateOption";
import { CarFormData } from "../../validation/carSchema";

interface CarBasicInfoFieldsProps {
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
  setValue: UseFormSetValue<CarFormData>;
  carTypes: string[];
  brands: string[];
  onAddCarType: (newType: string) => Promise<void>;
  onAddBrand: (newBrand: string) => Promise<void>;
  disabled?: boolean;
}

export function CarBasicInfoFields({
  register,
  errors,
  setValue,
  carTypes,
  brands,
  onAddCarType,
  onAddBrand,
  disabled = false,
}: CarBasicInfoFieldsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Basic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Car Name
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter car name"
            className="text-base"
            disabled={disabled}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year_of_manufacture" className="text-sm font-medium">
            Year of Manufacture
          </Label>
          <Input
            id="year_of_manufacture"
            type="number"
            {...register("year_of_manufacture", { valueAsNumber: true })}
            placeholder="2024"
            className="text-base"
            disabled={disabled}
          />
          {errors.year_of_manufacture && (
            <p className="text-sm text-red-500">
              {errors.year_of_manufacture.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DropdownWithCreateOption
          label="Car Type"
          placeholder="Select car type"
          options={carTypes}
          value={register("car-type").name}
          onChange={(value) => setValue("car-type", value)}
          onAddNew={onAddCarType}
          disabled={disabled}
          error={errors["car-type"]?.message}
        />

        <DropdownWithCreateOption
          label="Brand"
          placeholder="Select brand"
          options={brands}
          value={register("brand").name}
          onChange={(value) => setValue("brand", value)}
          onAddNew={onAddBrand}
          disabled={disabled}
          error={errors.brand?.message}
        />
      </div>

      <div className="space-y-2">
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
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}
