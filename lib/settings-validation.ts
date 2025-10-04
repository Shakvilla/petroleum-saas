import { z } from 'zod';
import type {
  CompanyProfileData,
  BusinessOperationsData,
  SecuritySettingsData,
  IntegrationSettingsData,
  NotificationSettingsData,
  ComplianceSettingsData,
  BrandingSettingsData,
  DataManagementSettingsData,
} from '@/types/settings';
import { FuelType, AccessLevel } from '@/types/settings';

// Base validation schemas
const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
});

const businessRegistrationSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  incorporationDate: z.date(),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
});

const primaryContactSchema = z.object({
  name: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: addressSchema,
});

// Company Profile Validation
export const companyProfileSchema: z.ZodSchema<CompanyProfileData> = z.object({
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name too long'),
  legalName: z
    .string()
    .min(1, 'Legal name is required')
    .max(100, 'Legal name too long'),
  industry: z.string().min(1, 'Industry is required'),
  businessRegistration: businessRegistrationSchema,
  primaryContact: primaryContactSchema,
  companySize: z.enum(['small', 'medium', 'large', 'enterprise']),
  employeeCount: z.number().min(0, 'Employee count must be positive'),
  operationalRegions: z
    .array(z.string())
    .min(1, 'At least one operational region is required'),
  businessType: z.enum(['distributor', 'retailer', 'wholesaler', 'mixed']),
});

// Business Operations Validation
const businessHoursSchema = z.object({
  start: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  end: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  isActive: z.boolean(),
});

const temperatureRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
  unit: z.enum(['celsius', 'fahrenheit']),
});

const capacityLimitsSchema = z.object({
  maxTankCapacity: z.number().min(0, 'Capacity must be positive'),
  maxDeliveryCapacity: z.number().min(0, 'Capacity must be positive'),
  maxFleetSize: z.number().min(0, 'Fleet size must be positive'),
});

const safetyThresholdsSchema = z.object({
  lowInventoryAlert: z
    .number()
    .min(0)
    .max(100, 'Alert percentage must be between 0-100'),
  criticalInventoryAlert: z
    .number()
    .min(0)
    .max(100, 'Alert percentage must be between 0-100'),
  temperatureAlerts: temperatureRangeSchema,
});

const operationalParamsSchema = z.object({
  fuelTypes: z
    .array(z.nativeEnum(FuelType))
    .min(1, 'At least one fuel type is required'),
  capacityLimits: capacityLimitsSchema,
  safetyThresholds: safetyThresholdsSchema,
});

const approvalProcessesSchema = z.object({
  deliveryApproval: z.boolean(),
  inventoryAdjustment: z.boolean(),
  userManagement: z.boolean(),
});

const notificationTriggersSchema = z.object({
  inventoryAlerts: z.boolean(),
  deliveryUpdates: z.boolean(),
  maintenanceReminders: z.boolean(),
});

const workflowSettingsSchema = z.object({
  approvalProcesses: approvalProcessesSchema,
  notificationTriggers: notificationTriggersSchema,
});

export const businessOperationsSchema: z.ZodSchema<BusinessOperationsData> =
  z.object({
    businessHours: z.object({
      monday: businessHoursSchema,
      tuesday: businessHoursSchema,
      wednesday: businessHoursSchema,
      thursday: businessHoursSchema,
      friday: businessHoursSchema,
      saturday: businessHoursSchema,
      sunday: businessHoursSchema,
    }),
    operationalParams: operationalParamsSchema,
    workflowSettings: workflowSettingsSchema,
  });

// Security Settings Validation
const passwordPolicySchema = z.object({
  minLength: z
    .number()
    .min(6, 'Minimum password length is 6')
    .max(32, 'Maximum password length is 32'),
  requireUppercase: z.boolean(),
  requireLowercase: z.boolean(),
  requireNumbers: z.boolean(),
  requireSpecialChars: z.boolean(),
  maxAge: z
    .number()
    .min(30, 'Password max age must be at least 30 days')
    .max(365, 'Password max age must be at most 365 days'),
  historyCount: z
    .number()
    .min(0, 'History count must be non-negative')
    .max(10, 'History count must be at most 10'),
});

