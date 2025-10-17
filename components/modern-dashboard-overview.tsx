'use client';

import { Suspense, lazy, memo } from 'react';
import { useTenant } from '@/components/tenant-provider';
import { useTenantQuery } from '@/hooks/use-tenant-query';
import { ProtectedComponent } from '@/components/protected-component';
import { useResponsive } from '@/components/responsive-provider';
import { cn } from '@/lib/utils';
import {
  TenantAwareCard,
  TenantAwareCardContent,
  TenantAwareCardDescription,
  TenantAwareCardHeader,
  TenantAwareCardTitle,
} from '@/components/ui/tenant-aware-card';
import { TenantAwareBadge } from '@/components/ui/tenant-aware-badge';
import { TenantAwareButton } from '@/components/ui/tenant-aware-button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Fuel,
  TrendingUp,
  TrendingDown,
  Truck,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Droplets,
  Activity,
  Target,
} from 'lucide-react';

// Lazy load heavy components
const ModernInventoryChart = lazy(() =>
  import('@/components/modern-inventory-chart').then(m => ({
    default: m.ModernInventoryChart,
  }))
);
const ModernSalesChart = lazy(() =>
  import('@/components/modern-sales-chart').then(m => ({
    default: m.ModernSalesChart,
  }))
);
const ModernTransactions = lazy(() =>
  import('@/components/modern-transactions').then(m => ({
    default: m.ModernTransactions,
  }))
);
const ModernAlertsPanel = lazy(() =>
  import('@/components/modern-alerts-panel').then(m => ({
    default: m.ModernAlertsPanel,
  }))
);

interface ModernDashboardOverviewProps {
  tenant?: string;
}

