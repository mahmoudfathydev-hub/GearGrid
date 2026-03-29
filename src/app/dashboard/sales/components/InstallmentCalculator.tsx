'use client';

import React from 'react';
import { InstallmentCalculation } from '../../types/sales';

interface InstallmentCalculatorProps {
  calculation: InstallmentCalculation;
  numberOfMonths: number;
  onMonthsChange: (months: number) => void;
}

export const InstallmentCalculator: React.FC<InstallmentCalculatorProps> = ({
  calculation,
  numberOfMonths,
  onMonthsChange,
}) => {
  const monthOptions = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">Installment Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Months
        </label>
        <select
          value={numberOfMonths}
          onChange={(e) => onMonthsChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select months</option>
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month} {month === 1 ? 'month' : 'months'}
            </option>
          ))}
        </select>
      </div>

      {numberOfMonths > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Down Payment (25%)</p>
            <p className="text-lg font-semibold text-gray-900">
              ${calculation.downPayment.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Remaining Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              ${calculation.remainingAmount.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Interest Rate</p>
            <p className="text-lg font-semibold text-gray-900">
              {(calculation.interestRate * 100).toFixed(0)}%
            </p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Interest Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              ${calculation.interestAmount.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Price with Interest</p>
            <p className="text-lg font-semibold text-blue-600">
              ${calculation.totalPriceWithInterest.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Monthly Payment</p>
            <p className="text-lg font-semibold text-green-600">
              ${calculation.monthlyPayment.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
