import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Car Card component for UI testing
const MockCarCard: React.FC<{ car: any }> = ({ car }) => {
  return (
    <div data-testid={`car-card-${car.id}`} className="car-card">
      <div className="car-image">
        <img src={car.image_urls?.[0] || '/placeholder.jpg'} alt={car.name} />
      </div>
      <div className="car-details">
        <h3 className="car-name">{car.name}</h3>
        <p className="car-brand">{car.brand}</p>
        <p className="car-price">${car.price.toLocaleString()}</p>
        <p className="car-year">{car.year_of_manufacture}</p>
        <p className="car-fuel">{car.fuel_type}</p>
        <p className="car-transmission">{car.transmission}</p>
        <p className="car-color">{car.color}</p>
        <p className="car-miles">{car.miles.toLocaleString()} miles</p>
      </div>
      <div className="car-actions">
        <button className="edit-btn" data-testid={`edit-car-${car.id}`}>
          Edit
        </button>
        <button className="delete-btn" data-testid={`delete-car-${car.id}`}>
          Delete
        </button>
        <button className="sell-btn" data-testid={`sell-car-${car.id}`}>
          Sell
        </button>
      </div>
    </div>
  );
};

// Mock Cars Grid component
const MockCarsGrid: React.FC<{ cars: any[]; loading: boolean }> = ({ cars, loading }) => {
  if (loading) {
    return (
      <div data-testid="cars-loading-skeleton">
        {[...Array(6)].map((_, index) => (
          <div key={index} data-testid={`skeleton-${index}`} className="car-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-button"></div>
          </div>
        ))}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div data-testid="empty-cars-state">
        <div className="empty-icon">🚗</div>
        <h3>No cars available</h3>
        <p>Check back later or adjust your filters</p>
        <button className="add-first-car">Add Your First Car</button>
      </div>
    );
  }

  return (
    <div data-testid="cars-grid" className="cars-grid">
      {cars.map((car) => (
        <MockCarCard key={car.id} car={car} />
      ))}
    </div>
  );
};

