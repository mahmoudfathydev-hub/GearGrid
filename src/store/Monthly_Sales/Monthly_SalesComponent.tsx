import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchMonthlySales, selectMonthlySales } from './Monthly_SalesSlice';

const MonthlySalesComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const monthlySales = useAppSelector(selectMonthlySales);
  const loading = useAppSelector((state) => state.monthlySales.loading);
  const error = useAppSelector((state) => state.monthlySales.error);

  useEffect(() => {
    dispatch(fetchMonthlySales());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Monthly Sales</h1>
      <ul>
        {monthlySales.map((sale) => (
          <li key={sale.id}>{sale.name} - {sale.money}</li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlySalesComponent;