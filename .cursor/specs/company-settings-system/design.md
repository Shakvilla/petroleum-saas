# Design Document

## Overview

This design document outlines the architecture and implementation approach for a comprehensive company settings system in the petroleum SaaS application. The system will provide a centralized, secure, and user-friendly interface for managing all aspects of company configuration, from basic profile information to complex security and compliance settings.

## Architecture

### System Architecture

The company settings system follows a modular, component-based architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Settings Dashboard                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Profile   │ │ Operations  │ │  Security   │ │  ...    │ │
│  │   Module    │ │   Module    │ │   Module    │ │         │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│                Settings State Management                    │
├─────────────────────────────────────────────────────────────┤
│              API Layer & Data Validation                    │
├─────────────────────────────────────────────────────────────┤
│                Backend Services                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
SettingsPage
├── SettingsNavigation
├── SettingsContent
│   ├── CompanyProfileSettings
│   ├── BusinessOperationsSettings
│   ├── SecuritySettings
│   ├── IntegrationSettings
│   ├── NotificationSettings
│   ├── ComplianceSettings
│   ├── BrandingSettings
│   └── DataManagementSettings
└── SettingsFooter
```

## Components and Interfaces

### Core Settings Components

#### 1. SettingsPage (Main Container)

```typescript
interface SettingsPageProps {
  tenant: string;
}

interface SettingsState {
  activeTab: SettingsTab;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: Record<string, string[]>;
}
```

#### 2. SettingsNavigation

```typescript
interface SettingsNavigationProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  hasUnsavedChanges: boolean;
}

