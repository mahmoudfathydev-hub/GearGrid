import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchSoldCars, selectSoldCars } from './Sold_CarsSlice';

const SoldCarsComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const soldCars = useAppSelector(selectSoldCars);
  const loading = useAppSelector((state) => state.soldCars.loading);
  const error = useAppSelector((state) => state.soldCars.error);

  useEffect(() => {
    dispatch(fetchSoldCars());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Sold Cars</h1>
      <ul>
        {soldCars.map((soldCar) => (
          <li key={soldCar.id}>Car ID: {soldCar.car_id}, Sold At: {soldCar.sold_at}</li>
        ))}
      </ul>
    </div>
  );
};

export default SoldCarsComponent;