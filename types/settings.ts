// Settings Types for Company Settings System

import type {
  ThemeCustomization,
  ValidationResults,
  ThemeHistoryEntry,
} from './theme-presets';

// Core Settings Types
export enum SettingsTab {
  PROFILE = 'profile',
  OPERATIONS = 'operations',
  SECURITY = 'security',
  INTEGRATIONS = 'integrations',
  NOTIFICATIONS = 'notifications',
  COMPLIANCE = 'compliance',
  BRANDING = 'branding',
  DATA_MANAGEMENT = 'data-management',
}

// Company Profile Settings
export interface CompanyProfileData {
  // Basic Information
  companyName: string;
  legalName: string;
  industry: string;
  businessRegistration: {
    registrationNumber: string;
    taxId: string;
    incorporationDate: Date;
    jurisdiction: string;
  };

  // Contact Information
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    address: Address;
  };

  // Business Details
  companySize: 'small' | 'medium' | 'large' | 'enterprise';
  employeeCount: number;
  operationalRegions: string[];
  businessType: 'distributor' | 'retailer' | 'wholesaler' | 'mixed';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Business Operations Settings
export interface BusinessOperationsData {
  // Business Hours
  businessHours: {
    [key: string]: {
      start: string;
      end: string;
      isActive: boolean;
    };
  };

  // Operational Parameters
  operationalParams: {
    fuelTypes: FuelType[];
    capacityLimits: {
      maxTankCapacity: number;
      maxDeliveryCapacity: number;
      maxFleetSize: number;
    };
    safetyThresholds: {
      lowInventoryAlert: number;
      criticalInventoryAlert: number;
      temperatureAlerts: TemperatureRange;
    };
  };

  // Workflow Settings
  workflowSettings: {
    approvalProcesses: {
      deliveryApproval: boolean;
      inventoryAdjustment: boolean;
      userManagement: boolean;
    };
    notificationTriggers: {
      inventoryAlerts: boolean;
      deliveryUpdates: boolean;
      maintenanceReminders: boolean;
    };
  };
}

export enum FuelType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  KEROSENE = 'kerosene',
  LUBRICANT = 'lubricant',
  JET_FUEL = 'jet_fuel',
}

export interface TemperatureRange {
  min: number;
  max: number;
  unit: 'celsius' | 'fahrenheit';
}

// Security Settings
export interface SecuritySettingsData {
  // Authentication
  authentication: {
    ssoEnabled: boolean;
    ssoProvider?: 'saml' | 'oidc' | 'oauth2';
    ssoConfig?: SSOConfiguration;
    twoFactorRequired: boolean;
    passwordPolicy: PasswordPolicy;
  };

  // Session Management
  sessionManagement: {
    sessionTimeout: number; // minutes
    concurrentSessionLimit: number;
    ipRestrictions: IPRestriction[];
    rememberMeEnabled: boolean;
  };

  // Access Control
  accessControl: {
    roleBasedAccess: boolean;
    featureAccessLevels: Record<string, AccessLevel>;
    apiAccessControl: boolean;
    dataExportPermissions: boolean;
  };

  // Audit and Compliance
  auditSettings: {
    auditLogging: boolean;
    logRetentionDays: number;
    complianceReporting: boolean;
    dataAnonymization: boolean;
  };
}

export interface SSOConfiguration {
  entityId: string;
  ssoUrl: string;
  certificate: string;
  attributeMapping: Record<string, string>;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number; // days
  historyCount: number;
}

export interface IPRestriction {
  ipAddress: string;
  description: string;
  isActive: boolean;
}

export enum AccessLevel {
  NONE = 'none',
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
}

// Integration Settings
export interface IntegrationSettingsData {
  // External Integrations
  externalIntegrations: {
    erpSystems: ERPIntegration[];
    accountingSystems: AccountingIntegration[];
    iotDevices: IoTDeviceIntegration[];
    thirdPartyServices: ThirdPartyIntegration[];
  };

  // API Management
  apiManagement: {
    apiKeys: APIKey[];
    rateLimits: RateLimit[];
    webhooks: Webhook[];
    dataSync: DataSyncConfiguration[];
  };
}

export interface ERPIntegration {
  id: string;
  name: string;
  type: 'sap' | 'oracle' | 'microsoft' | 'custom';
  connectionString: string;
  isActive: boolean;
  syncSchedule: string;
  lastSync: Date;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  expiresAt?: Date;
  isActive: boolean;
  lastUsed?: Date;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  retryPolicy: RetryPolicy;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential';
  initialDelay: number;
}

