import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchBrands, selectBrands } from './BrandSlice';

const BrandComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const brands = useAppSelector(selectBrands);
  const loading = useAppSelector((state) => state.brand.loading);
  const error = useAppSelector((state) => state.brand.error);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Brands</h1>
      <ul>
        {brands.map((brand) => (
          <li key={brand.id}>{brand.brand}</li>
        ))}
      </ul>
    </div>
  );
};

export default BrandComponent;