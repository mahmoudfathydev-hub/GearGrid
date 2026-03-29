import React, { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { fetchSoldCars } from "./Sold_CarsSlice";
import { useSoldCars } from "../../hooks/useSoldCars";

const SoldCarsComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { soldCars, loading, error } = useSoldCars();

  useEffect(() => {
    dispatch(fetchSoldCars());
  }, [dispatch]);

  console.log("SoldCars data:", soldCars);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Sold Cars</h1>
      <p>Total sold cars: {soldCars.length}</p>
      <ul>
        {soldCars.map((soldCar) => (
          <li key={soldCar.id}>
            Car ID: {soldCar.car_id}, Sold At: {soldCar.sold_at}, Created:{" "}
            {soldCar.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SoldCarsComponent;