// Notification Settings
export interface NotificationSettingsData {
  // Notification Channels
  channels: {
    email: EmailNotificationConfig;
    sms: SMSNotificationConfig;
    inApp: InAppNotificationConfig;
    push: PushNotificationConfig;
  };

  // Alert Thresholds
  alertThresholds: {
    inventory: InventoryAlertThresholds;
    delivery: DeliveryAlertThresholds;
    safety: SafetyAlertThresholds;
    system: SystemAlertThresholds;
  };

  // Communication Templates
  templates: {
    email: EmailTemplate[];
    sms: SMSTemplate[];
    inApp: InAppTemplate[];
  };

  // Escalation Procedures
  escalation: {
    chains: EscalationChain[];
    responseTimes: ResponseTimeConfig[];
    emergencyContacts: EmergencyContact[];
  };
}

export interface EmailNotificationConfig {
  enabled: boolean;
  smtpServer: string;
  smtpPort: number;
  username: string;
  fromAddress: string;
  replyToAddress: string;
}

export interface InventoryAlertThresholds {
  lowLevel: number;
  criticalLevel: number;
  temperatureHigh: number;
  temperatureLow: number;
  pressureHigh: number;
  pressureLow: number;
}

export interface EscalationChain {
  id: string;
  name: string;
  steps: EscalationStep[];
  isActive: boolean;
}

export interface EscalationStep {
  order: number;
  contactType: 'email' | 'sms' | 'phone';
  contact: string;
  delayMinutes: number;
  condition: string;
}

// Compliance Settings
export interface ComplianceSettingsData {
  // Regulatory Standards
  regulatoryStandards: {
    epa: EPACompliance;
    osha: OSHACompliance;
    dot: DOTCompliance;
    local: LocalCompliance[];
  };

  // Reporting Requirements
  reporting: {
    automatedReports: AutomatedReport[];
    reportSchedules: ReportSchedule[];
    dataRetention: DataRetentionPolicy;
  };

  // Safety Protocols
  safetyProtocols: {
    emergencyProcedures: EmergencyProcedure[];
    contactInformation: EmergencyContact[];
    safetyTraining: SafetyTraining[];
  };
}

export interface EPACompliance {
  enabled: boolean;
  reportingRequirements: string[];
  inspectionSchedule: string;
  documentationRequired: string[];
}

export interface AutomatedReport {
  id: string;
  name: string;
  type: 'inventory' | 'delivery' | 'safety' | 'compliance';
  schedule: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  isActive: boolean;
}

export interface EmergencyProcedure {
  id: string;
  name: string;
  description: string;
  steps: string[];
  contactInformation: string[];
  isActive: boolean;
}

// Branding Settings
export interface BrandingSettingsData {
  // Visual Branding
  visualBranding: {
    logo: LogoConfig;
    colorScheme: ColorScheme;
    typography: TypographyConfig;
    favicon: string;
  };

  // Display Preferences
  displayPreferences: {
    dashboardLayout: DashboardLayout;
    defaultViews: DefaultView[];
    featureVisibility: FeatureVisibility;
  };

  // Localization
  localization: {
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
    timezone: string;
    numberFormat: NumberFormat;
  };

  // Theme Management (New)
  themeManagement?: {
    currentPresetId?: string;
    customizations?: ThemeCustomization;
    validationResults?: ValidationResults;
    history?: ThemeHistoryEntry[];
    lastApplied?: Date;
    lastModified?: Date;
  };
}

export interface LogoConfig {
  primary: string;
  secondary?: string;
  favicon: string;
  sizes: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface DashboardLayout {
  defaultWidgets: string[];
  widgetPositions: Record<string, WidgetPosition>;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Data Management Settings
export interface DataManagementSettingsData {
  // Backup Configuration
  backup: {
    schedule: BackupSchedule;
    retention: BackupRetention;
    storage: BackupStorage;
    encryption: BackupEncryption;
  };

  // Data Export
  dataExport: {
    formats: ExportFormat[];
    schedules: ExportSchedule[];
    delivery: ExportDelivery;
  };

  // Data Retention
  dataRetention: {
    policies: DataRetentionPolicy[];
    automaticCleanup: boolean;
    archiveSettings: ArchiveSettings;
  };

  // Privacy and GDPR
  privacy: {
    gdprCompliance: boolean;
    dataAnonymization: boolean;
    rightToErasure: boolean;
    dataPortability: boolean;
  };
}

export interface BackupSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  days: number[];
  isActive: boolean;
}

export interface BackupRetention {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface ExportFormat {
  type: 'csv' | 'excel' | 'json' | 'xml';
  name: string;
  isActive: boolean;
}

export interface DataRetentionPolicy {
  dataType: string;
  retentionPeriod: number;
  unit: 'days' | 'months' | 'years';
  action: 'delete' | 'archive' | 'anonymize';
}

// Combined Settings Data
export interface SettingsData {
  profile: CompanyProfileData;
  operations: BusinessOperationsData;
  security: SecuritySettingsData;
  integrations: IntegrationSettingsData;
  notifications: NotificationSettingsData;
  compliance: ComplianceSettingsData;
  branding: BrandingSettingsData;
  dataManagement: DataManagementSettingsData;
}

// Settings State Management
export interface SettingsState {
  // Current active tab
  activeTab: SettingsTab;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;

