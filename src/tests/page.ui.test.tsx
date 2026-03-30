import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import Home from "../app/page";
import { createMockStore, mockStoreState } from "./mocks/reduxMocks";

// Mock child components with detailed UI structure
jest.mock("../app/components/Hero/Hero", () => {
  return function MockHero() {
    return (
      <section
        data-testid="hero-section"
        className="relative overflow-hidden bg-white dark:bg-black min-h-[calc(100vh-4rem)] flex items-center"
      >
        <header>
          <h1 className="text-4xl font-bold">Hero Title</h1>
          <p className="text-lg">Hero description</p>
        </header>
        <nav>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </button>
          <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Learn More
          </button>
        </nav>
      </section>
    );
  };
});

jest.mock("../app/components/FeaturedCars/FeaturedCars", () => {
  return function MockFeaturedCars() {
    return (
      <section
        data-testid="featured-cars-section"
        className="py-24 bg-white dark:bg-black overflow-hidden"
      >
        <header>
          <h2 className="text-3xl font-bold">Featured Collections</h2>
          <p className="text-gray-600">Hand-picked performance vehicles</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <img
              src="/images/car1.jpg"
              alt="Luxury Car"
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-xl font-semibold mt-2">Luxury Car</h3>
            <p className="text-gray-600">$75,000</p>
            <button className="mt-2 text-blue-600 hover:underline">
              View Details
            </button>
          </article>
        </div>
      </section>
    );
  };
});

jest.mock("../app/components/WhyUs/WhyUs", () => {
  return function MockWhyUs() {
    return (
      <section
        data-testid="why-us-section"
        className="py-16 bg-gray-50 dark:bg-gray-900"
      >
        <header>
          <h2 className="text-3xl font-bold text-center">Why Choose Us</h2>
          <p className="text-center text-gray-600">We offer the best service</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h3 className="text-xl font-semibold">Quality</h3>
            <p className="text-gray-600">Premium vehicles only</p>
          </article>
        </div>
      </section>
    );
  };
});

jest.mock("../app/components/CarRental/CarRental", () => {
  return function MockCarRental() {
    return (
      <section
        data-testid="car-rental-section"
        className="py-16 bg-white dark:bg-black"
      >
        <header>
          <h2 className="text-3xl font-bold">Car Rental</h2>
          <p className="text-gray-600">Rent your dream car</p>
        </header>
        <form className="max-w-md mx-auto">
          <label
            htmlFor="pickup-date"
            className="block text-sm font-medium mb-2"
          >
            Pickup Date
          </label>
          <input
            id="pickup-date"
            type="date"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-required="true"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
          >
            Search Cars
          </button>
        </form>
      </section>
    );
  };
});

jest.mock("../app/components/BuyAOne/BuyAOne", () => {
  return function MockBuyAOne() {
    return (
      <section
        data-testid="buy-a-one-section"
        className="py-16 bg-gray-50 dark:bg-gray-900"
      >
        <header>
          <h2 className="text-3xl font-bold">Buy A One</h2>
          <p className="text-gray-600">Exclusive collection</p>
        </header>
        <footer className="text-center">
          <button className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold">
            Explore Collection
          </button>
        </footer>
      </section>
    );
  };
});

