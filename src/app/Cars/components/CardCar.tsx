"use client";

import { useState } from "react";
import Image from "next/image";
import { Car } from "@/types/car";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CardCarProps {
  car: Car;
}

function CardCar({ car }: CardCarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
          <div className="relative h-48 w-full bg-white">
            <Image
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-md text-sm font-semibold">
              ${car.price.toLocaleString()}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {car.year}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {car.fuelType}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {car.transmission}
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {car.carType}
              </span>
            </div>

            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              <p>{car.mileage.toLocaleString()} miles</p>
              <p>{car.horsepower} hp</p>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {car.brand} {car.model} - {car.year}
          </DialogTitle>
          <DialogDescription>
            Complete details about this {car.carType}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-64 w-full">
            <Image
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">Specifications</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Price:</span>
                  <p className="text-green-600 font-bold">
                    ${car.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Mileage:</span>
                  <p>{car.mileage.toLocaleString()} miles</p>
                </div>
                <div>
                  <span className="font-medium">Engine:</span>
                  <p>{car.engine}</p>
                </div>
                <div>
                  <span className="font-medium">Horsepower:</span>
                  <p>{car.horsepower} hp</p>
                </div>
                <div>
                  <span className="font-medium">Fuel Type:</span>
                  <p>{car.fuelType}</p>
                </div>
                <div>
                  <span className="font-medium">Transmission:</span>
                  <p>{car.transmission}</p>
                </div>
                <div>
                  <span className="font-medium">Color:</span>
                  <p>{car.color}</p>
                </div>
                <div>
                  <span className="font-medium">Car Type:</span>
                  <p>{car.carType}</p>
                </div>
              </div>
            </div>

            {car.description && (
              <div>
                <h4 className="font-semibold text-lg mb-2">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {car.description}
                </p>
              </div>
            )}

            {car.features && car.features.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-2">Features</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                  {car.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CardCar;