const ssoConfigurationSchema = z.object({
  entityId: z.string().min(1, 'Entity ID is required'),
  ssoUrl: z.string().url('Invalid SSO URL'),
  certificate: z.string().min(1, 'Certificate is required'),
  attributeMapping: z.record(z.string()),
});

const ipRestrictionSchema = z.object({
  ipAddress: z.string().ip('Invalid IP address'),
  description: z.string().min(1, 'Description is required'),
  isActive: z.boolean(),
});

const authenticationSchema = z.object({
  ssoEnabled: z.boolean(),
  ssoProvider: z.enum(['saml', 'oidc', 'oauth2']).optional(),
  ssoConfig: ssoConfigurationSchema.optional(),
  twoFactorRequired: z.boolean(),
  passwordPolicy: passwordPolicySchema,
});

const sessionManagementSchema = z.object({
  sessionTimeout: z
    .number()
    .min(15, 'Session timeout must be at least 15 minutes')
    .max(1440, 'Session timeout must be at most 24 hours'),
  concurrentSessionLimit: z
    .number()
    .min(1, 'Concurrent session limit must be at least 1')
    .max(10, 'Concurrent session limit must be at most 10'),
  ipRestrictions: z.array(ipRestrictionSchema),
  rememberMeEnabled: z.boolean(),
});

const accessControlSchema = z.object({
  roleBasedAccess: z.boolean(),
  featureAccessLevels: z.record(z.nativeEnum(AccessLevel)),
  apiAccessControl: z.boolean(),
  dataExportPermissions: z.boolean(),
});

const auditSettingsSchema = z.object({
  auditLogging: z.boolean(),
  logRetentionDays: z
    .number()
    .min(30, 'Log retention must be at least 30 days')
    .max(2555, 'Log retention must be at most 7 years'),
  complianceReporting: z.boolean(),
  dataAnonymization: z.boolean(),
});

export const securitySettingsSchema: z.ZodSchema<SecuritySettingsData> =
  z.object({
    authentication: authenticationSchema,
    sessionManagement: sessionManagementSchema,
    accessControl: accessControlSchema,
    auditSettings: auditSettingsSchema,
  });

// Integration Settings Validation
const erpIntegrationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Integration name is required'),
  type: z.enum(['sap', 'oracle', 'microsoft', 'custom']),
  connectionString: z.string().min(1, 'Connection string is required'),
  isActive: z.boolean(),
  syncSchedule: z.string().min(1, 'Sync schedule is required'),
  lastSync: z.date(),
});

const apiKeySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'API key name is required'),
  key: z.string().min(1, 'API key is required'),
  permissions: z.array(z.string()),
  expiresAt: z.date().optional(),
  isActive: z.boolean(),
  lastUsed: z.date().optional(),
});

const webhookSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Webhook name is required'),
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'At least one event is required'),
  secret: z.string().min(1, 'Webhook secret is required'),
  isActive: z.boolean(),
  retryPolicy: z.object({
    maxRetries: z.number().min(0).max(10),
    backoffStrategy: z.enum(['linear', 'exponential']),
    initialDelay: z.number().min(1000).max(300000), // 1 second to 5 minutes
  }),
});

export const integrationSettingsSchema: z.ZodSchema<IntegrationSettingsData> =
  z.object({
    externalIntegrations: z.object({
      erpSystems: z.array(erpIntegrationSchema),
      accountingSystems: z.array(z.any()), // Simplified for now
      iotDevices: z.array(z.any()), // Simplified for now
      thirdPartyServices: z.array(z.any()), // Simplified for now
    }),
    apiManagement: z.object({
      apiKeys: z.array(apiKeySchema),
      rateLimits: z.array(z.any()), // Simplified for now
      webhooks: z.array(webhookSchema),
      dataSync: z.array(z.any()), // Simplified for now
    }),
  });

// Notification Settings Validation
const emailNotificationConfigSchema = z.object({
  enabled: z.boolean(),
  smtpServer: z.string().min(1, 'SMTP server is required'),
  smtpPort: z.number().min(1).max(65535, 'Invalid SMTP port'),
  username: z.string().min(1, 'Username is required'),
  fromAddress: z
    .string()
    .email('Invalid from address')
    .min(1, 'From address is required'),
  replyToAddress: z
    .string()
    .email('Invalid reply-to address')
    .min(1, 'Reply-to address is required'),
});

