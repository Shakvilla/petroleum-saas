import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModernSalesChart } from '@/components/modern-sales-chart';
import { ResponsiveProvider } from '@/components/responsive-provider';

// Mock the chart components
jest.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
}));

jest.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: () => <div data-testid="chart-tooltip" />,
  ChartTooltipContent: () => <div data-testid="chart-tooltip-content" />,
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

describe('ModernSalesChart', () => {
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

  it('renders the sales chart component', () => {
    renderWithResponsiveProvider(<ModernSalesChart />);
    
    expect(screen.getByText('Sales Performance')).toBeInTheDocument();
    expect(screen.getByText('Daily sales volume and revenue trends')).toBeInTheDocument();
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('displays sales statistics', () => {
    renderWithResponsiveProvider(<ModernSalesChart />);
    
    expect(screen.getByText('156.8K')).toBeInTheDocument();
    expect(screen.getByText('$235.3K')).toBeInTheDocument();
    expect(screen.getByText('$1.50')).toBeInTheDocument();
    expect(screen.getByText("Today's Volume (L)")).toBeInTheDocument();
    expect(screen.getByText("Today's Revenue")).toBeInTheDocument();
    expect(screen.getByText('Avg Price/L')).toBeInTheDocument();
  });

  it('shows performance badge', () => {
    renderWithResponsiveProvider(<ModernSalesChart />);
    
    expect(screen.getByText('+8.1%')).toBeInTheDocument();
  });

  it('renders chart elements', () => {
    renderWithResponsiveProvider(<ModernSalesChart />);
    
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('chart-tooltip-content')).toBeInTheDocument();
  });

  it('renders bar element', () => {
    renderWithResponsiveProvider(<ModernSalesChart />);
    
    expect(screen.getByTestId('bar')).toBeInTheDocument();
  });

  describe('Responsive behavior', () => {
    it('adapts layout for mobile viewport', () => {
      renderWithResponsiveProvider(<ModernSalesChart />, { width: 375, height: 667 });
      
      // Check that mobile-specific classes are applied
      const cardHeader = screen.getByText('Sales Performance').closest('[class*="pb-3"]');
      expect(cardHeader).toBeInTheDocument();
    });

    it('adapts layout for tablet viewport', () => {
      renderWithResponsiveProvider(<ModernSalesChart />, { width: 768, height: 1024 });
      
      // Check that tablet-specific classes are applied
      const cardHeader = screen.getByText('Sales Performance').closest('[class*="pb-4"]');
      expect(cardHeader).toBeInTheDocument();
    });

    it('adapts layout for desktop viewport', () => {
      renderWithResponsiveProvider(<ModernSalesChart />, { width: 1024, height: 768 });
      
      // Check that desktop-specific classes are applied
      const cardHeader = screen.getByText('Sales Performance').closest('[class*="pb-4"]');
      expect(cardHeader).toBeInTheDocument();
    });

    it('shows responsive stats layout', () => {
      renderWithResponsiveProvider(<ModernSalesChart />, { width: 375, height: 667 });
      
      // On mobile, stats should be in a single column
      const statsContainer = screen.getByText('156.8K').closest('[class*="grid"]');
      expect(statsContainer).toBeInTheDocument();
    });
  });

  describe('Chart configuration', () => {
    it('renders all chart elements', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      expect(screen.getByTestId('chart-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
    });

    it('renders bar component for sales data', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      const bar = screen.getByTestId('bar');
      expect(bar).toBeInTheDocument();
    });
  });

  describe('Visual elements', () => {
    it('renders dollar sign icon', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      // Check for dollar sign icon (hidden from screen readers)
      const icons = screen.getAllByRole('img', { hidden: true });
      expect(icons.length).toBeGreaterThan(0);
    });

    it('displays trending up icon in badge', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      // Check for trending up icon in the performance badge
      const icons = screen.getAllByRole('img', { hidden: true });
      expect(icons.length).toBeGreaterThan(0);
    });

    it('shows gradient background on icon', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      // The icon should have a gradient background
      const iconContainer = screen.getByText('Sales Performance').querySelector('[class*="bg-gradient-to-br"]');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Data display', () => {
    it('shows volume value', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      const volumeValue = screen.getByText('156.8K');
      expect(volumeValue).toBeInTheDocument();
    });

    it('shows revenue value', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      const revenueValue = screen.getByText('$235.3K');
      expect(revenueValue).toBeInTheDocument();
    });

    it('shows average price value', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      const avgPriceValue = screen.getByText('$1.50');
      expect(avgPriceValue).toBeInTheDocument();
    });

    it('displays performance percentage', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      const performanceBadge = screen.getByText('+8.1%');
      expect(performanceBadge).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Sales Performance');
    });

    it('provides descriptive text for chart', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      expect(screen.getByText('Daily sales volume and revenue trends')).toBeInTheDocument();
    });

    it('has proper color contrast for text', () => {
      renderWithResponsiveProvider(<ModernSalesChart />);
      
      // Check that important values have proper color classes
      const volumeValue = screen.getByText('156.8K');
      expect(volumeValue).toHaveClass('text-gray-900');
      
      const revenueValue = screen.getByText('$235.3K');
      expect(revenueValue).toHaveClass('text-emerald-600');
      
      const avgPriceValue = screen.getByText('$1.50');
      expect(avgPriceValue).toHaveClass('text-blue-600');
    });
  });
});