  // Form state
  hasUnsavedChanges: boolean;
  validationErrors: Record<string, string[]>;

  // Data
  settingsData: SettingsData;

  // UI state
  expandedSections: string[];
  showAdvancedOptions: boolean;
}

// API Response Models
export interface SettingsResponse {
  success: boolean;
  data: SettingsData;
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface SettingsUpdateRequest {
  section: SettingsTab;
  data: Partial<SettingsData>;
  version: number; // For optimistic locking
}

// Validation Types
export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'url' | 'number' | 'date' | 'custom';
  message: string;
  validator?: (value: any) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Additional types for completeness
export interface AccountingIntegration {
  id: string;
  name: string;
  type: string;
  connectionString: string;
  isActive: boolean;
}

export interface IoTDeviceIntegration {
  id: string;
  name: string;
  type: string;
  connectionString: string;
  isActive: boolean;
}

export interface ThirdPartyIntegration {
  id: string;
  name: string;
  type: string;
  connectionString: string;
  isActive: boolean;
}

export interface RateLimit {
  id: string;
  name: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
}

export interface DataSyncConfiguration {
  id: string;
  name: string;
  source: string;
  destination: string;
  schedule: string;
  isActive: boolean;
}

export interface SMSNotificationConfig {
  enabled: boolean;
  provider: string;
  apiKey: string;
  fromNumber: string;
}

export interface InAppNotificationConfig {
  enabled: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
}

export interface PushNotificationConfig {
  enabled: boolean;
  serviceWorkerUrl: string;
  vapidKey: string;
}

export interface DeliveryAlertThresholds {
  delayMinutes: number;
  routeDeviation: number;
  fuelLevelLow: number;
}

export interface SafetyAlertThresholds {
  temperatureHigh: number;
  temperatureLow: number;
  pressureHigh: number;
  pressureLow: number;
  leakDetection: boolean;
}

export interface SystemAlertThresholds {
  diskUsage: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  variables: string[];
}

export interface InAppTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  variables: string[];
}

export interface ResponseTimeConfig {
  alertType: string;
  responseTimeMinutes: number;
  escalationTimeMinutes: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface OSHACompliance {
  enabled: boolean;
  reportingRequirements: string[];
  inspectionSchedule: string;
  documentationRequired: string[];
}

export interface DOTCompliance {
  enabled: boolean;
  reportingRequirements: string[];
  inspectionSchedule: string;
  documentationRequired: string[];
}

export interface LocalCompliance {
  id: string;
  name: string;
  enabled: boolean;
  reportingRequirements: string[];
  inspectionSchedule: string;
  documentationRequired: string[];
}

export interface ReportSchedule {
  id: string;
  name: string;
  frequency: string;
  recipients: string[];
  format: string;
  isActive: boolean;
}

export interface SafetyTraining {
  id: string;
  name: string;
  description: string;
  frequency: string;
  isRequired: boolean;
}

export interface DefaultView {
  id: string;
  name: string;
  path: string;
  isDefault: boolean;
}

export interface FeatureVisibility {
  [key: string]: boolean;
}

export interface NumberFormat {
  decimalSeparator: string;
  thousandsSeparator: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
}

export interface TypographyConfig {
  fontFamily: string;
  headingFont?: string;
  fontSizes: Record<string, string>;
  fontWeight: Record<string, string>;
  lineHeight: Record<string, string>;
}

export interface BackupStorage {
  type: 'local' | 'cloud' | 'hybrid';
  location: string;
  credentials: Record<string, string>;
}

export interface BackupEncryption {
  enabled: boolean;
  algorithm: string;
  keyRotation: number; // days
}

export interface ExportSchedule {
  id: string;
  name: string;
  frequency: string;
  format: string;
  recipients: string[];
  isActive: boolean;
}

export interface ExportDelivery {
  method: 'email' | 'ftp' | 'api';
  destination: string;
  credentials: Record<string, string>;
}

export interface ArchiveSettings {
  enabled: boolean;
  location: string;
  compression: boolean;
  encryption: boolean;
}
