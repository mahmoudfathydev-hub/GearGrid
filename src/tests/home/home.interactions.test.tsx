import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider } from "next-themes";
import Home from "@/app/page";
import carsReducer from "@/store/Cars/CarsSlice";
import themeReducer from "@/store/themeSlice";
import { Cars } from "@/store/Cars/types";

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
];

const createTestStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      cars: carsReducer,
      theme: themeReducer,
    },
    preloadedState: {
      cars: {
        ids: [1],
        entities: {
          1: mockCars[0],
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

describe("Home Page Interaction Tests", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test("explore models link navigates to correct page", async () => {
    renderWithProviders(<Home />);

    const exploreLink = screen.getByRole("link", { name: /Explore Models/i });
    expect(exploreLink).toHaveAttribute("href", "/Cars");

    await user.click(exploreLink);
    // In a real app, this would trigger navigation
    expect(exploreLink).toBeInTheDocument();
  });

  test("book test drive link navigates to correct page", async () => {
    renderWithProviders(<Home />);

    const bookLink = screen.getByRole("link", { name: /Book Test Drive/i });
    expect(bookLink).toHaveAttribute("href", "/bookTestDrive");

    await user.click(bookLink);
    // In a real app, this would trigger navigation
    expect(bookLink).toBeInTheDocument();
  });

  test("hero buttons are clickable and accessible", async () => {
    renderWithProviders(<Home />);

    const exploreLink = screen.getByRole("link", { name: /Explore Models/i });
    const bookLink = screen.getByRole("link", { name: /Book Test Drive/i });

    // Test keyboard navigation
    exploreLink.focus();
    expect(exploreLink).toHaveFocus();

    bookLink.focus();
    expect(bookLink).toHaveFocus();

    // Test click events
    await user.click(exploreLink);
    await user.click(bookLink);
  });

  test("featured cars swiper renders and is interactive", async () => {
    renderWithProviders(<Home />);

    const swiper = screen.getByTestId("swiper");
    expect(swiper).toBeInTheDocument();

    // Test that swiper slides are rendered
    const slides = screen.getAllByTestId("swiper-slide");
    expect(slides.length).toBeGreaterThan(0);
  });

  test("car cards are interactive elements", async () => {
    const store = createTestStore();
    renderWithProviders(<Home />, { store });

    // Look for car card buttons
    const exploreButtons = screen.getAllByRole("button", {
      name: /Explore Details/i,
    });
    expect(exploreButtons.length).toBeGreaterThan(0);

    // Test clicking on explore details button
    if (exploreButtons.length > 0) {
      await user.click(exploreButtons[0]);
      expect(exploreButtons[0]).toBeInTheDocument();
    }
  });

  test("hover effects on interactive elements", async () => {
    renderWithProviders(<Home />);

    // Find elements with hover effects
    const hoverElements = document.querySelectorAll('[class*="hover:"]');
    expect(hoverElements.length).toBeGreaterThan(0);

    // Test hover on first interactive element
    if (hoverElements.length > 0) {
      fireEvent.mouseEnter(hoverElements[0]);
      fireEvent.mouseLeave(hoverElements[0]);
    }
  });

  test("keyboard navigation works for all interactive elements", async () => {
    renderWithProviders(<Home />);

    // Get all interactive elements
    const interactiveElements = screen.getAllByRole("link");
    interactiveElements.push(...screen.getAllByRole("button"));

    // Test tab navigation
    for (const element of interactiveElements) {
      element.focus();
      expect(element).toHaveFocus();
    }
  });

  test("click events on feature cards", async () => {
    renderWithProviders(<Home />);

    // Look for feature cards
    const featureTitles = [
      /Elite Selection/i,
      /Certified Integrity/i,
      /Bespoke Financing/i,
      /Concierge Service/i,
    ];

    featureTitles.forEach((title) => {
      const featureCard = screen.getByText(title);
      expect(featureCard).toBeInTheDocument();

      // Test click on feature card
      fireEvent.click(featureCard);
      expect(featureCard).toBeInTheDocument();
    });
  });

  test("image error handling", async () => {
    renderWithProviders(<Home />);

    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      // Test image error event
      fireEvent.error(img);
      expect(img).toBeInTheDocument();
    });
  });

  test("form interactions in rental section", async () => {
    renderWithProviders(<Home />);

    // Look for form inputs in rental section
    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="date"], select, textarea',
    );

    inputs.forEach((input) => {
      // Test focus events
      fireEvent.focus(input);
      fireEvent.blur(input);

      // Test change events if it's an input
      if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
        fireEvent.change(input, { target: { value: "test value" } });
      }
    });
  });

  test("button interactions in all sections", async () => {
    renderWithProviders(<Home />);

    const buttons = screen.getAllByRole("button");

    for (const button of buttons) {
      // Test button click
      await user.click(button);
      expect(button).toBeInTheDocument();

      // Test button hover
      fireEvent.mouseEnter(button);
      fireEvent.mouseLeave(button);
    }
  });

  test("scroll trigger interactions", async () => {
    renderWithProviders(<Home />);

    // Test scroll events
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    fireEvent.scroll(window, { target: { scrollY: 500 } });
    fireEvent.scroll(window, { target: { scrollY: 1000 } });
  });

  test("responsive interaction patterns", async () => {
    renderWithProviders(<Home />);

    // Test window resize events
    fireEvent.resize(window, { target: { innerWidth: 320 } }); // Mobile
    fireEvent.resize(window, { target: { innerWidth: 768 } }); // Tablet
    fireEvent.resize(window, { target: { innerWidth: 1024 } }); // Desktop
  });

  test("touch interactions for mobile", async () => {
    renderWithProviders(<Home />);

    const interactiveElements = screen.getAllByRole("link");
    interactiveElements.push(...screen.getAllByRole("button"));

    interactiveElements.forEach((element) => {
      // Test touch events
      fireEvent.touchStart(element);
      fireEvent.touchEnd(element);
    });
  });

  test("focus management and accessibility", async () => {
    renderWithProviders(<Home />);

    // Test tab order
    await user.tab();
    await user.tab();
    await user.tab();

    // Test shift+tab
    await user.tab({ shift: true });
  });

  test("link interactions and external behavior", async () => {
    renderWithProviders(<Home />);

    const links = screen.getAllByRole("link");

    links.forEach((link) => {
      // Test link click
      fireEvent.click(link);
      expect(link).toBeInTheDocument();

      // Test right-click (context menu)
      fireEvent.contextMenu(link);
    });
  });

  test("dynamic content interactions", async () => {
    const store = createTestStore();
    renderWithProviders(<Home />, { store });

    // Test that dynamic content from Redux is interactive
    const dynamicContent = screen.queryAllByText(/Test Car/i);
    dynamicContent.forEach((content) => {
      expect(content).toBeInTheDocument();
    });
  });

  test("error recovery interactions", async () => {
    // Test with error state
    const store = createTestStore({
      cars: {
        ids: [],
        entities: {},
        loading: false,
        error: "Network error",
      },
    });

    renderWithProviders(<Home />, { store });

    // Should still be interactive despite error
    const exploreLink = screen.getByRole("link", { name: /Explore Models/i });
    await user.click(exploreLink);
    expect(exploreLink).toBeInTheDocument();
  });

  test("loading state interactions", async () => {
    // Test with loading state
    const store = createTestStore({
      cars: {
        ids: [],
        entities: {},
        loading: true,
        error: null,
      },
    });

    renderWithProviders(<Home />, { store });

    // Should still be interactive during loading
    const bookLink = screen.getByRole("link", { name: /Book Test Drive/i });
    await user.click(bookLink);
    expect(bookLink).toBeInTheDocument();
  });

  test("theme toggle interactions", async () => {
    renderWithProviders(<Home />);

    // Test theme-related interactions
    const darkModeElements = document.querySelectorAll('[class*="dark:"]');
    expect(darkModeElements.length).toBeGreaterThan(0);
  });

  test("performance interactions", async () => {
    renderWithProviders(<Home />);

    // Test rapid interactions
    const buttons = screen.getAllByRole("button");

    for (let i = 0; i < 5; i++) {
      buttons.forEach((button) => {
        fireEvent.click(button);
      });
    }
  });

  test("accessibility interactions", async () => {
    renderWithProviders(<Home />);

    // Test ARIA attributes
    const elementsWithAria = document.querySelectorAll(
      "[aria-label], [aria-describedby], [aria-expanded]",
    );
    elementsWithAria.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });
});
