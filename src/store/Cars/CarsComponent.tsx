import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchCars, selectCars } from './CarsSlice';

const CarsComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const cars = useAppSelector(selectCars);
  const loading = useAppSelector((state) => state.cars.loading);
  const error = useAppSelector((state) => state.cars.error);

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
          <li key={car.id}>{car.name} - {car.brand}</li>
        ))}
      </ul>
    </div>
  );
};

export default CarsComponent;