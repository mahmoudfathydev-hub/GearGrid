export interface SoldCars {
  id: number;
  created_at: string;
  car_id: string;
  sold_at: string;
  name?: string;
  brand?: string;
  price?: number;
  image_urls?: string | string[];
  description?: string;
  year_of_manufacture?: number;
  miles?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  car_type?: string;
  features_amenities?: string;
  engine?: string;
  horse_power?: number;
}
