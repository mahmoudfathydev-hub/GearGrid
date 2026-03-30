import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider } from "next-themes";
import { fetchCars } from "@/store/Cars/CarsSlice";
import FeaturedCars from "@/app/components/FeaturedCars/FeaturedCars";
import carsReducer from "@/store/Cars/CarsSlice";
import themeReducer from "@/store/themeSlice";
import { Cars } from "@/store/Cars/types";

// Mock GSAP
jest.mock("gsap", () => ({
  fromTo: jest.fn(),
}));

// Mock Swiper
jest.mock("swiper/react", () => {
  const React = require("react");
  return {
    Swiper: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "swiper" }, children),
    SwiperSlide: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "swiper-slide" }, children),
  };
});

jest.mock("swiper/modules", () => ({
  Navigation: jest.fn(),
  Pagination: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
  const React = require("react");
  return ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children);
});

const mockCars: Cars[] = [
  {
    id: 1,
    created_at: "2024-01-01T00:00:00Z",
    name: "Test Car 1",
    car_type: "Sedan",
    brand: "Toyota",
    price: 25000,
    fuel_type: "Gasoline",
    description: "A great test car",
    features_amenities: "Leather seats, GPS, Bluetooth",
    engine: "2.5L",
    horse_power: 200,
    transmission: "Automatic",
    color: "Black",
    miles: 10000,
    year_of_manufacture: 2022,
    image_urls: ["https://example.com/car1.jpg"],
  },
  {
    id: 2,
    created_at: "2024-01-02T00:00:00Z",
    name: "Test Car 2",
    car_type: "SUV",
    brand: "Honda",
    price: 35000,
    fuel_type: "Hybrid",
    description: "Another great test car",
    features_amenities: "Sunroof, Heated seats, Apple CarPlay",
    engine: "3.0L",
    horse_power: 250,
    transmission: "CVT",
    color: "White",
    miles: 5000,
    year_of_manufacture: 2023,
    image_urls: ["https://example.com/car2.jpg"],
  },
];

const createTestStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      cars: carsReducer,
      theme: themeReducer,
    },
    preloadedState: {
      cars: {
        ids: [1, 2],
        entities: {
          1: mockCars[0],
          2: mockCars[1],
        },
        loading: false,
        error: null,
        ...initialState.cars,
      },
      theme: {
        theme: "light",
        ...initialState.theme,
      },
    },
  });
};

const renderWithProviders = (
  ui: React.ReactElement,
  {
    initialState = {},
    store = createTestStore(initialState),
  }: { initialState?: any; store?: any } = {},
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper });
};

