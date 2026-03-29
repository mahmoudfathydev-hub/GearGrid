"use client";

import React from "react";
import { useCars } from "../hooks/useCars";
import { useSoldCars } from "../hooks/useSoldCars";

const DashboardClient: React.FC = () => {
  const { cars } = useCars();
  const { soldCars } = useSoldCars();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Cars: {cars.length}</p>
      <p>Total Sold Cars: {soldCars.length}</p>
    </div>
  );
};

export default DashboardClient;