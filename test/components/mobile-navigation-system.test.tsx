import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileNavigationSystem, MobileBottomNavigation } from '@/components/mobile-navigation-system';
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

const mockNavigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3, description: 'Overview and analytics' },
  { name: 'Inventory', href: '/inventory', icon: Fuel, description: 'Fuel stock management' },
  { name: 'Distribution', href: '/distribution', icon: Truck, description: 'Delivery management' },
];

describe('MobileNavigationSystem', () => {
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

  it('renders the mobile navigation trigger', () => {
    renderWithResponsiveProvider(
      <MobileNavigationSystem user={mockUser} notifications={5} />
    );
    
    expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument();
  });

  it('opens navigation sheet when trigger is clicked', () => {
    renderWithResponsiveProvider(
      <MobileNavigationSystem user={mockUser} notifications={5} />
    );
    
    const trigger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(trigger);
    
    expect(screen.getByText('Petroleum SaaS')).toBeInTheDocument();
    expect(screen.getByText('Management System')).toBeInTheDocument();
  });

  it('displays user information in navigation', () => {
    renderWithResponsiveProvider(
      <MobileNavigationSystem user={mockUser} notifications={5} />
    );
    
    const trigger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(trigger);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows notification badge', () => {
    renderWithResponsiveProvider(
      <MobileNavigationSystem user={mockUser} notifications={5} />
    );
    
    const trigger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(trigger);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays navigation items', () => {
    renderWithResponsiveProvider(
      <MobileNavigationSystem 
        user={mockUser} 
        notifications={5}
        navigationItems={mockNavigationItems}
      />
    );
    
    const trigger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(trigger);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Distribution')).toBeInTheDocument();
  });

  it('shows item descriptions', () => {
    renderWithResponsiveProvider(
      <MobileNavigationSystem 
        user={mockUser} 
        notifications={5}
        navigationItems={mockNavigationItems}
      />
    );
    
    const trigger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(trigger);
    
    expect(screen.getByText('Overview and analytics')).toBeInTheDocument();
    expect(screen.getByText('Fuel stock management')).toBeInTheDocument();
    expect(screen.getByText('Delivery management')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    renderWithResponsiveProvider(
      <MobileNavigationSystem 
        user={mockUser} 
        notifications={5}
        navigationItems={mockNavigationItems}
      />
    );
    
    const trigger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(trigger);
    
    // Dashboard should be active since pathname is '/dashboard'
    const dashboardItem = screen.getByText('Dashboard').closest('button');
    expect(dashboardItem).toHaveClass('bg-blue-50');
  });

  it('shows quick actions section', () => {
    renderWithResponsiveProvider(
      <MobileNavigationSystem user={mockUser} notifications={5} />
    );
    
    const trigger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(trigger);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Add Stock')).toBeInTheDocument();
    expect(screen.getByText('New Delivery')).toBeInTheDocument();
  });

  it('shows user dropdown menu', () => {
    renderWithResponsiveProvider(
      <MobileNavigationSystem user={mockUser} notifications={5} />
    );
    
    const trigger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(trigger);
    
    const dropdownTrigger = screen.getByRole('button', { name: /chevron/i });
    fireEvent.click(dropdownTrigger);
    
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('calls onLogout when sign out is clicked', () => {
    const mockLogout = jest.fn();
    
    renderWithResponsiveProvider(
      <MobileNavigationSystem 
        user={mockUser} 
        notifications={5}
        onLogout={mockLogout}
      />
    );
    
    const trigger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(trigger);
    
    const dropdownTrigger = screen.getByRole('button', { name: /chevron/i });
    fireEvent.click(dropdownTrigger);
    
    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('does not render on desktop', () => {
    renderWithResponsiveProvider(
      <MobileNavigationSystem user={mockUser} notifications={5} />,
      { width: 1024, height: 768 }
    );
    
    expect(screen.queryByLabelText('Open navigation menu')).not.toBeInTheDocument();
  });

  it('closes navigation when close button is clicked', () => {
    renderWithResponsiveProvider(
      <MobileNavigationSystem user={mockUser} notifications={5} />
    );
    
    const trigger = screen.getByLabelText('Open navigation menu');
    fireEvent.click(trigger);
    
    expect(screen.getByText('Petroleum SaaS')).toBeInTheDocument();
    
    const closeButton = screen.getByLabelText('Close navigation');
    fireEvent.click(closeButton);
    
    expect(screen.queryByText('Petroleum SaaS')).not.toBeInTheDocument();
  });
});

describe('MobileBottomNavigation', () => {
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

  const mockBottomNavItems = [
    { name: 'Home', href: '/', icon: BarChart3 },
    { name: 'Inventory', href: '/inventory', icon: Fuel },
    { name: 'Distribution', href: '/distribution', icon: Truck },
  ];

  it('renders bottom navigation items', () => {
    renderWithResponsiveProvider(
      <MobileBottomNavigation items={mockBottomNavItems} activePath="/" />
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Distribution')).toBeInTheDocument();
  });

  it('highlights active item', () => {
    renderWithResponsiveProvider(
      <MobileBottomNavigation items={mockBottomNavItems} activePath="/inventory" />
    );
    
    const inventoryButton = screen.getByText('Inventory').closest('button');
    expect(inventoryButton).toHaveClass('text-blue-600');
  });

  it('shows notification badges', () => {
    const itemsWithBadges = [
      { name: 'Home', href: '/', icon: BarChart3, badge: 3 },
      { name: 'Inventory', href: '/inventory', icon: Fuel, badge: 0 },
      { name: 'Distribution', href: '/distribution', icon: Truck, badge: 12 },
    ];

    renderWithResponsiveProvider(
      <MobileBottomNavigation items={itemsWithBadges} activePath="/" />
    );
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('calls onNavigation when item is clicked', () => {
    const mockNavigation = jest.fn();
    
    renderWithResponsiveProvider(
      <MobileBottomNavigation 
        items={mockBottomNavItems} 
        activePath="/"
        onNavigation={mockNavigation}
      />
    );
    
    const inventoryButton = screen.getByText('Inventory');
    fireEvent.click(inventoryButton);
    
    expect(mockNavigation).toHaveBeenCalledWith('/inventory');
  });

  it('does not render on desktop', () => {
    renderWithResponsiveProvider(
      <MobileBottomNavigation items={mockBottomNavItems} activePath="/" />,
      { width: 1024, height: 768 }
    );
    
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('handles large badge numbers', () => {
    const itemsWithLargeBadge = [
      { name: 'Home', href: '/', icon: BarChart3, badge: 150 },
    ];

    renderWithResponsiveProvider(
      <MobileBottomNavigation items={itemsWithLargeBadge} activePath="/" />
    );
    
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderWithResponsiveProvider(
      <MobileBottomNavigation items={mockBottomNavItems} activePath="/" />
    );
    
    const homeButton = screen.getByLabelText('Home');
    expect(homeButton).toBeInTheDocument();
    
    const inventoryButton = screen.getByLabelText('Inventory');
    expect(inventoryButton).toBeInTheDocument();
    
    const distributionButton = screen.getByLabelText('Distribution');
    expect(distributionButton).toBeInTheDocument();
  });
});
