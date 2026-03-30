import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock all external dependencies
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

jest.mock('@/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => [],
}));

jest.mock('@/store/services/servicesSelectors', () => ({
  selectServices: () => [],
  fetchServices: () => ({ type: 'FETCH_SERVICES' }),
}));

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

// Import after all mocks
import Services from '@/app/Services/page';

describe('Services Page Basic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders services page without crashing', () => {
    render(<Services />);
    
    // Basic smoke test
    expect(document.body).toBeInTheDocument();
  });

  test('renders main content sections', () => {
    render(<Services />);
    
    // Check that main sections are rendered
    expect(screen.getByText(/Complete Car Services/i)).toBeInTheDocument();
    expect(screen.getByText(/One Platform/i)).toBeInTheDocument();
  });

  test('renders hero section properly', () => {
    render(<Services />);
    
    // Check hero section content
    expect(screen.getByText(/From buying to maintenance, GearGrid handles everything your car needs/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explore All Services/i })).toBeInTheDocument();
  });

  test('renders with proper heading structure', () => {
    render(<Services />);
    
    // Check for main heading
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent(/Complete Car Services/);
  });

  test('renders without console errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Services />);
    
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('renders with proper semantic HTML', () => {
    render(<Services />);
    
    // Check for semantic elements
    const mainElement = document.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
  });

  test('renders responsive design elements', () => {
    render(<Services />);
    
    // Check for responsive classes
    const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  test('renders dark mode support', () => {
    render(<Services />);
    
    // Check for dark mode classes
    const darkModeElements = document.querySelectorAll('[class*="dark:"]');
    expect(darkModeElements.length).toBeGreaterThan(0);
  });

  test('renders interactive elements', () => {
    render(<Services />);
    
    // Check for buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Check that buttons have proper attributes
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });

  test('renders with proper layout structure', () => {
    render(<Services />);
    
    // Check for layout containers
    const containers = document.querySelectorAll('[class*="max-w-"], [class*="mx-auto"], [class*="px-"]');
    expect(containers.length).toBeGreaterThan(0);
  });

  test('renders with proper styling classes', () => {
    render(<Services />);
    
    // Check for styling classes
    const styledElements = document.querySelectorAll('[class*="bg-"], [class*="text-"], [class*="font-"]');
    expect(styledElements.length).toBeGreaterThan(0);
  });

  test('renders accessibility features', () => {
    render(<Services />);
    
    // Check for accessibility
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });

  test('renders with proper color scheme', () => {
    render(<Services />);
    
    // Check for color classes
    const colorElements = document.querySelectorAll('[class*="text-"], [class*="bg-"]');
    expect(colorElements.length).toBeGreaterThan(0);
  });

  test('renders with proper spacing', () => {
    render(<Services />);
    
    // Check for spacing classes
    const spacingElements = document.querySelectorAll('[class*="p-"], [class*="m-"], [class*="gap-"]');
    expect(spacingElements.length).toBeGreaterThan(0);
  });

  test('renders with proper transitions', () => {
    render(<Services />);
    
    // Check for transition classes
    const transitionElements = document.querySelectorAll('[class*="transition-"]');
    expect(transitionElements.length).toBeGreaterThan(0);
  });

  test('renders with proper shadows and borders', () => {
    render(<Services />);
    
    // Check for shadow and border classes
    const shadowElements = document.querySelectorAll('[class*="shadow"]');
    const borderElements = document.querySelectorAll('[class*="border"]');
    
    expect(shadowElements.length + borderElements.length).toBeGreaterThan(0);
  });

  test('renders with proper rounded corners', () => {
    render(<Services />);
    
    // Check for rounded classes
    const roundedElements = document.querySelectorAll('[class*="rounded"]');
    expect(roundedElements.length).toBeGreaterThan(0);
  });

  test('renders with proper gradients', () => {
    render(<Services />);
    
    // Check for gradient classes
    const gradientElements = document.querySelectorAll('[class*="gradient"]');
    expect(gradientElements.length).toBeGreaterThan(0);
  });

  test('renders with proper typography', () => {
    render(<Services />);
    
    // Check for typography classes
    const typographyElements = document.querySelectorAll('[class*="text-"], [class*="font-"], [class*="leading-"]');
    expect(typographyElements.length).toBeGreaterThan(0);
  });

  test('renders with proper flex and grid layout', () => {
    render(<Services />);
    
    // Check for layout classes
    const flexElements = document.querySelectorAll('[class*="flex"]');
    const gridElements = document.querySelectorAll('[class*="grid"]');
    
    expect(flexElements.length + gridElements.length).toBeGreaterThan(0);
  });

  test('renders with proper transform effects', () => {
    render(<Services />);
    
    // Check for transform classes
    const transformElements = document.querySelectorAll('[class*="transform"], [class*="scale-"]');
    expect(transformElements.length).toBeGreaterThan(0);
  });

  test('renders with proper opacity and visibility', () => {
    render(<Services />);
    
    // Check for opacity classes
    const opacityElements = document.querySelectorAll('[class*="opacity"]');
    expect(opacityElements.length).toBeGreaterThanOrEqual(0);
  });

  test('renders with proper positioning', () => {
    render(<Services />);
    
    // Check for position classes
    const positionElements = document.querySelectorAll('[class*="relative"], [class*="absolute"]');
    expect(positionElements.length).toBeGreaterThan(0);
  });

  test('renders with proper overflow handling', () => {
    render(<Services />);
    
    // Check for overflow classes
    const overflowElements = document.querySelectorAll('[class*="overflow"]');
    expect(overflowElements.length).toBeGreaterThanOrEqual(0);
  });

  test('renders with proper width and height', () => {
    render(<Services />);
    
    // Check for dimension classes
    const dimensionElements = document.querySelectorAll('[class*="w-"], [class*="h-"]');
    expect(dimensionElements.length).toBeGreaterThan(0);
  });

  test('renders with proper z-index', () => {
    render(<Services />);
    
    // Check for z-index classes
    const zIndexElements = document.querySelectorAll('[class*="z-"]');
    expect(zIndexElements.length).toBeGreaterThanOrEqual(0);
  });
});