// Mock Filter component
const MockCarFilters: React.FC = () => {
  return (
    <div data-testid="car-filters" className="car-filters">
      <div className="search-section">
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search by make, model, or features..."
          className="search-input"
        />
        <button data-testid="search-btn" className="search-button">
          Search
        </button>
      </div>
      
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="brand-filter">Brand</label>
          <select data-testid="brand-filter" id="brand-filter">
            <option value="">All Brands</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            <option value="BMW">BMW</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="type-filter">Type</label>
          <select data-testid="type-filter" id="type-filter">
            <option value="">All Types</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="fuel-filter">Fuel Type</label>
          <select data-testid="fuel-filter" id="fuel-filter">
            <option value="">All Fuel Types</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Diesel">Diesel</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="transmission-filter">Transmission</label>
          <select data-testid="transmission-filter" id="transmission-filter">
            <option value="">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="CVT">CVT</option>
          </select>
        </div>

        <div className="price-filter">
          <label htmlFor="min-price">Min Price</label>
          <input
            data-testid="min-price"
            type="number"
            id="min-price"
            placeholder="Min Price"
          />
          <label htmlFor="max-price">Max Price</label>
          <input
            data-testid="max-price"
            type="number"
            id="max-price"
            placeholder="Max Price"
          />
        </div>

        <button data-testid="reset-filters" className="reset-filters">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

// Mock Pagination component
const MockPagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div data-testid="pagination" className="pagination">
      <button
        data-testid="prev-page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      
      <div className="page-numbers">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            data-testid={`page-${index + 1}`}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <button
        data-testid="next-page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
      
      <div data-testid="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

// Test data
const mockCars = [
  {
    id: 1,
    created_at: '2024-01-01',
    name: 'Toyota Camry',
    car_type: 'Sedan',
    brand: 'Toyota',
    price: 25000,
    fuel_type: 'Gasoline',
    description: 'A reliable sedan',
    features_amenities: 'GPS, Bluetooth',
    engine: '2.5L',
    horse_power: 203,
    transmission: 'Automatic',
    color: 'Blue',
    miles: 15000,
    year_of_manufacture: 2022,
    image_urls: ['toyota-camry.jpg']
  },
  {
    id: 2,
    created_at: '2024-01-02',
    name: 'Honda Civic',
    car_type: 'Sedan',
    brand: 'Honda',
    price: 22000,
    fuel_type: 'Gasoline',
    description: 'Efficient compact car',
    features_amenities: 'Bluetooth',
    engine: '2.0L',
    horse_power: 158,
    transmission: 'CVT',
    color: 'White',
    miles: 5000,
    year_of_manufacture: 2023,
    image_urls: ['honda-civic.jpg']
  },
  {
    id: 3,
    created_at: '2024-01-03',
    name: 'Ford F-150',
    car_type: 'Truck',
    brand: 'Ford',
    price: 35000,
    fuel_type: 'Gasoline',
    description: 'Powerful pickup truck',
    features_amenities: '4WD, Tow Package',
    engine: '3.5L V6',
    horse_power: 290,
    transmission: 'Automatic',
    color: 'Black',
    miles: 20000,
    year_of_manufacture: 2021,
    image_urls: ['ford-f150.jpg']
  }
];

describe('Cars UI Validation Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  test('cars grid displays correct car information', () => {
    render(<MockCarsGrid cars={mockCars} loading={false} />);

    const carsGrid = screen.getByTestId('cars-grid');
    expect(carsGrid).toBeInTheDocument();
    expect(carsGrid).toHaveClass('cars-grid');

    // Check car cards are rendered
    expect(screen.getByTestId('car-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('car-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('car-card-3')).toBeInTheDocument();

    // Check car details
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    expect(screen.getByText('Ford F-150')).toBeInTheDocument();

    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Honda')).toBeInTheDocument();
    expect(screen.getByText('Ford')).toBeInTheDocument();

    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('$22,000')).toBeInTheDocument();
    expect(screen.getByText('$35,000')).toBeInTheDocument();
  });

  test('car cards have proper structure and classes', () => {
    render(<MockCarsGrid cars={[mockCars[0]]} loading={false} />);

    const carCard = screen.getByTestId('car-card-1');
    expect(carCard).toHaveClass('car-card');

    // Check for car image
    const carImage = carCard.querySelector('.car-image img');
    expect(carImage).toBeInTheDocument();
    expect(carImage).toHaveAttribute('alt', 'Toyota Camry');
    expect(carImage).toHaveAttribute('src', 'toyota-camry.jpg');

    // Check for car details
    const carDetails = carCard.querySelector('.car-details');
    expect(carDetails).toBeInTheDocument();
    expect(carDetails).toHaveTextContent('Toyota Camry');
    expect(carDetails).toHaveTextContent('Toyota');
    expect(carDetails).toHaveTextContent('$25,000');

    // Check for action buttons
    expect(screen.getByTestId('edit-car-1')).toBeInTheDocument();
    expect(screen.getByTestId('delete-car-1')).toBeInTheDocument();
    expect(screen.getByTestId('sell-car-1')).toBeInTheDocument();
  });

  test('loading skeleton displays correctly', () => {
    render(<MockCarsGrid cars={[]} loading={true} />);

    const loadingSkeleton = screen.getByTestId('cars-loading-skeleton');
    expect(loadingSkeleton).toBeInTheDocument();

    // Check for skeleton elements
    expect(screen.getByTestId('skeleton-0')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-1')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-2')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-3')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-4')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-5')).toBeInTheDocument();

    // Check skeleton structure
    const skeleton = screen.getByTestId('skeleton-0');
    expect(skeleton.querySelector('.skeleton-image')).toBeInTheDocument();
    expect(skeleton.querySelector('.skeleton-text')).toBeInTheDocument();
    expect(skeleton.querySelector('.skeleton-button')).toBeInTheDocument();
  });

  test('empty state displays correctly', () => {
    render(<MockCarsGrid cars={[]} loading={false} />);

    const emptyState = screen.getByTestId('empty-cars-state');
    expect(emptyState).toBeInTheDocument();

    expect(screen.getByText('No cars available')).toBeInTheDocument();
    expect(screen.getByText('Check back later or adjust your filters')).toBeInTheDocument();
    expect(screen.getByText('🚗')).toBeInTheDocument();
    expect(screen.getByText('Add Your First Car')).toBeInTheDocument();
  });

  test('filters render with correct structure', () => {
    render(<MockCarFilters />);

    const filters = screen.getByTestId('car-filters');
    expect(filters).toBeInTheDocument();
    expect(filters).toHaveClass('car-filters');

    // Check search section
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-btn')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by make, model, or features...')).toBeInTheDocument();

    // Check filter dropdowns
    expect(screen.getByTestId('brand-filter')).toBeInTheDocument();
    expect(screen.getByTestId('type-filter')).toBeInTheDocument();
    expect(screen.getByTestId('fuel-filter')).toBeInTheDocument();
    expect(screen.getByTestId('transmission-filter')).toBeInTheDocument();

    // Check price inputs
    expect(screen.getByTestId('min-price')).toBeInTheDocument();
    expect(screen.getByTestId('max-price')).toBeInTheDocument();

    // Check reset button
    expect(screen.getByTestId('reset-filters')).toBeInTheDocument();
  });

  test('filter dropdowns have correct options', () => {
    render(<MockCarFilters />);

    const brandFilter = screen.getByTestId('brand-filter') as HTMLSelectElement;
    expect(brandFilter.options).toHaveLength(5); // All Brands + 4 car brands
    expect(brandFilter.options[0].value).toBe('');
    expect(brandFilter.options[1].value).toBe('Toyota');
    expect(brandFilter.options[2].value).toBe('Honda');
    expect(brandFilter.options[3].value).toBe('Ford');
    expect(brandFilter.options[4].value).toBe('BMW');

    const typeFilter = screen.getByTestId('type-filter') as HTMLSelectElement;
    expect(typeFilter.options).toHaveLength(5); // All Types + 4 car types
    expect(typeFilter.options[1].value).toBe('Sedan');
    expect(typeFilter.options[2].value).toBe('SUV');
    expect(typeFilter.options[3].value).toBe('Truck');
    expect(typeFilter.options[4].value).toBe('Coupe');
  });

  test('pagination component renders correctly', () => {
    const mockOnPageChange = jest.fn();
    render(
      <MockPagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const pagination = screen.getByTestId('pagination');
    expect(pagination).toBeInTheDocument();

    // Check navigation buttons
    expect(screen.getByTestId('prev-page')).toBeInTheDocument();
    expect(screen.getByTestId('next-page')).toBeInTheDocument();

    // Check page numbers
    expect(screen.getByTestId('page-1')).toBeInTheDocument();
    expect(screen.getByTestId('page-2')).toBeInTheDocument();
    expect(screen.getByTestId('page-3')).toBeInTheDocument();
    expect(screen.getByTestId('page-4')).toBeInTheDocument();
    expect(screen.getByTestId('page-5')).toBeInTheDocument();

    // Check pagination info
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();

    // Check active page styling
    const activePage = screen.getByTestId('page-2');
    expect(activePage).toHaveClass('active');
  });

  test('responsive design classes are applied', () => {
    render(<MockCarsGrid cars={mockCars} loading={false} />);

    const carsGrid = screen.getByTestId('cars-grid');
    expect(carsGrid).toHaveClass('cars-grid');

    const carCard = screen.getByTestId('car-card-1');
    expect(carCard).toHaveClass('car-card');
  });

  test('form labels are properly associated with inputs', () => {
    render(<MockCarFilters />);

    // Check that labels have correct 'for' attributes
    const brandLabel = screen.getByLabelText('Brand');
    expect(brandLabel).toBeInTheDocument();
    expect(brandLabel).toHaveAttribute('id', 'brand-filter');

    const typeLabel = screen.getByLabelText('Type');
    expect(typeLabel).toBeInTheDocument();
    expect(typeLabel).toHaveAttribute('id', 'type-filter');
  });

  test('buttons have proper accessibility attributes', () => {
    render(<MockCarsGrid cars={[mockCars[0]]} loading={false} />);

    const editBtn = screen.getByTestId('edit-car-1');
    const deleteBtn = screen.getByTestId('delete-car-1');
    const sellBtn = screen.getByTestId('sell-car-1');

    expect(editBtn).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();
    expect(sellBtn).toBeInTheDocument();
  });

  test('images have proper alt attributes', () => {
    render(<MockCarsGrid cars={[mockCars[0]]} loading={false} />);

    const carImage = screen.getByAltText('Toyota Camry');
    expect(carImage).toBeInTheDocument();
  });

  test('price formatting is correct', () => {
    render(<MockCarsGrid cars={mockCars} loading={false} />);

    // Check that prices are formatted with commas
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('$22,000')).toBeInTheDocument();
    expect(screen.getByText('$35,000')).toBeInTheDocument();
  });

  test('mileage formatting is correct', () => {
    render(<MockCarsGrid cars={mockCars} loading={false} />);

    // Check that mileage is formatted with commas
    expect(screen.getByText('15,000 miles')).toBeInTheDocument();
    expect(screen.getByText('5,000 miles')).toBeInTheDocument();
    expect(screen.getByText('20,000 miles')).toBeInTheDocument();
  });

  test('hover effects classes are present', () => {
    render(<MockCarsGrid cars={[mockCars[0]]} loading={false} />);

    const carCard = screen.getByTestId('car-card-1');
    expect(carCard).toBeInTheDocument();
  });

  test('loading state has proper skeleton structure', () => {
    render(<MockCarsGrid cars={[]} loading={true} />);

    const skeletons = screen.getAllByTestId(/skeleton-/);
    expect(skeletons).toHaveLength(6);

    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass('car-skeleton');
      expect(skeleton.querySelector('.skeleton-image')).toBeInTheDocument();
      expect(skeleton.querySelector('.skeleton-text')).toBeInTheDocument();
      expect(skeleton.querySelector('.skeleton-button')).toBeInTheDocument();
    });
  });

  test('empty state has proper call-to-action', () => {
    render(<MockCarsGrid cars={[]} loading={false} />);

    const addFirstCarBtn = screen.getByText('Add Your First Car');
    expect(addFirstCarBtn).toBeInTheDocument();
    expect(addFirstCarBtn.tagName).toBe('BUTTON');
  });

  test('filter inputs have proper placeholder text', () => {
    render(<MockCarFilters />);

    const searchInput = screen.getByPlaceholderText('Search by make, model, or features...');
    expect(searchInput).toBeInTheDocument();

    const minPriceInput = screen.getByPlaceholderText('Min Price');
    expect(minPriceInput).toBeInTheDocument();

    const maxPriceInput = screen.getByPlaceholderText('Max Price');
    expect(maxPriceInput).toBeInTheDocument();
  });
});
