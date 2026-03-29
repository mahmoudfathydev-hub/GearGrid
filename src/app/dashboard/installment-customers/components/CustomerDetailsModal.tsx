import React from "react";
import { InstallmentCustomer } from "../../types/sales";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: InstallmentCustomer | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-lg">
            Customer Details - {customer?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Customer Information
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {customer?.name}
                </p>
                <p>
                  <span className="font-medium">Sale Date:</span>{" "}
                  {customer && formatDate(customer.created_at)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Vehicle Information
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Car:</span>{" "}
                  {customer?.brand} {customer?.car_name}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Payment Details
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Monthly Payment:</span>{" "}
                  {formatCurrency(
                    customer?.money_for_installment_monthly || 0,
                  )}
                </p>
                <p>
                  <span className="font-medium">Number of Months:</span>{" "}
                  {customer?.Number_of_installment_months}
                </p>
                <p>
                  <span className="font-medium">Remaining Balance:</span>{" "}
                  {formatCurrency(customer?.remaining_balance || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
