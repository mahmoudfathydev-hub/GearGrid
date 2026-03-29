import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

import Navbar from '../components/global/Heading/navbar';
import { 
  Logo, 
  NavigationLinks, 
  ThemeToggle, 
  MobileMenuButton, 
  MobileMenu,
  SearchInput,
  CartIcon,
  HeartIcon,
  SignInButton
} from '../components/global/Heading/components';

describe('Heading Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Navbar', () => {
    test('renders without crashing', () => {
      customRender(<Navbar />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('renders logo with correct alt text', () => {
      customRender(<Navbar />);
      expect(screen.getByAltText('GearGrid')).toBeInTheDocument();
    });

    test('renders search input on desktop', () => {
      customRender(<Navbar />);
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    });

    test('renders navigation links', () => {
      customRender(<Navbar />);
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument();
    });

    test('does not render removed links', () => {
      customRender(<Navbar />);
      expect(screen.queryByRole('link', { name: 'About' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument();
    });

    test('renders theme toggle button', () => {
      customRender(<Navbar />);
      expect(screen.getByLabelText('Toggle dark mode')).toBeInTheDocument();
    });

    test('renders cart icon with badge', () => {
      customRender(<Navbar />);
      const cartIcon = screen.getByLabelText('Shopping cart');
      expect(cartIcon).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('renders heart icon with badge', () => {
      customRender(<Navbar />);
      const heartIcon = screen.getByLabelText('Wishlist');
      expect(heartIcon).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('renders sign in button', () => {
      customRender(<Navbar />);
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    test('renders mobile menu button', () => {
      customRender(<Navbar />);
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });

    test('mobile menu is closed by default', () => {
      customRender(<Navbar />);
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });

    test('handles theme toggle click', async () => {
      customRender(<Navbar />);
      const themeToggle = screen.getByLabelText('Toggle dark mode');
      await userEvent.click(themeToggle);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('handles cart icon click', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      customRender(<Navbar />);
      const cartIcon = screen.getByLabelText('Shopping cart');
      await userEvent.click(cartIcon);
      expect(consoleSpy).toHaveBeenCalledWith('Cart clicked');
      consoleSpy.mockRestore();
    });

    test('handles heart icon click', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      customRender(<Navbar />);
      const heartIcon = screen.getByLabelText('Wishlist');
      await userEvent.click(heartIcon);
      expect(consoleSpy).toHaveBeenCalledWith('Wishlist clicked');
      consoleSpy.mockRestore();
    });

    test('handles sign in button click', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      customRender(<Navbar />);
      const signInButton = screen.getByRole('button', { name: 'Sign In' });
      await userEvent.click(signInButton);
      expect(consoleSpy).toHaveBeenCalledWith('Sign in clicked');
      consoleSpy.mockRestore();
    });

    test('handles search input', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      customRender(<Navbar />);
      const searchInput = screen.getByPlaceholderText('Search products...');
      await userEvent.type(searchInput, 'test query');
      await userEvent.keyboard('{Enter}');
      expect(consoleSpy).toHaveBeenCalledWith('Searching for: test query');
      consoleSpy.mockRestore();
    });
  });

  describe('Logo', () => {
    test('renders without crashing', () => {
      customRender(<Logo />);
      expect(screen.getByAltText('GearGrid')).toBeInTheDocument();
    });

    test('applies custom className', () => {
      customRender(<Logo className="custom-test-class" />);
      const logoContainer = screen.getByAltText('GearGrid').parentElement;
      expect(logoContainer).toHaveClass('custom-test-class');
    });

    test('has correct accessibility attributes', () => {
      customRender(<Logo />);
      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('alt', 'GearGrid');
      expect(logo).toHaveAttribute('src', '/images/logo.png');
    });

    test('has correct dimensions', () => {
      customRender(<Logo />);
      const logo = screen.getByAltText('GearGrid');
      expect(logo).toHaveAttribute('width', '100');
      expect(logo).toHaveAttribute('height', '100');
    });
  });

  describe('NavigationLinks', () => {
    const mockLinks = [
      { id: 1, name: 'Home', href: '/' },
      { id: 2, name: 'About', href: '/about' },
      { id: 3, name: 'Services', href: '/services' }
    ];

    test('renders without crashing', () => {
      customRender(<NavigationLinks links={mockLinks} />);
    });

    test('renders all links correctly', () => {
      customRender(<NavigationLinks links={mockLinks} />);
      mockLinks.forEach(link => {
        expect(screen.getByRole('link', { name: link.name })).toBeInTheDocument();
      });
    });

    test('applies active state to first link', () => {
      customRender(<NavigationLinks links={mockLinks} />);
      const activeLink = screen.getByRole('link', { name: 'Home' });
      expect(activeLink).toHaveClass('text-gray-900');
    });

    test('renders mobile layout when isMobile is true', () => {
      customRender(<NavigationLinks links={mockLinks} isMobile={true} />);
      const container = screen.getByRole('navigation');
      expect(container).toHaveClass('space-y-1', 'sm:px-3');
    });

    test('renders desktop layout by default', () => {
      customRender(<NavigationLinks links={mockLinks} />);
      const container = screen.getByRole('navigation');
      expect(container).toHaveClass('flex', 'items-baseline', 'space-x-4');
    });

    test('handles empty links array', () => {
      customRender(<NavigationLinks links={[]} />);
      const links = screen.queryAllByRole('link');
      expect(links).toHaveLength(0);
    });

    test('applies hover states correctly', () => {
      customRender(<NavigationLinks links={mockLinks} />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveClass('hover:bg-gray-100', 'dark:hover:bg-gray-800');
      });
    });
  });

  describe('ThemeToggle', () => {
    test('renders without crashing', () => {
      customRender(<ThemeToggle theme="light" onToggle={jest.fn()} mounted={true} />);
    });

    test('shows sun icon in dark mode', () => {
      customRender(<ThemeToggle theme="dark" onToggle={jest.fn()} mounted={true} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('shows moon icon in light mode', () => {
      customRender(<ThemeToggle theme="light" onToggle={jest.fn()} mounted={true} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('shows placeholder when not mounted', () => {
      customRender(<ThemeToggle theme="light" onToggle={jest.fn()} mounted={false} />);
      const button = screen.getByRole('button');
      const placeholder = button.querySelector('div');
      expect(placeholder).toHaveClass('w-5', 'h-5');
    });

    test('calls onToggle when clicked', async () => {
      const mockToggle = jest.fn();
      customRender(<ThemeToggle theme="light" onToggle={mockToggle} mounted={true} />);
      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    test('has correct accessibility attributes', () => {
      customRender(<ThemeToggle theme="light" onToggle={jest.fn()} mounted={true} />);
      const button = screen.getByLabelText('Toggle dark mode');
      expect(button).toBeInTheDocument();
    });

    test('applies correct styling classes', () => {
      customRender(<ThemeToggle theme="light" onToggle={jest.fn()} mounted={true} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'p-2',
        'rounded-lg',
        'bg-gray-100',
        'text-gray-600',
        'transition-colors'
      );
    });
  });

  describe('MobileMenuButton', () => {
    test('renders without crashing', () => {
      customRender(<MobileMenuButton onClick={jest.fn()} />);
    });

    test('calls onClick when clicked', async () => {
      const mockClick = jest.fn();
      customRender(<MobileMenuButton onClick={mockClick} />);
      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    test('has correct accessibility attributes when closed', () => {
      customRender(<MobileMenuButton isOpen={false} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-controls', 'mobile-menu');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    test('sets aria-expanded when open', () => {
      customRender(<MobileMenuButton isOpen={true} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    test('applies correct styling classes', () => {
      customRender(<MobileMenuButton />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'p-2',
        'rounded-md',
        'text-gray-600',
        'hover:bg-gray-100'
      );
    });

    test('has menu icon', () => {
      customRender(<MobileMenuButton />);
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('MobileMenu', () => {
    const mockLinks = [
      { id: 1, name: 'Home', href: '/' },
      { id: 2, name: 'Services', href: '/services' }
    ];

    test('renders without crashing when open', () => {
      customRender(<MobileMenu links={mockLinks} isOpen={true} />);
    });

    test('does not render when closed', () => {
      customRender(<MobileMenu links={mockLinks} isOpen={false} />);
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });

    test('renders navigation links when open', () => {
      customRender(<MobileMenu links={mockLinks} isOpen={true} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('renders children when provided', () => {
      customRender(
        <MobileMenu links={mockLinks} isOpen={true}>
          <div data-testid="test-children">Test Children Content</div>
        </MobileMenu>
      );
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByText('Test Children Content')).toBeInTheDocument();
    });

    test('has correct mobile styling', () => {
      customRender(<MobileMenu links={mockLinks} isOpen={true} />);
      const menu = screen.getByTestId('mobile-menu');
      expect(menu).toHaveClass('md:hidden');
    });

    test('renders border when children exist', () => {
      customRender(
        <MobileMenu links={mockLinks} isOpen={true}>
          <div>Child content</div>
        </MobileMenu>
      );
      const borderElement = screen.getByText('Child content').parentElement?.parentElement;
      expect(borderElement).toHaveClass('border-t', 'border-gray-200', 'dark:border-gray-700');
    });
  });

  describe('SearchInput', () => {
    test('renders without crashing', () => {
      customRender(<SearchInput onSearch={jest.fn()} />);
    });

    test('renders with default placeholder', () => {
      customRender(<SearchInput onSearch={jest.fn()} />);
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    });

    test('renders with custom placeholder', () => {
      customRender(<SearchInput onSearch={jest.fn()} placeholder="Custom search placeholder" />);
      expect(screen.getByPlaceholderText('Custom search placeholder')).toBeInTheDocument();
    });

    test('applies custom className', () => {
      customRender(<SearchInput onSearch={jest.fn()} className="custom-search-class" />);
      const form = screen.getByRole('form');
      expect(form).toHaveClass('custom-search-class');
    });

    test('updates input value when typing', async () => {
      customRender(<SearchInput onSearch={jest.fn()} />);
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'test search query');
      expect(input).toHaveValue('test search query');
    });

    test('calls onSearch when form is submitted', async () => {
      const mockSearch = jest.fn();
      customRender(<SearchInput onSearch={mockSearch} />);
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'test query');
      await userEvent.keyboard('{Enter}');
      expect(mockSearch).toHaveBeenCalledWith('test query');
    });

    test('has search icon', () => {
      customRender(<SearchInput onSearch={jest.fn()} />);
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('applies correct styling classes', () => {
      customRender(<SearchInput onSearch={jest.fn()} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(
        'w-full',
        'pl-10',
        'pr-4',
        'py-2',
        'border',
        'rounded-lg'
      );
    });

    test('handles focus states', async () => {
      customRender(<SearchInput onSearch={jest.fn()} />);
      const input = screen.getByRole('textbox');
      await userEvent.click(input);
      expect(input).toHaveFocus();
      expect(input).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
    });
  });

  describe('CartIcon', () => {
    test('renders without crashing', () => {
      customRender(<CartIcon onClick={jest.fn()} />);
    });

    test('calls onClick when clicked', async () => {
      const mockClick = jest.fn();
      customRender(<CartIcon onClick={mockClick} />);
      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    test('shows item count badge when count > 0', () => {
      customRender(<CartIcon itemCount={5} onClick={jest.fn()} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('shows 99+ when count > 99', () => {
      customRender(<CartIcon itemCount={150} onClick={jest.fn()} />);
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    test('does not show badge when count is 0', () => {
      customRender(<CartIcon itemCount={0} onClick={jest.fn()} />);
      const badge = screen.queryByText('0');
      expect(badge).not.toBeInTheDocument();
    });

    test('applies custom className', () => {
      customRender(<CartIcon onClick={jest.fn()} className="custom-cart-class" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-cart-class');
    });

    test('has correct accessibility attributes', () => {
      customRender(<CartIcon onClick={jest.fn()} />);
      const button = screen.getByLabelText('Shopping cart');
      expect(button).toBeInTheDocument();
    });

    test('applies correct styling classes', () => {
      customRender(<CartIcon onClick={jest.fn()} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'relative',
        'p-2',
        'rounded-lg',
        'text-gray-600',
        'transition-colors'
      );
    });
  });

  describe('HeartIcon', () => {
    test('renders without crashing', () => {
      customRender(<HeartIcon onClick={jest.fn()} />);
    });

    test('calls onClick when clicked', async () => {
      const mockClick = jest.fn();
      customRender(<HeartIcon onClick={mockClick} />);
      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    test('shows filled heart when liked', () => {
      customRender(<HeartIcon isLiked={true} onClick={jest.fn()} />);
      const heart = document.querySelector('svg');
      expect(heart).toHaveClass('fill-current');
    });

    test('shows empty heart when not liked', () => {
      customRender(<HeartIcon isLiked={false} onClick={jest.fn()} />);
      const heart = document.querySelector('svg');
      expect(heart).not.toHaveClass('fill-current');
    });

    test('shows item count badge when count > 0', () => {
      customRender(<HeartIcon itemCount={3} onClick={jest.fn()} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('applies liked styling when isLiked is true', () => {
      customRender(<HeartIcon isLiked={true} onClick={jest.fn()} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-red-500');
    });

    test('applies unliked styling when isLiked is false', () => {
      customRender(<HeartIcon isLiked={false} onClick={jest.fn()} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-gray-600');
    });

    test('has correct accessibility attributes', () => {
      customRender(<HeartIcon onClick={jest.fn()} />);
      const button = screen.getByLabelText('Wishlist');
      expect(button).toBeInTheDocument();
    });
  });

  describe('SignInButton', () => {
    test('renders without crashing', () => {
      customRender(<SignInButton onClick={jest.fn()} />);
    });

    test('calls onClick when clicked', async () => {
      const mockClick = jest.fn();
      customRender(<SignInButton onClick={mockClick} />);
      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    test('shows Sign In text when not logged in', () => {
      customRender(<SignInButton isLoggedIn={false} onClick={jest.fn()} />);
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    test('shows user name when logged in', () => {
      customRender(<SignInButton isLoggedIn={true} userName="John Doe" onClick={jest.fn()} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    test('shows Account text when logged in without username', () => {
      customRender(<SignInButton isLoggedIn={true} onClick={jest.fn()} />);
      expect(screen.getByText('Account')).toBeInTheDocument();
    });

    test('applies logged in styling when isLoggedIn is true', () => {
      customRender(<SignInButton isLoggedIn={true} onClick={jest.fn()} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-100', 'dark:bg-gray-800');
    });

    test('applies sign in styling when isLoggedIn is false', () => {
      customRender(<SignInButton isLoggedIn={false} onClick={jest.fn()} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600');
    });

    test('has user icon', () => {
      customRender(<SignInButton onClick={jest.fn()} />);
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('applies custom className', () => {
      customRender(<SignInButton onClick={jest.fn()} className="custom-signin-class" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-signin-class');
    });

    test('has correct accessibility attributes', () => {
      customRender(<SignInButton onClick={jest.fn()} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });
});