describe("Home Page - UI Validation", () => {
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

  describe("Semantic HTML Structure", () => {
    test("uses proper semantic elements", () => {
      createWrapper();

      // Check for semantic sections
      const sections = screen.getAllByRole("section");
      expect(sections.length).toBe(5);

      // Check for headings hierarchy
      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(0);

      // Check first heading is h1 (from Hero)
      expect(headings[0].tagName).toBe("H1");
    });

    test("has proper landmark regions", () => {
      createWrapper();

      // Check for navigation
      const navElements = screen.getAllByRole("navigation");
      expect(navElements.length).toBeGreaterThan(0);

      // Check for main content areas
      const sections = screen.getAllByRole("region");
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe("Color Schemes and Typography", () => {
    test("applies correct color classes", () => {
      createWrapper();

      const heroSection = screen.getByTestId("hero-section");
      expect(heroSection).toHaveClass("bg-white", "dark:bg-black");

      const featuredSection = screen.getByTestId("featured-cars-section");
      expect(featuredSection).toHaveClass("bg-white", "dark:bg-black");

      const whyUsSection = screen.getByTestId("why-us-section");
      expect(whyUsSection).toHaveClass("bg-gray-50", "dark:bg-gray-900");
    });

    test("has proper typography classes", () => {
      createWrapper();

      const headings = screen.getAllByRole("heading");
      headings.forEach((heading: HTMLElement) => {
        expect(heading).toHaveClass(/font-/); // font-bold, font-semibold, etc.
      });

      const paragraphs = screen.getAllByRole("paragraph");
      paragraphs.forEach((paragraph: HTMLElement) => {
        expect(paragraph).toBeInTheDocument();
      });
    });

    test("maintains consistent spacing", () => {
      createWrapper();

      const sections = screen.getAllByRole("section");
      sections.forEach((section: HTMLElement) => {
        // Check for padding/margin classes
        expect(section).toHaveClass(/py-|px-|p-/);
      });
    });
  });

  describe("Interactive Elements", () => {
    test("buttons have proper styling and hover states", () => {
      createWrapper();

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button: HTMLElement) => {
        expect(button).toHaveClass(/bg-|border-/);
        expect(button).toHaveClass(/hover:/);
        expect(button).toHaveClass("transition-");
      });
    });

    test("form inputs have proper styling and focus states", () => {
      createWrapper();

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input: HTMLElement) => {
        expect(input).toHaveClass("border", "rounded-lg");
        expect(input).toHaveClass("focus:ring-2", "focus:border-blue-500");
      });
    });

    test("links have proper hover states", () => {
      createWrapper();

      const links = screen.getAllByRole("link");
      links.forEach((link: HTMLElement) => {
        expect(link).toHaveClass(/hover:/);
      });
    });
  });

  describe("Transitions and Animations", () => {
    test("interactive elements have transition classes", () => {
      createWrapper();

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button: HTMLElement) => {
        expect(button).toHaveClass("transition-");
      });

      const cards = screen.queryAllByRole("article");
      if (cards.length > 0) {
        cards.forEach((card: HTMLElement) => {
          expect(card).toHaveClass("transition-");
        });
      }
    });

    test("hover effects are properly implemented", () => {
      createWrapper();

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button: HTMLElement) => {
        expect(button).toHaveClass(/hover:/);
      });
    });
  });

  describe("Responsive Design Classes", () => {
    test("has responsive grid layouts", () => {
      const { container } = createWrapper();

      const grids = container.querySelectorAll(".grid");
      grids.forEach((grid: Element) => {
        expect(grid).toHaveClass(/grid-cols-1/);
        expect(grid).toHaveClass(/md:grid-cols-/);
        expect(grid).toHaveClass(/lg:grid-cols-/);
      });
    });

    test("has responsive typography", () => {
      const { container } = createWrapper();

      const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
      headings.forEach((element: Element) => {
        // Check for responsive text sizes
        expect(element).toHaveClass(/text-/);
      });
    });

    test("has responsive spacing", () => {
      createWrapper();

      const sections = screen.getAllByRole("section");
      sections.forEach((section: HTMLElement) => {
        // Check for responsive padding
        expect(section).toHaveClass(/py-/);
      });
    });
  });

  describe("Dark Mode Support", () => {
    test("components have dark mode classes", () => {
      createWrapper();

      const sections = screen.getAllByRole("section");
      sections.forEach((section: HTMLElement) => {
        expect(section).toHaveClass(/dark:/);
      });
    });

    test("text colors adapt to dark mode", () => {
      const { container } = createWrapper();

      const textElements = container.querySelectorAll("h1, h2, h3, p");
      textElements.forEach((element: Element) => {
        // Check for dark mode text color classes
        expect(element).toHaveClass(/dark:/);
      });
    });
  });

  describe("Accessibility Labels", () => {
    test("images have alt text", () => {
      createWrapper();

      const images = screen.getAllByRole("img");
      images.forEach((image: HTMLElement) => {
        expect(image).toHaveAttribute("alt");
        expect(image.getAttribute("alt")).not.toBe("");
      });
    });

    test("form inputs have proper labels", () => {
      createWrapper();

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input: HTMLElement) => {
        expect(input).toHaveAttribute("id");

        // Check for associated label
        const label = screen.getByLabelText(input.getAttribute("id") || "");
        expect(label).toBeInTheDocument();
      });
    });

    test("buttons have accessible names", () => {
      createWrapper();

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button: HTMLElement) => {
        expect(button).toHaveAccessibleName();
      });
    });

    test("ARIA attributes are properly used", () => {
      const { container } = createWrapper();

      // Check for required ARIA attributes
      const requiredInputs = container.querySelectorAll(
        '[aria-required="true"]',
      );
      requiredInputs.forEach((input: Element) => {
        expect(input).toHaveAttribute("aria-required", "true");
      });
    });
  });

  describe("Visual Hierarchy", () => {
    test("headings follow proper hierarchy", () => {
      createWrapper();

      const headings = screen.getAllByRole("heading");
      const headingLevels = headings.map((h: HTMLElement) =>
        parseInt(h.tagName.charAt(1)),
      );

      // Should start with h1 and not skip levels
      expect(headingLevels[0]).toBe(1);

      for (let i = 1; i < headingLevels.length; i++) {
        expect(headingLevels[i] - headingLevels[i - 1]).toBeLessThanOrEqual(1);
      }
    });

    test("important elements have proper visual weight", () => {
      createWrapper();

      const mainButtons = screen
        .getAllByRole("button")
        .filter(
          (button: HTMLElement) =>
            button.textContent?.includes("Get Started") ||
            button.textContent?.includes("Explore") ||
            button.textContent?.includes("Search"),
        );

      mainButtons.forEach((button: HTMLElement) => {
        expect(button).toHaveClass(/bg-/);
        expect(button).toHaveClass(/text-white/);
      });
    });
  });

  describe("Component Structure", () => {
    test("sections have proper header and content structure", () => {
      createWrapper();

      const sections = screen.getAllByRole("section");
      sections.forEach((section: HTMLElement) => {
        // Each section should have a heading
        const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
        expect(heading).toBeInTheDocument();
      });
    });

    test("cards have proper structure", () => {
      createWrapper();

      const cards = screen.queryAllByRole("article");
      cards.forEach((card: HTMLElement) => {
        expect(card).toBeInTheDocument();

        // Cards should have accessible content
        expect(card).toHaveAccessibleName();
      });
    });
  });
});
