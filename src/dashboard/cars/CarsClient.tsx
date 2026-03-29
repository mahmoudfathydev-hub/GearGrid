"use client";

import React from "react";
import { useCars } from "../../hooks/useCars";

const CarsClient: React.FC = () => {
  const { cars } = useCars();

  return (
    <div>
      <h1>Cars</h1>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>{car.name} - {car.brand}</li>
        ))}
      </ul>
    </div>
  );
};

export default CarsClient;