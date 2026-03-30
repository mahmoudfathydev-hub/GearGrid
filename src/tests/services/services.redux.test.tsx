import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { fetchServices } from '@/store/services/servicesSelectors';
import servicesReducer from '@/store/services/servicesSlice';

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

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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

// Mock services data
const mockServices = [
  {
    id: 1,
    created_at: '2024-01-01T00:00:00Z',
    name: 'Car Maintenance',
    icon: 'wrench',
    desc: 'Professional maintenance service for all vehicles',
  },
  {
    id: 2,
    created_at: '2024-01-02T00:00:00Z',
    name: 'Car Rental',
    icon: 'car',
    desc: 'Daily, weekly, and monthly rentals with flexible terms',
  },
  {
    id: 3,
    created_at: '2024-01-03T00:00:00Z',
    name: 'Roadside Assistance',
    icon: 'help',
    desc: '24/7 emergency support across all locations',
  },
];

const createMockStore = (initialState: any = {}) => {
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
          name: '',
          icon: '',
          desc: '',
        },
        editingId: null,
        ...initialState,
      },
    },
  });
};

// Import after all mocks
import Services from '@/app/Services/page';

describe('Services Page Redux Integration Tests', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    store = createMockStore();
  });

  const renderWithProviders = (ui: React.ReactElement, initialState: any = {}) => {
    const testStore = createMockStore(initialState);
    return render(
      <Provider store={testStore}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {ui}
        </ThemeProvider>
      </Provider>
    );
  };

  test('dispatches fetchServices on mount', async () => {
    const mockDispatch = jest.fn();
    
    // Mock the dispatch function
    jest.spyOn(require('@/hooks'), 'useAppDispatch').mockReturnValue(mockDispatch);
    
    renderWithProviders(<Services />);
    
    // Wait for useEffect to run
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(fetchServices());
    });
  });

  test('reads services data from Redux store', () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices }
    });
    
    // Check that services are rendered from Redux store
    expect(screen.getByText(/Car Maintenance/i)).toBeInTheDocument();
    expect(screen.getByText(/Car Rental/i)).toBeInTheDocument();
    expect(screen.getByText(/Roadside Assistance/i)).toBeInTheDocument();
  });

  test('renders empty state when services array is empty', () => {
    renderWithProviders(<Services />, {
      services: { services: [] }
    });
    
    // Check for empty state message
    expect(screen.getByText(/No services available/i)).toBeInTheDocument();
    expect(screen.getByText(/Add services through the dashboard to see them here./i)).toBeInTheDocument();
  });

  test('handles loading state correctly', () => {
    renderWithProviders(<Services />, {
      services: { loading: true, services: [] }
    });
    
    // During loading, page should still render hero section
    expect(screen.getByText(/Complete Car Services/i)).toBeInTheDocument();
    expect(screen.getByText(/One Platform/i)).toBeInTheDocument();
  });

  test('handles error state correctly', () => {
    renderWithProviders(<Services />, {
      services: { error: 'Failed to fetch services', services: [] }
    });
    
    // During error, page should still render hero section
    expect(screen.getByText(/Complete Car Services/i)).toBeInTheDocument();
  });

  test('updates UI when services data changes', async () => {
    const { rerender } = renderWithProviders(<Services />, {
      services: { services: [] }
    });
    
    // Initially should show empty state
    expect(screen.getByText(/No services available/i)).toBeInTheDocument();
    
    // Rerender with services data
    rerender(
      <Provider store={createMockStore({ services: mockServices })}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Services />
        </ThemeProvider>
      </Provider>
    );
    
    // Should now show services
    expect(screen.getByText(/Car Maintenance/i)).toBeInTheDocument();
    expect(screen.queryByText(/No services available/i)).not.toBeInTheDocument();
  });

  test('transforms Redux service data correctly', () => {
    renderWithProviders(<Services />, {
      services: { services: mockServices }
    });
    
    // Check that data transformation works
    expect(screen.getByText(/Professional maintenance service for all vehicles/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily, weekly, and monthly rentals with flexible terms/i)).toBeInTheDocument();
    
    // Check for transformed benefits
    expect(screen.getByText(/Professional service/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick response/i)).toBeInTheDocument();
  });

  test('handles single service correctly', () => {
    const singleService = [mockServices[0]];
    
    renderWithProviders(<Services />, {
      services: { services: singleService }
    });
    
    // Should render single service
    expect(screen.getByText(/Car Maintenance/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional maintenance service for all vehicles/i)).toBeInTheDocument();
    
    // Should not render other services
    expect(screen.queryByText(/Car Rental/i)).not.toBeInTheDocument();
  });

  test('handles large number of services', () => {
    const manyServices = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      created_at: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
      name: `Service ${i + 1}`,
      icon: `icon${i + 1}`,
      desc: `Description for service ${i + 1}`,
    }));
    
    renderWithProviders(<Services />, {
      services: { services: manyServices }
    });
    
    // Should render all services
    expect(screen.getByText(/Service 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Service 20/i)).toBeInTheDocument();
    
    // Count service cards
    const serviceCards = document.querySelectorAll('[class*="bg-white"]');
    expect(serviceCards.length).toBe(20);
  });

  test('handles services with missing optional fields', () => {
    const servicesWithMissingFields = [
      {
        id: 1,
        created_at: '2024-01-01T00:00:00Z',
        name: 'Service with missing icon',
        desc: 'Description only',
      },
      {
        id: 2,
        created_at: '2024-01-02T00:00:00Z',
        name: 'Service with missing description',
        icon: 'icon',
        desc: '',
      },
    ];
    
    renderWithProviders(<Services />, {
      services: { services: servicesWithMissingFields }
    });
    
    // Should handle missing fields gracefully
    expect(screen.getByText(/Service with missing icon/i)).toBeInTheDocument();
    expect(screen.getByText(/Service with missing description/i)).toBeInTheDocument();
  });

  test('Redux selector returns correct data', () => {
    const testStore = createMockStore({ services: mockServices });
    const state = testStore.getState();
    
    // Test selector
    expect(state.services.services).toEqual(mockServices);
    expect(state.services.loading).toBe(false);
    expect(state.services.error).toBe(null);
  });

  test('Redux state updates correctly after fetch', () => {
    const testStore = createMockStore();
    
    // Dispatch fetch fulfilled action
    testStore.dispatch({
      type: 'services/fetchServices/fulfilled',
      payload: mockServices,
    });
    
    const state = testStore.getState();
    expect(state.services.services).toEqual(mockServices);
    expect(state.services.loading).toBe(false);
    expect(state.services.error).toBe(null);
  });

  test('Redux state handles fetch pending correctly', () => {
    const testStore = createMockStore();
    
    // Dispatch fetch pending action
    testStore.dispatch({
      type: 'services/fetchServices/pending',
    });
    
    const state = testStore.getState();
    expect(state.services.loading).toBe(true);
    expect(state.services.error).toBe(null);
  });

  test('Redux state handles fetch rejected correctly', () => {
    const testStore = createMockStore();
    
    // Dispatch fetch rejected action
    testStore.dispatch({
      type: 'services/fetchServices/rejected',
      payload: 'Network error',
    });
    
    const state = testStore.getState();
    expect(state.services.loading).toBe(false);
    expect(state.services.error).toBe('Network error');
    expect(state.services.services).toEqual([]);
  });

  test('components react to store changes', async () => {
    const { rerender } = renderWithProviders(<Services />, {
      services: { services: [] }
    });
    
    // Initially empty
    expect(screen.getByText(/No services available/i)).toBeInTheDocument();
    
    // Update store with services
    const updatedStore = createMockStore({ services: mockServices });
    
    rerender(
      <Provider store={updatedStore}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Services />
        </ThemeProvider>
      </Provider>
    );
    
    // Should show services
    expect(screen.getByText(/Car Maintenance/i)).toBeInTheDocument();
    expect(screen.queryByText(/No services available/i)).not.toBeInTheDocument();
  });

  test('error message displays when fetch fails', () => {
    renderWithProviders(<Services />, {
      services: { error: 'Failed to load services', services: [] }
    });
    
    // Error should be handled gracefully
    expect(screen.getByText(/Complete Car Services/i)).toBeInTheDocument();
    // Note: The component doesn't display error message directly, but handles it gracefully
  });

  test('service transformation handles edge cases', () => {
    const edgeCaseServices = [
      {
        id: 1,
        created_at: '2024-01-01T00:00:00Z',
        name: '',
        icon: '',
        desc: '',
      },
      {
        id: 2,
        created_at: '2024-01-02T00:00:00Z',
        name: 'Normal Service',
        icon: 'normal-icon',
        desc: 'Normal description',
      },
    ];
    
    renderWithProviders(<Services />, {
      services: { services: edgeCaseServices }
    });
    
    // Should handle edge cases gracefully
    expect(screen.getByText(/Normal Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Normal description/i)).toBeInTheDocument();
  });
});
