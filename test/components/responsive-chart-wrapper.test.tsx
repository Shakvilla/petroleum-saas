import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResponsiveChartWrapper, ResponsiveChartContainer, useResponsiveChart } from '@/components/responsive-chart-wrapper';
import { ResponsiveProvider } from '@/components/responsive-provider';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

// Test component to test the hook
const TestHookComponent = () => {
  const chartUtils = useResponsiveChart();
  
  return (
    <div>
      <div data-testid="is-mobile">{chartUtils.isMobile.toString()}</div>
      <div data-testid="is-tablet">{chartUtils.isTablet.toString()}</div>
      <div data-testid="is-desktop">{chartUtils.isDesktop.toString()}</div>
      <div data-testid="chart-height">{chartUtils.getChartHeight({ mobile: 200, tablet: 250, desktop: 300 })}</div>
      <div data-testid="font-size">{chartUtils.getChartFontSize({ mobile: 10, tablet: 11, desktop: 12 })}</div>
    </div>
  );
};

describe('ResponsiveChartWrapper', () => {
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

  it('renders the chart wrapper with title', () => {
    renderWithResponsiveProvider(
      <ResponsiveChartWrapper title="Test Chart">
        <div data-testid="chart-content">Chart Content</div>
      </ResponsiveChartWrapper>
    );
    
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });

  it('renders with description', () => {
    renderWithResponsiveProvider(
      <ResponsiveChartWrapper title="Test Chart" description="Test description">
        <div data-testid="chart-content">Chart Content</div>
      </ResponsiveChartWrapper>
    );
    
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    renderWithResponsiveProvider(
      <ResponsiveChartWrapper 
        title="Test Chart" 
        icon={<DollarSign className="text-white" />}
      >
        <div data-testid="chart-content">Chart Content</div>
      </ResponsiveChartWrapper>
    );
    
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    // Icon should be present (hidden from screen readers)
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons.length).toBeGreaterThan(0);
  });

  it('renders with badge', () => {
    const badge = (
      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
        <TrendingUp className="w-3 h-3 mr-1" />
        +8.1%
      </Badge>
    );

    renderWithResponsiveProvider(
      <ResponsiveChartWrapper title="Test Chart" badge={badge}>
        <div data-testid="chart-content">Chart Content</div>
      </ResponsiveChartWrapper>
    );
    
    expect(screen.getByText('+8.1%')).toBeInTheDocument();
  });

  it('renders with stats', () => {
    const stats = [
      { label: 'Volume', value: '156.8K', color: 'text-gray-900' },
      { label: 'Revenue', value: '$235.3K', color: 'text-emerald-600' },
      { label: 'Price', value: '$1.50', color: 'text-blue-600' },
    ];

    renderWithResponsiveProvider(
      <ResponsiveChartWrapper title="Test Chart" showStats stats={stats}>
        <div data-testid="chart-content">Chart Content</div>
      </ResponsiveChartWrapper>
    );
    
    expect(screen.getByText('156.8K')).toBeInTheDocument();
    expect(screen.getByText('$235.3K')).toBeInTheDocument();
    expect(screen.getByText('$1.50')).toBeInTheDocument();
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithResponsiveProvider(
      <ResponsiveChartWrapper title="Test Chart" loading>
        <div data-testid="chart-content">Chart Content</div>
      </ResponsiveChartWrapper>
    );
    
    // Should show skeleton elements instead of chart content
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument();
  });

  it('shows error state', () => {
    renderWithResponsiveProvider(
      <ResponsiveChartWrapper title="Test Chart" error="Failed to load data">
        <div data-testid="chart-content">Chart Content</div>
      </ResponsiveChartWrapper>
    );
    
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    expect(screen.getByText('Failed to load chart data')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument();
  });

  describe('Responsive behavior', () => {
    it('adapts layout for mobile viewport', () => {
      renderWithResponsiveProvider(
        <ResponsiveChartWrapper title="Test Chart">
          <div data-testid="chart-content">Chart Content</div>
        </ResponsiveChartWrapper>,
        { width: 375, height: 667 }
      );
      
      // Check that mobile-specific classes are applied
      const cardHeader = screen.getByText('Test Chart').closest('[class*="pb-3"]');
      expect(cardHeader).toBeInTheDocument();
    });

    it('adapts layout for tablet viewport', () => {
      renderWithResponsiveProvider(
        <ResponsiveChartWrapper title="Test Chart">
          <div data-testid="chart-content">Chart Content</div>
        </ResponsiveChartWrapper>,
        { width: 768, height: 1024 }
      );
      
      // Check that tablet-specific classes are applied
      const cardHeader = screen.getByText('Test Chart').closest('[class*="pb-4"]');
      expect(cardHeader).toBeInTheDocument();
    });

    it('adapts layout for desktop viewport', () => {
      renderWithResponsiveProvider(
        <ResponsiveChartWrapper title="Test Chart">
          <div data-testid="chart-content">Chart Content</div>
        </ResponsiveChartWrapper>,
        { width: 1024, height: 768 }
      );
      
      // Check that desktop-specific classes are applied
      const cardHeader = screen.getByText('Test Chart').closest('[class*="pb-4"]');
      expect(cardHeader).toBeInTheDocument();
    });

    it('shows responsive stats layout', () => {
      const stats = [
        { label: 'Volume', value: '156.8K' },
        { label: 'Revenue', value: '$235.3K' },
        { label: 'Price', value: '$1.50' },
      ];

      renderWithResponsiveProvider(
        <ResponsiveChartWrapper title="Test Chart" showStats stats={stats}>
          <div data-testid="chart-content">Chart Content</div>
        </ResponsiveChartWrapper>,
        { width: 375, height: 667 }
      );
      
      // On mobile, stats should be in a single column
      const statsContainer = screen.getByText('156.8K').closest('[class*="grid"]');
      expect(statsContainer).toBeInTheDocument();
    });
  });

  describe('Custom height configuration', () => {
    it('uses custom height configuration', () => {
      const customHeight = {
        mobile: 150,
        tablet: 200,
        desktop: 400,
      };

      renderWithResponsiveProvider(
        <ResponsiveChartWrapper title="Test Chart" height={customHeight}>
          <div data-testid="chart-content">Chart Content</div>
        </ResponsiveChartWrapper>
      );
      
      // The chart container should have the custom height
      const chartContainer = screen.getByTestId('chart-content').parentElement;
      expect(chartContainer).toHaveStyle({ height: '400px' });
    });
  });
});

