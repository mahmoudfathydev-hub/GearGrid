"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "./ImageUpload";
import { CarPricingFields } from "./form/CarPricingFields";
import { CarSpecificationsFields } from "./form/CarSpecificationsFields";
import { FeaturesInput } from "./form/FeaturesInput";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { Loader } from "@/components/ui/loader";
import {
  insertCar,
  insertBrand,
  insertFuelType,
  insertTransmission,
  insertCarType,
  getCarTypes,
  getBrands,
  getFuelTypes,
  getTransmissions,
} from "@/lib/supabase";
import {
  carSchema,
  CarFormData,
  initialCarTypes,
  initialFuelTypes,
  initialBrands,
  initialTransmissions,
} from "../validation/carSchema";

export function AddCarForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);
  const [carTypes, setCarTypes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // Fetch data from database on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [dbCarTypes, dbBrands, dbFuelTypes, dbTransmissions] =
          await Promise.all([
            getCarTypes(),
            getBrands(),
            getFuelTypes(),
            getTransmissions(),
          ]);

        // Merge static data with database data, prioritizing database data
        const allCarTypes = [...new Set([...dbCarTypes, ...initialCarTypes])];
        const allBrands = [...new Set([...dbBrands, ...initialBrands])];
        const allFuelTypes = [
          ...new Set([...dbFuelTypes, ...initialFuelTypes]),
        ];
        const allTransmissions = [
          ...new Set([...dbTransmissions, ...initialTransmissions]),
        ];

        setCarTypes(allCarTypes);
        setBrands(allBrands);
        setFuelTypes(allFuelTypes);
        setTransmissions(allTransmissions);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        // Fallback to static data if database fetch fails
        setCarTypes(initialCarTypes);
        setBrands(initialBrands);
        setFuelTypes(initialFuelTypes);
        setTransmissions(initialTransmissions);
      }
    };

    fetchDropdownData();
  }, []);

  const form = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      name: "",
      "car-type": "",
      brand: "",
      price: 0,
      fuel_type: "",
      description: "",
      features_amenities: [],
      engine: "",
      horse_power: 0,
      transmission: "",
      color: "",
      miles: 0,
      year_of_manufacture: new Date().getFullYear(),
      image_urls: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = form;

  const onSubmit = handleSubmit(async (data: CarFormData) => {
    setIsSubmitting(true);
    setShowLoader(true);

    try {
      if (
        imageUrls.length > 0 &&
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      ) {
        console.warn("Cloudinary not configured, but images were uploaded");
      }

      const { "car-type": carType, ...restData } = data;
      const carData = {
        ...restData,
        car_type: carType,
        image_urls: imageUrls,
        features_amenities: data.features_amenities.join(", "),
      };

      console.log("Submitting car data:", carData);

      // Show loader for 3 seconds minimum
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const result = await insertCar(carData);
      console.log("Car inserted:", result);

      toast.success("Car added successfully!", {
        position: "top-center",
        style: {
          background: "linear-gradient(to right, #10b981, #059669)",
          color: "white",
          border: "none",
        },
      });

      // Clear all toasts after successful submission
      setTimeout(() => toast.dismiss(), 2000);
      reset();
      setImageUrls([]);
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error instanceof Error) {
        if (error.message.includes("Cloudinary")) {
          toast.error(
            "Image upload failed. Please check Cloudinary configuration.",
            {
              position: "top-center",
              style: {
                background: "linear-gradient(to right, #ef4444, #dc2626)",
                color: "white",
                border: "none",
              },
            },
          );
        } else {
          toast.error(error.message, {
            position: "top-center",
            style: {
              background: "linear-gradient(to right, #ef4444, #dc2626)",
              color: "white",
              border: "none",
            },
          });
        }
      } else {
        toast.error("Failed to add car. Please try again.", {
          position: "top-center",
          style: {
            background: "linear-gradient(to right, #ef4444, #dc2626)",
            color: "white",
            border: "none",
          },
        });
      }
    } finally {
      setIsSubmitting(false);
      setShowLoader(false);
    }
  });

  const handleAddFuelType = async (newFuelType: string) => {
    try {
      console.log("handleAddFuelType called with:", newFuelType);
      await insertFuelType(newFuelType);
      // Add to beginning of array to show newest first
      setFuelTypes((prev) => [...new Set([newFuelType, ...prev])]);
      toast.success(`Fuel type "${newFuelType}" added successfully!`);
    } catch (error) {
      console.error("Error adding fuel type:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add fuel type. Please try again.");
      }
    }
  };

  const handleAddTransmission = async (newTransmission: string) => {
    try {
      await insertTransmission(newTransmission);
      // Add to beginning of array to show newest first
      setTransmissions((prev) => [...new Set([newTransmission, ...prev])]);
      toast.success(`Transmission "${newTransmission}" added successfully!`);
    } catch (error) {
      console.error("Error adding transmission:", error);
      toast.error("Failed to add transmission. Please try again.");
    }
  };

  const handleAddCarType = async (newCarType: string) => {
    try {
      console.log("handleAddCarType called with:", newCarType);
      await insertCarType(newCarType);
      // Add to beginning of array to show newest first
      setCarTypes((prev) => [...new Set([newCarType, ...prev])]);
      toast.success(`Car type "${newCarType}" added successfully!`);
    } catch (error) {
      console.error("Error adding car type:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add car type. Please try again.");
      }
    }
  };

  const handleAddBrand = async (newBrand: string) => {
    try {
      await insertBrand(newBrand);
      // Add to beginning of array to show newest first
      setBrands((prev) => [...new Set([newBrand, ...prev])]);
      toast.success(`Brand "${newBrand}" added successfully!`);
    } catch (error) {
      console.error("Error adding brand:", error);
      toast.error("Failed to add brand. Please try again.");
    }
  };

  return (
    <div className="relative">
      {/* Loader Overlay */}
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Loader size="lg" text="Adding vehicle to database..." />
        </div>
      )}

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Vehicle
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Enter the vehicle details to add it to your inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-8">
            <BasicInfoFields
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              carTypes={carTypes}
              brands={brands}
              onAddCarType={handleAddCarType}
              onAddBrand={handleAddBrand}
              disabled={isSubmitting || showLoader}
            />
            <CarPricingFields
              register={register}
              errors={errors}
              disabled={isSubmitting || showLoader}
            />
            <CarSpecificationsFields
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              fuelTypes={fuelTypes}
              transmissions={transmissions}
              onAddFuelType={handleAddFuelType}
              onAddTransmission={handleAddTransmission}
              disabled={isSubmitting || showLoader}
            />
            <FeaturesInput
              value={watch("features_amenities") || []}
              onChange={(features) => setValue("features_amenities", features)}
              disabled={isSubmitting || showLoader}
              error={errors.features_amenities?.message}
            />
            <ImageUpload
              value={imageUrls}
              onChange={setImageUrls}
              disabled={isSubmitting || showLoader}
            />
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={isSubmitting || showLoader}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || showLoader}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
