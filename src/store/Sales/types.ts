export interface Car {
  id: number;
  name: string;
  brand_id: number;
  price: number;
  fuel_type_id: number;
  transmission_id: number;
  created_at: string;
}

export interface SoldCar {
  id: number;
  car_id: number;
  sold_at: string;
}

export interface CreateSaleRequest {
  carId: number;
}

export interface CreateSaleResponse {
  success: boolean;
  message: string;
}
