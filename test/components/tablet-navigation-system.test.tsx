import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabletNavigationSystem, TabletLayout } from '@/components/tablet-navigation-system';
import { ResponsiveProvider } from '@/components/responsive-provider';
import { BarChart3, Fuel, Truck } from 'lucide-react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/dashboard',
}));

const renderWithResponsiveProvider = (component: React.ReactElement, mockViewport = { width: 768, height: 1024 }) => {
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
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: BarChart3, 
    description: 'Overview and analytics',
    category: 'Main'
  },
  { 
    name: 'Inventory', 
    href: '/inventory', 
    icon: Fuel, 
    description: 'Fuel stock management',
    category: 'Operations'
  },
  { 
    name: 'Distribution', 
    href: '/distribution', 
    icon: Truck, 
    description: 'Delivery management',
    category: 'Operations'
  },
];

describe('TabletNavigationSystem', () => {
  beforeEach(() => {
    // Reset window dimensions to tablet
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('renders the tablet navigation system', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem user={mockUser} notifications={5} />
    );
    
    expect(screen.getByText('Petroleum SaaS')).toBeInTheDocument();
    expect(screen.getByText('Management System')).toBeInTheDocument();
  });

  it('displays user information', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem user={mockUser} notifications={5} />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows notification badge', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem user={mockUser} notifications={5} />
    );
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays navigation items grouped by category', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem 
        user={mockUser} 
        notifications={5}
        navigationItems={mockNavigationItems}
      />
    );
    
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Distribution')).toBeInTheDocument();
  });

  it('shows item descriptions', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem 
        user={mockUser} 
        notifications={5}
        navigationItems={mockNavigationItems}
      />
    );
    
    expect(screen.getByText('Overview and analytics')).toBeInTheDocument();
    expect(screen.getByText('Fuel stock management')).toBeInTheDocument();
    expect(screen.getByText('Delivery management')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem 
        user={mockUser} 
        notifications={5}
        navigationItems={mockNavigationItems}
      />
    );
    
    // Dashboard should be active since pathname is '/dashboard'
    const dashboardItem = screen.getByText('Dashboard').closest('button');
    expect(dashboardItem).toHaveClass('bg-blue-50');
  });

  it('shows search input when enabled', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem 
        user={mockUser} 
        notifications={5}
        showSearch={true}
      />
    );
    
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('hides search input when disabled', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem 
        user={mockUser} 
        notifications={5}
        showSearch={false}
      />
    );
    
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });

  it('calls onSearch when search query changes', () => {
    const mockSearch = jest.fn();
    
    renderWithResponsiveProvider(
      <TabletNavigationSystem 
        user={mockUser} 
        notifications={5}
        showSearch={true}
        onSearch={mockSearch}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    expect(mockSearch).toHaveBeenCalledWith('test query');
  });

  it('collapses and expands navigation', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem user={mockUser} notifications={5} />
    );
    
    const collapseButton = screen.getByLabelText('Collapse navigation');
    fireEvent.click(collapseButton);
    
    // Should show expand button
    expect(screen.getByLabelText('Expand navigation')).toBeInTheDocument();
    
    // Should hide text content
    expect(screen.queryByText('Petroleum SaaS')).not.toBeInTheDocument();
  });

  it('shows user dropdown menu', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem user={mockUser} notifications={5} />
    );
    
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
      <TabletNavigationSystem 
        user={mockUser} 
        notifications={5}
        onLogout={mockLogout}
      />
    );
    
    const dropdownTrigger = screen.getByRole('button', { name: /chevron/i });
    fireEvent.click(dropdownTrigger);
    
    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('does not render on mobile', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem user={mockUser} notifications={5} />,
      { width: 375, height: 667 }
    );
    
    expect(screen.queryByText('Petroleum SaaS')).not.toBeInTheDocument();
  });

  it('does not render on desktop', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem user={mockUser} notifications={5} />,
      { width: 1024, height: 768 }
    );
    
    expect(screen.queryByText('Petroleum SaaS')).not.toBeInTheDocument();
  });

  it('shows collapsed user avatar when navigation is collapsed', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem user={mockUser} notifications={5} />
    );
    
    const collapseButton = screen.getByLabelText('Collapse navigation');
    fireEvent.click(collapseButton);
    
    // Should still show user avatar in collapsed state
    const avatar = screen.getByRole('button', { name: /avatar/i });
    expect(avatar).toBeInTheDocument();
  });

  it('handles large notification counts', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem user={mockUser} notifications={150} />
    );
    
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('works without user prop', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem notifications={5} />
    );
    
    expect(screen.getByText('Petroleum SaaS')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('works without notifications', () => {
    renderWithResponsiveProvider(
      <TabletNavigationSystem user={mockUser} />
    );
    
    expect(screen.getByText('Petroleum SaaS')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });
});

describe('TabletLayout', () => {
  beforeEach(() => {
    // Reset window dimensions to tablet
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('renders tablet layout with navigation', () => {
    renderWithResponsiveProvider(
      <TabletLayout user={mockUser} notifications={5}>
        <div>Test Content</div>
      </TabletLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Petroleum SaaS')).toBeInTheDocument();
  });

  it('renders content in main area', () => {
    renderWithResponsiveProvider(
      <TabletLayout user={mockUser} notifications={5}>
        <div>Test Content</div>
      </TabletLayout>
    );
    
    const main = screen.getByText('Test Content').closest('main');
    expect(main).toHaveClass('flex-1', 'overflow-auto', 'p-6');
  });

  it('does not render navigation on mobile', () => {
    renderWithResponsiveProvider(
      <TabletLayout user={mockUser} notifications={5}>
        <div>Test Content</div>
      </TabletLayout>,
      { width: 375, height: 667 }
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.queryByText('Petroleum SaaS')).not.toBeInTheDocument();
  });

  it('does not render navigation on desktop', () => {
    renderWithResponsiveProvider(
      <TabletLayout user={mockUser} notifications={5}>
        <div>Test Content</div>
      </TabletLayout>,
      { width: 1024, height: 768 }
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.queryByText('Petroleum SaaS')).not.toBeInTheDocument();
  });

  it('passes props to navigation system', () => {
    const mockSearch = jest.fn();
    
    renderWithResponsiveProvider(
      <TabletLayout 
        user={mockUser} 
        notifications={5}
        showSearch={true}
        onSearch={mockSearch}
        navigationItems={mockNavigationItems}
      >
        <div>Test Content</div>
      </TabletLayout>
    );
    
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithResponsiveProvider(
      <TabletLayout user={mockUser} notifications={5} className="custom-class">
        <div>Test Content</div>
      </TabletLayout>
    );
    
    const container = screen.getByText('Test Content').closest('[class*="custom-class"]');
    expect(container).toBeInTheDocument();
  });
});
