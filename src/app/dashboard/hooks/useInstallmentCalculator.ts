import { useState, useEffect } from 'react';
import { InstallmentCalculation } from '../types/sales';

export const useInstallmentCalculator = (carPrice: number, numberOfMonths: number) => {
  const [calculation, setCalculation] = useState<InstallmentCalculation>({
    carPrice: 0,
    downPayment: 0,
    remainingAmount: 0,
    interestRate: 0,
    interestAmount: 0,
    totalPriceWithInterest: 0,
    monthlyPayment: 0,
    numberOfMonths: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const downPayment = carPrice * 0.25; // 25% down payment
      const remainingAmount = carPrice - downPayment;
      
      let interestRate = 0;
      if (numberOfMonths <= 12) {
        interestRate = 0.10; // 10% interest
      } else if (numberOfMonths <= 24) {
        interestRate = 0.20; // 20% interest
      } else if (numberOfMonths <= 50) {
        interestRate = 0.40; // 40% interest
      }
      
      const interestAmount = remainingAmount * interestRate;
      const totalPriceWithInterest = remainingAmount + interestAmount;
      const monthlyPayment = numberOfMonths > 0 ? totalPriceWithInterest / numberOfMonths : 0;

      setCalculation({
        carPrice,
        downPayment,
        remainingAmount,
        interestRate,
        interestAmount,
        totalPriceWithInterest,
        monthlyPayment,
        numberOfMonths,
      });
    };

    calculate();
  }, [carPrice, numberOfMonths]);

  return calculation;
};