export const ModernDashboardOverview = memo(function ModernDashboardOverview({
  tenant: propTenant,
}: ModernDashboardOverviewProps) {
  const { tenant } = useTenant();
  const currentTenant = propTenant || tenant?.id;
  const { isMobile, isTablet } = useResponsive();

  // Load dashboard data
  const { data: dashboardData, isLoading } = useTenantQuery(
    ['dashboard', 'overview'],
    async () => {
      const response = await fetch(`/api/tenants/${currentTenant}/dashboard`);
      if (!response.ok) throw new Error('Failed to load dashboard');
      return response.json();
    },
    {
      enabled: !!currentTenant,
    }
  );

  const stats = [
    {
      name: 'Total Revenue',
      value: '$2.84M',
      fullValue: '$2,847,392',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      description: 'vs last month',
    },
    {
      name: 'Fuel Inventory',
      value: '847K L',
      fullValue: '847,293 L',
      change: '-2.3%',
      changeType: 'decrease',
      icon: Fuel,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      description: 'total capacity',
    },
    {
      name: 'Active Deliveries',
      value: '23',
      fullValue: '23',
      change: '+5.2%',
      changeType: 'increase',
      icon: Truck,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      description: 'in transit',
    },
    {
      name: 'Daily Sales',
      value: '157K L',
      fullValue: '156,847 L',
      change: '+8.1%',
      changeType: 'increase',
      icon: BarChart3,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      description: "today's volume",
    },
  ];

  const tankLevels = [
    {
      name: 'Premium Gasoline',
      level: 78,
      capacity: 50000,
      current: 39000,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      status: 'optimal',
    },
    {
      name: 'Regular Gasoline',
      level: 45,
      capacity: 75000,
      current: 33750,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      status: 'medium',
    },
    {
      name: 'Diesel',
      level: 92,
      capacity: 40000,
      current: 36800,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      status: 'high',
    },
    {
      name: 'Kerosene',
      level: 23,
      capacity: 25000,
      current: 5750,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      status: 'critical',
    },
  ];

  const quickActions = [
    {
      name: 'New Delivery',
      icon: Truck,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Add Inventory',
      icon: Fuel,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Generate Report',
      icon: BarChart3,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      name: 'View Alerts',
      icon: AlertTriangle,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden rounded-lg lg:rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 lg:p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-4 -right-4 h-16 w-16 lg:h-24 lg:w-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 h-24 w-24 lg:h-32 lg:w-32 rounded-full bg-white/5 blur-2xl"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Activity className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
              <TenantAwareBadge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 text-xs"
              >
                Live Dashboard
              </TenantAwareBadge>
            </div>
            <h1 className={cn(
              'font-bold mb-2 capitalize',
              isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-2xl lg:text-4xl'
            )}>
              {tenant?.name || currentTenant} Petroleum Operations
            </h1>
            <p className={cn(
              'text-blue-100',
              isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm lg:text-lg'
            )}>
              Real-time monitoring and management of your petroleum distribution
              network
            </p>
          </div>
          <div className={cn(
            'flex flex-wrap',
            isMobile ? 'gap-1' : isTablet ? 'gap-2' : 'gap-2 lg:gap-3'
          )}>
            {quickActions.map(action => (
              <TenantAwareButton
                key={action.name}
                className={cn(
                  `${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`,
                  isMobile ? 'text-xs' : isTablet ? 'text-xs' : 'text-xs lg:text-sm'
                )}
                size="sm"
              >
                <action.icon className={cn(
                  'mr-1 h-3 w-3',
                  isMobile ? 'mr-1' : isTablet ? 'mr-1' : 'mr-1 lg:mr-2 lg:h-4 lg:w-4'
                )} />
                <span className={cn(
                  isMobile ? 'hidden' : isTablet ? 'inline' : 'hidden sm:inline'
                )}>
                  {action.name}
                </span>
              </TenantAwareButton>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Modern Stats Grid */}
      <div className={cn(
        'grid gap-4',
        isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4',
        isMobile ? 'gap-3' : isTablet ? 'gap-4' : 'gap-4 lg:gap-6'
      )}>
        {stats.map(stat => (
          <TenantAwareCard
            key={stat.name}
            className="relative overflow-hidden bg-white border border-gray-200  hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <TenantAwareCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TenantAwareCardTitle className={cn(
                'font-medium text-gray-600 truncate pr-2',
                isMobile ? 'text-xs' : isTablet ? 'text-xs' : 'text-xs lg:text-sm'
              )}>
                {stat.name}
              </TenantAwareCardTitle>
              <div
                className={cn(
                  `rounded-xl ${stat.iconBg} flex-shrink-0`,
                  isMobile ? 'p-1' : isTablet ? 'p-1.5' : 'p-1.5 lg:p-2'
                )}
              >
                <stat.icon
                  className={cn(
                    `${stat.iconColor}`,
                    isMobile ? 'h-3 w-3' : isTablet ? 'h-3 w-3' : 'h-3 w-3 lg:h-4 lg:w-4'
                  )}
                />
              </div>
            </TenantAwareCardHeader>
            <TenantAwareCardContent>
              <div
                className={cn(
                  'font-bold text-gray-900 mb-1',
                  isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-xl lg:text-3xl'
                )}
                title={stat.fullValue}
              >
                {stat.value}
              </div>
              <div className="flex items-center justify-between">
                <div className={cn(
                  'flex items-center',
                  isMobile ? 'text-xs' : isTablet ? 'text-xs' : 'text-xs lg:text-sm'
                )}>
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className={cn(
                      'mr-1 text-emerald-500',
                      isMobile ? 'h-3 w-3' : isTablet ? 'h-3 w-3' : 'h-3 w-3 lg:h-4 lg:w-4'
                    )} />
                  ) : (
                    <TrendingDown className={cn(
                      'mr-1 text-red-500',
                      isMobile ? 'h-3 w-3' : isTablet ? 'h-3 w-3' : 'h-3 w-3 lg:h-4 lg:w-4'
                    )} />
                  )}
                  <span
                    className={
                      stat.changeType === 'increase'
                        ? 'text-emerald-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {stat.change}
                  </span>
                </div>
                <span className={cn(
                  'text-gray-500',
                  isMobile ? 'text-xs hidden' : isTablet ? 'text-xs' : 'text-xs hidden sm:block'
                )}>
                  {stat.description}
                </span>
              </div>
            </TenantAwareCardContent>
          </TenantAwareCard>
        ))}
      </div>

      {/* Responsive Main Content Grid */}
      <div className={cn(
        'grid gap-6',
        isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-3',
        isMobile ? 'gap-4' : isTablet ? 'gap-6' : 'gap-6 lg:gap-8'
      )}>
        {/* Modern Tank Levels */}
        <ProtectedComponent resource="tanks" action="read">
          <TenantAwareCard className={cn(
            'border-gray-100 hover:shadow-lg hover:cursor-pointer bg-white',
            isMobile ? 'col-span-1' : isTablet ? 'col-span-1' : 'xl:col-span-1'
          )}>
            <TenantAwareCardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <TenantAwareCardTitle className={cn(
                    'font-bold text-gray-900',
                    isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-lg lg:text-xl'
                  )}>
                    Tank Levels
                  </TenantAwareCardTitle>
                  <TenantAwareCardDescription className={cn(
                    'text-gray-600',
                    isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm'
                  )}>
                    Real-time fuel inventory status
                  </TenantAwareCardDescription>
                </div>
                <div className={cn(
                  'bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl',
                  isMobile ? 'p-1.5' : isTablet ? 'p-2' : 'p-2'
                )}>
                  <Droplets className={cn(
                    'text-white',
                    isMobile ? 'h-3 w-3' : isTablet ? 'h-4 w-4' : 'h-4 w-4 lg:h-5 lg:w-5'
                  )} />
                </div>
              </div>
            </TenantAwareCardHeader>
            <TenantAwareCardContent className={cn(
              'space-y-4',
              isMobile ? 'space-y-3' : isTablet ? 'space-y-4' : 'space-y-4 lg:space-y-6'
            )}>
              {tankLevels.map(tank => (
                <div
                  key={tank.name}
                  className={cn(
                    `rounded-2xl ${tank.bgColor} border border-gray-200/50`,
                    isMobile ? 'p-2' : isTablet ? 'p-3' : 'p-3 lg:p-4'
                  )}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className={cn(
                      'font-semibold text-gray-900 truncate pr-2',
                      isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm lg:text-base'
                    )}>
                      {tank.name}
                    </span>
                    <TenantAwareBadge
                      variant={
                        tank.status === 'critical'
                          ? 'destructive'
                          : tank.status === 'optimal'
                            ? 'default'
                            : 'secondary'
                      }
                      className={cn(
                        'font-medium flex-shrink-0',
                        isMobile ? 'text-xs' : 'text-xs'
                      )}
                    >
                      {tank.status}
                    </TenantAwareBadge>
                  </div>

                  <div className="space-y-2">
                    <div className={cn(
                      'flex justify-between text-gray-600',
                      isMobile ? 'text-xs' : isTablet ? 'text-xs' : 'text-xs lg:text-sm'
                    )}>
                      <span>{tank.current.toLocaleString()}L</span>
                      <span>{tank.capacity.toLocaleString()}L</span>
                    </div>

                    <div className="relative">
                      <Progress
                        value={tank.level}
                        className={cn(
                          'bg-gray-200',
                          isMobile ? 'h-1.5' : isTablet ? 'h-2' : 'h-2 lg:h-3'
                        )}
                      />
                      <div
                        className={cn(
                          `absolute top-0 left-0 rounded-full bg-gradient-to-r ${tank.color} transition-all duration-500`,
                          isMobile ? 'h-1.5' : isTablet ? 'h-2' : 'h-2 lg:h-3'
                        )}
                        style={{ width: `${tank.level}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={cn(
                        'font-medium text-gray-700',
                        isMobile ? 'text-xs' : isTablet ? 'text-xs' : 'text-xs lg:text-sm'
                      )}>
                        {tank.level}% Full
                      </span>
                      <div className="flex items-center space-x-1">
                        <Target className={cn(
                          'text-gray-400',
                          isMobile ? 'h-2.5 w-2.5' : isTablet ? 'h-3 w-3' : 'h-3 w-3'
                        )} />
                        <span className={cn(
                          'text-gray-500',
                          isMobile ? 'text-xs' : 'text-xs'
                        )}>
                          Target: 80%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TenantAwareCardContent>
          </TenantAwareCard>
        </ProtectedComponent>

        {/* Responsive Charts */}
        <div className={cn(
          'space-y-6',
          isMobile ? 'col-span-1' : isTablet ? 'col-span-1' : 'xl:col-span-2',
          isMobile ? 'space-y-4' : isTablet ? 'space-y-6' : 'space-y-6 lg:space-y-8'
        )}>
          <ProtectedComponent resource="inventory" action="read">
            <Suspense fallback={<Skeleton className={cn(
              'w-full',
              isMobile ? 'h-[200px]' : isTablet ? 'h-[250px]' : 'h-[300px]'
            )} />}>
              <ModernInventoryChart />
            </Suspense>
          </ProtectedComponent>
        </div>
      </div>
      
      {/* Responsive Sales Chart */}
      <div className="grid grid-cols-1">
        <ProtectedComponent resource="sales" action="read">
          <Suspense fallback={<Skeleton className={cn(
            'w-full',
            isMobile ? 'h-[200px]' : isTablet ? 'h-[250px]' : 'h-[300px]'
          )} />}>
            <ModernSalesChart />
          </Suspense>
        </ProtectedComponent>
      </div>

      {/* Responsive Bottom Grid */}
      <div className={cn(
        'grid gap-6',
        isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2',
        isMobile ? 'gap-4' : isTablet ? 'gap-6' : 'gap-6 lg:gap-8'
      )}>
        <ProtectedComponent resource="transactions" action="read">
          <Suspense fallback={<Skeleton className={cn(
            'w-full',
            isMobile ? 'h-[300px]' : isTablet ? 'h-[350px]' : 'h-[400px]'
          )} />}>
            <ModernTransactions />
          </Suspense>
        </ProtectedComponent>
        <ProtectedComponent resource="alerts" action="read">
          <Suspense fallback={<Skeleton className={cn(
            'w-full',
            isMobile ? 'h-[300px]' : isTablet ? 'h-[350px]' : 'h-[400px]'
          )} />}>
            <ModernAlertsPanel />
          </Suspense>
        </ProtectedComponent>
      </div>
    </div>
  );
});
