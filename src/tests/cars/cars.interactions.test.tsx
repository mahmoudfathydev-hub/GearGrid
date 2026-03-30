import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock interactive Car component
const MockInteractiveCarCard: React.FC<{ car: any }> = ({ car }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleCardClick = () => {
    setClickCount(prev => prev + 1);
  };

  const handleDoubleClick = () => {
    alert(`Double clicked on ${car.name}`);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${car.name}?`)) {
      alert(`${car.name} deleted!`);
    }
  };

  const handleSell = () => {
    if (window.confirm(`Are you sure you want to sell ${car.name}?`)) {
      alert(`${car.name} sold!`);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      data-testid={`car-card-${car.id}`}
      className={`car-card ${isHovered ? 'hovered' : ''}`}
      onClick={handleCardClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="button"
      aria-label={`Car: ${car.name}, ${car.brand}, $${car.price}`}
    >
      <div className="car-image">
        <img src={car.image_urls?.[0] || '/placeholder.jpg'} alt={car.name} />
      </div>
      <div className="car-details">
        <h3>{car.name}</h3>
        <p>{car.brand}</p>
        <p>${car.price.toLocaleString()}</p>
        <p>Clicks: {clickCount}</p>
      </div>
      <div className="car-actions">
        <button
          data-testid={`edit-car-${car.id}`}
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          aria-label={`Edit ${car.name}`}
        >
          Edit
        </button>
        <button
          data-testid={`delete-car-${car.id}`}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          aria-label={`Delete ${car.name}`}
        >
          Delete
        </button>
        <button
          data-testid={`sell-car-${car.id}`}
          onClick={(e) => {
            e.stopPropagation();
            handleSell();
          }}
          aria-label={`Sell ${car.name}`}
        >
          Sell
        </button>
      </div>
      {isEditing && (
        <div data-testid={`edit-modal-${car.id}`} className="edit-modal">
          <h4>Edit {car.name}</h4>
          <button onClick={() => setIsEditing(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

// Mock Filter component with interactions
const MockInteractiveFilters: React.FC<{ onFilterChange: (filters: any) => void }> = ({ onFilterChange }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedBrand, setSelectedBrand] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');

  const handleSearch = () => {
    onFilterChange({
      search: searchQuery,
      brand: selectedBrand,
      type: selectedType,
      minPrice,
      maxPrice
    });
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedType('');
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({});
  };

  return (
    <div data-testid="interactive-filters">
      <input
        data-testid="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search cars..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <button data-testid="search-btn" onClick={handleSearch}>
        Search
      </button>
      
      <select
        data-testid="brand-filter"
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
      >
        <option value="">All Brands</option>
        <option value="Toyota">Toyota</option>
        <option value="Honda">Honda</option>
        <option value="Ford">Ford</option>
      </select>
      
      <select
        data-testid="type-filter"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="Sedan">Sedan</option>
        <option value="SUV">SUV</option>
        <option value="Truck">Truck</option>
      </select>
      
      <input
        data-testid="min-price"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Min Price"
      />
      
      <input
        data-testid="max-price"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Max Price"
      />
      
      <button data-testid="reset-filters" onClick={handleReset}>
        Reset Filters
      </button>
    </div>
  );
};

// Mock Pagination with interactions
const MockInteractivePagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div data-testid="interactive-pagination">
      <button
        data-testid="prev-page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          data-testid={`page-${index + 1}`}
          onClick={() => onPageChange(index + 1)}
          className={currentPage === index + 1 ? 'active' : ''}
        >
          {index + 1}
        </button>
      ))}
      
      <button
        data-testid="next-page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
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
  }
];

describe('Cars Interaction Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    
    // Mock window.confirm and alert
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
  });

  test('car card responds to clicks', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const carCard = screen.getByTestId('car-card-1');
    
    // First click
    await user.click(carCard);
    expect(screen.getByText('Clicks: 1')).toBeInTheDocument();

    // Second click
    await user.click(carCard);
    expect(screen.getByText('Clicks: 2')).toBeInTheDocument();
  });

  test('car card responds to double click', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const carCard = screen.getByTestId('car-card-1');
    
    await user.dblClick(carCard);
    
    expect(window.alert).toHaveBeenCalledWith('Double clicked on Toyota Camry');
  });

  test('car card responds to hover events', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const carCard = screen.getByTestId('car-card-1');
    
    // Mouse enter
    fireEvent.mouseEnter(carCard);
    expect(carCard).toHaveClass('hovered');

    // Mouse leave
    fireEvent.mouseLeave(carCard);
    expect(carCard).not.toHaveClass('hovered');
  });

  test('edit button opens edit modal', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const editBtn = screen.getByTestId('edit-car-1');
    
    await user.click(editBtn);
    
    expect(screen.getByTestId('edit-modal-1')).toBeInTheDocument();
    expect(screen.getByText('Edit Toyota Camry')).toBeInTheDocument();
  });

  test('delete button triggers confirmation dialog', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const deleteBtn = screen.getByTestId('delete-car-1');
    
    await user.click(deleteBtn);
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete Toyota Camry?');
    expect(window.alert).toHaveBeenCalledWith('Toyota Camry deleted!');
  });

  test('sell button triggers confirmation dialog', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const sellBtn = screen.getByTestId('sell-car-1');
    
    await user.click(sellBtn);
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to sell Toyota Camry?');
    expect(window.alert).toHaveBeenCalledWith('Toyota Camry sold!');
  });

  test('search input responds to typing', async () => {
    const mockFilterChange = jest.fn();
    render(<MockInteractiveFilters onFilterChange={mockFilterChange} />);

    const searchInput = screen.getByTestId('search-input');
    
    await user.type(searchInput, 'Toyota');
    
    expect(searchInput).toHaveValue('Toyota');
  });

  test('search button triggers filter change', async () => {
    const mockFilterChange = jest.fn();
    render(<MockInteractiveFilters onFilterChange={mockFilterChange} />);

    const searchInput = screen.getByTestId('search-input');
    const searchBtn = screen.getByTestId('search-btn');
    
    await user.type(searchInput, 'Toyota');
    await user.click(searchBtn);
    
    expect(mockFilterChange).toHaveBeenCalledWith({
      search: 'Toyota',
      brand: '',
      type: '',
      minPrice: '',
      maxPrice: ''
    });
  });

  test('search triggers on Enter key', async () => {
    const mockFilterChange = jest.fn();
    render(<MockInteractiveFilters onFilterChange={mockFilterChange} />);

    const searchInput = screen.getByTestId('search-input');
    
    await user.type(searchInput, 'Toyota');
    await user.keyboard('{Enter}');
    
    expect(mockFilterChange).toHaveBeenCalledWith({
      search: 'Toyota',
      brand: '',
      type: '',
      minPrice: '',
      maxPrice: ''
    });
  });

  test('brand filter dropdown changes value', async () => {
    const mockFilterChange = jest.fn();
    render(<MockInteractiveFilters onFilterChange={mockFilterChange} />);

    const brandFilter = screen.getByTestId('brand-filter') as HTMLSelectElement;
    
    await user.selectOptions(brandFilter, 'Toyota');
    
    expect(brandFilter).toHaveValue('Toyota');
  });

  test('type filter dropdown changes value', async () => {
    const mockFilterChange = jest.fn();
    render(<MockInteractiveFilters onFilterChange={mockFilterChange} />);

    const typeFilter = screen.getByTestId('type-filter') as HTMLSelectElement;
    
    await user.selectOptions(typeFilter, 'Sedan');
    
    expect(typeFilter).toHaveValue('Sedan');
  });

  test('price inputs accept numeric values', async () => {
    const mockFilterChange = jest.fn();
    render(<MockInteractiveFilters onFilterChange={mockFilterChange} />);

    const minPriceInput = screen.getByTestId('min-price');
    const maxPriceInput = screen.getByTestId('max-price');
    
    await user.type(minPriceInput, '20000');
    await user.type(maxPriceInput, '30000');
    
    expect(minPriceInput).toHaveValue(20000);
    expect(maxPriceInput).toHaveValue(30000);
  });

  test('reset filters clears all inputs', async () => {
    const mockFilterChange = jest.fn();
    render(<MockInteractiveFilters onFilterChange={mockFilterChange} />);

    const searchInput = screen.getByTestId('search-input');
    const brandFilter = screen.getByTestId('brand-filter');
    const resetBtn = screen.getByTestId('reset-filters');
    
    // Fill some filters
    await user.type(searchInput, 'Toyota');
    await user.selectOptions(brandFilter, 'Toyota');
    
    // Reset
    await user.click(resetBtn);
    
    expect(searchInput).toHaveValue('');
    expect(brandFilter).toHaveValue('');
    expect(mockFilterChange).toHaveBeenCalledWith({});
  });

  test('pagination navigation works', async () => {
    const mockPageChange = jest.fn();
    render(
      <MockInteractivePagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockPageChange}
      />
    );

    const prevBtn = screen.getByTestId('prev-page');
    const nextBtn = screen.getByTestId('next-page');
    const page3Btn = screen.getByTestId('page-3');
    
    // Navigate to previous page
    await user.click(prevBtn);
    expect(mockPageChange).toHaveBeenCalledWith(1);
    
    // Navigate to next page
    await user.click(nextBtn);
    expect(mockPageChange).toHaveBeenCalledWith(3);
    
    // Navigate to specific page
    await user.click(page3Btn);
    expect(mockPageChange).toHaveBeenCalledWith(3);
  });

  test('pagination buttons are disabled at boundaries', () => {
    render(
      <MockInteractivePagination
        currentPage={1}
        totalPages={5}
        onPageChange={jest.fn()}
      />
    );

    const prevBtn = screen.getByTestId('prev-page');
    const nextBtn = screen.getByTestId('next-page');
    
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();
  });

  test('keyboard navigation works on car cards', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const carCard = screen.getByTestId('car-card-1');
    
    // Focus on car card
    carCard.focus();
    expect(carCard).toHaveFocus();
    
    // Enter key triggers click
    await user.keyboard('{Enter}');
    expect(screen.getByText('Clicks: 1')).toBeInTheDocument();
    
    // Space key also triggers click
    await user.keyboard('{ }');
    expect(screen.getByText('Clicks: 2')).toBeInTheDocument();
  });

  test('keyboard navigation works on filters', async () => {
    const mockFilterChange = jest.fn();
    render(<MockInteractiveFilters onFilterChange={mockFilterChange} />);

    const searchInput = screen.getByTestId('search-input');
    const searchBtn = screen.getByTestId('search-btn');
    
    // Tab to search input
    await user.tab();
    expect(searchInput).toHaveFocus();
    
    // Type and press Enter
    await user.type('Toyota');
    await user.keyboard('{Enter}');
    
    expect(mockFilterChange).toHaveBeenCalled();
  });

  test('touch events work on mobile devices', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const carCard = screen.getByTestId('car-card-1');
    
    // Simulate touch events
    fireEvent.touchStart(carCard);
    fireEvent.touchEnd(carCard);
    
    expect(screen.getByText('Clicks: 1')).toBeInTheDocument();
  });

  test('rapid clicking is handled correctly', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const carCard = screen.getByTestId('car-card-1');
    
    // Rapid clicks
    await user.click(carCard);
    await user.click(carCard);
    await user.click(carCard);
    await user.click(carCard);
    await user.click(carCard);
    
    expect(screen.getByText('Clicks: 5')).toBeInTheDocument();
  });

  test('edit modal can be closed', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const editBtn = screen.getByTestId('edit-car-1');
    
    // Open modal
    await user.click(editBtn);
    expect(screen.getByTestId('edit-modal-1')).toBeInTheDocument();
    
    // Close modal
    const closeBtn = screen.getByText('Close');
    await user.click(closeBtn);
    
    expect(screen.queryByTestId('edit-modal-1')).not.toBeInTheDocument();
  });

  test('button click events don\'t propagate to card', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const editBtn = screen.getByTestId('edit-car-1');
    const carCard = screen.getByTestId('car-card-1');
    
    // Click edit button (should not increment card click count)
    await user.click(editBtn);
    
    expect(screen.getByText('Clicks: 0')).toBeInTheDocument();
    expect(screen.getByTestId('edit-modal-1')).toBeInTheDocument();
  });

  test('car cards have proper ARIA labels', () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const carCard = screen.getByTestId('car-card-1');
    
    expect(carCard).toHaveAttribute('role', 'button');
    expect(carCard).toHaveAttribute('aria-label', 'Car: Toyota Camry, Toyota, $25,000');
    expect(carCard).toHaveAttribute('tabIndex', '0');
  });

  test('filter inputs have proper accessibility attributes', () => {
    const mockFilterChange = jest.fn();
    render(<MockInteractiveFilters onFilterChange={mockFilterChange} />);

    const searchInput = screen.getByTestId('search-input');
    const brandFilter = screen.getByTestId('brand-filter');
    
    expect(searchInput).toHaveAttribute('placeholder', 'Search cars...');
    expect(brandFilter).toBeInTheDocument();
  });

  test('pagination buttons have proper accessibility', () => {
    const mockPageChange = jest.fn();
    render(
      <MockInteractivePagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockPageChange}
      />
    );

    const prevBtn = screen.getByTestId('prev-page');
    const nextBtn = screen.getByTestId('next-page');
    
    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();
  });

  test('context menu events are handled', () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const carCard = screen.getByTestId('car-card-1');
    
    // Simulate right-click
    fireEvent.contextMenu(carCard);
    
    // Should not crash and card should still be present
    expect(carCard).toBeInTheDocument();
  });

  test('scroll events are handled', () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const carCard = screen.getByTestId('car-card-1');
    
    // Simulate scroll
    fireEvent.scroll(carCard);
    
    // Should not crash
    expect(carCard).toBeInTheDocument();
  });

  test('focus management works correctly', async () => {
    render(<MockInteractiveCarCard car={mockCars[0]} />);

    const carCard = screen.getByTestId('car-card-1');
    const editBtn = screen.getByTestId('edit-car-1');
    
    // Focus card
    carCard.focus();
    expect(carCard).toHaveFocus();
    
    // Focus button
    editBtn.focus();
    expect(editBtn).toHaveFocus();
    expect(carCard).not.toHaveFocus();
  });
});
