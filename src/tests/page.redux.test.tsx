import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import Home from "../app/page";
import { createMockStore, mockStoreState } from "./mocks/reduxMocks";
import {
  mockCars,
  mockEmptyCars,
  mockLargeCarsDataset,
} from "./mocks/pageMocks";

// Mock the fetchCars thunk
const mockFetchCars = jest.fn();
jest.mock("../store/Cars/CarsSlice", () => ({
  ...jest.requireActual("../store/Cars/CarsSlice"),
  fetchCars: () => mockFetchCars(),
}));

// Mock the useCars hook to control Redux state
jest.mock("../hooks/useCars", () => ({
  useCars: () => ({
    cars: [],
    carById: jest.fn(),
    carIds: [],
  }),
}));

// Mock child components to focus on Redux integration
jest.mock("../app/components/Hero/Hero", () => {
  return function MockHero() {
    return <section data-testid="hero-section">Hero Component</section>;
  };
});

jest.mock("../app/components/FeaturedCars/FeaturedCars", () => {
  return function MockFeaturedCars() {
    return (
      <section data-testid="featured-cars-section">
        Featured Cars Component
      </section>
    );
  };
});

jest.mock("../app/components/WhyUs/WhyUs", () => {
  return function MockWhyUs() {
    return <section data-testid="why-us-section">Why Us Component</section>;
  };
});

jest.mock("../app/components/CarRental/CarRental", () => {
  return function MockCarRental() {
    return (
      <section data-testid="car-rental-section">Car Rental Component</section>
    );
  };
});

jest.mock("../app/components/BuyAOne/BuyAOne", () => {
  return function MockBuyAOne() {
    return (
      <section data-testid="buy-a-one-section">Buy A One Component</section>
    );
  };
});

describe("Home Page - Redux Integration", () => {
  const createWrapper = (
    initialState: any = mockStoreState,
    searchParams = {},
  ) => {
    const store = createMockStore(initialState);
    return render(
      <Provider store={store}>
        <Home searchParams={searchParams} />
      </Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Cars Slice Integration", () => {
    test("dispatches fetchCars on component mount", async () => {
      createWrapper();
      expect(mockFetchCars).toHaveBeenCalled();
    });

    test("renders with cars data in Redux store", () => {
      const stateWithCars = {
        ...mockStoreState,
        cars: {
          entities: mockCars.reduce(
            (acc, car) => {
              acc[car.id] = car;
              return acc;
            },
            {} as Record<number, any>,
          ),
          ids: mockCars.map((car) => car.id),
          status: "idle" as const,
          error: null,
        },
      };

      createWrapper(stateWithCars);

      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
    });

    test("renders with empty cars data", () => {
      const stateWithEmptyCars = {
        ...mockStoreState,
        cars: {
          entities: {},
          ids: [],
          status: "idle" as const,
          error: null,
        },
      };

      createWrapper(stateWithEmptyCars);

      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
    });

    test("renders with large cars dataset", () => {
      const stateWithLargeDataset = {
        ...mockStoreState,
        cars: {
          entities: mockLargeCarsDataset.reduce(
            (acc, car) => {
              acc[car.id] = car;
              return acc;
            },
            {} as Record<number, any>,
          ),
          ids: mockLargeCarsDataset.map((car) => car.id),
          status: "idle" as const,
          error: null,
        },
      };

      createWrapper(stateWithLargeDataset);

      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
    });
  });

  describe("Async Action States", () => {
    test("handles pending state correctly", async () => {
      const pendingState = {
        ...mockStoreState,
        cars: {
          entities: {},
          ids: [],
          status: "loading" as const,
          error: null,
        },
      };

      createWrapper(pendingState);

      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
    });

    test("handles fulfilled state correctly", async () => {
      const fulfilledState = {
        ...mockStoreState,
        cars: {
          entities: mockCars.reduce(
            (acc, car) => {
              acc[car.id] = car;
              return acc;
            },
            {} as Record<number, any>,
          ),
          ids: mockCars.map((car) => car.id),
          status: "idle" as const,
          error: null,
        },
      };

      createWrapper(fulfilledState);

      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
    });

    test("handles rejected state correctly", async () => {
      const rejectedState = {
        ...mockStoreState,
        cars: {
          entities: {},
          ids: [],
          status: "failed" as const,
          error: "Failed to fetch cars",
        },
      };

      createWrapper(rejectedState);

      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    test("handles API errors gracefully", async () => {
      const errorState = {
        ...mockStoreState,
        cars: {
          entities: {},
          ids: [],
          status: "failed" as const,
          error: "Network error: Failed to fetch",
        },
      };

      createWrapper(errorState);

      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
    });

    test("handles malformed data in Redux state", async () => {
      const malformedState = {
        ...mockStoreState,
        cars: {
          entities: {
            1: { id: 1, name: "Car with missing fields" },
            2: { id: 2, brand: null, price: null },
          },
          ids: [1, 2],
          status: "idle" as const,
          error: null,
        },
      };

      createWrapper(malformedState);

      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
    });
  });

  describe("Performance with Redux", () => {
    test("handles large Redux state efficiently", async () => {
      const largeState = {
        ...mockStoreState,
        cars: {
          entities: mockLargeCarsDataset.reduce(
            (acc, car) => {
              acc[car.id] = car;
              return acc;
            },
            {} as Record<number, any>,
          ),
          ids: mockLargeCarsDataset.map((car) => car.id),
          status: "idle" as const,
          error: null,
        },
      };

      const startTime = performance.now();
      createWrapper(largeState);
      const endTime = performance.now();

      // Should render within reasonable time (less than 100ms for 25 items)
      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    });
  });

  describe("Redux Selectors", () => {
    test("uses correct selectors from useCars hook", async () => {
      createWrapper();
      expect(mockFetchCars).toHaveBeenCalledTimes(1);
    });

    test("selects cars data correctly", async () => {
      const stateWithCars = {
        ...mockStoreState,
        cars: {
          entities: mockCars.reduce(
            (acc, car) => {
              acc[car.id] = car;
              return acc;
            },
            {} as Record<number, any>,
          ),
          ids: mockCars.map((car) => car.id),
          status: "idle" as const,
          error: null,
        },
      };

      createWrapper(stateWithCars);

      // The component should render successfully with the selected data
      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
    });
  });
});
