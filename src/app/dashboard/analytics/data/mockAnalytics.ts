export interface MonthlySalesData {
  month: string;
  total_sales: number;
}

export interface BrandSalesData {
  brand: string;
  sales: number;
}

export interface UserStats {
  total_customers: number;
  active_users: number;
}

export interface CarStats {
  cars_in_stock: number;
}

export const mockMonthlySales: MonthlySalesData[] = [
  { month: "Jan", total_sales: 4000 },
  { month: "Feb", total_sales: 3200 },
  { month: "Mar", total_sales: 5100 },
  { month: "Apr", total_sales: 4800 },
  { month: "May", total_sales: 6200 },
  { month: "Jun", total_sales: 5900 },
  { month: "Jul", total_sales: 7100 },
  { month: "Aug", total_sales: 6800 },
  { month: "Sep", total_sales: 7500 },
  { month: "Oct", total_sales: 8200 },
  { month: "Nov", total_sales: 7900 },
  { month: "Dec", total_sales: 9100 }
];

export const mockBrandSales: BrandSalesData[] = [
  { brand: "BMW", sales: 12 },
  { brand: "Audi", sales: 9 },
  { brand: "Mercedes", sales: 15 },
  { brand: "Toyota", sales: 8 },
  { brand: "Honda", sales: 6 },
  { brand: "Volkswagen", sales: 7 },
  { brand: "Ford", sales: 5 },
  { brand: "Tesla", sales: 11 }
];

export const mockUserStats: UserStats = {
  total_customers: 2847,
  active_users: 142
};

export const mockCarStats: CarStats = {
  cars_in_stock: 156
};
