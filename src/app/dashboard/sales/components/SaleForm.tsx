"use client";

import React, { useState, useEffect } from "react";
import { useFetchBrands } from "../../hooks/useFetchBrands";
import { useFetchCarsByBrand } from "../../hooks/useFetchCarsByBrand";
import { useInstallmentCalculator } from "../../hooks/useInstallmentCalculator";
import { useCreateSale } from "../../hooks/useCreateSale";
import { PaymentTypeToggle } from "./PaymentTypeToggle";
import { InstallmentCalculator } from "./InstallmentCalculator";
import { SummaryCard } from "./SummaryCard";
import { Car, SaleFormData } from "../../types/sales";

export const SaleForm: React.FC = () => {
  const [formData, setFormData] = useState<SaleFormData>({
    name: "",
    carId: "",
    brand: "",
    carName: "",
    carPrice: 0,
    paymentType: "cash",
    numberOfMonths: 0,
    customerPhone: "",
    notes: "",
    saleType: "direct",
  });

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { brands, loading: brandsLoading } = useFetchBrands();
  const {
    cars,
    loading: carsLoading,
    refetch: refetchCars,
  } = useFetchCarsByBrand(formData.brand);
  const calculation = useInstallmentCalculator(
    formData.carPrice,
    formData.numberOfMonths,
  );
  const {
    createSale,
    loading: submitting,
    error: submitError,
    success,
    reset,
  } = useCreateSale();

  useEffect(() => {
    if (formData.carId && cars.length > 0) {
      const car = cars.find((c) => c.id === formData.carId);
      if (car) {
        setSelectedCar(car);
        setFormData((prev) => ({
          ...prev,
          carName: car.name,
          carPrice: car.price,
        }));
      }
    }
  }, [formData.carId, cars]);

  const handleInputChange = (field: keyof SaleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBrandChange = (brand: string) => {
    setFormData((prev) => ({
      ...prev,
      brand,
      carId: "",
      carName: "",
      carPrice: 0,
    }));
    setSelectedCar(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Customer name is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.carId) newErrors.carId = "Car is required";
    if (!formData.customerPhone.trim())
      newErrors.customerPhone = "Phone number is required";
    if (
      formData.paymentType === "installment" &&
      formData.numberOfMonths === 0
    ) {
      newErrors.numberOfMonths = "Number of months is required for installment";
    }
    if (
      formData.paymentType === "installment" &&
      formData.numberOfMonths > 50
    ) {
      newErrors.numberOfMonths = "Maximum 50 months allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await createSale(
        formData,
        formData.paymentType === "installment" ? calculation : undefined,
      );

      if (result.data) {
        // Refresh cars list to update availability
        if (formData.brand) {
          await refetchCars();
        }

        // Reset form
        setFormData({
          name: "",
          carId: "",
          brand: "",
          carName: "",
          carPrice: 0,
          paymentType: "cash",
          numberOfMonths: 0,
          customerPhone: "",
          notes: "",
          saleType: "direct",
        });
        setSelectedCar(null);
        reset();
      }
    } catch (error) {
      console.error("Error creating sale:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Record New Sale</h1>
          <p className="text-blue-100 mt-2">Add a new car sale to the system</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Customer Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter customer name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        handleInputChange("customerPhone", e.target.value)
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.customerPhone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter phone number"
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.customerPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes about the sale"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Car Selection
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.brand ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={brandsLoading}
                    >
                      <option value="">Select a brand</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                    {errors.brand && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.brand}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Car Model *
                    </label>
                    <select
                      value={formData.carId}
                      onChange={(e) =>
                        handleInputChange("carId", e.target.value)
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.carId ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={!formData.brand || carsLoading}
                    >
                      <option value="">Select a car</option>
                      {cars.length === 0 && formData.brand && !carsLoading && (
                        <option value="" disabled>
                          No available cars for this brand
                        </option>
                      )}
                      {cars.map((car) => (
                        <option key={car.id} value={car.id}>
                          {car.name} - ${car.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    {errors.carId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.carId}
                      </p>
                    )}
                  </div>
                </div>

                {selectedCar && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Selected Car:</span>{" "}
                      {selectedCar.brand} {selectedCar.name}
                    </p>
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Price:</span> $
                      {selectedCar.price.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Type */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Details
                </h2>

                <PaymentTypeToggle
                  paymentType={formData.paymentType}
                  onPaymentTypeChange={(type) =>
                    handleInputChange("paymentType", type)
                  }
                />

                {formData.paymentType === "installment" && (
                  <div className="mt-6">
                    <InstallmentCalculator
                      calculation={calculation}
                      numberOfMonths={formData.numberOfMonths}
                      onMonthsChange={(months) =>
                        handleInputChange("numberOfMonths", months)
                      }
                    />
                    {errors.numberOfMonths && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.numberOfMonths}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <SummaryCard
                  carPrice={formData.carPrice}
                  paymentType={formData.paymentType}
                  calculation={calculation}
                />

                <button
                  type="submit"
                  disabled={submitting || !formData.carPrice}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {submitting ? "Processing..." : "Record Sale"}
                </button>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{submitError}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      Sale recorded successfully! Car is now marked as sold and
                      won't appear in future sales.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
