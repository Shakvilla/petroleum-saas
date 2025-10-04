// Documentation: /docs/components/index.md

// Modern Dashboard Components
export { ModernDashboardOverview } from './modern-dashboard-overview';
export { ModernTankOverview } from './modern-tank-overview';
export { ModernInventoryAlerts } from './modern-inventory-alerts';
export { ModernInventoryHistory } from './modern-inventory-history';
export { ModernIoTMonitoring } from './modern-iot-monitoring';
export { ModernPredictiveAnalytics } from './modern-predictive-analytics';
export { ModernSalesChart } from './modern-sales-chart';
export { ModernTransactions } from './modern-transactions';

// Management Components
export { InventoryManagement } from './inventory-management';
export { FleetTracker } from './fleet-tracker';
export { RouteOptimizer } from './route-optimizer';
export { DistributionManagement } from './distribution-management';

// Auth Components
export { default as LoginPage } from './auth/login-page';
export { default as RegisterPage } from './auth/register-page';
export { default as ForgotPasswordPage } from './auth/forgot-password-page';

// Layout Components
export { DashboardLayout } from './dashboard-layout';
export { TenantProvider } from './tenant-provider';
export { ThemeProvider } from './theme-provider';

// UI Components
export {
  ErrorBoundary,
  withErrorBoundary,
  ComponentErrorBoundary,
  CriticalErrorBoundary,
} from './error-boundary';
export {
  CardSkeleton,
  TableSkeleton,
  ChartSkeleton,
  ListSkeleton,
  LoadingSpinner,
  LoadingProgress,
  LoadingButton,
  PageLoadingOverlay,
  InlineLoading,
} from './loading-states';
export {
  EmptyState,
  NoDataEmptyState,
  NoSearchResultsEmptyState,
  ErrorEmptyState,
  NoPermissionsEmptyState,
  NoTanksEmptyState,
  NoDeliveriesEmptyState,
  NoAnalyticsEmptyState,
  NoUsersEmptyState,
} from './empty-states';
export { OfflineIndicator } from './offline-indicator';
export { PerformanceMonitor } from './performance-monitor';
export { RealtimeNotifications } from './realtime-notifications';

// User Management
export { UsersPageContent } from './users/users-page-content';
export { UsersTable } from './users/users-table';
export { UserCreateDialog } from './users/user-create-dialog';
export { UserEditDialog } from './users/user-edit-dialog';
export { UserDeleteDialog } from './users/user-delete-dialog';
export { UserViewDialog } from './users/user-view-dialog';

// Protected Components
export {
  ProtectedComponent,
  FeatureGate,
  PermissionGate,
} from './protected-component';

// Route Progress Bar
export { default as RouteProgressBar } from './route-progress-bar';
