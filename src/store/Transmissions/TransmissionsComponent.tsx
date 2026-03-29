import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchTransmissions, selectTransmissions } from './TransmissionsSlice';

const TransmissionsComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const transmissions = useAppSelector(selectTransmissions);
  const loading = useAppSelector((state) => state.transmissions.loading);
  const error = useAppSelector((state) => state.transmissions.error);

  useEffect(() => {
    dispatch(fetchTransmissions());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Transmissions</h1>
      <ul>
        {transmissions.map((transmission) => (
          <li key={transmission.id}>{transmission.transmissions}</li>
        ))}
      </ul>
    </div>
  );
};

export default TransmissionsComponent;