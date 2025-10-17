import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModernInventoryChart } from '@/components/modern-inventory-chart';
import { ResponsiveProvider } from '@/components/responsive-provider';

// Mock the chart components
jest.mock('recharts', () => ({
  Area: () => <div data-testid="area" />,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
}));

jest.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: () => <div data-testid="chart-tooltip" />,
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

describe('ModernInventoryChart', () => {
  beforeEach(() => {
    // Reset window dimensions
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

  it('renders the chart component', () => {
    renderWithResponsiveProvider(<ModernInventoryChart />);
    
    expect(screen.getByText('Inventory Trends')).toBeInTheDocument();
    expect(screen.getByText('Fuel inventory levels and distribution over time')).toBeInTheDocument();
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('displays fuel type statistics', () => {
    renderWithResponsiveProvider(<ModernInventoryChart />);
    
    expect(screen.getByText('Total Inventory')).toBeInTheDocument();
    expect(screen.getByText('Daily Change')).toBeInTheDocument();
    expect(screen.getByText('Premium Gas')).toBeInTheDocument();
    expect(screen.getByText('Regular Gas')).toBeInTheDocument();
  });

  it('shows fuel type legend', () => {
    renderWithResponsiveProvider(<ModernInventoryChart />);
    
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Regular')).toBeInTheDocument();
    expect(screen.getByText('Diesel')).toBeInTheDocument();
    expect(screen.getByText('Kerosene')).toBeInTheDocument();
  });

  it('displays inventory insights', () => {
    renderWithResponsiveProvider(<ModernInventoryChart />);
    
    expect(screen.getByText('Inventory Insights')).toBeInTheDocument();
    expect(screen.getByText(/Regular gasoline shows significant decrease/)).toBeInTheDocument();
  });

  it('renders chart controls', () => {
    renderWithResponsiveProvider(<ModernInventoryChart />);
    
    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByDisplayValue('7 Days')).toBeInTheDocument();
  });

  describe('Responsive behavior', () => {
    it('adapts layout for mobile viewport', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />, { width: 375, height: 667 });
      
      // Check that mobile-specific classes are applied
      const cardHeader = screen.getByText('Inventory Trends').closest('[class*="pb-3"]');
      expect(cardHeader).toBeInTheDocument();
    });

    it('adapts layout for tablet viewport', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />, { width: 768, height: 1024 });
      
      // Check that tablet-specific classes are applied
      const cardHeader = screen.getByText('Inventory Trends').closest('[class*="pb-4"]');
      expect(cardHeader).toBeInTheDocument();
    });

    it('adapts layout for desktop viewport', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />, { width: 1024, height: 768 });
      
      // Check that desktop-specific classes are applied
      const cardHeader = screen.getByText('Inventory Trends').closest('[class*="pb-4"]');
      expect(cardHeader).toBeInTheDocument();
    });

    it('shows responsive grid layout for fuel types', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />, { width: 375, height: 667 });
      
      // On mobile, fuel types should be in a single column
      const fuelTypeContainer = screen.getByText('Premium').closest('[class*="grid"]');
      expect(fuelTypeContainer).toBeInTheDocument();
    });
  });

  describe('Chart configuration', () => {
    it('renders all chart elements', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />);
      
      expect(screen.getByTestId('chart-container')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
    });

    it('renders area components for each fuel type', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />);
      
      const areas = screen.getAllByTestId('area');
      expect(areas).toHaveLength(4); // Premium, Regular, Diesel, Kerosene
    });
  });

  describe('Interactive elements', () => {
    it('renders dropdown menu for filters', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />);
      
      const filterButton = screen.getByText('Filter');
      expect(filterButton).toBeInTheDocument();
    });

    it('renders export button', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />);
      
      const exportButton = screen.getByText('Export');
      expect(exportButton).toBeInTheDocument();
    });

    it('renders maximize button', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />);
      
      const maximizeButton = screen.getByRole('button', { name: /maximize/i });
      expect(maximizeButton).toBeInTheDocument();
    });
  });

  describe('Data display', () => {
    it('shows total inventory value', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />);
      
      // Should show a number with 'L' suffix
      const totalInventory = screen.getByText(/L$/);
      expect(totalInventory).toBeInTheDocument();
    });

    it('shows percentage change', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />);
      
      // Should show a percentage value
      const percentageChange = screen.getByText(/%$/);
      expect(percentageChange).toBeInTheDocument();
    });

    it('shows fuel type percentages', () => {
      renderWithResponsiveProvider(<ModernInventoryChart />);
      
      // Should show percentage values for each fuel type
      const percentages = screen.getAllByText(/%$/);
      expect(percentages.length).toBeGreaterThan(0);
    });
  });
});
