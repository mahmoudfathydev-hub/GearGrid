import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchFuelTypes, selectFuelTypes } from './Fuel_TypeSlice';

const FuelTypeComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const fuelTypes = useAppSelector(selectFuelTypes);
  const loading = useAppSelector((state) => state.fuelType.loading);
  const error = useAppSelector((state) => state.fuelType.error);

  useEffect(() => {
    dispatch(fetchFuelTypes());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Fuel Types</h1>
      <ul>
        {fuelTypes.map((fuelType) => (
          <li key={fuelType.id}>{fuelType.fuel_type}</li>
        ))}
      </ul>
    </div>
  );
};

export default FuelTypeComponent;