enum SettingsTab {
  PROFILE = 'profile',
  OPERATIONS = 'operations',
  SECURITY = 'security',
  INTEGRATIONS = 'integrations',
  NOTIFICATIONS = 'notifications',
  COMPLIANCE = 'compliance',
  BRANDING = 'branding',
  DATA_MANAGEMENT = 'data-management',
}
```

#### 3. Company Profile Settings

```typescript
interface CompanyProfileData {
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

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
```

#### 4. Business Operations Settings

```typescript
interface BusinessOperationsData {
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

enum FuelType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  KEROSENE = 'kerosene',
  LUBRICANT = 'lubricant',
  JET_FUEL = 'jet_fuel',
}

interface TemperatureRange {
  min: number;
  max: number;
  unit: 'celsius' | 'fahrenheit';
}
```

#### 5. Security Settings

```typescript
interface SecuritySettingsData {
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

interface SSOConfiguration {
  entityId: string;
  ssoUrl: string;
  certificate: string;
  attributeMapping: Record<string, string>;
}

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number; // days
  historyCount: number;
}

interface IPRestriction {
  ipAddress: string;
  description: string;
  isActive: boolean;
}

enum AccessLevel {
  NONE = 'none',
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
}
```

#### 6. Integration Settings

```typescript
interface IntegrationSettingsData {
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

interface ERPIntegration {
  id: string;
  name: string;
  type: 'sap' | 'oracle' | 'microsoft' | 'custom';
  connectionString: string;
  isActive: boolean;
  syncSchedule: string;
  lastSync: Date;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  expiresAt?: Date;
  isActive: boolean;
  lastUsed?: Date;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  retryPolicy: RetryPolicy;
}

interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential';
  initialDelay: number;
}
```

#### 7. Notification Settings

```typescript
interface NotificationSettingsData {
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

interface EmailNotificationConfig {
  enabled: boolean;
  smtpServer: string;
  smtpPort: number;
  username: string;
  fromAddress: string;
  replyToAddress: string;
}

interface InventoryAlertThresholds {
  lowLevel: number;
  criticalLevel: number;
  temperatureHigh: number;
  temperatureLow: number;
  pressureHigh: number;
  pressureLow: number;
}

interface EscalationChain {
  id: string;
  name: string;
  steps: EscalationStep[];
  isActive: boolean;
}

interface EscalationStep {
  order: number;
  contactType: 'email' | 'sms' | 'phone';
  contact: string;
  delayMinutes: number;
  condition: string;
}
```

#### 8. Compliance Settings

```typescript
interface ComplianceSettingsData {
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

interface EPACompliance {
  enabled: boolean;
  reportingRequirements: string[];
  inspectionSchedule: string;
  documentationRequired: string[];
}

interface AutomatedReport {
  id: string;
  name: string;
  type: 'inventory' | 'delivery' | 'safety' | 'compliance';
  schedule: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  isActive: boolean;
}

interface EmergencyProcedure {
  id: string;
  name: string;
  description: string;
  steps: string[];
  contactInformation: string[];
  isActive: boolean;
}
```

#### 9. Branding Settings

```typescript
interface BrandingSettingsData {
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
}

interface LogoConfig {
  primary: string;
  secondary?: string;
  favicon: string;
  sizes: {
    small: string;
    medium: string;
    large: string;
  };
}

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  success: string;
  warning: string;
  error: string;
}

interface DashboardLayout {
  defaultWidgets: string[];
  widgetPositions: Record<string, WidgetPosition>;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'auto';
}

interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

#### 10. Data Management Settings

```typescript
interface DataManagementSettingsData {
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

interface BackupSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  days: number[];
  isActive: boolean;
}

interface BackupRetention {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

interface ExportFormat {
  type: 'csv' | 'excel' | 'json' | 'xml';
  name: string;
  isActive: boolean;
}

interface DataRetentionPolicy {
  dataType: string;
  retentionPeriod: number;
  unit: 'days' | 'months' | 'years';
  action: 'delete' | 'archive' | 'anonymize';
}
```

## Data Models

### Settings State Management

```typescript
interface SettingsState {
  // Current active tab
  activeTab: SettingsTab;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;

  // Form state
  hasUnsavedChanges: boolean;
  validationErrors: Record<string, string[]>;

  // Data
  settingsData: {
    profile: CompanyProfileData;
    operations: BusinessOperationsData;
    security: SecuritySettingsData;
    integrations: IntegrationSettingsData;
    notifications: NotificationSettingsData;
    compliance: ComplianceSettingsData;
    branding: BrandingSettingsData;
    dataManagement: DataManagementSettingsData;
  };

  // UI state
  expandedSections: string[];
  showAdvancedOptions: boolean;
}
```

### API Response Models

```typescript
interface SettingsResponse {
  success: boolean;
  data: SettingsData;
  message?: string;
  errors?: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface SettingsUpdateRequest {
  section: SettingsTab;
  data: Partial<SettingsData>;
  version: number; // For optimistic locking
}
```

## Error Handling

### Validation Strategy

```typescript
interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'url' | 'number' | 'date' | 'custom';
  message: string;
  validator?: (value: any) => boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}
```

### Error Recovery

- **Network Errors**: Retry mechanism with exponential backoff
- **Validation Errors**: Inline field validation with clear error messages
- **Concurrent Updates**: Optimistic locking with conflict resolution
- **Permission Errors**: Graceful degradation with appropriate messaging

## Testing Strategy

### Unit Tests

- Component rendering and interaction
- Form validation logic
- State management functions
- Utility functions and helpers

### Integration Tests

- API integration and data flow
- Cross-component communication
- Settings persistence and retrieval
- Permission-based access control

### End-to-End Tests

- Complete settings workflow
- Multi-user concurrent access
- Data validation and error handling
- Settings impact on other system components

### Performance Tests

- Large dataset handling
- Concurrent user scenarios
- Memory usage optimization
- Response time benchmarks

## Security Considerations

### Data Protection

- Encryption of sensitive settings data
- Secure transmission of configuration data
- Access control and audit logging
- Data anonymization for compliance

### Input Validation

- Server-side validation for all inputs
- XSS and injection attack prevention
- File upload security for logos and documents
- API rate limiting and abuse prevention

### Access Control

- Role-based access to different settings sections
- Multi-factor authentication for sensitive changes
- Session management and timeout
- IP restrictions for administrative access