describe('ResponsiveChartContainer', () => {
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

  it('renders the chart container', () => {
    renderWithResponsiveProvider(
      <ResponsiveChartContainer>
        <div data-testid="chart-content">Chart Content</div>
      </ResponsiveChartContainer>
    );
    
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithResponsiveProvider(
      <ResponsiveChartContainer loading>
        <div data-testid="chart-content">Chart Content</div>
      </ResponsiveChartContainer>
    );
    
    // Should show skeleton instead of chart content
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument();
  });

  it('shows error state', () => {
    renderWithResponsiveProvider(
      <ResponsiveChartContainer error="Failed to load data">
        <div data-testid="chart-content">Chart Content</div>
      </ResponsiveChartContainer>
    );
    
    expect(screen.getByText('Failed to load chart data')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument();
  });

  it('uses custom height configuration', () => {
    const customHeight = {
      mobile: 150,
      tablet: 200,
      desktop: 400,
    };

    renderWithResponsiveProvider(
      <ResponsiveChartContainer height={customHeight}>
        <div data-testid="chart-content">Chart Content</div>
      </ResponsiveChartContainer>
    );
    
    // The container should have the custom height
    const container = screen.getByTestId('chart-content').parentElement;
    expect(container).toHaveStyle({ height: '400px' });
  });
});

describe('useResponsiveChart hook', () => {
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

  it('returns correct device type for desktop', () => {
    renderWithResponsiveProvider(<TestHookComponent />, { width: 1024, height: 768 });
    
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
    expect(screen.getByTestId('is-tablet')).toHaveTextContent('false');
    expect(screen.getByTestId('is-desktop')).toHaveTextContent('true');
  });

  it('returns correct device type for tablet', () => {
    renderWithResponsiveProvider(<TestHookComponent />, { width: 768, height: 1024 });
    
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
    expect(screen.getByTestId('is-tablet')).toHaveTextContent('true');
    expect(screen.getByTestId('is-desktop')).toHaveTextContent('false');
  });

  it('returns correct device type for mobile', () => {
    renderWithResponsiveProvider(<TestHookComponent />, { width: 375, height: 667 });
    
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
    expect(screen.getByTestId('is-tablet')).toHaveTextContent('false');
    expect(screen.getByTestId('is-desktop')).toHaveTextContent('false');
  });

  it('returns correct chart height for desktop', () => {
    renderWithResponsiveProvider(<TestHookComponent />, { width: 1024, height: 768 });
    
    expect(screen.getByTestId('chart-height')).toHaveTextContent('300');
  });

  it('returns correct chart height for tablet', () => {
    renderWithResponsiveProvider(<TestHookComponent />, { width: 768, height: 1024 });
    
    expect(screen.getByTestId('chart-height')).toHaveTextContent('250');
  });

  it('returns correct chart height for mobile', () => {
    renderWithResponsiveProvider(<TestHookComponent />, { width: 375, height: 667 });
    
    expect(screen.getByTestId('chart-height')).toHaveTextContent('200');
  });

  it('returns correct font size for desktop', () => {
    renderWithResponsiveProvider(<TestHookComponent />, { width: 1024, height: 768 });
    
    expect(screen.getByTestId('font-size')).toHaveTextContent('12');
  });

  it('returns correct font size for tablet', () => {
    renderWithResponsiveProvider(<TestHookComponent />, { width: 768, height: 1024 });
    
    expect(screen.getByTestId('font-size')).toHaveTextContent('11');
  });

  it('returns correct font size for mobile', () => {
    renderWithResponsiveProvider(<TestHookComponent />, { width: 375, height: 667 });
    
    expect(screen.getByTestId('font-size')).toHaveTextContent('10');
  });
});