const inventoryAlertThresholdsSchema = z.object({
  lowLevel: z.number().min(0).max(100, 'Low level must be between 0-100'),
  criticalLevel: z
    .number()
    .min(0)
    .max(100, 'Critical level must be between 0-100'),
  temperatureHigh: z
    .number()
    .min(-50)
    .max(100, 'Temperature must be between -50°C and 100°C'),
  temperatureLow: z
    .number()
    .min(-50)
    .max(100, 'Temperature must be between -50°C and 100°C'),
  pressureHigh: z.number().min(0).max(1000, 'Pressure must be between 0-1000'),
  pressureLow: z.number().min(0).max(1000, 'Pressure must be between 0-1000'),
});

export const notificationSettingsSchema: z.ZodSchema<NotificationSettingsData> =
  z.object({
    channels: z.object({
      email: emailNotificationConfigSchema,
      sms: z.object({
        enabled: z.boolean(),
        provider: z.string().min(1, 'Provider is required'),
        apiKey: z.string().min(1, 'API key is required'),
        fromNumber: z.string().min(1, 'From number is required'),
      }),
      inApp: z.object({
        enabled: z.boolean(),
        soundEnabled: z.boolean(),
        desktopNotifications: z.boolean(),
      }),
      push: z.object({
        enabled: z.boolean(),
        serviceWorkerUrl: z
          .string()
          .url('Invalid service worker URL')
          .min(1, 'Service worker URL is required'),
        vapidKey: z.string().min(1, 'VAPID key is required'),
      }),
    }),
    alertThresholds: z.object({
      inventory: inventoryAlertThresholdsSchema,
      delivery: z.object({
        delayMinutes: z
          .number()
          .min(0)
          .max(1440, 'Delay must be between 0-1440 minutes'),
        routeDeviation: z
          .number()
          .min(0)
          .max(100, 'Route deviation must be between 0-100'),
        fuelLevelLow: z
          .number()
          .min(0)
          .max(100, 'Fuel level must be between 0-100'),
      }),
      safety: z.object({
        temperatureHigh: z.number().min(-50).max(100),
        temperatureLow: z.number().min(-50).max(100),
        pressureHigh: z.number().min(0).max(1000),
        pressureLow: z.number().min(0).max(1000),
        leakDetection: z.boolean(),
      }),
      system: z.object({
        diskUsage: z
          .number()
          .min(0)
          .max(100, 'Disk usage must be between 0-100'),
        memoryUsage: z
          .number()
          .min(0)
          .max(100, 'Memory usage must be between 0-100'),
        cpuUsage: z.number().min(0).max(100, 'CPU usage must be between 0-100'),
        networkLatency: z
          .number()
          .min(0)
          .max(10000, 'Network latency must be between 0-10000ms'),
      }),
    }),
    templates: z.object({
      email: z.array(z.any()), // Simplified for now
      sms: z.array(z.any()), // Simplified for now
      inApp: z.array(z.any()), // Simplified for now
    }),
    escalation: z.object({
      chains: z.array(z.any()), // Simplified for now
      responseTimes: z.array(z.any()), // Simplified for now
      emergencyContacts: z.array(z.any()), // Simplified for now
    }),
  });

// Compliance Settings Validation
const epaComplianceSchema = z.object({
  enabled: z.boolean(),
  reportingRequirements: z.array(z.string()),
  inspectionSchedule: z.string().min(1, 'Inspection schedule is required'),
  documentationRequired: z.array(z.string()),
});

const localComplianceSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  enabled: z.boolean(),
  reportingRequirements: z.array(z.string()),
  inspectionSchedule: z.string().min(1, 'Inspection schedule is required'),
  documentationRequired: z.array(z.string()),
});

const automatedReportSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Report name is required'),
  type: z.enum(['inventory', 'delivery', 'safety', 'compliance']),
  schedule: z.string().min(1, 'Schedule is required'),
  recipients: z
    .array(z.string().email('Invalid recipient email'))
    .min(1, 'At least one recipient is required'),
  format: z.enum(['pdf', 'excel', 'csv']),
  isActive: z.boolean(),
});

export const complianceSettingsSchema: z.ZodSchema<ComplianceSettingsData> =
  z.object({
    regulatoryStandards: z.object({
      epa: epaComplianceSchema,
      osha: epaComplianceSchema, // Same structure as EPA
      dot: epaComplianceSchema, // Same structure as EPA
      local: z.array(localComplianceSchema),
    }),
    reporting: z.object({
      automatedReports: z.array(automatedReportSchema),
      reportSchedules: z.array(z.any()), // Simplified for now
      dataRetention: z.object({
        dataType: z.string(),
        retentionPeriod: z.number().min(1),
        unit: z.enum(['days', 'months', 'years']),
        action: z.enum(['delete', 'archive', 'anonymize']),
      }),
    }),
    safetyProtocols: z.object({
      emergencyProcedures: z.array(z.any()), // Simplified for now
      contactInformation: z.array(z.any()), // Simplified for now
      safetyTraining: z.array(z.any()), // Simplified for now
    }),
  });

// Branding Settings Validation
const logoConfigSchema = z.object({
  primary: z
    .string()
    .url('Invalid logo URL')
    .min(1, 'Primary logo URL is required'),
  secondary: z.string().url('Invalid logo URL').optional(),
  favicon: z
    .string()
    .url('Invalid favicon URL')
    .min(1, 'Favicon URL is required'),
  sizes: z.object({
    small: z
      .string()
      .url('Invalid logo URL')
      .min(1, 'Small logo URL is required'),
    medium: z
      .string()
      .url('Invalid logo URL')
      .min(1, 'Medium logo URL is required'),
    large: z
      .string()
      .url('Invalid logo URL')
      .min(1, 'Large logo URL is required'),
  }),
});

const colorSchemeSchema = z.object({
  primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  background: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  surface: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  text: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  success: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  warning: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  error: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
});

const typographyConfigSchema = z.object({
  fontFamily: z.string().min(1, 'Font family is required'),
  headingFont: z.string().optional(),
  fontSizes: z.record(z.string()),
});

const dashboardLayoutSchema = z.object({
  defaultWidgets: z.array(z.string()),
  widgetPositions: z.record(
    z.object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    })
  ),
  sidebarCollapsed: z.boolean(),
  theme: z.enum(['light', 'dark', 'auto']),
});

const numberFormatSchema = z.object({
  decimalSeparator: z
    .string()
    .length(1, 'Decimal separator must be a single character'),
  thousandsSeparator: z
    .string()
    .length(1, 'Thousands separator must be a single character'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  currencyPosition: z.enum(['before', 'after']),
});

export const brandingSettingsSchema: z.ZodSchema<BrandingSettingsData> =
  z.object({
    visualBranding: z.object({
      logo: logoConfigSchema,
      colorScheme: colorSchemeSchema,
      typography: typographyConfigSchema,
      favicon: z
        .string()
        .url('Invalid favicon URL')
        .min(1, 'Favicon URL is required'),
    }),
    displayPreferences: z.object({
      dashboardLayout: dashboardLayoutSchema,
      defaultViews: z.array(z.any()), // Simplified for now
      featureVisibility: z.record(z.boolean()),
    }),
    localization: z.object({
      language: z
        .string()
        .min(2, 'Language code must be at least 2 characters'),
      currency: z.string().length(3, 'Currency code must be 3 characters'),
      dateFormat: z.string().min(1, 'Date format is required'),
      timeFormat: z.enum(['12h', '24h']),
      timezone: z.string().min(1, 'Timezone is required'),
      numberFormat: numberFormatSchema,
    }),
  });

// Data Management Settings Validation
const backupScheduleSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  days: z.array(z.number().min(0).max(6)), // 0 = Sunday, 6 = Saturday
  isActive: z.boolean(),
});

