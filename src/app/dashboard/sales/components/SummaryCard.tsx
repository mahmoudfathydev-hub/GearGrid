'use client';

import React from 'react';
import { InstallmentCalculation } from '../../types/sales';

interface SummaryCardProps {
  carPrice: number;
  paymentType: 'cash' | 'installment';
  calculation?: InstallmentCalculation;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  carPrice,
  paymentType,
  calculation,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-blue-100">Car Price:</span>
          <span className="text-xl font-semibold">${carPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-blue-100">Payment Type:</span>
          <span className="text-lg font-medium capitalize">{paymentType}</span>
        </div>
        
        {paymentType === 'installment' && calculation && calculation.numberOfMonths > 0 && (
          <>
            <div className="border-t border-blue-400 pt-3 mt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-100">Down Payment:</span>
                <span className="text-lg font-medium">${calculation.downPayment.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-100">Monthly Payment:</span>
                <span className="text-lg font-medium text-green-300">
                  ${calculation.monthlyPayment.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-100">Number of Months:</span>
                <span className="text-lg font-medium">{calculation.numberOfMonths}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Total with Interest:</span>
                <span className="text-xl font-bold text-yellow-300">
                  ${calculation.totalPriceWithInterest.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
        
        {paymentType === 'cash' && (
          <div className="border-t border-blue-400 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-100">Total Payment:</span>
              <span className="text-xl font-bold text-green-300">
                ${carPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
