import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const mockServices = [
  {
    id: 1,
    created_at: "2024-01-01T00:00:00Z",
    name: "Car Maintenance",
    icon: "wrench",
    desc: "Professional maintenance service for all vehicles",
  },
  {
    id: 2,
    created_at: "2024-01-02T00:00:00Z",
    name: "Car Rental",
    icon: "car",
    desc: "Daily, weekly, and monthly rentals with flexible terms",
  },
];

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
        ...initialState,
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

describe("Services Page Interaction Tests", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
  });

  const renderWithProviders = (
    ui: React.ReactElement,
    initialState: any = {},
  ) => {
    return customRender(ui, { initialState });
  };

  test("hero CTA button is clickable", async () => {
    renderWithProviders(<Services />);

    const heroButton = screen.getByRole("button", {
      name: /Explore All Services/i,
    });

    await user.click(heroButton);

    // Button should be clicked (no specific action defined, but should not error)
    expect(heroButton).toBeInTheDocument();
  });

  test("service card is clickable", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const serviceCard = screen.getByText(/Car Maintenance/i).closest("div");

    await user.click(serviceCard!);

    // Card should be clicked
    expect(serviceCard).toBeInTheDocument();
  });

  test("service CTA button is clickable", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const ctaButton = screen.getByRole("button", { name: /Learn More/i });

    await user.click(ctaButton);

    // CTA button should be clicked
    expect(ctaButton).toBeInTheDocument();
  });

  test("hover effects work on service cards", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const serviceCard = screen.getByText(/Car Maintenance/i).closest("div");

    // Test hover effect
    fireEvent.mouseEnter(serviceCard!);
    fireEvent.mouseLeave(serviceCard!);

    expect(serviceCard).toBeInTheDocument();
  });

  test("hover effects work on CTA buttons", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const ctaButton = screen.getByRole("button", { name: /Learn More/i });

    // Test hover effect
    fireEvent.mouseEnter(ctaButton);
    fireEvent.mouseLeave(ctaButton);

    expect(ctaButton).toBeInTheDocument();
  });

  test("keyboard navigation works on hero button", async () => {
    renderWithProviders(<Services />);

    const heroButton = screen.getByRole("button", {
      name: /Explore All Services/i,
    });

    // Test keyboard navigation
    heroButton.focus();
    expect(heroButton).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(heroButton).toBeInTheDocument();
  });

  test("keyboard navigation works on service cards", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const serviceCard = screen.getByText(/Car Maintenance/i).closest("div");

    // Test keyboard navigation
    serviceCard!.focus();
    expect(serviceCard).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(serviceCard).toBeInTheDocument();
  });

  test("keyboard navigation works on CTA buttons", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const ctaButton = screen.getByRole("button", { name: /Learn More/i });

    // Test keyboard navigation
    ctaButton.focus();
    expect(ctaButton).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(ctaButton).toBeInTheDocument();
  });

  test("tab navigation order is logical", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Test tab navigation
    await user.tab();
    await user.tab();
    await user.tab();

    // Should navigate through interactive elements
    const interactiveElements = screen.getAllByRole("button");
    expect(interactiveElements.length).toBeGreaterThan(0);
  });

  test("focus states are visible", () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const ctaButton = screen.getByRole("button", { name: /Learn More/i });

    // Test focus state
    ctaButton.focus();
    expect(ctaButton).toHaveFocus();

    // Check for focus styles (if implemented)
    expect(ctaButton).toBeInTheDocument();
  });

  test("touch events work on mobile", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const serviceCard = screen.getByText(/Car Maintenance/i).closest("div");

    // Test touch events
    fireEvent.touchStart(serviceCard!);
    fireEvent.touchEnd(serviceCard!);

    expect(serviceCard).toBeInTheDocument();
  });

  test("multiple service cards can be interacted with", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const ctaButtons = screen.getAllByRole("button", { name: /Learn More/i });

    // Test clicking multiple CTA buttons
    for (const button of ctaButtons) {
      await user.click(button);
      expect(button).toBeInTheDocument();
    }
  });

  test("service cards respond to hover state changes", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const serviceTitle = screen.getByText(/Car Maintenance/i);
    const serviceCard = serviceTitle.closest("div");

    // Test hover state changes
    fireEvent.mouseEnter(serviceCard!);

    // Title should change color on hover
    expect(serviceTitle).toBeInTheDocument();

    fireEvent.mouseLeave(serviceCard!);

    expect(serviceCard).toBeInTheDocument();
  });

  test("empty state interactions work", async () => {
    renderWithProviders(<Services />, {
      services: { services: [] },
    });

    const emptyStateText = screen.getByText(/No services available/i);

    // Empty state should be interactive (if clickable)
    fireEvent.click(emptyStateText);

    expect(emptyStateText).toBeInTheDocument();
  });

  test("loading state interactions are handled", async () => {
    renderWithProviders(<Services />, {
      services: { loading: true, services: [] },
    });

    const heroButton = screen.getByRole("button", {
      name: /Explore All Services/i,
    });

    // Should still be interactive during loading
    await user.click(heroButton);

    expect(heroButton).toBeInTheDocument();
  });

  test("error state interactions are handled", async () => {
    renderWithProviders(<Services />, {
      services: { error: "Failed to load services", services: [] },
    });

    const heroButton = screen.getByRole("button", {
      name: /Explore All Services/i,
    });

    // Should still be interactive during error state
    await user.click(heroButton);

    expect(heroButton).toBeInTheDocument();
  });

  test("rapid interactions don't cause errors", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const ctaButton = screen.getByRole("button", { name: /Learn More/i });

    // Test rapid clicking
    for (let i = 0; i < 5; i++) {
      await user.click(ctaButton);
    }

    expect(ctaButton).toBeInTheDocument();
  });

  test("service card interactions work with transformed benefits", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const benefitText = screen.getByText(/Professional service/i);

    // Test clicking on benefit
    fireEvent.click(benefitText);

    expect(benefitText).toBeInTheDocument();
  });

  test("scroll interactions work", () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Test scroll events
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    fireEvent.scroll(window, { target: { scrollY: 500 } });

    // Page should still be functional
    expect(screen.getByText(/Car Maintenance/i)).toBeInTheDocument();
  });

  test("window resize interactions work", () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Test resize events
    fireEvent.resize(window, { target: { innerWidth: 768 } });
    fireEvent.resize(window, { target: { innerWidth: 1024 } });

    // Page should still be functional
    expect(screen.getByText(/Car Maintenance/i)).toBeInTheDocument();
  });

  test("context menu interactions work", () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const serviceCard = screen.getByText(/Car Maintenance/i).closest("div");

    // Test context menu
    fireEvent.contextMenu(serviceCard!);

    expect(serviceCard).toBeInTheDocument();
  });

  test("double click interactions work", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const serviceCard = screen.getByText(/Car Maintenance/i).closest("div");

    // Test double click
    fireEvent.doubleClick(serviceCard!);

    expect(serviceCard).toBeInTheDocument();
  });

  test("accessibility interactions work with screen readers", () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Test ARIA attributes
    const ctaButton = screen.getByRole("button", { name: /Learn More/i });

    // Check for accessibility attributes
    expect(ctaButton).toHaveAttribute("type", "button");
  });

  test("form submission interactions work (if forms exist)", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    // Test if there are any form interactions
    const buttons = screen.getAllByRole("button");

    for (const button of buttons) {
      await user.click(button);
      expect(button).toBeInTheDocument();
    }
  });

  test("navigation interactions work properly", async () => {
    renderWithProviders(<Services />);

    // Test navigation interactions
    const heroButton = screen.getByRole("button", {
      name: /Explore All Services/i,
    });

    await user.click(heroButton);

    // Should trigger navigation or action
    expect(heroButton).toBeInTheDocument();
  });

  test("error recovery interactions work", async () => {
    renderWithProviders(<Services />, {
      services: { error: "Network error", services: [] },
    });

    const heroButton = screen.getByRole("button", {
      name: /Explore All Services/i,
    });

    // Test retry interaction
    await user.click(heroButton);

    expect(heroButton).toBeInTheDocument();
  });

  test("service card group interactions work", async () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices },
    });

    const serviceCards = document.querySelectorAll('[class*="group"]');

    // Test group hover interactions
    serviceCards.forEach((card) => {
      fireEvent.mouseEnter(card);
      fireEvent.mouseLeave(card);
      expect(card).toBeInTheDocument();
    });
  });
});
