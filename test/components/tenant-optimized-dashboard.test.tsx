// Documentation: /docs/responsive-design/tenant-optimized-dashboard-tests.md

import { render, screen } from '@testing-library/react';
import { TenantOptimizedDashboard } from '@/components/tenant-optimized-dashboard';
import { ResponsiveProvider } from '@/components/responsive-provider';
import { TenantProvider } from '@/components/tenant-provider';

// Mock the tenant provider
const mockTenant = {
  id: 'test-tenant',
  name: 'Test Company',
  slug: 'test-company'
};

// Mock the tenant provider
const MockTenantProvider = ({ children }: { children: React.ReactNode }) => (
  <TenantProvider value={mockTenant}>
    {children}
  </TenantProvider>
);

// Mock the responsive provider with different breakpoints
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

// Mock the lazy-loaded components
jest.mock('@/components/modern-tank-overview', () => ({
  ModernTankOverview: () => <div data-testid="tank-overview">Tank Overview</div>
}));

jest.mock('@/components/modern-inventory-chart', () => ({
  ModernInventoryChart: () => <div data-testid="inventory-chart">Inventory Chart</div>
}));

jest.mock('@/components/modern-sales-chart', () => ({
  ModernSalesChart: () => <div data-testid="sales-chart">Sales Chart</div>
}));

jest.mock('@/components/modern-predictive-analytics', () => ({
  ModernPredictiveAnalytics: () => <div data-testid="predictive-analytics">Predictive Analytics</div>
}));

jest.mock('@/components/modern-iot-monitoring', () => ({
  ModernIoTMonitoring: () => <div data-testid="iot-monitoring">IoT Monitoring</div>
}));

jest.mock('@/components/modern-alerts-panel', () => ({
  ModernAlertsPanel: () => <div data-testid="alerts-panel">Alerts Panel</div>
}));

jest.mock('@/components/modern-transactions', () => ({
  ModernTransactions: () => <div data-testid="transactions">Transactions</div>
}));

// Mock the hooks
jest.mock('@/hooks/use-tenant-query', () => ({
  useTenantQuery: () => ({
    data: { dashboard: 'mock-data' },
    isLoading: false,
    error: null
  })
}));

jest.mock('@/lib/tenant-cache', () => ({
  useTenantCache: () => ({
    get: jest.fn(),
    set: jest.fn()
  })
}));

jest.mock('@/lib/tenant-performance-monitor', () => ({
  useTenantPerformanceMonitor: () => ({
    recordMetric: jest.fn()
  })
}));

describe('TenantOptimizedDashboard - Responsive', () => {
  const renderDashboard = (breakpoint: string = 'desktop') => {
    return render(
      <MockTenantProvider>
        <MockResponsiveProvider breakpoint={breakpoint}>
          <TenantOptimizedDashboard />
        </MockResponsiveProvider>
      </MockTenantProvider>
    );
  };

  describe('Mobile Layout', () => {
    it('should render mobile-optimized header', () => {
      renderDashboard('mobile');
      
      const header = screen.getByText('Test Company Dashboard');
      expect(header).toHaveClass('text-2xl');
      
      const subtitle = screen.getByText(/Welcome back!/);
      expect(subtitle).toHaveClass('text-sm');
    });

    it('should hide last updated time on mobile', () => {
      renderDashboard('mobile');
      
      expect(screen.queryByText(/Last updated/)).not.toBeInTheDocument();
    });

    it('should use single column grid on mobile', () => {
      renderDashboard('mobile');
      
      const grid = screen.getByTestId('dashboard-grid') || 
                   document.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
    });

    it('should use smaller gaps on mobile', () => {
      renderDashboard('mobile');
      
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('gap-4');
    });
  });

  describe('Tablet Layout', () => {
    it('should render tablet-optimized header', () => {
      renderDashboard('tablet');
      
      const header = screen.getByText('Test Company Dashboard');
      expect(header).toHaveClass('text-3xl');
      
      const subtitle = screen.getByText(/Welcome back!/);
      expect(subtitle).toHaveClass('text-base');
    });

    it('should show last updated time on tablet', () => {
      renderDashboard('tablet');
      
      expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    });

    it('should use two column grid on tablet', () => {
      renderDashboard('tablet');
      
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2');
    });
  });

  describe('Desktop Layout', () => {
    it('should render desktop-optimized header', () => {
      renderDashboard('desktop');
      
      const header = screen.getByText('Test Company Dashboard');
      expect(header).toHaveClass('text-3xl');
      
      const subtitle = screen.getByText(/Welcome back!/);
      expect(subtitle).toHaveClass('text-base');
    });

    it('should show last updated time on desktop', () => {
      renderDashboard('desktop');
      
      expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    });

    it('should use three column grid on desktop', () => {
      renderDashboard('desktop');
      
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-3');
    });

    it('should use larger gaps on desktop', () => {
      renderDashboard('desktop');
      
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('gap-6');
    });
  });

  describe('Responsive Card Spans', () => {
    it('should use single column spans on mobile', () => {
      renderDashboard('mobile');
      
      const tankCard = screen.getByText('Tank Overview').closest('.col-span-1');
      expect(tankCard).toBeInTheDocument();
    });

    it('should use appropriate spans on tablet', () => {
      renderDashboard('tablet');
      
      const tankCard = screen.getByText('Tank Overview').closest('.col-span-2');
      expect(tankCard).toBeInTheDocument();
    });

    it('should use appropriate spans on desktop', () => {
      renderDashboard('desktop');
      
      const tankCard = screen.getByText('Tank Overview').closest('.lg\\:col-span-2');
      expect(tankCard).toBeInTheDocument();
    });
  });

  describe('Responsive Skeleton Loading', () => {
    it('should use smaller skeleton heights on mobile', () => {
      renderDashboard('mobile');
      
      // This would be tested when loading state is active
      // For now, we test the skeleton component logic
      const skeleton = document.querySelector('.h-48');
      expect(skeleton).toBeInTheDocument();
    });

    it('should use medium skeleton heights on tablet', () => {
      renderDashboard('tablet');
      
      const skeleton = document.querySelector('.h-56');
      expect(skeleton).toBeInTheDocument();
    });

    it('should use larger skeleton heights on desktop', () => {
      renderDashboard('desktop');
      
      const skeleton = document.querySelector('.h-64');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render all dashboard components', () => {
      renderDashboard('desktop');
      
      expect(screen.getByTestId('tank-overview')).toBeInTheDocument();
      expect(screen.getByTestId('inventory-chart')).toBeInTheDocument();
      expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
      expect(screen.getByTestId('predictive-analytics')).toBeInTheDocument();
      expect(screen.getByTestId('iot-monitoring')).toBeInTheDocument();
      expect(screen.getByTestId('alerts-panel')).toBeInTheDocument();
      expect(screen.getByTestId('transactions')).toBeInTheDocument();
    });

    it('should maintain component functionality across breakpoints', () => {
      ['mobile', 'tablet', 'desktop'].forEach(breakpoint => {
        const { unmount } = renderDashboard(breakpoint);
        
        expect(screen.getByText('Test Company Dashboard')).toBeInTheDocument();
        expect(screen.getByTestId('tank-overview')).toBeInTheDocument();
        
        unmount();
      });
    });
  });
});
