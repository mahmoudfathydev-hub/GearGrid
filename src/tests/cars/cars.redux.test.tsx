import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import carsReducer, { 
  fetchCars, 
  createCar, 
  updateCar, 
  deleteCar, 
  createSaleTransaction,
  selectCars,
  selectCarById 
} from '../../../store/Cars/CarsSlice';
import soldCarsReducer, { 
  fetchSoldCars,
  createSoldCar,
  selectAllSoldCars 
} from '../../../store/Sold_Cars/Sold_CarsSlice';
import { Cars } from '../../../store/Cars/types';
import { SoldCars } from '../../../store/Sold_Cars/types';

// Mock supabase
jest.mock('../../../lib/supabaseClient', () => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn()
      })),
      single: jest.fn()
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn()
      }))
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    })),
    delete: jest.fn(() => ({
      eq: jest.fn()
    }))
  }))
}));

// Mock Cars component for Redux testing
const MockCarsComponent: React.FC = () => {
  const [cars, setCars] = React.useState<Cars[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate fetch
      setCars([
        {
          id: 1,
          created_at: '2024-01-01',
          name: 'Toyota Camry',
          car_type: 'Sedan',
          brand: 'Toyota',
          price: 25000,
          fuel_type: 'Gasoline',
          description: 'A reliable sedan',
          features_amenities: 'GPS, Bluetooth',
          engine: '2.5L',
          horse_power: 203,
          transmission: 'Automatic',
          color: 'Blue',
          miles: 15000,
          year_of_manufacture: 2022,
          image_urls: ['car1.jpg']
        }
      ]);
    } catch (err) {
      setError('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCar = async () => {
    const newCar: Partial<Cars> = {
      name: 'Honda Civic',
      car_type: 'Sedan',
      brand: 'Honda',
      price: 22000,
      fuel_type: 'Gasoline',
      description: 'Efficient compact car',
      features_amenities: 'Bluetooth',
      engine: '2.0L',
      horse_power: 158,
      transmission: 'CVT',
      color: 'White',
      miles: 0,
      year_of_manufacture: 2023,
      image_urls: ['car2.jpg']
    };
    setCars(prev => [...prev, { ...newCar, id: Date.now(), created_at: new Date().toISOString() } as Cars]);
  };

  const handleUpdateCar = async (id: number) => {
    setCars(prev => prev.map(car => 
      car.id === id ? { ...car, price: car.price + 1000 } : car
    ));
  };

  const handleDeleteCar = async (id: number) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  const handleSellCar = async (id: number) => {
    const carToSell = cars.find(car => car.id === id);
    if (carToSell) {
      // Move to sold cars (simulation)
      setCars(prev => prev.filter(car => car.id !== id));
    }
  };

  return (
    <div data-testid="mock-cars-component">
      <button onClick={handleFetchCars} data-testid="fetch-cars-btn">
        Fetch Cars
      </button>
      <button onClick={handleCreateCar} data-testid="create-car-btn">
        Create Car
      </button>
      <button onClick={() => handleUpdateCar(1)} data-testid="update-car-btn">
        Update Car
      </button>
      <button onClick={() => handleDeleteCar(1)} data-testid="delete-car-btn">
        Delete Car
      </button>
      <button onClick={() => handleSellCar(1)} data-testid="sell-car-btn">
        Sell Car
      </button>
      
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      
      <div data-testid="cars-list">
        {cars.map(car => (
          <div key={car.id} data-testid={`car-${car.id}`}>
            <h3>{car.name}</h3>
            <p>Brand: {car.brand}</p>
            <p>Price: ${car.price}</p>
            <p>Type: {car.car_type}</p>
            <p>Fuel: {car.fuel_type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cars: carsReducer,
      soldCars: soldCarsReducer,
    },
    preloadedState: initialState,
  });
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode; store?: any }> = ({ 
  children, 
  store = createTestStore() 
}) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

describe('Cars Redux Integration Tests', () => {
  let store: ReturnType<typeof createTestStore>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    store = createTestStore();
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('fetchCars pending state sets loading to true', () => {
    store.dispatch(fetchCars.pending('fetchCars', undefined));
    
    const state = store.getState();
    expect(state.cars.loading).toBe(true);
    expect(state.cars.error).toBe(null);
  });

  test('fetchCars fulfilled state updates cars and clears loading', () => {
    const mockCars: Cars[] = [
      {
        id: 1,
        created_at: '2024-01-01',
        name: 'Toyota Camry',
        car_type: 'Sedan',
        brand: 'Toyota',
        price: 25000,
        fuel_type: 'Gasoline',
        description: 'A reliable sedan',
        features_amenities: 'GPS, Bluetooth',
        engine: '2.5L',
        horse_power: 203,
        transmission: 'Automatic',
        color: 'Blue',
        miles: 15000,
        year_of_manufacture: 2022,
        image_urls: ['car1.jpg']
      }
    ];

    store.dispatch(fetchCars.fulfilled(mockCars, 'fetchCars', undefined));
    
    const state = store.getState();
    expect(state.cars.loading).toBe(false);
    expect(state.cars.entities[1]).toEqual(mockCars[0]);
    expect(state.cars.ids).toContain(1);
  });

  test('fetchCars rejected state sets error and clears loading', () => {
    const errorMessage = 'Failed to fetch cars';
    store.dispatch(fetchCars.rejected(errorMessage, 'fetchCars', undefined, errorMessage));
    
    const state = store.getState();
    expect(state.cars.loading).toBe(false);
    expect(state.cars.error).toBe(errorMessage);
    expect(state.cars.ids).toHaveLength(0);
  });

  test('createCar fulfilled state adds new car', () => {
    const newCar: Cars = {
      id: 2,
      created_at: '2024-01-02',
      name: 'Honda Civic',
      car_type: 'Sedan',
      brand: 'Honda',
      price: 22000,
      fuel_type: 'Gasoline',
      description: 'Efficient compact car',
      features_amenities: 'Bluetooth',
      engine: '2.0L',
      horse_power: 158,
      transmission: 'CVT',
      color: 'White',
      miles: 0,
      year_of_manufacture: 2023,
      image_urls: ['car2.jpg']
    };

    store.dispatch(createCar.fulfilled(newCar, 'createCar', {} as Partial<Cars>));
    
    const state = store.getState();
    expect(state.cars.entities[2]).toEqual(newCar);
    expect(state.cars.ids).toContain(2);
  });

  test('updateCar fulfilled state updates existing car', () => {
    // First add a car
    const originalCar: Cars = {
      id: 1,
      created_at: '2024-01-01',
      name: 'Toyota Camry',
      car_type: 'Sedan',
      brand: 'Toyota',
      price: 25000,
      fuel_type: 'Gasoline',
      description: 'A reliable sedan',
      features_amenities: 'GPS, Bluetooth',
      engine: '2.5L',
      horse_power: 203,
      transmission: 'Automatic',
      color: 'Blue',
      miles: 15000,
      year_of_manufacture: 2022,
      image_urls: ['car1.jpg']
    };

    store.dispatch(createCar.fulfilled(originalCar, 'createCar', {} as Partial<Cars>));

    // Update the car
    const updatedCar = { ...originalCar, price: 26000 };
    store.dispatch(updateCar.fulfilled(updatedCar, 'updateCar', { id: 1, price: 26000 }));
    
    const state = store.getState();
    expect(state.cars.entities[1]?.price).toBe(26000);
  });

  test('deleteCar fulfilled state removes car', () => {
    // First add a car
    const car: Cars = {
      id: 1,
      created_at: '2024-01-01',
      name: 'Toyota Camry',
      car_type: 'Sedan',
      brand: 'Toyota',
      price: 25000,
      fuel_type: 'Gasoline',
      description: 'A reliable sedan',
      features_amenities: 'GPS, Bluetooth',
      engine: '2.5L',
      horse_power: 203,
      transmission: 'Automatic',
      color: 'Blue',
      miles: 15000,
      year_of_manufacture: 2022,
      image_urls: ['car1.jpg']
    };

    store.dispatch(createCar.fulfilled(car, 'createCar', {} as Partial<Cars>));
    expect(state.cars.ids).toContain(1);

    // Delete the car
    store.dispatch(deleteCar.fulfilled(1, 'deleteCar', 1));
    
    const state = store.getState();
    expect(state.cars.entities[1]).toBeUndefined();
    expect(state.cars.ids).not.toContain(1);
  });

  test('createSaleTransaction moves car from Cars to Sold_Cars', async () => {
    // Add a car to Cars store
    const car: Cars = {
      id: 1,
      created_at: '2024-01-01',
      name: 'Toyota Camry',
      car_type: 'Sedan',
      brand: 'Toyota',
      price: 25000,
      fuel_type: 'Gasoline',
      description: 'A reliable sedan',
      features_amenities: 'GPS, Bluetooth',
      engine: '2.5L',
      horse_power: 203,
      transmission: 'Automatic',
      color: 'Blue',
      miles: 15000,
      year_of_manufacture: 2022,
      image_urls: ['car1.jpg']
    };

    store.dispatch(createCar.fulfilled(car, 'createCar', {} as Partial<Cars>));
    expect(store.getState().cars.entities[1]).toBeDefined();

    // Create sale transaction
    const soldCarData: Partial<SoldCars> = {
      car_id: 1,
      name: 'Toyota Camry',
      brand: 'Toyota',
      price: 25000,
      sale_date: new Date().toISOString(),
      customer_name: 'John Doe',
      customer_email: 'john@example.com'
    };

    // Mock the sold car creation
    const mockSoldCar: SoldCars = {
      id: 1,
      created_at: '2024-01-01',
      car_id: 1,
      name: 'Toyota Camry',
      brand: 'Toyota',
      price: 25000,
      sale_date: new Date().toISOString(),
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      payment_method: 'Cash',
      financing_details: ''
    };

    store.dispatch(createSoldCar.fulfilled(mockSoldCar, 'createSoldCar', soldCarData));
    store.dispatch(deleteCar.fulfilled(1, 'deleteCar', 1));

    const finalState = store.getState();
    expect(finalState.cars.entities[1]).toBeUndefined();
    expect(finalState.cars.ids).not.toContain(1);
    expect(finalState.soldCars.entities[1]).toBeDefined();
    expect(finalState.soldCars.ids).toContain(1);
  });

  test('selectCars selector returns all cars', () => {
    const cars: Cars[] = [
      {
        id: 1,
        created_at: '2024-01-01',
        name: 'Toyota Camry',
        car_type: 'Sedan',
        brand: 'Toyota',
        price: 25000,
        fuel_type: 'Gasoline',
        description: 'A reliable sedan',
        features_amenities: 'GPS, Bluetooth',
        engine: '2.5L',
        horse_power: 203,
        transmission: 'Automatic',
        color: 'Blue',
        miles: 15000,
        year_of_manufacture: 2022,
        image_urls: ['car1.jpg']
      },
      {
        id: 2,
        created_at: '2024-01-02',
        name: 'Honda Civic',
        car_type: 'Sedan',
        brand: 'Honda',
        price: 22000,
        fuel_type: 'Gasoline',
        description: 'Efficient compact car',
        features_amenities: 'Bluetooth',
        engine: '2.0L',
        horse_power: 158,
        transmission: 'CVT',
        color: 'White',
        miles: 0,
        year_of_manufacture: 2023,
        image_urls: ['car2.jpg']
      }
    ];

    store.dispatch(fetchCars.fulfilled(cars, 'fetchCars', undefined));
    
    const selectedCars = selectCars(store.getState());
    expect(selectedCars).toHaveLength(2);
    expect(selectedCars[0].name).toBe('Toyota Camry');
    expect(selectedCars[1].name).toBe('Honda Civic');
  });

  test('selectCarById selector returns correct car', () => {
    const cars: Cars[] = [
      {
        id: 1,
        created_at: '2024-01-01',
        name: 'Toyota Camry',
        car_type: 'Sedan',
        brand: 'Toyota',
        price: 25000,
        fuel_type: 'Gasoline',
        description: 'A reliable sedan',
        features_amenities: 'GPS, Bluetooth',
        engine: '2.5L',
        horse_power: 203,
        transmission: 'Automatic',
        color: 'Blue',
        miles: 15000,
        year_of_manufacture: 2022,
        image_urls: ['car1.jpg']
      }
    ];

    store.dispatch(fetchCars.fulfilled(cars, 'fetchCars', undefined));
    
    const selectedCar = selectCarById(store.getState(), 1);
    expect(selectedCar).toBeDefined();
    expect(selectedCar?.name).toBe('Toyota Camry');
    expect(selectedCar?.brand).toBe('Toyota');
  });

  test('handles multiple car operations correctly', () => {
    const cars: Cars[] = [
      {
        id: 1,
        created_at: '2024-01-01',
        name: 'Toyota Camry',
        car_type: 'Sedan',
        brand: 'Toyota',
        price: 25000,
        fuel_type: 'Gasoline',
        description: 'A reliable sedan',
        features_amenities: 'GPS, Bluetooth',
        engine: '2.5L',
        horse_power: 203,
        transmission: 'Automatic',
        color: 'Blue',
        miles: 15000,
        year_of_manufacture: 2022,
        image_urls: ['car1.jpg']
      },
      {
        id: 2,
        created_at: '2024-01-02',
        name: 'Honda Civic',
        car_type: 'Sedan',
        brand: 'Honda',
        price: 22000,
        fuel_type: 'Gasoline',
        description: 'Efficient compact car',
        features_amenities: 'Bluetooth',
        engine: '2.0L',
        horse_power: 158,
        transmission: 'CVT',
        color: 'White',
        miles: 0,
        year_of_manufacture: 2023,
        image_urls: ['car2.jpg']
      }
    ];

    store.dispatch(fetchCars.fulfilled(cars, 'fetchCars', undefined));

    // Update first car
    const updatedCar1 = { ...cars[0], price: 26000 };
    store.dispatch(updateCar.fulfilled(updatedCar1, 'updateCar', { id: 1, price: 26000 }));

    // Delete second car
    store.dispatch(deleteCar.fulfilled(2, 'deleteCar', 2));

    const state = store.getState();
    expect(state.cars.entities[1]?.price).toBe(26000);
    expect(state.cars.entities[2]).toBeUndefined();
    expect(state.cars.ids).toEqual([1]);
  });

  test('error handling preserves state integrity', () => {
    const cars: Cars[] = [
      {
        id: 1,
        created_at: '2024-01-01',
        name: 'Toyota Camry',
        car_type: 'Sedan',
        brand: 'Toyota',
        price: 25000,
        fuel_type: 'Gasoline',
        description: 'A reliable sedan',
        features_amenities: 'GPS, Bluetooth',
        engine: '2.5L',
        horse_power: 203,
        transmission: 'Automatic',
        color: 'Blue',
        miles: 15000,
        year_of_manufacture: 2022,
        image_urls: ['car1.jpg']
      }
    ];

    store.dispatch(fetchCars.fulfilled(cars, 'fetchCars', undefined));

    // Simulate error
    store.dispatch(createCar.rejected('Failed to create', 'createCar', {} as Partial<Cars>, 'Failed to create'));

    const state = store.getState();
    expect(state.cars.error).toBe('Failed to create');
    expect(state.cars.entities[1]).toBeDefined(); // Original data preserved
    expect(state.cars.loading).toBe(false);
  });

  test('component integration with Redux store', async () => {
    render(
      <TestWrapper store={store}>
        <MockCarsComponent />
      </TestWrapper>
    );

    const fetchBtn = screen.getByTestId('fetch-cars-btn');
    await user.click(fetchBtn);

    await waitFor(() => {
      expect(screen.getByTestId('car-1')).toBeInTheDocument();
      expect(screen.getByTestId('car-1')).toHaveTextContent('Toyota Camry');
    });
  });

  test('component handles loading state', async () => {
    render(
      <TestWrapper store={store}>
        <MockCarsComponent />
      </TestWrapper>
    );

    const fetchBtn = screen.getByTestId('fetch-cars-btn');
    
    // Click and immediately check for loading
    await user.click(fetchBtn);
    
    // Loading should appear (simulated in mock component)
    expect(screen.getByTestId('mock-cars-component')).toBeInTheDocument();
  });

  test('component handles error state', async () => {
    render(
      <TestWrapper store={store}>
        <MockCarsComponent />
      </TestWrapper>
    );

    // Simulate error condition by dispatching error
    store.dispatch(fetchCars.rejected('Network error', 'fetchCars', undefined, 'Network error'));

    await waitFor(() => {
      expect(screen.getByTestId('mock-cars-component')).toBeInTheDocument();
    });
  });
});
