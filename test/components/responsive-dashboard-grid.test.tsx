// Documentation: /docs/responsive-design/responsive-dashboard-grid-tests.md

import { render, screen } from '@testing-library/react';
import {
  ResponsiveDashboardGrid,
  ResponsiveDashboardCard,
  ResponsiveDashboardWidget,
  ResponsiveDashboardSection,
  ResponsiveDashboardMetrics,
  ResponsiveDashboardChart
} from '@/components/responsive-dashboard-grid';
import { ResponsiveProvider } from '@/components/responsive-provider';
import { BarChart3, TrendingUp } from 'lucide-react';

// Mock responsive provider with different breakpoints
const MockResponsiveProvider = ({ 
  children, 
  breakpoint = 'desktop' 
}: { 
  children: React.ReactNode;
  breakpoint?: string;
}) => {
  const mockState = {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isLargeDesktop: breakpoint === 'largeDesktop',
    orientation: 'portrait' as const,
    viewportWidth: breakpoint === 'mobile' ? 375 : breakpoint === 'tablet' ? 768 : 1024,
    viewportHeight: breakpoint === 'mobile' ? 667 : breakpoint === 'tablet' ? 1024 : 768,
    safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
  };

  return (
    <ResponsiveProvider initialState={mockState}>
      {children}
    </ResponsiveProvider>
  );
};

describe('ResponsiveDashboardGrid', () => {
  const renderGrid = (breakpoint: string = 'desktop') => {
    return render(
      <MockResponsiveProvider breakpoint={breakpoint}>
        <ResponsiveDashboardGrid>
          <div>Card 1</div>
          <div>Card 2</div>
          <div>Card 3</div>
        </ResponsiveDashboardGrid>
      </MockResponsiveProvider>
    );
  };

  it('should render single column on mobile', () => {
    renderGrid('mobile');
    
    const grid = document.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1');
  });

  it('should render two columns on tablet', () => {
    renderGrid('tablet');
    
    const grid = document.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-2');
  });

  it('should render three columns on desktop', () => {
    renderGrid('desktop');
    
    const grid = document.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-3');
  });

  it('should apply custom gap sizes', () => {
    render(
      <MockResponsiveProvider breakpoint="mobile">
        <ResponsiveDashboardGrid gap="lg">
          <div>Card 1</div>
        </ResponsiveDashboardGrid>
      </MockResponsiveProvider>
    );
    
    const grid = document.querySelector('.grid');
    expect(grid).toHaveClass('gap-6');
  });
});

describe('ResponsiveDashboardCard', () => {
  it('should apply correct column spans for mobile', () => {
    render(
      <MockResponsiveProvider breakpoint="mobile">
        <ResponsiveDashboardGrid>
          <ResponsiveDashboardCard mobileSpan={1} tabletSpan={2} desktopSpan={3}>
            <div>Card Content</div>
          </ResponsiveDashboardCard>
        </ResponsiveDashboardGrid>
      </MockResponsiveProvider>
    );
    
    const card = document.querySelector('.col-span-1');
    expect(card).toBeInTheDocument();
  });

  it('should apply correct column spans for tablet', () => {
    render(
      <MockResponsiveProvider breakpoint="tablet">
        <ResponsiveDashboardGrid>
          <ResponsiveDashboardCard mobileSpan={1} tabletSpan={2} desktopSpan={3}>
            <div>Card Content</div>
          </ResponsiveDashboardCard>
        </ResponsiveDashboardGrid>
      </MockResponsiveProvider>
    );
    
    const card = document.querySelector('.col-span-2');
    expect(card).toBeInTheDocument();
  });

  it('should apply correct column spans for desktop', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardGrid>
          <ResponsiveDashboardCard mobileSpan={1} tabletSpan={2} desktopSpan={3}>
            <div>Card Content</div>
          </ResponsiveDashboardCard>
        </ResponsiveDashboardGrid>
      </MockResponsiveProvider>
    );
    
    const card = document.querySelector('.col-span-3');
    expect(card).toBeInTheDocument();
  });

  it('should apply priority ordering', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardGrid>
          <ResponsiveDashboardCard priority="high">
            <div>High Priority</div>
          </ResponsiveDashboardCard>
          <ResponsiveDashboardCard priority="low">
            <div>Low Priority</div>
          </ResponsiveDashboardCard>
        </ResponsiveDashboardGrid>
      </MockResponsiveProvider>
    );
    
    const highPriority = document.querySelector('.order-first');
    const lowPriority = document.querySelector('.order-last');
    
    expect(highPriority).toBeInTheDocument();
    expect(lowPriority).toBeInTheDocument();
  });
});

