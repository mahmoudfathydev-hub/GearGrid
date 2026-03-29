export interface Car {
  id: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
  description?: string;
  availability_status?: "available" | "sold" | "reserved";
}

export interface MonthlySale {
  id?: string;
  name: string;
  money: number;
  brand: string;
  car_name: string;
  cash_or_no: "cash" | "installment";
  Number_of_installment_months?: number;
  money_for_installment_monthly?: number;
  down_payment?: number;
  total_price_with_interest?: number;
  sale_type: string;
  customer_phone: string;
  notes?: string;
  remaining_balance?: number;
  is_fully_paid?: boolean;
  created_at?: string;
}

export interface InstallmentCalculation {
  carPrice: number;
  downPayment: number;
  remainingAmount: number;
  interestRate: number;
  interestAmount: number;
  totalPriceWithInterest: number;
  monthlyPayment: number;
  numberOfMonths: number;
}

export interface InstallmentCustomer {
  id: string;
  name: string;
  car_name: string;
  brand: string;
  money_for_installment_monthly: number;
  Number_of_installment_months: number;
  remaining_balance: number;
  created_at: string;
  // Edit form fields
  carPrice?: number;
  down_payment?: number;
  remaining_amount?: number;
  interest_rate?: number;
  interest_amount?: number;
  total_price_with_interest?: number;
}

export interface SaleFormData {
  name: string;
  carId: string;
  brand: string;
  carName: string;
  carPrice: number;
  paymentType: "cash" | "installment";
  numberOfMonths: number;
  customerPhone: string;
  notes: string;
  saleType: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}
