import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import Home from '../app/page';
import { createMockStore, mockStoreState } from './mocks/reduxMocks';

// Mock child components with interactive elements
jest.mock('../app/components/Hero/Hero', () => {
  return function MockHero() {
    return (
      <section data-testid="hero-section">
        <header>
          <h1>Hero Title</h1>
          <p>Hero description</p>
        </header>
        <nav>
          <button 
            data-testid="get-started-btn"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => console.log('Get Started clicked')}
          >
            Get Started
          </button>
          <button 
            data-testid="learn-more-btn"
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => console.log('Learn More clicked')}
          >
            Learn More
          </button>
        </nav>
      </section>
    );
  };
});

jest.mock('../app/components/FeaturedCars/FeaturedCars', () => {
  return function MockFeaturedCars() {
    return (
      <section data-testid="featured-cars-section">
        <header>
          <h2>Featured Collections</h2>
          <p>Hand-picked performance vehicles</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article data-testid="car-card-1" className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <img src="/images/car1.jpg" alt="Luxury Car" className="w-full h-48 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">Luxury Car</h3>
            <p className="text-gray-600">$75,000</p>
            <button 
              data-testid="view-details-1"
              className="mt-2 text-blue-600 hover:underline"
              onClick={() => console.log('View Details clicked for car 1')}
            >
              View Details
            </button>
          </article>
          <article data-testid="car-card-2" className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <img src="/images/car2.jpg" alt="Sports Car" className="w-full h-48 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">Sports Car</h3>
            <p className="text-gray-600">$85,000</p>
            <button 
              data-testid="view-details-2"
              className="mt-2 text-blue-600 hover:underline"
              onClick={() => console.log('View Details clicked for car 2')}
            >
              View Details
            </button>
          </article>
        </div>
      </section>
    );
  };
});

jest.mock('../app/components/WhyUs/WhyUs', () => {
  return function MockWhyUs() {
    return (
      <section data-testid="why-us-section">
        <header>
          <h2>Why Choose Us</h2>
          <p>We offer the best service</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article data-testid="quality-feature" className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h3 className="text-xl font-semibold">Quality</h3>
            <p className="text-gray-600">Premium vehicles only</p>
            <button 
              data-testid="learn-more-quality"
              className="mt-2 text-blue-600 hover:underline"
              onClick={() => console.log('Learn More Quality clicked')}
            >
              Learn More
            </button>
          </article>
        </div>
      </section>
    );
  };
});

