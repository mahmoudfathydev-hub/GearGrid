import React, { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { fetchCars, createSaleTransaction } from "./CarsSlice";
import { useCars } from "../../hooks/useCars";

const CarsComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cars, loading, error } = useCars();

  const handleSellCar = (carId: number) => {
    const soldCar = {
      car_id: carId.toString(),
      sold_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    dispatch(createSaleTransaction({ carId, soldCar }));
  };

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Cars</h1>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {car.name} - {car.brand}
            <button
              onClick={() => handleSellCar(car.id)}
              style={{ marginLeft: "10px" }}
            >
              Sell
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarsComponent;
