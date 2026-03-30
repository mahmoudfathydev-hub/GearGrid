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

// Mock Redux store with services state
const servicesReducer = (
  state = {
    loading: false,
    success: false,
    error: null,
    services: [],
    formData: {
      name: "",
      icon: "",
      desc: "",
    },
    editingId: null,
  },
  action: any,
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const createTestStore = (initialState: Record<string, any> = {}) => {
  return configureStore({
    reducer: {
      services: servicesReducer,
    },
    preloadedState: {
      services: {
        loading: false,
        success: false,
        error: null,
        services: [],
        formData: {
          name: "",
          icon: "",
          desc: "",
        },
        editingId: null,
        ...initialState.services,
      },
    },
  });
};

const TestWrapper = ({
  children,
  initialState = {},
}: {
  children: React.ReactNode;
  initialState?: Record<string, unknown>;
}) => {
  const testStore = createTestStore(initialState);

  return (
    <Provider store={testStore}>
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </Provider>
  );
};

const customRender = (ui: React.ReactElement, options = {}) => {
  return render(ui, { wrapper: TestWrapper, ...options });
};

// Import after all mocks
import Services from "@/app/Services/page";

describe("Services Page Rendering Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (
    ui: React.ReactElement,
    initialState: any = {},
  ) => {
    return customRender(ui, { initialState });
  };

  test("renders services page without crashing", () => {
    renderWithProviders(<Services />);

    // Check that page renders
    expect(document.body).toBeInTheDocument();
  });

  test("renders services hero section", () => {
    renderWithProviders(<Services />);

    // Check for hero content
    expect(screen.getByText(/Complete Car Services/i)).toBeInTheDocument();
    expect(screen.getByText(/One Platform/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /From buying to maintenance, GearGrid handles everything your car needs/i,
      ),
    ).toBeInTheDocument();
  });

  test("renders hero CTA button", () => {
    renderWithProviders(<Services />);

    // Check for hero CTA button
    const heroButton = screen.getByRole("button", {
      name: /Explore All Services/i,
    });
    expect(heroButton).toBeInTheDocument();
    expect(heroButton).toHaveClass("bg-blue-600");
  });

  test("renders services grid section", () => {
    const mockServices = [
      {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        name: "Car Maintenance",
        icon: "wrench",
        desc: "Professional maintenance service",
      },
    ];

    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Check for service card
    expect(screen.getByText(/Car Maintenance/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Professional maintenance service/i),
    ).toBeInTheDocument();
  });

  test("renders empty state when no services exist", () => {
    renderWithProviders(<Services />, {
      services: { services: [] },
    });

    // Check for empty state
    expect(screen.getByText(/No services available/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Add services through the dashboard to see them here./i),
    ).toBeInTheDocument();
  });

  test("renders loading state", () => {
    renderWithProviders(<Services />, {
      services: { loading: true, services: [] },
    });

    // Loading state should still render the page structure
    expect(screen.getByText(/Complete Car Services/i)).toBeInTheDocument();
  });

  test("renders error state", () => {
    renderWithProviders(<Services />, {
      services: { error: "Failed to fetch services", services: [] },
    });

    // Error state should still render the page
    expect(screen.getByText(/Complete Car Services/i)).toBeInTheDocument();
  });

  test("renders service cards with correct structure", () => {
    const mockServices = [
      {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        name: "Car Sales",
        icon: "car",
        desc: "New and used vehicles with verified listings",
      },
    ];

    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Check for service card structure
    const serviceCard = screen.getByText(/Car Sales/i).closest("div");
    expect(serviceCard).toHaveClass(
      "bg-white",
      "dark:bg-gray-800",
      "rounded-xl",
      "shadow-lg",
    );
  });

  test("renders service benefits", () => {
    const mockServices = [
      {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        name: "Car Sales",
        icon: "verified",
        desc: "New and used vehicles",
      },
    ];

    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Check for benefits list
    expect(screen.getByText(/Professional service/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick response/i)).toBeInTheDocument();
  });

  test("renders service CTA buttons", () => {
    const mockServices = [
      {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        name: "Car Sales",
        icon: "car",
        desc: "New and used vehicles",
      },
    ];

    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Check for CTA button
    const ctaButton = screen.getByRole("button", { name: /Learn More/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveClass("bg-blue-600", "hover:bg-blue-700");
  });

  test("renders proper semantic structure", () => {
    renderWithProviders(<Services />);

    // Check for semantic elements
    const mainElement = document.querySelector("main");
    expect(mainElement).toBeInTheDocument();

    const sections = document.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(0);

    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    expect(headings.length).toBeGreaterThan(0);
  });

  test("renders responsive design classes", () => {
    renderWithProviders(<Services />);

    // Check for responsive classes
    const responsiveElements = document.querySelectorAll(
      '[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]',
    );
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  test("renders dark mode support", () => {
    renderWithProviders(<Services />);

    // Check for dark mode classes
    const darkModeElements = document.querySelectorAll('[class*="dark:"]');
    expect(darkModeElements.length).toBeGreaterThan(0);
  });

  test("renders proper layout structure", () => {
    renderWithProviders(<Services />);

    // Check for layout classes
    const containerElements = document.querySelectorAll(
      '[class*="max-w-"], [class*="mx-auto"], [class*="px-"]',
    );
    expect(containerElements.length).toBeGreaterThan(0);
  });

  test("renders without console errors", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithProviders(<Services />);

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test("renders service grid with proper grid classes", () => {
    const mockServices = [
      {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        name: "Service 1",
        icon: "icon1",
        desc: "Description 1",
      },
      {
        id: 2,
        created_at: "2024-01-01T00:00:00Z",
        name: "Service 2",
        icon: "icon2",
        desc: "Description 2",
      },
      {
        id: 3,
        created_at: "2024-01-01T00:00:00Z",
        name: "Service 3",
        icon: "icon3",
        desc: "Description 3",
      },
    ];

    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Check for grid layout
    const gridContainer = document.querySelector('[class*="grid"]');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass(
      "grid-cols-1",
      "md:grid-cols-2",
      "lg:grid-cols-3",
    );
  });

  test("renders service titles with proper styling", () => {
    const mockServices = [
      {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        name: "Test Service",
        icon: "test",
        desc: "Test description",
      },
    ];

    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Check for title styling
    const titleElement = screen.getByText(/Test Service/i);
    expect(titleElement).toHaveClass(
      "text-xl",
      "font-bold",
      "text-gray-900",
      "dark:text-white",
    );
  });

  test("renders service descriptions with proper styling", () => {
    const mockServices = [
      {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        name: "Test Service",
        icon: "test",
        desc: "Test description for service",
      },
    ];

    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Check for description styling
    const descriptionElement = screen.getByText(
      /Test description for service/i,
    );
    expect(descriptionElement).toHaveClass(
      "text-gray-600",
      "dark:text-gray-300",
    );
  });
});
