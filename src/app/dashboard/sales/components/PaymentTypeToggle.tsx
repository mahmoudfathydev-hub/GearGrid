'use client';

import React from 'react';

interface PaymentTypeToggleProps {
  paymentType: 'cash' | 'installment';
  onPaymentTypeChange: (type: 'cash' | 'installment') => void;
}

export const PaymentTypeToggle: React.FC<PaymentTypeToggleProps> = ({
  paymentType,
  onPaymentTypeChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Payment Type
      </label>
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="paymentType"
            value="cash"
            checked={paymentType === 'cash'}
            onChange={(e) => onPaymentTypeChange(e.target.value as 'cash' | 'installment')}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Cash</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="paymentType"
            value="installment"
            checked={paymentType === 'installment'}
            onChange={(e) => onPaymentTypeChange(e.target.value as 'cash' | 'installment')}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Installment</span>
        </label>
      </div>
    </div>
  );
};
