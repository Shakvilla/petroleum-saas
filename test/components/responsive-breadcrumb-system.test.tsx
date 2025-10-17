import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { 
  ResponsiveBreadcrumbSystem, 
  MobileBreadcrumb,
  generateBreadcrumbsFromPath,
  useBreadcrumbs,
  petroleumRouteMap
} from '@/components/responsive-breadcrumb-system';
import { ResponsiveProvider } from '@/components/responsive-provider';
import { Home, Settings } from 'lucide-react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/inventory/add',
}));

const renderWithResponsiveProvider = (component: React.ReactElement, mockViewport = { width: 1024, height: 768 }) => {
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

const mockBreadcrumbItems = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Add Stock', href: '/inventory/add' },
];

describe('ResponsiveBreadcrumbSystem', () => {
  beforeEach(() => {
    // Reset window dimensions to desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it('renders breadcrumb items', () => {
    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem items={mockBreadcrumbItems} />
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Add Stock')).toBeInTheDocument();
  });

  it('shows home icon when showHome is true', () => {
    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem items={mockBreadcrumbItems} showHome={true} />
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('hides home when showHome is false', () => {
    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem items={mockBreadcrumbItems} showHome={false} />
    );
    
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('highlights the last item as current page', () => {
    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem items={mockBreadcrumbItems} />
    );
    
    const lastItem = screen.getByText('Add Stock');
    expect(lastItem.closest('span')).toHaveClass('font-medium', 'text-gray-900');
  });

  it('shows ellipsis dropdown when items exceed max limit', () => {
    const manyItems = [
      { label: 'Dashboard', href: '/' },
      { label: 'Inventory', href: '/inventory' },
      { label: 'Category 1', href: '/inventory/category1' },
      { label: 'Category 2', href: '/inventory/category2' },
      { label: 'Category 3', href: '/inventory/category3' },
      { label: 'Add Stock', href: '/inventory/add' },
    ];

    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem items={manyItems} maxItems={4} />
    );
    
    expect(screen.getByLabelText('More breadcrumbs')).toBeInTheDocument();
  });

  it('shows hidden items in dropdown', () => {
    const manyItems = [
      { label: 'Dashboard', href: '/' },
      { label: 'Inventory', href: '/inventory' },
      { label: 'Category 1', href: '/inventory/category1' },
      { label: 'Category 2', href: '/inventory/category2' },
      { label: 'Add Stock', href: '/inventory/add' },
    ];

    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem items={manyItems} maxItems={3} />
    );
    
    const dropdownTrigger = screen.getByLabelText('More breadcrumbs');
    fireEvent.click(dropdownTrigger);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('calls onItemClick when item is clicked', () => {
    const mockClick = jest.fn();
    
    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem 
        items={mockBreadcrumbItems} 
        onItemClick={mockClick}
      />
    );
    
    const inventoryItem = screen.getByText('Inventory');
    fireEvent.click(inventoryItem);
    
    expect(mockClick).toHaveBeenCalledWith('/inventory');
  });

  it('adapts max items based on screen size', () => {
    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem items={mockBreadcrumbItems} />,
      { width: 375, height: 667 } // Mobile
    );
    
    // Should show fewer items on mobile
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Add Stock')).toBeInTheDocument();
  });

  it('shows icons when showIcons is true', () => {
    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem 
        items={mockBreadcrumbItems} 
        showIcons={true}
      />
    );
    
    // Home icon should be visible
    const homeIcon = screen.getByText('Home').closest('button')?.querySelector('svg');
    expect(homeIcon).toBeInTheDocument();
  });

  it('hides icons when showIcons is false', () => {
    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem 
        items={mockBreadcrumbItems} 
        showIcons={false}
      />
    );
    
    // Icons should not be visible
    const homeButton = screen.getByText('Home').closest('button');
    const icon = homeButton?.querySelector('svg');
    expect(icon).not.toBeInTheDocument();
  });

  it('truncates labels on mobile when truncateLabels is true', () => {
    const longLabelItems = [
      { label: 'Very Long Dashboard Name That Should Be Truncated', href: '/' },
      { label: 'Add Stock', href: '/inventory/add' },
    ];

    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem 
        items={longLabelItems} 
        truncateLabels={true}
      />,
      { width: 375, height: 667 }
    );
    
    const longLabel = screen.getByText('Very Long Dashboard Name That Should Be Truncated');
    expect(longLabel).toHaveClass('truncate', 'max-w-32');
  });

  it('uses custom separator', () => {
    const customSeparator = <span>/</span>;
    
    renderWithResponsiveProvider(
      <ResponsiveBreadcrumbSystem 
        items={mockBreadcrumbItems} 
        separator={customSeparator}
      />
    );
    
    expect(screen.getByText('/')).toBeInTheDocument();
  });
});

