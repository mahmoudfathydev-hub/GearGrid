import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      theme: (state = { theme: 'light' }, action) => {
        switch (action.type) {
          case 'theme/toggleTheme':
            return { theme: state.theme === 'dark' ? 'light' : 'dark' };
          default:
            return state;
        }
      },
      cars: (state = { entities: {}, ids: [], status: 'idle', error: null }, action) => state,
      soldCars: (state = { entities: {}, ids: [], status: 'idle', error: null }, action) => state,
      users: (state = { currentUser: null, users: [], status: 'idle', error: null }, action) => state,
    },
    preloadedState: initialState,
  });
};

const TestWrapper = ({ children, initialState = {} }: { children: React.ReactNode; initialState?: Record<string, unknown> }) => {
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

// Mock the child components
jest.mock('../app/components/Hero/Hero', () => {
  return function MockHero() {
    return <section data-testid="hero-section">Hero Component</section>;
  };
});

jest.mock('../app/components/FeaturedCars/FeaturedCars', () => {
  return function MockFeaturedCars() {
    return <section data-testid="featured-cars-section">Featured Cars Component</section>;
  };
});

jest.mock('../app/components/WhyUs/WhyUs', () => {
  return function MockWhyUs() {
    return <section data-testid="why-us-section">Why Us Component</section>;
  };
});

jest.mock('../app/components/CarRental/CarRental', () => {
  return function MockCarRental() {
    return <section data-testid="car-rental-section">Car Rental Component</section>;
  };
});

jest.mock('../app/components/BuyAOne/BuyAOne', () => {
  return function MockBuyAOne() {
    return <section data-testid="buy-a-one-section">Buy A One Component</section>;
  };
});

import Home from '../app/page';

describe('Home Page - Simple Tests', () => {
  test('renders without crashing', () => {
    customRender(<Home />);
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
  });

  test('renders all main sections', () => {
    customRender(<Home />);
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('featured-cars-section')).toBeInTheDocument();
    expect(screen.getByTestId('why-us-section')).toBeInTheDocument();
    expect(screen.getByTestId('car-rental-section')).toBeInTheDocument();
    expect(screen.getByTestId('buy-a-one-section')).toBeInTheDocument();
  });

  test('displays unauthorized error when error param is present', () => {
    customRender(<Home searchParams={{ error: 'unauthorized' }} />);
    expect(screen.getByText('Unauthorized Access')).toBeInTheDocument();
    expect(screen.getByText(/Access denied. You must be an admin to access the dashboard./)).toBeInTheDocument();
  });

  test('does not display error when no error param', () => {
    customRender(<Home searchParams={{}} />);
    expect(screen.queryByText('Unauthorized Access')).not.toBeInTheDocument();
  });
});
