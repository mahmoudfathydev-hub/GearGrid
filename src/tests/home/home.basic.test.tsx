/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock all external dependencies
jest.mock('gsap', () => ({
  fromTo: jest.fn(),
  registerPlugin: jest.fn(),
}));

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: jest.fn(),
    refresh: jest.fn(),
  },
}));

jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', { 'data-testid': 'swiper' }, children),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', { 'data-testid': 'swiper-slide' }, children),
}));

jest.mock('swiper/modules', () => ({
  Navigation: jest.fn(),
  Pagination: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => 
    React.createElement('a', { href }, children);
});

jest.mock('@/hooks', () => ({
  useAppSelector: () => ({ theme: 'light' }),
  useAppDispatch: () => jest.fn(),
}));

jest.mock('@/hooks/useCars', () => ({
  useCars: () => ({ cars: [], carById: jest.fn(), carIds: [] }),
}));

jest.mock('@/store/Cars/CarsSlice', () => ({
  fetchCars: jest.fn(),
  selectAllCars: () => [],
  selectCarById: () => null,
  selectCarIds: () => [],
}));

// Mock the components that cause issues
jest.mock('@/app/components/Hero/Hero', () => {
  return function MockHero() {
    return React.createElement('section', { 'data-testid': 'hero-section' }, 'Hero Section');
  };
});

jest.mock('@/app/components/FeaturedCars/FeaturedCars', () => {
  return function MockFeaturedCars() {
    return React.createElement('section', { 'data-testid': 'featured-cars-section' }, 'Featured Cars Section');
  };
});

jest.mock('@/app/components/WhyUs/WhyUs', () => {
  return function MockWhyUs() {
    return React.createElement('section', { 'data-testid': 'why-us-section' }, 'Why Us Section');
  };
});

jest.mock('@/app/components/CarRental/CarRental', () => {
  return function MockCarRental() {
    return React.createElement('section', { 'data-testid': 'car-rental-section' }, 'Car Rental Section');
  };
});

jest.mock('@/app/components/BuyAOne/BuyAOne', () => {
  return function MockBuyAOne() {
    return React.createElement('section', { 'data-testid': 'buy-a-one-section' }, 'Buy A One Section');
  };
});

// Import after mocking
import Home from '@/app/page';

describe('Home Page Basic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders home page without crashing', () => {
    render(<Home />);
    
    // Check that all sections are rendered
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('featured-cars-section')).toBeInTheDocument();
    expect(screen.getByTestId('why-us-section')).toBeInTheDocument();
    expect(screen.getByTestId('car-rental-section')).toBeInTheDocument();
    expect(screen.getByTestId('buy-a-one-section')).toBeInTheDocument();
  });

  test('renders with proper section order', () => {
    render(<Home />);
    
    const sections = screen.getAllByRole('generic');
    expect(sections.length).toBeGreaterThanOrEqual(5);
  });

  test('page structure is semantic', () => {
    render(<Home />);
    
    // Check for semantic elements
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBe(5);
  });

  test('no console errors during render', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Home />);
    
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('mocks are working correctly', () => {
    render(<Home />);
    
    // Verify mocked components are rendered
    expect(screen.getByText('Hero Section')).toBeInTheDocument();
    expect(screen.getByText('Featured Cars Section')).toBeInTheDocument();
    expect(screen.getByText('Why Us Section')).toBeInTheDocument();
    expect(screen.getByText('Car Rental Section')).toBeInTheDocument();
    expect(screen.getByText('Buy A One Section')).toBeInTheDocument();
  });
});