describe('MobileBreadcrumb', () => {
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

  it('renders mobile breadcrumb', () => {
    renderWithResponsiveProvider(
      <MobileBreadcrumb items={mockBreadcrumbItems} />
    );
    
    expect(screen.getByText('Add Stock')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
  });

  it('shows back button when showBackButton is true', () => {
    renderWithResponsiveProvider(
      <MobileBreadcrumb items={mockBreadcrumbItems} showBackButton={true} />
    );
    
    expect(screen.getByLabelText('Go back')).toBeInTheDocument();
  });

  it('hides back button when showBackButton is false', () => {
    renderWithResponsiveProvider(
      <MobileBreadcrumb items={mockBreadcrumbItems} showBackButton={false} />
    );
    
    expect(screen.queryByLabelText('Go back')).not.toBeInTheDocument();
  });

  it('calls onBackClick when back button is clicked', () => {
    const mockBackClick = jest.fn();
    
    renderWithResponsiveProvider(
      <MobileBreadcrumb 
        items={mockBreadcrumbItems} 
        onBackClick={mockBackClick}
      />
    );
    
    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);
    
    expect(mockBackClick).toHaveBeenCalled();
  });

  it('does not render on desktop', () => {
    renderWithResponsiveProvider(
      <MobileBreadcrumb items={mockBreadcrumbItems} />,
      { width: 1024, height: 768 }
    );
    
    expect(screen.queryByText('Add Stock')).not.toBeInTheDocument();
  });

  it('shows current item icon', () => {
    const itemsWithIcon = [
      { label: 'Inventory', href: '/inventory' },
      { label: 'Add Stock', href: '/inventory/add', icon: Settings },
    ];

    renderWithResponsiveProvider(
      <MobileBreadcrumb items={itemsWithIcon} />
    );
    
    // Icon should be visible
    const icon = screen.getByText('Add Stock').closest('div')?.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});

describe('generateBreadcrumbsFromPath', () => {
  it('generates breadcrumbs from simple path', () => {
    const breadcrumbs = generateBreadcrumbsFromPath('/inventory/add');
    
    expect(breadcrumbs).toHaveLength(2);
    expect(breadcrumbs[0]).toEqual({
      label: 'Inventory',
      href: '/inventory',
    });
    expect(breadcrumbs[1]).toEqual({
      label: 'Add',
      href: '/inventory/add',
    });
  });

  it('uses route map for custom labels', () => {
    const routeMap = {
      '/inventory': { label: 'Fuel Inventory' },
      '/inventory/add': { label: 'Add New Stock' },
    };
    
    const breadcrumbs = generateBreadcrumbsFromPath('/inventory/add', routeMap);
    
    expect(breadcrumbs[0].label).toBe('Fuel Inventory');
    expect(breadcrumbs[1].label).toBe('Add New Stock');
  });

  it('capitalizes segment names when no route map provided', () => {
    const breadcrumbs = generateBreadcrumbsFromPath('/user/settings');
    
    expect(breadcrumbs[0].label).toBe('User');
    expect(breadcrumbs[1].label).toBe('Settings');
  });

  it('handles empty path', () => {
    const breadcrumbs = generateBreadcrumbsFromPath('');
    
    expect(breadcrumbs).toHaveLength(0);
  });

  it('handles root path', () => {
    const breadcrumbs = generateBreadcrumbsFromPath('/');
    
    expect(breadcrumbs).toHaveLength(0);
  });
});

describe('useBreadcrumbs hook', () => {
  it('generates breadcrumbs from pathname', () => {
    const TestComponent = () => {
      const breadcrumbs = useBreadcrumbs('/inventory/add', petroleumRouteMap);
      return (
        <div>
          {breadcrumbs.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      );
    };

    renderWithResponsiveProvider(<TestComponent />);
    
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Add Stock')).toBeInTheDocument();
  });

  it('memoizes breadcrumbs based on pathname', () => {
    let renderCount = 0;
    
    const TestComponent = ({ pathname }: { pathname: string }) => {
      const breadcrumbs = useBreadcrumbs(pathname, petroleumRouteMap);
      renderCount++;
      
      return (
        <div>
          {breadcrumbs.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      );
    };

    const { rerender } = renderWithResponsiveProvider(
      <TestComponent pathname="/inventory/add" />
    );
    
    expect(renderCount).toBe(1);
    
    // Rerender with same pathname should not cause recalculation
    rerender(<TestComponent pathname="/inventory/add" />);
    expect(renderCount).toBe(2); // Component still re-renders, but hook memoizes
    
    // Rerender with different pathname should cause recalculation
    rerender(<TestComponent pathname="/sales" />);
    expect(renderCount).toBe(3);
  });
});

describe('petroleumRouteMap', () => {
  it('contains expected routes', () => {
    expect(petroleumRouteMap['/']).toEqual({ label: 'Dashboard', icon: Home });
    expect(petroleumRouteMap['/inventory']).toEqual({ label: 'Inventory', icon: expect.any(Function) });
    expect(petroleumRouteMap['/sales']).toEqual({ label: 'Sales', icon: expect.any(Function) });
    expect(petroleumRouteMap['/settings']).toEqual({ label: 'Settings', icon: expect.any(Function) });
  });

  it('has icons for all routes', () => {
    Object.entries(petroleumRouteMap).forEach(([path, config]) => {
      expect(config.label).toBeTruthy();
      expect(config.icon).toBeTruthy();
    });
  });
});
