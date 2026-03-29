import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchCarTypes, selectCarTypes } from './Car_TypeSlice';

const CarTypeComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const carTypes = useAppSelector(selectCarTypes);
  const loading = useAppSelector((state) => state.carType.loading);
  const error = useAppSelector((state) => state.carType.error);

  useEffect(() => {
    dispatch(fetchCarTypes());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Car Types</h1>
      <ul>
        {carTypes.map((carType) => (
          <li key={carType.id}>{carType.car_type}</li>
        ))}
      </ul>
    </div>
  );
};

export default CarTypeComponent;