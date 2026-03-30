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

describe("Services Page UI Structure Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (
    ui: React.ReactElement,
    initialState: any = {},
  ) => {
    return customRender(ui, { initialState });
  };

  test("has correct semantic HTML structure", () => {
    renderWithProviders(<Services />);

    // Check for main element
    const mainElement = document.querySelector("main");
    expect(mainElement).toBeInTheDocument();

    // Check for sections
    const sections = document.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(0);

    // Check for proper heading hierarchy
    const h1 = document.querySelector("h1");
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent(/Complete Car Services/);
  });

  test("hero section has proper structure", () => {
    renderWithProviders(<Services />);

    // Check for hero heading
    const heroHeading = screen.getByRole("heading", { level: 1 });
    expect(heroHeading).toBeInTheDocument();
    expect(heroHeading).toHaveTextContent(/Complete Car Services/);

    // Check for hero description
    const heroDescription = screen.getByText(
      /From buying to maintenance, GearGrid handles everything your car needs/,
    );
    expect(heroDescription).toBeInTheDocument();

    // Check for hero button
    const heroButton = screen.getByRole("button", {
      name: /Explore All Services/,
    });
    expect(heroButton).toBeInTheDocument();
  });

  test("services grid has proper structure", () => {
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

    // Check for grid container
    const gridContainer = document.querySelector('[class*="grid"]');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass(
      "grid-cols-1",
      "md:grid-cols-2",
      "lg:grid-cols-3",
    );
  });

  test("service cards have consistent structure", () => {
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

    // Check for service card
    const serviceCard = screen.getByText(/Test Service/).closest("div");
    expect(serviceCard).toHaveClass(
      "bg-white",
      "dark:bg-gray-800",
      "rounded-xl",
      "shadow-lg",
    );

    // Check for card structure elements
    expect(screen.getByText(/Test Service/)).toBeInTheDocument();
    expect(
      screen.getByText(/Test description for service/),
    ).toBeInTheDocument();

    // Check for benefits list
    const benefitsList = document.querySelector("ul");
    expect(benefitsList).toBeInTheDocument();

    // Check for CTA button
    const ctaButton = screen.getByRole("button", { name: /Learn More/ });
    expect(ctaButton).toBeInTheDocument();
  });

  test("service titles exist and are properly styled", () => {
    const mockServices = [
      {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        name: "Car Maintenance Service",
        icon: "wrench",
        desc: "Professional maintenance",
      },
    ];

    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Check for title
    const titleElement = screen.getByText(/Car Maintenance Service/i);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe("H3");
    expect(titleElement).toHaveClass(
      "text-xl",
      "font-bold",
      "text-gray-900",
      "dark:text-white",
    );
  });

  test("service descriptions exist and are properly styled", () => {
    const mockServices = [
      {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        name: "Test Service",
        icon: "test",
        desc: "This is a detailed description of the test service that we offer",
      },
    ];

    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Check for description
    const descriptionElement = screen.getByText(
      /This is a detailed description of the test service that we offer/i,
    );
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement.tagName).toBe("P");
    expect(descriptionElement).toHaveClass(
      "text-gray-600",
      "dark:text-gray-300",
    );
  });

  test("service benefits render correctly", () => {
    const mockServices = [
      {
        id: 1,
        created_at: "2024-01-01T00:00:00Z",
        name: "Test Service",
        icon: "test-icon",
        desc: "Test description",
      },
    ];

    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Check for transformed benefits
    expect(screen.getByText(/test-icon/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional service/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick response/i)).toBeInTheDocument();

    // Check for benefits list structure
    const benefitItems = document.querySelectorAll("li");
    expect(benefitItems.length).toBeGreaterThan(0);

    // Check for benefit bullet points
    const bulletPoints = document.querySelectorAll('[class*="bg-blue-500"]');
    expect(bulletPoints.length).toBeGreaterThan(0);
  });

  test("CTA buttons exist and are properly styled", () => {
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

    // Check for CTA button
    const ctaButton = screen.getByRole("button", { name: /Learn More/ });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveClass(
      "w-full",
      "py-3",
      "bg-blue-600",
      "hover:bg-blue-700",
      "text-white",
      "font-semibold",
      "rounded-lg",
    );
  });

  test("responsive layout classes are present", () => {
    renderWithProviders(<Services />);

    // Check for responsive classes
    const responsiveElements = document.querySelectorAll(
      '[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]',
    );
    expect(responsiveElements.length).toBeGreaterThan(0);

    // Check for specific responsive breakpoints
    const smElements = document.querySelectorAll('[class*="sm:"]');
    const mdElements = document.querySelectorAll('[class*="md:"]');
    const lgElements = document.querySelectorAll('[class*="lg:"]');

    expect(smElements.length).toBeGreaterThan(0);
    expect(mdElements.length).toBeGreaterThan(0);
    expect(lgElements.length).toBeGreaterThan(0);
  });

  test("consistent spacing is applied", () => {
    renderWithProviders(<Services />);

    // Check for spacing classes
    const paddingElements = document.querySelectorAll(
      '[class*="p-"], [class*="px-"], [class*="py-"], [class*="pt-"], [class*="pb-"]',
    );
    expect(paddingElements.length).toBeGreaterThan(0);

    const marginElements = document.querySelectorAll(
      '[class*="m-"], [class*="mx-"], [class*="my-"], [class*="mt-"], [class*="mb-"]',
    );
    expect(marginElements.length).toBeGreaterThan(0);

    const gapElements = document.querySelectorAll('[class*="gap-"]');
    expect(gapElements.length).toBeGreaterThan(0);
  });

  test("color scheme is consistent", () => {
    renderWithProviders(<Services />);

    // Check for text color classes
    const textColors = document.querySelectorAll('[class*="text-"]');
    expect(textColors.length).toBeGreaterThan(0);

    // Check for background color classes
    const bgColors = document.querySelectorAll('[class*="bg-"]');
    expect(bgColors.length).toBeGreaterThan(0);

    // Check for gradient classes
    const gradientElements = document.querySelectorAll('[class*="gradient"]');
    expect(gradientElements.length).toBeGreaterThan(0);
  });

  test("typography is consistent", () => {
    renderWithProviders(<Services />);

    // Check for font size classes
    const fontSizes = document.querySelectorAll('[class*="text-"]');
    expect(fontSizes.length).toBeGreaterThan(0);

    // Check for font weight classes
    const fontWeights = document.querySelectorAll('[class*="font-"]');
    expect(fontWeights.length).toBeGreaterThan(0);

    // Check for line height classes
    const lineHeights = document.querySelectorAll('[class*="leading-"]');
    expect(lineHeights.length).toBeGreaterThan(0);
  });

  test("interactive elements have hover states", () => {
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

    // Check for hover classes
    const hoverElements = document.querySelectorAll('[class*="hover:"]');
    expect(hoverElements.length).toBeGreaterThan(0);

    // Check for specific hover effects
    const serviceCard = screen.getByText(/Test Service/).closest("div");
    expect(serviceCard).toHaveClass(
      "hover:shadow-xl",
      "group-hover:text-blue-600",
    );

    const ctaButton = screen.getByRole("button", { name: /Learn More/ });
    expect(ctaButton).toHaveClass("hover:bg-blue-700", "hover:scale-105");
  });

  test("transition effects are applied", () => {
    renderWithProviders(<Services />);

    // Check for transition classes
    const transitionElements = document.querySelectorAll(
      '[class*="transition-"]',
    );
    expect(transitionElements.length).toBeGreaterThan(0);

    // Check for duration classes
    const durationElements = document.querySelectorAll('[class*="duration-"]');
    expect(durationElements.length).toBeGreaterThan(0);
  });

  test("border and shadow effects are used", () => {
    renderWithProviders(<Services />);

    // Check for border classes
    const borderElements = document.querySelectorAll('[class*="border"]');
    expect(borderElements.length).toBeGreaterThan(0);

    // Check for shadow classes
    const shadowElements = document.querySelectorAll('[class*="shadow"]');
    expect(shadowElements.length).toBeGreaterThan(0);
  });

  test("rounded corners are applied consistently", () => {
    renderWithProviders(<Services />);

    // Check for rounded classes
    const roundedElements = document.querySelectorAll('[class*="rounded"]');
    expect(roundedElements.length).toBeGreaterThan(0);
  });

  test("empty state has proper structure", () => {
    renderWithProviders(<Services />, {
      services: { services: [] },
    });

    // Check for empty state container
    const emptyStateContainer = screen
      .getByText(/No services available/i)
      .closest("section");
    expect(emptyStateContainer).toBeInTheDocument();
    expect(emptyStateContainer).toHaveClass(
      "py-16",
      "bg-gray-50",
      "dark:bg-gray-900",
    );

    // Check for empty state content
    expect(screen.getByText(/No services available/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Add services through the dashboard to see them here./i),
    ).toBeInTheDocument();
  });

  test("container structure is proper", () => {
    renderWithProviders(<Services />);

    // Check for max-width containers
    const maxWidthContainers = document.querySelectorAll('[class*="max-w-"]');
    expect(maxWidthContainers.length).toBeGreaterThan(0);

    // Check for center alignment
    const centerAlignedElements =
      document.querySelectorAll('[class*="mx-auto"]');
    expect(centerAlignedElements.length).toBeGreaterThan(0);

    // Check for padding containers
    const paddingContainers = document.querySelectorAll('[class*="px-"]');
    expect(paddingContainers.length).toBeGreaterThan(0);
  });
});