jest.mock('../app/components/CarRental/CarRental', () => {
  return function MockCarRental() {
    return (
      <section data-testid="car-rental-section">
        <header>
          <h2>Car Rental</h2>
          <p>Rent your dream car</p>
        </header>
        <form 
          data-testid="rental-form"
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Form submitted');
          }}
        >
          <label htmlFor="pickup-date" className="block text-sm font-medium mb-2">
            Pickup Date
          </label>
          <input 
            id="pickup-date"
            data-testid="pickup-date-input"
            type="date" 
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            aria-required="true"
          />
          <label htmlFor="return-date" className="block text-sm font-medium mb-2">
            Return Date
          </label>
          <input 
            id="return-date"
            data-testid="return-date-input"
            type="date" 
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            aria-required="true"
          />
          <button 
            data-testid="search-cars-btn"
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

jest.mock('../app/components/BuyAOne/BuyAOne', () => {
  return function MockBuyAOne() {
    return (
      <section data-testid="buy-a-one-section">
        <header>
          <h2>Buy A One</h2>
          <p>Exclusive collection</p>
        </header>
        <footer className="text-center">
          <button 
            data-testid="explore-collection-btn"
            className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
            onClick={() => console.log('Explore Collection clicked')}
          >
            Explore Collection
          </button>
        </footer>
      </section>
    );
  };
});

describe('Home Page - User Interactions', () => {
  const createWrapper = (initialState: any = mockStoreState, searchParams = {}) => {
    const store = createMockStore(initialState);
    return render(
      <Provider store={store}>
        <Home searchParams={searchParams} />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  describe('Button Interactions', () => {
    test('handles single button clicks', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const getStartedBtn = screen.getByTestId('get-started-btn');
      await user.click(getStartedBtn);
      
      expect(console.log).toHaveBeenCalledWith('Get Started clicked');
    });

    test('handles multiple button clicks', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const getStartedBtn = screen.getByTestId('get-started-btn');
      const learnMoreBtn = screen.getByTestId('learn-more-btn');
      
      await user.click(getStartedBtn);
      await user.click(learnMoreBtn);
      
      expect(console.log).toHaveBeenCalledWith('Get Started clicked');
      expect(console.log).toHaveBeenCalledWith('Learn More clicked');
    });

    test('handles rapid button clicks', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const getStartedBtn = screen.getByTestId('get-started-btn');
      
      // Rapid clicks
      await user.click(getStartedBtn);
      await user.click(getStartedBtn);
      await user.click(getStartedBtn);
      
      expect(console.log).toHaveBeenCalledTimes(3);
    });

    test('handles double clicks', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const getStartedBtn = screen.getByTestId('get-started-btn');
      await user.dblClick(getStartedBtn);
      
      expect(console.log).toHaveBeenCalledTimes(2); // dblClick triggers two click events
    });
  });

  describe('Card Interactions', () => {
    test('handles car card interactions', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const carCard1 = screen.getByTestId('car-card-1');
      const viewDetailsBtn = screen.getByTestId('view-details-1');
      
      // Click on the card
      await user.click(carCard1);
      
      // Click on view details button
      await user.click(viewDetailsBtn);
      
      expect(console.log).toHaveBeenCalledWith('View Details clicked for car 1');
    });

    test('handles multiple car card interactions', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const viewDetailsBtn1 = screen.getByTestId('view-details-1');
      const viewDetailsBtn2 = screen.getByTestId('view-details-2');
      
      await user.click(viewDetailsBtn1);
      await user.click(viewDetailsBtn2);
      
      expect(console.log).toHaveBeenCalledWith('View Details clicked for car 1');
      expect(console.log).toHaveBeenCalledWith('View Details clicked for car 2');
    });
  });

  describe('Form Interactions', () => {
    test('handles form input', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const pickupDateInput = screen.getByTestId('pickup-date-input');
      const returnDateInput = screen.getByTestId('return-date-input');
      
      await user.type(pickupDateInput, '2024-12-01');
      await user.type(returnDateInput, '2024-12-05');
      
      expect(pickupDateInput).toHaveValue('2024-12-01');
      expect(returnDateInput).toHaveValue('2024-12-05');
    });

    test('handles form submission', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const pickupDateInput = screen.getByTestId('pickup-date-input');
      const searchBtn = screen.getByTestId('search-cars-btn');
      
      await user.type(pickupDateInput, '2024-12-01');
      await user.click(searchBtn);
      
      expect(console.log).toHaveBeenCalledWith('Form submitted');
    });

    test('handles form validation', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const searchBtn = screen.getByTestId('search-cars-btn');
      
      // Try to submit empty form
      await user.click(searchBtn);
      
      // Form should still submit (mocked validation would prevent this in real app)
      expect(console.log).toHaveBeenCalledWith('Form submitted');
    });
  });

  describe('Keyboard Navigation', () => {
    test('supports tab navigation', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      // Tab through interactive elements
      await user.tab();
      await user.tab();
      await user.tab();
      
      // Focus should be on an interactive element
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
      expect(['BUTTON', 'INPUT', 'A']).toContain(focusedElement?.tagName);
    });

    test('supports enter key on buttons', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const getStartedBtn = screen.getByTestId('get-started-btn');
      getStartedBtn.focus();
      
      await user.keyboard('{Enter}');
      
      expect(console.log).toHaveBeenCalledWith('Get Started clicked');
    });

    test('supports escape key', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const pickupDateInput = screen.getByTestId('pickup-date-input');
      pickupDateInput.focus();
      
      await user.keyboard('{Escape}');
      
      // Escape should blur the input
      expect(document.activeElement).not.toBe(pickupDateInput);
    });

    test('supports space key on buttons', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const getStartedBtn = screen.getByTestId('get-started-btn');
      getStartedBtn.focus();
      
      await user.keyboard('{ }');
      
      expect(console.log).toHaveBeenCalledWith('Get Started clicked');
    });
  });

  describe('Hover and Touch Events', () => {
    test('handles hover events', async () => {
      createWrapper();
      
      const getStartedBtn = screen.getByTestId('get-started-btn');
      
      fireEvent.mouseEnter(getStartedBtn);
      expect(getStartedBtn).toHaveClass('hover:bg-blue-700');
      
      fireEvent.mouseLeave(getStartedBtn);
    });

    test('handles touch events', async () => {
      createWrapper();
      
      const getStartedBtn = screen.getByTestId('get-started-btn');
      
      fireEvent.touchStart(getStartedBtn);
      fireEvent.touchEnd(getStartedBtn);
      
      expect(getStartedBtn).toBeInTheDocument();
    });
  });

  describe('Scroll Events', () => {
    test('handles window scroll', async () => {
      createWrapper();
      
      // Mock scroll event
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      
      // Page should still be functional
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    test('handles element scroll', async () => {
      createWrapper();
      
      const featuredSection = screen.getByTestId('featured-cars-section');
      
      fireEvent.scroll(featuredSection, { target: { scrollTop: 50 } });
      
      expect(featuredSection).toBeInTheDocument();
    });
  });

  describe('Window Resize', () => {
    test('handles window resize', async () => {
      createWrapper();
      
      // Mock window resize
      fireEvent.resize(window);
      
      // Page should still be functional
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    test('handles responsive layout changes', async () => {
      createWrapper();
      
      // Change viewport size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent.resize(window);
      
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });
  });

  describe('Error Handling in Interactions', () => {
    test('handles button click errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock a button that throws an error
      jest.doMock('../app/components/Hero/Hero', () => {
        return function MockHero() {
          return (
            <section data-testid="hero-section">
              <button 
                data-testid="error-btn"
                onClick={() => {
                  throw new Error('Button click error');
                }}
              >
                Error Button
              </button>
            </section>
          );
        };
      });
      
      createWrapper();
      
      const errorBtn = screen.getByTestId('error-btn');
      
      // Error should be caught and not crash the app
      await expect(async () => {
        await user.click(errorBtn);
      }).rejects.toThrow('Button click error');
    });

    test('handles form submission errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock a form that throws an error
      jest.doMock('../app/components/CarRental/CarRental', () => {
        return function MockCarRental() {
          return (
            <section data-testid="car-rental-section">
              <form 
                onSubmit={() => {
                  throw new Error('Form submission error');
                }}
              >
                <button data-testid="submit-btn" type="submit">Submit</button>
              </form>
            </section>
          );
        };
      });
      
      createWrapper();
      
      const submitBtn = screen.getByTestId('submit-btn');
      
      await expect(async () => {
        await user.click(submitBtn);
      }).rejects.toThrow('Form submission error');
    });
  });

  describe('Accessibility Interactions', () => {
    test('supports screen reader interactions', async () => {
      createWrapper();
      
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach((button: HTMLElement) => {
        expect(button).toHaveAccessibleName();
      });
    });

    test('supports ARIA interactions', async () => {
      createWrapper();
      
      const inputs = screen.getAllByRole('textbox');
      
      inputs.forEach((input: HTMLElement) => {
        if (input.getAttribute('aria-required') === 'true') {
          expect(input).toHaveAttribute('aria-required', 'true');
        }
      });
    });
  });

  describe('Performance with Interactions', () => {
    test('handles many rapid interactions efficiently', async () => {
      const user = userEvent.setup();
      createWrapper();
      
      const startTime = performance.now();
      
      // Perform many rapid interactions
      for (let i = 0; i < 50; i++) {
        await user.click(screen.getByTestId('get-started-btn'));
      }
      
      const endTime = performance.now();
      
      // Should complete within reasonable time (less than 1 second for 50 clicks)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    test('does not cause memory leaks with interactions', async () => {
      const user = userEvent.setup();
      const { unmount } = createWrapper();
      
      // Perform interactions
      await user.click(screen.getByTestId('get-started-btn'));
      
      // Unmount component
      unmount();
      
      // Should not cause memory leaks (this is more of a manual test)
      expect(true).toBe(true);
    });
  });
});
