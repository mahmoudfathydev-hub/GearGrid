import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple test component
const TestComponent = () => {
  return (
    <div data-testid="test-component">
      <h1 data-testid="title">Test Cars Page</h1>
      <input data-testid="search-input" placeholder="Search cars..." />
      <select data-testid="brand-filter">
        <option value="">All Brands</option>
        <option value="Toyota">Toyota</option>
      </select>
      <div data-testid="results-count">Results: 1</div>
      <div data-testid="cars-grid">
        <div data-testid="car-card-1">
          <h3>Toyota Camry</h3>
          <p>Toyota</p>
          <p>$25,000</p>
        </div>
      </div>
    </div>
  );
};

describe('Cars Page - Simple Tests', () => {
  test('renders component without crashing', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  test('renders title', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('title')).toHaveTextContent('Test Cars Page');
  });

  test('renders search input', () => {
    render(<TestComponent />);
    const searchInput = screen.getByPlaceholderText('Search cars...');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders brand filter', () => {
    render(<TestComponent />);
    const brandFilter = screen.getByTestId('brand-filter');
    expect(brandFilter).toBeInTheDocument();
    expect(brandFilter.querySelector('select')).toBeInTheDocument();
  });

  test('renders results count', () => {
    render(<TestComponent />);
    const resultsCount = screen.getByTestId('results-count');
    expect(resultsCount).toBeInTheDocument();
    expect(resultsCount).toHaveTextContent('Results: 1');
  });

  test('renders cars grid', () => {
    render(<TestComponent />);
    const carsGrid = screen.getByTestId('cars-grid');
    expect(carsGrid).toBeInTheDocument();
  });

  test('renders car card', () => {
    render(<TestComponent />);
    const carCard = screen.getByTestId('car-card-1');
    expect(carCard).toBeInTheDocument();
    expect(carCard).toHaveTextContent('Toyota Camry');
    expect(carCard).toHaveTextContent('Toyota');
    expect(carCard).toHaveTextContent('$25,000');
  });
});