describe('ResponsiveDashboardWidget', () => {
  it('should render widget with title and icon', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardWidget
          title="Test Widget"
          icon={BarChart3}
        >
          <div>Widget Content</div>
        </ResponsiveDashboardWidget>
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Test Widget')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart-3')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardWidget
          title="Loading Widget"
          loading={true}
        >
          <div>Widget Content</div>
        </ResponsiveDashboardWidget>
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Loading Widget')).toBeInTheDocument();
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render error state', () => {
    const mockRetry = jest.fn();
    
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardWidget
          title="Error Widget"
          error="Something went wrong"
          onRetry={mockRetry}
        >
          <div>Widget Content</div>
        </ResponsiveDashboardWidget>
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Error Widget')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should render actions', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardWidget
          title="Widget with Actions"
          actions={<button>Action</button>}
        >
          <div>Widget Content</div>
        </ResponsiveDashboardWidget>
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});

describe('ResponsiveDashboardSection', () => {
  it('should render section with title and description', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardSection
          title="Dashboard Section"
          description="Section description"
        >
          <div>Section Content</div>
        </ResponsiveDashboardSection>
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Dashboard Section')).toBeInTheDocument();
    expect(screen.getByText('Section description')).toBeInTheDocument();
  });

  it('should render section with actions', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardSection
          title="Dashboard Section"
          actions={<button>Section Action</button>}
        >
          <div>Section Content</div>
        </ResponsiveDashboardSection>
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Section Action')).toBeInTheDocument();
  });

  it('should stack actions on mobile', () => {
    render(
      <MockResponsiveProvider breakpoint="mobile">
        <ResponsiveDashboardSection
          title="Dashboard Section"
          actions={<button>Section Action</button>}
        >
          <div>Section Content</div>
        </ResponsiveDashboardSection>
      </MockResponsiveProvider>
    );
    
    const actionsContainer = screen.getByText('Section Action').parentElement;
    expect(actionsContainer).toHaveClass('w-full');
  });
});

describe('ResponsiveDashboardMetrics', () => {
  const mockMetrics = [
    {
      label: 'Total Revenue',
      value: '$2.84M',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: TrendingUp
    },
    {
      label: 'Fuel Inventory',
      value: '847K L',
      change: '-2.3%',
      changeType: 'decrease' as const
    }
  ];

  it('should render metrics grid', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardMetrics metrics={mockMetrics} />
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$2.84M')).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('should use correct grid columns for mobile', () => {
    render(
      <MockResponsiveProvider breakpoint="mobile">
        <ResponsiveDashboardMetrics metrics={mockMetrics} />
      </MockResponsiveProvider>
    );
    
    const grid = document.querySelector('.grid-cols-2');
    expect(grid).toBeInTheDocument();
  });

  it('should use correct grid columns for desktop', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardMetrics metrics={mockMetrics} />
      </MockResponsiveProvider>
    );
    
    const grid = document.querySelector('.grid-cols-4');
    expect(grid).toBeInTheDocument();
  });
});

describe('ResponsiveDashboardChart', () => {
  it('should render chart with title', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardChart title="Sales Chart">
          <div>Chart Content</div>
        </ResponsiveDashboardChart>
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Sales Chart')).toBeInTheDocument();
  });

  it('should apply correct height for mobile', () => {
    render(
      <MockResponsiveProvider breakpoint="mobile">
        <ResponsiveDashboardChart title="Mobile Chart" height="md">
          <div>Chart Content</div>
        </ResponsiveDashboardChart>
      </MockResponsiveProvider>
    );
    
    const chartContainer = document.querySelector('.h-48');
    expect(chartContainer).toBeInTheDocument();
  });

  it('should apply correct height for desktop', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveDashboardChart title="Desktop Chart" height="md">
          <div>Chart Content</div>
        </ResponsiveDashboardChart>
      </MockResponsiveProvider>
    );
    
    const chartContainer = document.querySelector('.h-80');
    expect(chartContainer).toBeInTheDocument();
  });
});
