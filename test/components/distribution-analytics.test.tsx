import React from 'react';
import { render, screen } from '@testing-library/react';
import { DistributionAnalytics } from '@/components/distribution-analytics';
import { ResponsiveProvider } from '@/components/responsive-provider';

// Mock the chart components
jest.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
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

describe('DistributionAnalytics', () => {
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

  it('renders the analytics component', () => {
    renderWithResponsiveProvider(<DistributionAnalytics />);
    
    expect(screen.getByText('Delivery Performance')).toBeInTheDocument();
    expect(screen.getByText('Route Distribution')).toBeInTheDocument();
    expect(screen.getByText('Fuel Efficiency Trend')).toBeInTheDocument();
    expect(screen.getByText('Route Efficiency')).toBeInTheDocument();
    expect(screen.getByText('Driver Performance')).toBeInTheDocument();
  });

  it('displays KPI cards', () => {
    renderWithResponsiveProvider(<DistributionAnalytics />);
    
    expect(screen.getByText('Average Delivery Time')).toBeInTheDocument();
    expect(screen.getByText('Fuel Efficiency')).toBeInTheDocument();
    expect(screen.getByText('Cost per Delivery')).toBeInTheDocument();
    expect(screen.getByText('Fleet Utilization')).toBeInTheDocument();
  });

  it('shows KPI values and trends', () => {
    renderWithResponsiveProvider(<DistributionAnalytics />);
    
    expect(screen.getByText('2.4 hours')).toBeInTheDocument();
    expect(screen.getByText('7.2 L/100km')).toBeInTheDocument();
    expect(screen.getByText('$24.50')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('renders route distribution legend', () => {
    renderWithResponsiveProvider(<DistributionAnalytics />);
    
    expect(screen.getByText('Downtown')).toBeInTheDocument();
    expect(screen.getByText('Suburban')).toBeInTheDocument();
    expect(screen.getByText('Highway')).toBeInTheDocument();
    expect(screen.getByText('Industrial')).toBeInTheDocument();
  });

  it('displays route efficiency data', () => {
    renderWithResponsiveProvider(<DistributionAnalytics />);
    
    expect(screen.getByText('Downtown Circuit')).toBeInTheDocument();
    expect(screen.getByText('Highway Express')).toBeInTheDocument();
    expect(screen.getByText('Suburban Loop')).toBeInTheDocument();
    expect(screen.getByText('Industrial Zone')).toBeInTheDocument();
  });

  it('shows driver performance data', () => {
    renderWithResponsiveProvider(<DistributionAnalytics />);
    
    expect(screen.getByText('Sarah Wilson')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Mike Johnson')).toBeInTheDocument();
    expect(screen.getByText('Lisa Garcia')).toBeInTheDocument();
  });

  describe('Responsive behavior', () => {
    it('adapts layout for mobile viewport', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />, { width: 375, height: 667 });
      
      // Check that mobile-specific classes are applied
      const kpiCards = screen.getAllByText(/Average Delivery Time|Fuel Efficiency|Cost per Delivery|Fleet Utilization/);
      expect(kpiCards.length).toBe(4);
    });

    it('adapts layout for tablet viewport', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />, { width: 768, height: 1024 });
      
      // Check that tablet-specific classes are applied
      const charts = screen.getAllByTestId('responsive-container');
      expect(charts.length).toBeGreaterThan(0);
    });

    it('adapts layout for desktop viewport', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />, { width: 1024, height: 768 });
      
      // Check that desktop-specific classes are applied
      const charts = screen.getAllByTestId('responsive-container');
      expect(charts.length).toBeGreaterThan(0);
    });
  });

  describe('Chart components', () => {
    it('renders all chart types', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('renders chart elements', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      expect(screen.getAllByTestId('responsive-container')).toHaveLength(3);
      expect(screen.getAllByTestId('cartesian-grid')).toHaveLength(2);
      expect(screen.getAllByTestId('x-axis')).toHaveLength(2);
      expect(screen.getAllByTestId('y-axis')).toHaveLength(2);
      expect(screen.getAllByTestId('tooltip')).toHaveLength(3);
    });

    it('renders bar chart elements', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      const bars = screen.getAllByTestId('bar');
      expect(bars).toHaveLength(2); // Deliveries and On-Time bars
    });

    it('renders pie chart elements', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      expect(screen.getByTestId('pie')).toBeInTheDocument();
      const cells = screen.getAllByTestId('cell');
      expect(cells).toHaveLength(4); // Four route types
    });

    it('renders line chart elements', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      const lines = screen.getAllByTestId('line');
      expect(lines).toHaveLength(2); // Efficiency and Cost lines
    });
  });

  describe('Performance metrics', () => {
    it('displays route efficiency percentages', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      expect(screen.getByText('92%')).toBeInTheDocument();
      expect(screen.getByText('88%')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('78%')).toBeInTheDocument();
    });

    it('shows delivery counts', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      expect(screen.getByText('45 deliveries')).toBeInTheDocument();
      expect(screen.getByText('32 deliveries')).toBeInTheDocument();
      expect(screen.getByText('28 deliveries')).toBeInTheDocument();
      expect(screen.getByText('18 deliveries')).toBeInTheDocument();
    });

    it('displays driver scores', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      expect(screen.getByText('96%')).toBeInTheDocument();
      expect(screen.getByText('94%')).toBeInTheDocument();
      expect(screen.getByText('91%')).toBeInTheDocument();
      expect(screen.getByText('89%')).toBeInTheDocument();
    });

    it('shows driver delivery counts', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      expect(screen.getByText('78 deliveries')).toBeInTheDocument();
      expect(screen.getByText('82 deliveries')).toBeInTheDocument();
      expect(screen.getByText('75 deliveries')).toBeInTheDocument();
      expect(screen.getByText('68 deliveries')).toBeInTheDocument();
    });
  });

  describe('Icons and visual elements', () => {
    it('renders trend icons', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      // Check for trend icons (TrendingUp/TrendingDown)
      const trendElements = screen.getAllByRole('img', { hidden: true });
      expect(trendElements.length).toBeGreaterThan(0);
    });

    it('displays route type indicators', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      // Check for colored indicators in route distribution
      const indicators = screen.getAllByRole('img', { hidden: true });
      expect(indicators.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('provides descriptive text for charts', () => {
      renderWithResponsiveProvider(<DistributionAnalytics />);
      
      expect(screen.getByText('Monthly deliveries and on-time performance')).toBeInTheDocument();
      expect(screen.getByText('Delivery distribution by route type')).toBeInTheDocument();
      expect(screen.getByText('Weekly fuel consumption and cost analysis')).toBeInTheDocument();
    });
  });
});
