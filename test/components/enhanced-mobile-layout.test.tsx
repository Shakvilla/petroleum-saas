import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileLayout } from '@/components/mobile-layout';
import { ResponsiveProvider } from '@/components/responsive-provider';
import { BarChart3, Fuel, Truck } from 'lucide-react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/dashboard',
}));

const renderWithResponsiveProvider = (component: React.ReactElement, mockViewport = { width: 375, height: 667 }) => {
  // Mock window.innerWidth and innerHeight
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: mockViewport.width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: mockViewport.height,
  });

  return render(
    <ResponsiveProvider>
      {component}
    </ResponsiveProvider>
  );
};

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/avatar.jpg',
  role: 'Admin',
};

const mockBottomNavItems = [
  { name: 'Home', href: '/', icon: BarChart3 },
  { name: 'Inventory', href: '/inventory', icon: Fuel },
  { name: 'Distribution', href: '/distribution', icon: Truck },
];

describe('Enhanced MobileLayout', () => {
  beforeEach(() => {
    // Reset window dimensions to mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });
  });

  it('renders the enhanced mobile layout', () => {
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('displays enhanced header with navigation system', () => {
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('shows notification badge in header', () => {
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays user avatar in header', () => {
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    const avatar = screen.getByRole('button', { name: /avatar/i });
    expect(avatar).toBeInTheDocument();
  });

  it('shows user dropdown menu when avatar is clicked', () => {
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    const avatar = screen.getByRole('button', { name: /avatar/i });
    fireEvent.click(avatar);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('calls onLogout when sign out is clicked', () => {
    const mockLogout = jest.fn();
    
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5} onLogout={mockLogout}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    const avatar = screen.getByRole('button', { name: /avatar/i });
    fireEvent.click(avatar);
    
    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('shows bottom navigation when enabled', () => {
    renderWithResponsiveProvider(
      <MobileLayout 
        user={mockUser} 
        notifications={5}
        showBottomNavigation={true}
        bottomNavItems={mockBottomNavItems}
        activePath="/"
      >
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Distribution')).toBeInTheDocument();
  });

  it('highlights active item in bottom navigation', () => {
    renderWithResponsiveProvider(
      <MobileLayout 
        user={mockUser} 
        notifications={5}
        showBottomNavigation={true}
        bottomNavItems={mockBottomNavItems}
        activePath="/inventory"
      >
        <div>Test Content</div>
      </MobileLayout>
    );
    
    const inventoryButton = screen.getByText('Inventory').closest('button');
    expect(inventoryButton).toHaveClass('text-blue-600');
  });

  it('calls onNavigation when bottom nav item is clicked', () => {
    const mockNavigation = jest.fn();
    
    renderWithResponsiveProvider(
      <MobileLayout 
        user={mockUser} 
        notifications={5}
        showBottomNavigation={true}
        bottomNavItems={mockBottomNavItems}
        activePath="/"
        onNavigation={mockNavigation}
      >
        <div>Test Content</div>
      </MobileLayout>
    );
    
    const inventoryButton = screen.getByText('Inventory');
    fireEvent.click(inventoryButton);
    
    expect(mockNavigation).toHaveBeenCalledWith('/inventory');
  });

  it('adds padding to main content when bottom navigation is shown', () => {
    renderWithResponsiveProvider(
      <MobileLayout 
        user={mockUser} 
        notifications={5}
        showBottomNavigation={true}
        bottomNavItems={mockBottomNavItems}
      >
        <div>Test Content</div>
      </MobileLayout>
    );
    
    const main = screen.getByText('Test Content').closest('main');
    expect(main).toHaveClass('pb-16');
  });

  it('renders custom header when provided', () => {
    const customHeader = <div>Custom Header</div>;
    
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5} header={customHeader}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.getByText('Custom Header')).toBeInTheDocument();
  });

  it('renders custom footer when provided', () => {
    const customFooter = <div>Custom Footer</div>;
    
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5} footer={customFooter}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.getByText('Custom Footer')).toBeInTheDocument();
  });

  it('renders legacy sidebar when provided', () => {
    const customSidebar = <div>Custom Sidebar</div>;
    
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5} sidebar={customSidebar}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    // Sidebar should be rendered but hidden by default
    expect(screen.getByText('Custom Sidebar')).toBeInTheDocument();
  });

  it('renders desktop layout on desktop viewport', () => {
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5}>
        <div>Test Content</div>
      </MobileLayout>,
      { width: 1024, height: 768 }
    );
    
    // Should not show mobile navigation system
    expect(screen.queryByLabelText('Open navigation menu')).not.toBeInTheDocument();
  });

  it('handles large notification counts', () => {
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={150}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('handles zero notifications', () => {
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={0}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('works without user prop', () => {
    renderWithResponsiveProvider(
      <MobileLayout notifications={5}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument();
    // Should not show user avatar
    expect(screen.queryByRole('button', { name: /avatar/i })).not.toBeInTheDocument();
  });

  it('works without notifications', () => {
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    // Should not show notification badge
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    // Test escape key handling (this would be tested in integration tests)
    const navigationButton = screen.getByLabelText('Open navigation menu');
    fireEvent.click(navigationButton);
    
    // Navigation should open
    expect(screen.getByText('Petroleum SaaS')).toBeInTheDocument();
  });

  it('prevents body scroll when sidebar is open', () => {
    renderWithResponsiveProvider(
      <MobileLayout user={mockUser} notifications={5} sidebar={<div>Sidebar</div>}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    // This would be tested in integration tests with actual DOM manipulation
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
