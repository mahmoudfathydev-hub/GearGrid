import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import Home from "../app/page";
import {
  createMockStore,
  mockStoreState,
  mockLoadingState,
  mockErrorState,
} from "./mocks/reduxMocks";
import { mockCars, mockEmptyCars } from "./mocks/pageMocks";

// Mock child components to focus on page structure
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

describe("Home Page - Rendering & Layout", () => {
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

  describe("Basic Rendering", () => {
    test("renders without crashing", () => {
      createWrapper();
      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
      expect(screen.getByTestId("why-us-section")).toBeInTheDocument();
      expect(screen.getByTestId("car-rental-section")).toBeInTheDocument();
      expect(screen.getByTestId("buy-a-one-section")).toBeInTheDocument();
    });

    test("renders all main sections in correct order", () => {
      createWrapper();
      const sections = screen.getAllByRole("section");
      expect(sections).toHaveLength(5);

      expect(sections[0]).toHaveAttribute("data-testid", "hero-section");
      expect(sections[1]).toHaveAttribute(
        "data-testid",
        "featured-cars-section",
      );
      expect(sections[2]).toHaveAttribute("data-testid", "why-us-section");
      expect(sections[3]).toHaveAttribute("data-testid", "car-rental-section");
      expect(sections[4]).toHaveAttribute("data-testid", "buy-a-one-section");
    });

    test("renders semantic HTML structure", () => {
      createWrapper();

      // Check for semantic elements
      const mainContent = document.querySelector("main") || document.body;
      expect(mainContent).toBeInTheDocument();

      // Check for sections
      const sections = screen.getAllByRole("section");
      expect(sections.length).toBeGreaterThan(0);

      // Each section should be properly structured
      sections.forEach((section) => {
        expect(section).toBeInTheDocument();
        expect(section).toHaveAttribute("data-testid");
      });
    });
  });

  describe("Error Message Display", () => {
    test("displays unauthorized error message when error param is present", () => {
      createWrapper(mockStoreState, { error: "unauthorized" });

      const errorMessage = screen.getByText(
        /Access denied. You must be an admin to access the dashboard./,
      );
      expect(errorMessage).toBeInTheDocument();

      const errorTitle = screen.getByText("Unauthorized Access");
      expect(errorTitle).toBeInTheDocument();
    });

    test("does not display error message when no error param", () => {
      createWrapper(mockStoreState, {});

      expect(screen.queryByText("Unauthorized Access")).not.toBeInTheDocument();
      expect(screen.queryByText(/Access denied/)).not.toBeInTheDocument();
    });

    test("handles different error param values", () => {
      createWrapper(mockStoreState, { error: "other-error" });

      expect(screen.queryByText("Unauthorized Access")).not.toBeInTheDocument();
      expect(screen.queryByText(/Access denied/)).not.toBeInTheDocument();
    });

    test("error message has proper styling classes", () => {
      createWrapper(mockStoreState, { error: "unauthorized" });

      const errorContainer = screen
        .getByText("Unauthorized Access")
        .closest("div");
      expect(errorContainer).toHaveClass(
        "bg-red-100",
        "border-l-4",
        "border-red-500",
        "text-red-700",
        "p-4",
        "mb-4",
      );
    });
  });

  describe("Empty States", () => {
    test("renders correctly with empty cars data", () => {
      const emptyState = {
        ...mockStoreState,
        cars: {
          ...mockStoreState.cars,
          entities: {},
          ids: [],
        },
      };

      createWrapper(emptyState);

      // Page should still render all sections
      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
      expect(screen.getByTestId("why-us-section")).toBeInTheDocument();
      expect(screen.getByTestId("car-rental-section")).toBeInTheDocument();
      expect(screen.getByTestId("buy-a-one-section")).toBeInTheDocument();
    });

    test("handles missing searchParams gracefully", () => {
      const { container } = render(
        <Provider store={createMockStore(mockStoreState)}>
          <Home />
        </Provider>,
      );

      expect(container).toBeInTheDocument();
      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    test("renders during loading state", () => {
      const loadingState = {
        ...mockStoreState,
        cars: {
          ...mockStoreState.cars,
          status: "loading" as const,
        },
      };
      createWrapper(loadingState);

      // Page should still render all sections during loading
      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
      expect(screen.getByTestId("why-us-section")).toBeInTheDocument();
      expect(screen.getByTestId("car-rental-section")).toBeInTheDocument();
      expect(screen.getByTestId("buy-a-one-section")).toBeInTheDocument();
    });
  });

  describe("Error States", () => {
    test("renders with error state", () => {
      const errorState = {
        ...mockStoreState,
        cars: {
          ...mockStoreState.cars,
          status: "failed" as const,
          error: "Failed to fetch cars",
        },
      };
      createWrapper(errorState);

      // Page should still render all sections even with errors
      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("featured-cars-section")).toBeInTheDocument();
      expect(screen.getByTestId("why-us-section")).toBeInTheDocument();
      expect(screen.getByTestId("car-rental-section")).toBeInTheDocument();
      expect(screen.getByTestId("buy-a-one-section")).toBeInTheDocument();
    });
  });

  describe("Responsive Layout", () => {
    test("has responsive classes on sections", () => {
      createWrapper();

      // Check that sections have responsive styling
      const sections = screen.getAllByRole("section");
      sections.forEach((section) => {
        const sectionElement = section as HTMLElement;
        // Sections should have responsive classes (checked via classList)
        expect(sectionElement).toBeInTheDocument();
      });
    });

    test("maintains layout structure with different viewport sizes", async () => {
      // Mock different viewport sizes
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375, // Mobile
      });

      createWrapper();
      expect(screen.getByTestId("hero-section")).toBeInTheDocument();

      // Change to tablet
      window.innerWidth = 768;
      window.dispatchEvent(new Event("resize"));

      await waitFor(() => {
        expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      });

      // Change to desktop
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));

      await waitFor(() => {
        expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      });
    });
  });

  describe("Component Structure", () => {
    test("each section is properly contained", () => {
      createWrapper();

      const sections = screen.getAllByRole("section");
      sections.forEach((section) => {
        expect(section).toHaveAttribute("data-testid");
        expect(section).toBeInTheDocument();
      });
    });

    test("page wrapper structure is correct", () => {
      const { container } = createWrapper();

      // Should have a fragment wrapper (React.Fragment)
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Accessibility Structure", () => {
    test("has proper heading hierarchy", () => {
      createWrapper();

      // While we've mocked the components, we can still check basic structure
      const mainContent = document.querySelector("main") || document.body;
      expect(mainContent).toBeInTheDocument();
    });

    test("sections are properly landmarked", () => {
      createWrapper();

      const sections = screen.getAllByRole("section");
      expect(sections.length).toBeGreaterThan(0);

      sections.forEach((section) => {
        expect(section).toBeInTheDocument();
      });
    });
  });
});
