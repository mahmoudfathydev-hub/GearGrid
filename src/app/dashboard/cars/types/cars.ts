export interface Car {
  id: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
  description?: string;
  year?: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  availability_status?: 'available' | 'sold' | 'reserved';
  created_at: string;
  updated_at?: string;
}

export interface CarFormData {
  name: string;
  brand: string;
  price: number;
  image?: string;
  description?: string;
  year?: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
}

export interface CarFilters {
  search: string;
  brand: string;
  sortBy: 'name' | 'brand' | 'price' | 'created_at';
  sortOrder: 'asc' | 'desc';
  availability?: 'all' | 'available' | 'sold' | 'reserved';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
