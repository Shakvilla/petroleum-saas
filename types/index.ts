// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  tenantId: string;
  lastLoginAt: Date;
  preferences: UserPreferences;
  isActive: boolean;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Tenant Types
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  settings: TenantSettings;
  branding: BrandingConfig;
  features: FeatureFlags;
  theme?: TenantThemeConfig;
}

export interface TenantSettings {
  timezone: string;
  currency: string;
  dateFormat: string;
  businessHours: BusinessHours;
  planType?: string;
}

export interface BusinessHours {
  start: string;
  end: string;
  days: number[];
}

export interface BrandingConfig {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  favicon: string;
  tagline?: string;
}

export interface TenantThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  textSecondaryColor?: string;
  borderColor?: string;
  primaryFont?: string;
  secondaryFont?: string;
}

export interface FeatureFlags {
  realTimeUpdates: boolean;
  advancedAnalytics: boolean;
  mobileApp: boolean;
  apiAccess: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta: {
    total?: number;
    page?: number;
    limit?: number;
  };
  errors?: ApiError[];
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// Error Types
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  SYSTEM = 'SYSTEM',
}

export interface ErrorContext {
  type: ErrorType;
  message: string;
  code?: string;
  field?: string;
  timestamp: Date;
  userId?: string;
  tenantId?: string;
  requestId?: string;
  component?: string;
  action?: string;
}

// UI State Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'radio';
  required: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern';
  value?: any;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

// Chart and Data Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

// Tank and Inventory Types
export interface Tank {
  id: string;
  name: string;
  type: TankType;
  capacity: number;
  currentLevel: number;
  status: TankStatus;
  location: Location;
  lastUpdated: Date;
}

export enum TankType {
  GASOLINE = 'GASOLINE',
  DIESEL = 'DIESEL',
  KEROSENE = 'KEROSENE',
  LUBRICANT = 'LUBRICANT',
}

export enum TankStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
  CRITICAL = 'CRITICAL',
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'TANKER' | 'VAN' | 'TRUCK';
  capacity: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  licensePlate: string;
  driver: {
    id: string;
    name: string;
    license: string;
    phone: string;
  };
  lastMaintenance: string;
  nextMaintenance: string;
  mileage: number;
  fuelEfficiency: number;
  tenantId: string;
}

// Delivery and Fleet Types
export interface Delivery {
  id: string;
  vehicleId: string;
  driverId: string;
  route: Route;
  status: DeliveryStatus;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  fuelType: TankType;
  quantity: number;
  address: string;
  customer: string;
  estimatedTime: string;
  priority: string;
  progress: number;
}

export enum DeliveryStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Route {
  id: string;
  name: string;
  waypoints: Waypoint[];
  distance: number;
  estimatedDuration: number;
}

export interface Waypoint {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  order: number;
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: Date;
  tenantId: string;
}

export interface RealTimeUpdate {
  entityType: 'tank' | 'delivery' | 'vehicle' | 'alert';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  data: any;
}

// Transaction Types
export interface Transaction {
  id: string;
  type: 'fuel_sale' | 'fuel_purchase' | 'maintenance' | 'delivery';
  amount: number;
  volume?: number;
  currency: string;
  description: string;
  timestamp: Date;
  tenantId: string;
  userId: string;
  fuelType?: string;
  customer?: { name: string };
  location?: { name: string };
  status?: string;
  metadata?: Record<string, any>;
}

// Alert Types
export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  entityType: 'tank' | 'vehicle' | 'delivery' | 'system';
  entityId: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  tenantId: string;
  status?: 'ACTIVE' | 'RESOLVED' | 'ACKNOWLEDGED';
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}
