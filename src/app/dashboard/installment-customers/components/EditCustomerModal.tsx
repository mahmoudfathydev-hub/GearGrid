import React, { useEffect, useCallback } from "react";
import { InstallmentCustomer } from "../../types/sales";
import { DialogFooter } from "@/components/ui/dialog";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: InstallmentCustomer | null;
  editForm: Partial<InstallmentCustomer>;
  onEditFormChange: (form: Partial<InstallmentCustomer>) => void;
  onSave: () => void;
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  isOpen,
  onClose,
  customer,
  editForm,
  onEditFormChange,
  onSave,
}) => {
  const calculateInstallmentDetails = useCallback(
    (carPrice: number, numberOfMonths: number) => {
      const downPayment = carPrice * 0.25; // 25% down payment
      const remainingAmount = carPrice - downPayment;

      let interestRate = 0;
      if (numberOfMonths <= 12) {
        interestRate = 0.1; // 10% interest
      } else if (numberOfMonths <= 24) {
        interestRate = 0.2; // 20% interest
      } else if (numberOfMonths <= 50) {
        interestRate = 0.4; // 40% interest
      }

      const interestAmount = remainingAmount * interestRate;
      const totalPriceWithInterest = remainingAmount + interestAmount;
      const monthlyPayment =
        numberOfMonths > 0 ? totalPriceWithInterest / numberOfMonths : 0;

      return {
        downPayment,
        remainingAmount,
        interestRate,
        interestAmount,
        totalPriceWithInterest,
        monthlyPayment,
      };
    },
    [],
  );
  // Real-time calculation effect for edit form
  useEffect(() => {
    if (editForm.carPrice && editForm.Number_of_installment_months) {
      const calculations = calculateInstallmentDetails(
        editForm.carPrice,
        editForm.Number_of_installment_months,
      );

      onEditFormChange({
        ...editForm,
        down_payment: calculations.downPayment,
        remaining_amount: calculations.remainingAmount,
        interest_rate: calculations.interestRate,
        interest_amount: calculations.interestAmount,
        total_price_with_interest: calculations.totalPriceWithInterest,
        money_for_installment_monthly: calculations.monthlyPayment,
      });
    }
  }, [
    editForm.carPrice,
    editForm.Number_of_installment_months,
    calculateInstallmentDetails,
    onEditFormChange,
  ]);

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white">
              Edit Customer - {customer.name}
            </h3>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Payment ($)
                </label>
                <input
                  type="number"
                  value={editForm.money_for_installment_monthly || ""}
                  onChange={(e) =>
                    onEditFormChange({
                      ...editForm,
                      money_for_installment_monthly: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Months
                  {editForm.Number_of_installment_months &&
                    editForm.Number_of_installment_months > 50 && (
                      <span className="text-red-500 text-xs">
                        Maximum 50 months allowed
                      </span>
                    )}
                </label>
                <input
                  type="number"
                  value={editForm.Number_of_installment_months || ""}
                  onChange={(e) =>
                    onEditFormChange({
                      ...editForm,
                      Number_of_installment_months: parseInt(e.target.value),
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    editForm.Number_of_installment_months &&
                    editForm.Number_of_installment_months > 50
                      ? "border-red-500"
                      : ""
                  }`}
                  min="1"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Price ($)
                </label>
                <input
                  type="number"
                  value={editForm.carPrice || ""}
                  onChange={(e) =>
                    onEditFormChange({
                      ...editForm,
                      carPrice: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment (25%)
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900">
                  $
                  {editForm.down_payment
                    ? editForm.down_payment.toFixed(2)
                    : "0.00"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remaining Amount ($)
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900">
                  $
                  {editForm.remaining_amount
                    ? editForm.remaining_amount.toFixed(2)
                    : "0.00"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (
                  {editForm.interest_rate ? editForm.interest_rate * 100 : 0}
                  %)
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900">
                  {editForm.interest_rate
                    ? `${(editForm.interest_rate * 100).toFixed(0)}%`
                    : "0%"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Amount ($)
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900">
                  $
                  {editForm.interest_amount
                    ? editForm.interest_amount.toFixed(2)
                    : "0.00"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Price with Interest ($)
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900">
                  $
                  {editForm.total_price_with_interest
                    ? editForm.total_price_with_interest.toFixed(2)
                    : "0.00"}
                </div>
              </div>
            </div>

            <DialogFooter>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700"
              >
                Save Changes
              </button>
            </DialogFooter>
          </div>
        </div>
      </div>
    </div>
  );
};
