import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: any;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock("next/image", () => {
  return function MockImage({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: any;
  }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

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

jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

jest.mock("swiper/modules", () => ({
  Navigation: jest.fn(),
  Pagination: jest.fn(),
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Redux store
const carsReducer = (
  state = {
    ids: [],
    entities: {},
    loading: false,
    error: null,
  },
  action: any,
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const themeReducer = (state = { theme: "light" }, action: any) => {
  switch (action.type) {
    case "theme/toggleTheme":
      return { theme: state.theme === "dark" ? "light" : "dark" };
    default:
      return state;
  }
};

const mockStore = configureStore({
  reducer: {
    cars: carsReducer,
    theme: themeReducer,
  },
});

// Import after all mocks
import Home from "@/app/page";

describe("Home Page Rendering Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={mockStore}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {ui}
        </ThemeProvider>
      </Provider>,
    );
  };

  test("renders home page without crashing", () => {
    renderWithProviders(<Home />);

    // Check that the page renders
    expect(document.body).toBeInTheDocument();
  });

  test("renders hero section content", () => {
    renderWithProviders(<Home />);

    // Look for hero content
    expect(screen.getByText(/Power in/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance/i)).toBeInTheDocument();
    expect(screen.getByText(/Elegance in Design/i)).toBeInTheDocument();
  });

  test("renders navigation buttons", () => {
    renderWithProviders(<Home />);

    // Check for navigation links
    expect(
      screen.getByRole("link", { name: /Explore Models/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Book Test Drive/i }),
    ).toBeInTheDocument();
  });

  test("renders featured cars section", () => {
    renderWithProviders(<Home />);

    // Check for featured cars section
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
    expect(screen.getByText(/Collections/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Hand-picked performance vehicles/i),
    ).toBeInTheDocument();
  });

  test("renders why us section", () => {
    renderWithProviders(<Home />);

    // Check for why us section
    expect(screen.getByText(/Why Choose Us/i)).toBeInTheDocument();
    expect(screen.getByText(/The GearGrid Difference/i)).toBeInTheDocument();
    expect(screen.getByText(/Elite Selection/i)).toBeInTheDocument();
    expect(screen.getByText(/Certified Integrity/i)).toBeInTheDocument();
    expect(screen.getByText(/Bespoke Financing/i)).toBeInTheDocument();
    expect(screen.getByText(/Concierge Service/i)).toBeInTheDocument();
  });

  test("renders proper semantic structure", () => {
    renderWithProviders(<Home />);

    // Check for semantic elements
    const sections = document.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(5);

    // Check for headings
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    expect(headings.length).toBeGreaterThan(0);
  });

  test("renders with proper accessibility attributes", () => {
    renderWithProviders(<Home />);

    // Check for images with alt attributes
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
    });

    // Check for accessible buttons
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveAccessibleName();
    });
  });

  test("renders responsive design classes", () => {
    renderWithProviders(<Home />);

    // Check for responsive classes
    const responsiveElements = document.querySelectorAll(
      '[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]',
    );
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  test("renders dark mode support", () => {
    renderWithProviders(<Home />);

    // Check for dark mode classes
    const darkModeElements = document.querySelectorAll('[class*="dark:"]');
    expect(darkModeElements.length).toBeGreaterThan(0);
  });

  test("renders proper layout structure", () => {
    renderWithProviders(<Home />);

    // Check for flex containers
    const flexContainers = document.querySelectorAll('[class*="flex"]');
    expect(flexContainers.length).toBeGreaterThan(0);

    // Check for grid containers
    const gridContainers = document.querySelectorAll('[class*="grid"]');
    expect(gridContainers.length).toBeGreaterThan(0);
  });

  test("renders without console errors", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithProviders(<Home />);

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test("navigation links have correct href attributes", () => {
    renderWithProviders(<Home />);

    const exploreLink = screen.getByRole("link", { name: /Explore Models/i });
    const bookLink = screen.getByRole("link", { name: /Book Test Drive/i });

    expect(exploreLink).toHaveAttribute("href", "/Cars");
    expect(bookLink).toHaveAttribute("href", "/bookTestDrive");
  });

  test("renders with proper color scheme classes", () => {
    renderWithProviders(<Home />);

    // Check for color classes
    const colorElements = document.querySelectorAll(
      '[class*="text-"], [class*="bg-"], [class*="border-"]',
    );
    expect(colorElements.length).toBeGreaterThan(0);
  });

  test("renders with proper spacing classes", () => {
    renderWithProviders(<Home />);

    // Check for spacing classes
    const spacingElements = document.querySelectorAll(
      '[class*="p-"], [class*="m-"], [class*="gap-"]',
    );
    expect(spacingElements.length).toBeGreaterThan(0);
  });

  test("renders with interactive elements", () => {
    renderWithProviders(<Home />);

    // Check for interactive elements
    const buttons = screen.getAllByRole("button");
    const links = screen.getAllByRole("link");

    expect(buttons.length + links.length).toBeGreaterThan(0);
  });
});
