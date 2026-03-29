export interface MonthlySales {
  id: string;
  name: string;
  money: number;
  brand: string;
  car_name: string;
  cash_or_no: string;
  Number_of_installment_months: number;
  money_for_installment_monthly: number;
  down_payment: number;
  total_price_with_interest: number;
  sale_type: string;
  customer_phone: string;
  notes: string;
  remaining_balance: number;
  is_fully_paid: boolean;
  created_at: string;
  updated_at: string;
}