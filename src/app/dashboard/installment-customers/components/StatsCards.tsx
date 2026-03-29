import React from "react";
import { InstallmentCustomer } from "../../types/sales";

interface StatsCardsProps {
  customers: InstallmentCustomer[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const StatsCards: React.FC<StatsCardsProps> = ({ customers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
        <p className="text-blue-100 text-sm">Total Customers</p>
        <p className="text-2xl font-bold">{customers.length}</p>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
        <p className="text-green-100 text-sm">
          Total Remaining Balance
        </p>
        <p className="text-2xl font-bold">
          {formatCurrency(
            customers.reduce(
              (sum, c) => sum + (c.remaining_balance || 0),
              0,
            ),
          )}
        </p>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
        <p className="text-purple-100 text-sm">Avg Monthly Payment</p>
        <p className="text-2xl font-bold">
          {formatCurrency(
            customers.reduce(
              (sum, c) => sum + (c.money_for_installment_monthly || 0),
              0,
            ) / customers.length || 0,
          )}
        </p>
      </div>
    </div>
  );
};
