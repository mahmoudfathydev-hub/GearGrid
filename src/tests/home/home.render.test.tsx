import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider } from "next-themes";
import Home from "@/app/page";
import carsReducer from "@/store/Cars/CarsSlice";
import themeReducer from "@/store/themeSlice";

// Mock GSAP animations
jest.mock("gsap", () => ({
  fromTo: jest.fn(),
  registerPlugin: jest.fn(),
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: jest.fn(),
    refresh: jest.fn(),
  },
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

// Mock Swiper modules
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

const createTestStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      cars: carsReducer,
      theme: themeReducer,
    },
    preloadedState: {
      cars: {
        ids: [],
        entities: {},
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

describe("Home Page Rendering Tests", () => {
  test("renders home page without crashing", () => {
    renderWithProviders(<Home />);

    // Check if main sections are rendered
    expect(
      screen.getByTestId("hero-section") || document.querySelector("section"),
    ).toBeInTheDocument();
  });

  test("renders Hero section with correct content", () => {
    renderWithProviders(<Home />);

    // Check for hero content
    expect(screen.getByText(/Power in/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance/i)).toBeInTheDocument();
    expect(screen.getByText(/Elegance in Design/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Models/i)).toBeInTheDocument();
    expect(screen.getByText(/Book Test Drive/i)).toBeInTheDocument();
  });

  test("renders Featured Cars section", () => {
    renderWithProviders(<Home />);

    // Check for featured cars section
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
    expect(screen.getByText(/Collections/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Hand-picked performance vehicles/i),
    ).toBeInTheDocument();
  });

  test("renders Why Us section", () => {
    renderWithProviders(<Home />);

    // Check for why us section
    expect(screen.getByText(/Why Choose Us/i)).toBeInTheDocument();
    expect(screen.getByText(/The GearGrid Difference/i)).toBeInTheDocument();
    expect(screen.getByText(/Elite Selection/i)).toBeInTheDocument();
    expect(screen.getByText(/Certified Integrity/i)).toBeInTheDocument();
    expect(screen.getByText(/Bespoke Financing/i)).toBeInTheDocument();
    expect(screen.getByText(/Concierge Service/i)).toBeInTheDocument();
  });

  test("renders Car Rental section", () => {
    renderWithProviders(<Home />);

    // Check for car rental section
    const rentalSection = document.querySelector(
      'section[class*="bg-gray-50"]',
    );
    expect(rentalSection).toBeInTheDocument();
  });

  test("renders Buy A One section", () => {
    renderWithProviders(<Home />);

    // Check for buy a one section
    const buySection = document.querySelector('section[class*="border-t"]');
    expect(buySection).toBeInTheDocument();
  });

  test("renders with proper semantic structure", () => {
    renderWithProviders(<Home />);

    // Check for semantic HTML structure
    const sections = document.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(5); // Hero, FeaturedCars, WhyUs, CarRental, BuyAOne

    // Check for proper headings
    const headings = document.querySelectorAll("h1, h2, h3");
    expect(headings.length).toBeGreaterThan(0);
  });

  test("renders responsive design classes", () => {
    renderWithProviders(<Home />);

    // Check for responsive classes
    const container = document.querySelector(".container");
    expect(container).toBeInTheDocument();

    const responsiveElements = document.querySelectorAll(
      '[class*="lg:"], [class*="md:"], [class*="sm:"]',
    );
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  test("renders dark mode support", () => {
    renderWithProviders(<Home />);

    // Check for dark mode classes
    const darkModeElements = document.querySelectorAll('[class*="dark:"]');
    expect(darkModeElements.length).toBeGreaterThan(0);
  });

  test("renders with proper accessibility attributes", () => {
    renderWithProviders(<Home />);

    // Check for alt attributes on images
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
    });

    // Check for proper button elements
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      expect(button).toHaveAccessibleName();
    });
  });

  test("renders with proper layout structure", () => {
    renderWithProviders(<Home />);

    // Check for flex containers
    const flexContainers = document.querySelectorAll('[class*="flex"]');
    expect(flexContainers.length).toBeGreaterThan(0);

    // Check for grid containers
    const gridContainers = document.querySelectorAll('[class*="grid"]');
    expect(gridContainers.length).toBeGreaterThan(0);
  });

  test("renders with proper spacing classes", () => {
    renderWithProviders(<Home />);

    // Check for spacing classes (padding, margin, gap)
    const spacingElements = document.querySelectorAll(
      '[class*="p-"], [class*="m-"], [class*="gap-"]',
    );
    expect(spacingElements.length).toBeGreaterThan(0);
  });

  test("renders with proper color scheme", () => {
    renderWithProviders(<Home />);

    // Check for color classes
    const colorElements = document.querySelectorAll(
      '[class*="text-"], [class*="bg-"], [class*="border-"]',
    );
    expect(colorElements.length).toBeGreaterThan(0);
  });

  test("renders without console errors", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithProviders(<Home />);

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