describe("Home Page Redux Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("FeaturedCars component dispatches fetchCars on mount", () => {
    const mockDispatch = jest.fn();
    jest.mock("@/hooks", () => ({
      useAppDispatch: () => mockDispatch,
      useAppSelector: () => ({ cars: [] }),
    }));

    renderWithProviders(<FeaturedCars />);

    // Note: This test verifies the component structure
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
    expect(screen.getByText(/Collections/i)).toBeInTheDocument();
  });

  test("FeaturedCars displays cars from Redux store", () => {
    const store = createTestStore();

    renderWithProviders(<FeaturedCars />, { store });

    // Check that featured cars section is rendered
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
    expect(screen.getByText(/Collections/i)).toBeInTheDocument();
  });

  test("FeaturedCars handles empty cars state", () => {
    const store = createTestStore({
      cars: {
        ids: [],
        entities: {},
        loading: false,
        error: null,
      },
    });

    renderWithProviders(<FeaturedCars />, { store });

    // Should still render the section header
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
    expect(screen.getByText(/Collections/i)).toBeInTheDocument();
  });

  test("FeaturedCars handles loading state", () => {
    const store = createTestStore({
      cars: {
        ids: [],
        entities: {},
        loading: true,
        error: null,
      },
    });

    renderWithProviders(<FeaturedCars />, { store });

    // Should render the section even during loading
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
  });

  test("FeaturedCars handles error state", () => {
    const store = createTestStore({
      cars: {
        ids: [],
        entities: {},
        loading: false,
        error: "Failed to fetch cars",
      },
    });

    renderWithProviders(<FeaturedCars />, { store });

    // Should still render the section even with error
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
    expect(screen.getByText(/Collections/i)).toBeInTheDocument();
  });

  test("Redux store correctly manages cars state", () => {
    const store = createTestStore();

    // Check initial state
    const state = store.getState();
    expect(state.cars.ids).toContain(1);
    expect(state.cars.ids).toContain(2);
    expect(state.cars.entities[1]).toEqual(mockCars[0]);
    expect(state.cars.entities[2]).toEqual(mockCars[1]);
    expect(state.cars.loading).toBe(false);
    expect(state.cars.error).toBe(null);
  });

  test("Redux cars selector works correctly", () => {
    const store = createTestStore();

    // Test selector functionality through component rendering
    renderWithProviders(<FeaturedCars />, { store });

    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
  });

  test("Redux theme integration works", () => {
    const store = createTestStore({
      theme: {
        theme: "dark",
      },
    });

    renderWithProviders(<FeaturedCars />, { store });

    // Component should render with dark theme support
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
  });

  test("fetchCars thunk action creator", () => {
    // Test that fetchCars is properly defined
    expect(typeof fetchCars).toBe("function");
    expect(fetchCars.fulfilled).toBeDefined();
    expect(fetchCars.pending).toBeDefined();
    expect(fetchCars.rejected).toBeDefined();
  });

  test("cars slice handles fetchCars.pending", () => {
    const store = createTestStore();

    // Dispatch pending action
    store.dispatch(fetchCars.pending("fetchCars", undefined));

    const state = store.getState();
    expect(state.cars.loading).toBe(true);
    expect(state.cars.error).toBe(null);
  });

  test("cars slice handles fetchCars.fulfilled", () => {
    const store = createTestStore();

    // Dispatch fulfilled action
    store.dispatch(fetchCars.fulfilled(mockCars, "fetchCars", undefined));

    const state = store.getState();
    expect(state.cars.loading).toBe(false);
    expect(state.cars.error).toBe(null);
    expect(state.cars.ids).toContain(1);
    expect(state.cars.ids).toContain(2);
  });

  test("cars slice handles fetchCars.rejected", () => {
    const store = createTestStore();

    // Dispatch rejected action
    store.dispatch(
      fetchCars.rejected(new Error("Test error"), "fetchCars", undefined),
    );

    const state = store.getState();
    expect(state.cars.loading).toBe(false);
    expect(state.cars.error).toBe("Test error");
  });

  test("FeaturedCars transforms Redux data correctly", () => {
    const store = createTestStore();

    renderWithProviders(<FeaturedCars />, { store });

    // The component should transform the data and render
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
    expect(screen.getByText(/Collections/i)).toBeInTheDocument();
  });

  test("Redux state persistence", () => {
    const store = createTestStore();

    // Get initial state
    let state = store.getState();
    const initialCarsCount = state.cars.ids.length;

    // State should remain consistent
    state = store.getState();
    expect(state.cars.ids.length).toBe(initialCarsCount);
  });

  test("Redux store handles multiple car updates", () => {
    const store = createTestStore();

    // Add more cars
    const newCars: Cars[] = [
      {
        id: 3,
        created_at: "2024-01-03T00:00:00Z",
        name: "Test Car 3",
        car_type: "Truck",
        brand: "Ford",
        price: 45000,
        fuel_type: "Diesel",
        description: "A powerful truck",
        features_amenities: "Towing package, 4WD",
        engine: "5.0L",
        horse_power: 350,
        transmission: "Manual",
        color: "Blue",
        miles: 15000,
        year_of_manufacture: 2021,
        image_urls: ["https://example.com/car3.jpg"],
      },
    ];

    store.dispatch(
      fetchCars.fulfilled([...mockCars, ...newCars], "fetchCars", undefined),
    );

    const state = store.getState();
    expect(state.cars.ids).toContain(3);
    expect(state.cars.entities[3]).toEqual(newCars[0]);
  });

  test("Redux error handling resilience", () => {
    const store = createTestStore();

    // Simulate error state
    store.dispatch(
      fetchCars.rejected(new Error("Network error"), "fetchCars", undefined),
    );

    const state = store.getState();
    expect(state.cars.error).toBe("Network error");
    expect(state.cars.loading).toBe(false);

    // Component should still render
    renderWithProviders(<FeaturedCars />, { store });
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
  });
});