const backupRetentionSchema = z.object({
  daily: z
    .number()
    .min(0)
    .max(365, 'Daily retention must be between 0-365 days'),
  weekly: z
    .number()
    .min(0)
    .max(52, 'Weekly retention must be between 0-52 weeks'),
  monthly: z
    .number()
    .min(0)
    .max(12, 'Monthly retention must be between 0-12 months'),
  yearly: z
    .number()
    .min(0)
    .max(10, 'Yearly retention must be between 0-10 years'),
});

const backupStorageSchema = z.object({
  type: z.enum(['local', 'cloud', 'hybrid']),
  location: z.string().min(1, 'Storage location is required'),
  credentials: z.record(z.string()),
});

const backupEncryptionSchema = z.object({
  enabled: z.boolean(),
  algorithm: z.string().min(1, 'Encryption algorithm is required'),
  keyRotation: z
    .number()
    .min(30, 'Key rotation must be at least 30 days')
    .max(365, 'Key rotation must be at most 365 days'),
});

const exportFormatSchema = z.object({
  type: z.enum(['csv', 'excel', 'json', 'xml']),
  name: z.string().min(1, 'Format name is required'),
  isActive: z.boolean(),
});

const dataRetentionPolicySchema = z.object({
  dataType: z.string().min(1, 'Data type is required'),
  retentionPeriod: z.number().min(1, 'Retention period must be positive'),
  unit: z.enum(['days', 'months', 'years']),
  action: z.enum(['delete', 'archive', 'anonymize']),
});

const privacySchema = z.object({
  gdprCompliance: z.boolean(),
  dataAnonymization: z.boolean(),
  rightToErasure: z.boolean(),
  dataPortability: z.boolean(),
});

export const dataManagementSettingsSchema: z.ZodSchema<DataManagementSettingsData> =
  z.object({
    backup: z.object({
      schedule: backupScheduleSchema,
      retention: backupRetentionSchema,
      storage: backupStorageSchema,
      encryption: backupEncryptionSchema,
    }),
    dataExport: z.object({
      formats: z.array(exportFormatSchema),
      schedules: z.array(z.any()), // Simplified for now
      delivery: z.object({
        method: z.enum(['email', 'ftp', 'api']),
        destination: z.string().min(1, 'Destination is required'),
        credentials: z.record(z.string()),
      }),
    }),
    dataRetention: z.object({
      policies: z.array(dataRetentionPolicySchema),
      automaticCleanup: z.boolean(),
      archiveSettings: z.object({
        enabled: z.boolean(),
        location: z.string().min(1, 'Archive location is required'),
        compression: z.boolean(),
        encryption: z.boolean(),
      }),
    }),
    privacy: privacySchema,
  });

// Validation utility functions
export const validateSettingsSection = <T>(
  section: string,
  data: T,
  schema: z.ZodSchema<T>
): { isValid: boolean; errors: Record<string, string[]> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: ['Validation failed'] } };
  }
};

export const validateAllSettings = (data: any) => {
  const validations = {
    profile: validateSettingsSection(
      'profile',
      data.profile,
      companyProfileSchema
    ),
    operations: validateSettingsSection(
      'operations',
      data.operations,
      businessOperationsSchema
    ),
    security: validateSettingsSection(
      'security',
      data.security,
      securitySettingsSchema
    ),
    integrations: validateSettingsSection(
      'integrations',
      data.integrations,
      integrationSettingsSchema
    ),
    notifications: validateSettingsSection(
      'notifications',
      data.notifications,
      notificationSettingsSchema
    ),
    compliance: validateSettingsSection(
      'compliance',
      data.compliance,
      complianceSettingsSchema
    ),
    branding: validateSettingsSection(
      'branding',
      data.branding,
      brandingSettingsSchema
    ),
    dataManagement: validateSettingsSection(
      'dataManagement',
      data.dataManagement,
      dataManagementSettingsSchema
    ),
  };

  const allErrors: Record<string, string[]> = {};
  let isValid = true;

  Object.entries(validations).forEach(([section, validation]) => {
    if (!validation.isValid) {
      isValid = false;
      Object.entries(validation.errors).forEach(([field, messages]) => {
        allErrors[`${section}.${field}`] = messages;
      });
    }
  });

  return { isValid, errors: allErrors };
};
