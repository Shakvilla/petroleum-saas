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

// Tenant Types
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  settings: TenantSettings;
  branding: BrandingConfig;
  features: FeatureFlags;
}

export interface TenantSettings {
  timezone: string;
  currency: string;
  dateFormat: string;
  businessHours: BusinessHours;
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
