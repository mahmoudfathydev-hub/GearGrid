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

describe("Home Page UI Validation Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("hero section has proper semantic structure", () => {
    renderWithProviders(<Home />);

    // Check for main heading
    const mainHeading = screen.getByRole("heading", { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent(/Power in/i);
  });

  test("navigation buttons are present and accessible", () => {
    renderWithProviders(<Home />);

    // Check for navigation links
    const exploreLink = screen.getByRole("link", { name: /Explore Models/i });
    const bookLink = screen.getByRole("link", { name: /Book Test Drive/i });

    expect(exploreLink).toBeInTheDocument();
    expect(exploreLink).toHaveAttribute("href", "/Cars");

    expect(bookLink).toBeInTheDocument();
    expect(bookLink).toHaveAttribute("href", "/bookTestDrive");
  });

  test("featured cars section has proper structure", () => {
    renderWithProviders(<Home />);

    // Check for section header
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
    expect(screen.getByText(/Collections/i)).toBeInTheDocument();

    // Check for description
    expect(
      screen.getByText(/Hand-picked performance vehicles/i),
    ).toBeInTheDocument();

    // Check for swiper component
    expect(screen.getByTestId("swiper")).toBeInTheDocument();
  });

  test("why us section displays all features", () => {
    renderWithProviders(<Home />);

    // Check for all feature titles
    expect(screen.getByText(/Elite Selection/i)).toBeInTheDocument();
    expect(screen.getByText(/Certified Integrity/i)).toBeInTheDocument();
    expect(screen.getByText(/Bespoke Financing/i)).toBeInTheDocument();
    expect(screen.getByText(/Concierge Service/i)).toBeInTheDocument();

    // Check for main heading
    expect(screen.getByText(/Why Choose Us/i)).toBeInTheDocument();
    expect(screen.getByText(/The GearGrid Difference/i)).toBeInTheDocument();
  });

  test("images have proper alt attributes", () => {
    renderWithProviders(<Home />);

    // Check for all images
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).not.toBe("");
    });
  });

  test("buttons have accessible labels", () => {
    renderWithProviders(<Home />);

    // Check for all buttons
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveAccessibleName();
    });
  });

  test("responsive design classes are present", () => {
    renderWithProviders(<Home />);

    // Check for responsive breakpoints
    const responsiveElements = document.querySelectorAll(
      '[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]',
    );
    expect(responsiveElements.length).toBeGreaterThan(0);

    // Check for container class
    const container = document.querySelector(".container");
    expect(container).toBeInTheDocument();
  });

  test("dark mode support classes are present", () => {
    renderWithProviders(<Home />);

    // Check for dark mode classes
    const darkModeElements = document.querySelectorAll('[class*="dark:"]');
    expect(darkModeElements.length).toBeGreaterThan(0);
  });

  test("proper semantic HTML structure", () => {
    renderWithProviders(<Home />);

    // Check for semantic elements
    const sections = document.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(5);

    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    expect(headings.length).toBeGreaterThan(0);

    // Check for proper heading hierarchy
    const h1 = document.querySelector("h1");
    expect(h1).toBeInTheDocument();
  });

  test("grid and flex layouts are properly implemented", () => {
    renderWithProviders(<Home />);

    // Check for grid containers
    const gridContainers = document.querySelectorAll('[class*="grid"]');
    expect(gridContainers.length).toBeGreaterThan(0);

    // Check for flex containers
    const flexContainers = document.querySelectorAll('[class*="flex"]');
    expect(flexContainers.length).toBeGreaterThan(0);
  });

  test("spacing and layout classes are consistent", () => {
    renderWithProviders(<Home />);

    // Check for padding classes
    const paddingElements = document.querySelectorAll(
      '[class*="p-"], [class*="px-"], [class*="py-"], [class*="pt-"], [class*="pb-"], [class*="pl-"], [class*="pr-"]',
    );
    expect(paddingElements.length).toBeGreaterThan(0);

    // Check for margin classes
    const marginElements = document.querySelectorAll(
      '[class*="m-"], [class*="mx-"], [class*="my-"], [class*="mt-"], [class*="mb-"], [class*="ml-"], [class*="mr-"]',
    );
    expect(marginElements.length).toBeGreaterThan(0);

    // Check for gap classes
    const gapElements = document.querySelectorAll('[class*="gap-"]');
    expect(gapElements.length).toBeGreaterThan(0);
  });

  test("color scheme is properly applied", () => {
    renderWithProviders(<Home />);

    // Check for text color classes
    const textColors = document.querySelectorAll('[class*="text-"]');
    expect(textColors.length).toBeGreaterThan(0);

    // Check for background color classes
    const bgColors = document.querySelectorAll('[class*="bg-"]');
    expect(bgColors.length).toBeGreaterThan(0);

    // Check for border color classes
    const borderColors = document.querySelectorAll('[class*="border-"]');
    expect(borderColors.length).toBeGreaterThan(0);
  });

  test("typography classes are properly applied", () => {
    renderWithProviders(<Home />);

    // Check for font size classes
    const fontSizes = document.querySelectorAll('[class*="text-"]');
    expect(fontSizes.length).toBeGreaterThan(0);

    // Check for font weight classes
    const fontWeights = document.querySelectorAll('[class*="font-"]');
    expect(fontWeights.length).toBeGreaterThan(0);

    // Check for text alignment classes
    const textAlignments = document.querySelectorAll(
      '[class*="text-"], [class*="justify-"], [class*="items-"]',
    );
    expect(textAlignments.length).toBeGreaterThan(0);
  });

  test("interactive elements have hover states", () => {
    renderWithProviders(<Home />);

    // Check for hover classes
    const hoverElements = document.querySelectorAll('[class*="hover:"]');
    expect(hoverElements.length).toBeGreaterThan(0);
  });

  test("transition and animation classes are present", () => {
    renderWithProviders(<Home />);

    // Check for transition classes
    const transitions = document.querySelectorAll('[class*="transition-"]');
    expect(transitions.length).toBeGreaterThan(0);

    // Check for duration classes
    const durations = document.querySelectorAll('[class*="duration-"]');
    expect(durations.length).toBeGreaterThan(0);
  });

  test("border and shadow effects are applied", () => {
    renderWithProviders(<Home />);

    // Check for border classes
    const borders = document.querySelectorAll('[class*="border"]');
    expect(borders.length).toBeGreaterThan(0);

    // Check for shadow classes
    const shadows = document.querySelectorAll('[class*="shadow"]');
    expect(shadows.length).toBeGreaterThan(0);
  });

  test("rounded corners are applied consistently", () => {
    renderWithProviders(<Home />);

    // Check for rounded classes
    const rounded = document.querySelectorAll('[class*="rounded"]');
    expect(rounded.length).toBeGreaterThan(0);
  });

  test("overflow handling is proper", () => {
    renderWithProviders(<Home />);

    // Check for overflow classes
    const overflows = document.querySelectorAll('[class*="overflow"]');
    expect(overflows.length).toBeGreaterThan(0);
  });

  test("position classes are used appropriately", () => {
    renderWithProviders(<Home />);

    // Check for position classes
    const positions = document.querySelectorAll(
      '[class*="relative"], [class*="absolute"], [class*="fixed"], [class*="sticky"]',
    );
    expect(positions.length).toBeGreaterThan(0);
  });

  test("z-index management is proper", () => {
    renderWithProviders(<Home />);

    // Check for z-index classes
    const zIndexes = document.querySelectorAll('[class*="z-"]');
    expect(zIndexes.length).toBeGreaterThan(0);
  });

  test("aspect ratio and object fit are used", () => {
    renderWithProviders(<Home />);

    // Check for object fit classes
    const objectFits = document.querySelectorAll('[class*="object-"]');
    expect(objectFits.length).toBeGreaterThan(0);
  });

  test("opacity and visibility classes are present", () => {
    renderWithProviders(<Home />);

    // Check for opacity classes
    const opacities = document.querySelectorAll('[class*="opacity-"]');
    expect(opacities.length).toBeGreaterThan(0);
  });

  test("transform and scale effects are applied", () => {
    renderWithProviders(<Home />);

    // Check for transform classes
    const transforms = document.querySelectorAll(
      '[class*="transform"], [class*="scale-"], [class*="translate-"], [class*="rotate-"]',
    );
    expect(transforms.length).toBeGreaterThan(0);
  });

  test("content wrapper and container structure", () => {
    renderWithProviders(<Home />);

    // Check for max-width containers
    const maxWidths = document.querySelectorAll('[class*="max-w-"]');
    expect(maxWidths.length).toBeGreaterThan(0);

    // Check for width classes
    const widths = document.querySelectorAll(
      '[class*="w-"], [class*="w-full"], [class*="w-auto"]',
    );
    expect(widths.length).toBeGreaterThan(0);
  });

  test("height and min-height classes are used", () => {
    renderWithProviders(<Home />);

    // Check for height classes
    const heights = document.querySelectorAll(
      '[class*="h-"], [class*="min-h-"], [class*="max-h-"]',
    );
    expect(heights.length).toBeGreaterThan(0);
  });
});
