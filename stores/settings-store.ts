import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  SettingsState,
  SettingsData,
  ValidationError,
} from '@/types/settings';
import type {
  ThemePreset,
  ThemeCustomization,
  ValidationResults,
  ThemeHistoryEntry,
} from '@/types/theme-presets';
import { SettingsTab } from '@/types/settings';
import { validateThemePreset, validateColorScheme, validateTypography } from '@/lib/theme-validation';
import { getThemePresetById } from '@/lib/theme-presets-data';

// Settings store state interface
interface SettingsStoreState extends SettingsState {
  // Theme Management Properties
  currentThemePreset: ThemePreset | null;
  themeCustomizations: ThemeCustomization | null;
  themeValidationResults: ValidationResults | null;
  themeHistory: ThemeHistoryEntry[];
  
  // Actions
  setActiveTab: (tab: SettingsTab) => void;
  setLoading: (isLoading: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setUnsavedChanges: (hasChanges: boolean) => void;
  setValidationErrors: (errors: Record<string, string[]>) => void;
  setSettingsData: (data: Partial<SettingsData>) => void;
  updateSection: (section: SettingsTab, data: any) => void;
  setExpandedSections: (sections: string[]) => void;
  toggleExpandedSection: (section: string) => void;
  setShowAdvancedOptions: (show: boolean) => void;
  resetSettings: () => void;
  clearValidationErrors: () => void;
  
  // Theme Management Actions
  setThemePreset: (preset: ThemePreset) => void;
  applyThemeCustomization: (customization: ThemeCustomization) => void;
  saveThemeCustomization: () => void;
  resetThemeCustomization: () => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;
  validateTheme: (theme: SettingsData) => ValidationResults;
  addToThemeHistory: (entry: ThemeHistoryEntry) => void;
  undoThemeChange: () => void;
  redoThemeChange: () => void;
}

// Default settings data
// @ts-ignore
const defaultSettingsData: SettingsData = {
  profile: {
    companyName: '',
    legalName: '',
    industry: '',
    businessRegistration: {
      registrationNumber: '',
      taxId: '',
      incorporationDate: new Date(),
      jurisdiction: '',
    },
    primaryContact: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    },
    companySize: 'small',
    employeeCount: 0,
    operationalRegions: [],
    businessType: 'distributor',
  },
  operations: {
    businessHours: {
      monday: { start: '09:00', end: '17:00', isActive: true },
      tuesday: { start: '09:00', end: '17:00', isActive: true },
      wednesday: { start: '09:00', end: '17:00', isActive: true },
      thursday: { start: '09:00', end: '17:00', isActive: true },
      friday: { start: '09:00', end: '17:00', isActive: true },
      saturday: { start: '09:00', end: '17:00', isActive: false },
      sunday: { start: '09:00', end: '17:00', isActive: false },
    },
    operationalParams: {
      fuelTypes: ['gasoline' as any, 'diesel' as any],
      capacityLimits: {
        maxTankCapacity: 100000,
        maxDeliveryCapacity: 10000,
        maxFleetSize: 50,
      },
      safetyThresholds: {
        lowInventoryAlert: 20,
        criticalInventoryAlert: 10,
        temperatureAlerts: {
          min: -10,
          max: 50,
          unit: 'celsius',
        },
      },
    },
    workflowSettings: {
      approvalProcesses: {
        deliveryApproval: false,
        inventoryAdjustment: true,
        userManagement: true,
      },
      notificationTriggers: {
        inventoryAlerts: true,
        deliveryUpdates: true,
        maintenanceReminders: true,
      },
    },
  },
  security: {
    authentication: {
      ssoEnabled: false,
      twoFactorRequired: false,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90,
        historyCount: 5,
      },
    },
    sessionManagement: {
      sessionTimeout: 480, // 8 hours
      concurrentSessionLimit: 3,
      ipRestrictions: [],
      rememberMeEnabled: true,
    },
    accessControl: {
      roleBasedAccess: true,
      featureAccessLevels: {},
      apiAccessControl: true,
      dataExportPermissions: true,
    },
    auditSettings: {
      auditLogging: true,
      logRetentionDays: 365,
      complianceReporting: true,
      dataAnonymization: false,
    },
  },
  integrations: {
    externalIntegrations: {
      erpSystems: [],
      accountingSystems: [],
      iotDevices: [],
      thirdPartyServices: [],
    },
    apiManagement: {
      apiKeys: [],
      rateLimits: [],
      webhooks: [],
      dataSync: [],
    },
  },
  notifications: {
    channels: {
      email: {
        enabled: true,
        smtpServer: '',
        smtpPort: 587,
        username: '',
        fromAddress: '',
        replyToAddress: '',
      },
      sms: {
        enabled: false,
        provider: '',
        apiKey: '',
        fromNumber: '',
      },
      inApp: {
        enabled: true,
        soundEnabled: true,
        desktopNotifications: true,
      },
      push: {
        enabled: false,
        serviceWorkerUrl: '',
        vapidKey: '',
      },
    },
    alertThresholds: {
      inventory: {
        lowLevel: 20,
        criticalLevel: 10,
        temperatureHigh: 50,
        temperatureLow: -10,
        pressureHigh: 100,
        pressureLow: 0,
      },
      delivery: {
        delayMinutes: 30,
        routeDeviation: 5,
        fuelLevelLow: 20,
      },
      safety: {
        temperatureHigh: 50,
        temperatureLow: -10,
        pressureHigh: 100,
        pressureLow: 0,
        leakDetection: true,
      },
      system: {
        diskUsage: 80,
        memoryUsage: 80,
        cpuUsage: 80,
        networkLatency: 1000,
      },
    },
    templates: {
      email: [],
      sms: [],
      inApp: [],
    },
    escalation: {
      chains: [],
      responseTimes: [],
      emergencyContacts: [],
    },
  },
  compliance: {
    regulatoryStandards: {
      epa: {
        enabled: false,
        reportingRequirements: [],
        inspectionSchedule: '',
        documentationRequired: [],
      },
      osha: {
        enabled: false,
        reportingRequirements: [],
        inspectionSchedule: '',
        documentationRequired: [],
      },
      dot: {
        enabled: false,
        reportingRequirements: [],
        inspectionSchedule: '',
        documentationRequired: [],
      },
      local: [],
    },
    reporting: {
      automatedReports: [],
      reportSchedules: [],
      dataRetention: {
        dataType: 'general',
        retentionPeriod: 7,
        unit: 'years',
        action: 'archive',
      },
    },
    safetyProtocols: {
      emergencyProcedures: [],
      contactInformation: [],
      safetyTraining: [],
    },
  },
  branding: {
    visualBranding: {
      logo: {
        primary: '',
        favicon: '',
        sizes: {
          small: '',
          medium: '',
          large: '',
        },
      },
      colorScheme: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#f59e0b',
        background: '#ffffff',
        textSecondary: '',
        border: '',
        info: '',
        surface: '#f8fafc',
        text: '#1f2937',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      typography: {
        fontFamily: 'Inter',
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
        },

      },
      favicon: '',
    },
    themeManagement: {
      currentPresetId: 'corporate-blue',
      customizations: undefined,
      validationResults: undefined,
      history: [],
      lastApplied: new Date(),
      lastModified: new Date(),
    },
    displayPreferences: {
      dashboardLayout: {
        defaultWidgets: ['overview', 'inventory', 'deliveries'],
        widgetPositions: {},
        sidebarCollapsed: false,
        theme: 'light',
      },
      defaultViews: [],
      featureVisibility: {},
    },
    localization: {
      language: 'en',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      timezone: 'UTC',
      numberFormat: {
        decimalSeparator: '.',
        thousandsSeparator: ',',
        currencySymbol: '$',
        currencyPosition: 'before',
      },
    },
  },
  dataManagement: {
    backup: {
      schedule: {
        frequency: 'daily',
        time: '02:00',
        days: [1, 2, 3, 4, 5],
        isActive: true,
      },
      retention: {
        daily: 7,
        weekly: 4,
        monthly: 12,
        yearly: 7,
      },
      storage: {
        type: 'cloud',
        location: '',
        credentials: {},
      },
      encryption: {
        enabled: true,
        algorithm: 'AES-256',
        keyRotation: 90,
      },
    },
    dataExport: {
      formats: [
        { type: 'csv', name: 'CSV', isActive: true },
        { type: 'excel', name: 'Excel', isActive: true },
        { type: 'json', name: 'JSON', isActive: false },
        { type: 'xml', name: 'XML', isActive: false },
      ],
      schedules: [],
      delivery: {
        method: 'email',
        destination: '',
        credentials: {},
      },
    },
    dataRetention: {
      policies: [
        {
          dataType: 'user_data',
          retentionPeriod: 7,
          unit: 'years',
          action: 'archive',
        },
        {
          dataType: 'transaction_data',
          retentionPeriod: 10,
          unit: 'years',
          action: 'archive',
        },
        {
          dataType: 'log_data',
          retentionPeriod: 1,
          unit: 'years',
          action: 'delete',
        },
      ],
      automaticCleanup: true,
      archiveSettings: {
        enabled: true,
        location: '',
        compression: true,
        encryption: true,
      },
    },
    privacy: {
      gdprCompliance: false,
      dataAnonymization: false,
      rightToErasure: false,
      dataPortability: false,
    },
  },
};

// Create the settings store
export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: 'profile' as SettingsTab,
      isLoading: false,
      isSaving: false,
      hasUnsavedChanges: false,
      validationErrors: {},
      settingsData: defaultSettingsData,
      expandedSections: [],
      showAdvancedOptions: false,
      
      // Theme Management Initial State
      currentThemePreset: getThemePresetById('corporate-blue') || null,
      themeCustomizations: null,
      themeValidationResults: null,
      themeHistory: [],

      // Actions
      setActiveTab: (tab: SettingsTab) => {
        set({ activeTab: tab });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setSaving: (isSaving: boolean) => {
        set({ isSaving });
      },

      setUnsavedChanges: (hasChanges: boolean) => {
        set({ hasUnsavedChanges: hasChanges });
      },

      setValidationErrors: (errors: Record<string, string[]>) => {
        set({ validationErrors: errors });
      },

      setSettingsData: (data: Partial<SettingsData>) => {
        set(state => ({
          settingsData: { ...state.settingsData, ...data },
          hasUnsavedChanges: true,
        }));
      },

      updateSection: (section: SettingsTab, data: any) => {
        set(state => ({
          settingsData: {
            ...state.settingsData,
            [section === 'data-management' ? 'dataManagement' : section]: {
              ...state.settingsData[
                section === 'data-management' ? 'dataManagement' : section
              ],
              ...data,
            },
          },
          hasUnsavedChanges: true,
        }));
      },

      setExpandedSections: (sections: string[]) => {
        set({ expandedSections: sections });
      },

      toggleExpandedSection: (section: string) => {
        set(state => {
          const isExpanded = state.expandedSections.includes(section);
          const newSections = isExpanded
            ? state.expandedSections.filter(s => s !== section)
            : [...state.expandedSections, section];
          return { expandedSections: newSections };
        });
      },

      setShowAdvancedOptions: (show: boolean) => {
        set({ showAdvancedOptions: show });
      },

      resetSettings: () => {
        set({
          settingsData: defaultSettingsData,
          hasUnsavedChanges: false,
          validationErrors: {},
          expandedSections: [],
        });
      },

      clearValidationErrors: () => {
        set({ validationErrors: {} });
      },

      // Theme Management Actions
      setThemePreset: (preset: ThemePreset) => {
        set(state => {
          // Validate the preset before applying
          const validationResults = validateThemePreset(preset);
          
          // Add to history before applying
          const historyEntry: ThemeHistoryEntry = {
            id: `preset-${preset.id}-${Date.now()}`,
            preset,
            customizations: state.themeCustomizations || undefined,
            appliedAt: new Date(),
            appliedBy: 'user', // TODO: Get actual user ID
            description: `Applied preset: ${preset.name}`,
          };

          return {
            currentThemePreset: preset,
            themeValidationResults: validationResults,
            themeHistory: [...state.themeHistory, historyEntry].slice(-50),
            settingsData: {
              ...state.settingsData,
              branding: {
                ...state.settingsData.branding,
                visualBranding: {
                  ...state.settingsData.branding.visualBranding,
                  colorScheme: preset.colors,
                  typography: preset.typography,
                },
                themeManagement: {
                  ...state.settingsData.branding.themeManagement,
                  currentPresetId: preset.id,
                  validationResults,
                  lastApplied: new Date(),
                  lastModified: new Date(),
                  history: [...(state.settingsData.branding.themeManagement?.history || []), historyEntry].slice(-50),
                },
              },
            },
            hasUnsavedChanges: true,
          };
        });
      },

      applyThemeCustomization: (customization: ThemeCustomization) => {
        set(state => {
          // Create updated theme data for validation
          const updatedThemeData = {
            ...state.settingsData,
            branding: {
              ...state.settingsData.branding,
              visualBranding: {
                ...state.settingsData.branding.visualBranding,
                colorScheme: {
                  ...state.settingsData.branding.visualBranding.colorScheme,
                  ...customization.customizations.colors,
                },
                typography: {
                  ...state.settingsData.branding.visualBranding.typography,
                  ...customization.customizations.typography,
                },
              },
            },
          };

          // Validate the updated theme
          const validationResults = get().validateTheme(updatedThemeData);

          // Add to history
          const historyEntry: ThemeHistoryEntry = {
            id: `customization-${Date.now()}`,
            preset: state.currentThemePreset!,
            customizations: customization,
            appliedAt: new Date(),
            appliedBy: 'user', // TODO: Get actual user ID
            description: `Applied customization to ${state.currentThemePreset?.name || 'theme'}`,
          };

          return {
            themeCustomizations: customization,
            themeValidationResults: validationResults,
            themeHistory: [...state.themeHistory, historyEntry].slice(-50),
            settingsData: updatedThemeData,
            hasUnsavedChanges: true,
          };
        });
      },

      saveThemeCustomization: () => {
        set(state => ({
          hasUnsavedChanges: false,
          settingsData: {
            ...state.settingsData,
            branding: {
              ...state.settingsData.branding,
              themeManagement: {
                ...state.settingsData.branding.themeManagement,
                lastApplied: new Date(),
                history: state.settingsData.branding.themeManagement?.history || [],
              },
            },
          },
        }));
      },

      resetThemeCustomization: () => {
        set(state => ({
          themeCustomizations: null,
          settingsData: {
            ...state.settingsData,
            branding: {
              ...state.settingsData.branding,
              themeManagement: {
                ...state.settingsData.branding.themeManagement,
                customizations: undefined,
                lastModified: new Date(),
                history: state.settingsData.branding.themeManagement?.history || [],
              },
            },
          },
          hasUnsavedChanges: true,
        }));
      },

      exportTheme: () => {
        const state = get();
        const themeData = {
          preset: state.currentThemePreset,
          customizations: state.themeCustomizations,
          settings: state.settingsData.branding,
          exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(themeData, null, 2);
      },

      importTheme: (themeData: string) => {
        try {
          const parsedData = JSON.parse(themeData);
          
          // Validate imported data structure
          if (!parsedData.preset && !parsedData.customizations && !parsedData.settings) {
            throw new Error('Invalid theme data: missing preset, customizations, or settings');
          }

          // Import preset if available
          if (parsedData.preset) {
            // Validate preset structure
            if (!parsedData.preset.id || !parsedData.preset.colors || !parsedData.preset.typography) {
              throw new Error('Invalid preset data: missing required fields');
            }
            get().setThemePreset(parsedData.preset);
          }

          // Import customizations if available
          if (parsedData.customizations) {
            // Validate customization structure
            if (!parsedData.customizations.presetId || !parsedData.customizations.customizations) {
              throw new Error('Invalid customization data: missing required fields');
            }
            get().applyThemeCustomization(parsedData.customizations);
          }

          // Import settings if available (for backward compatibility)
          if (parsedData.settings) {
            get().setSettingsData({ branding: parsedData.settings });
          }

          // Add import to history
          const historyEntry: ThemeHistoryEntry = {
            id: `import-${Date.now()}`,
            preset: parsedData.preset || get().currentThemePreset!,
            customizations: parsedData.customizations,
            appliedAt: new Date(),
            appliedBy: 'user', // TODO: Get actual user ID
            description: `Imported theme configuration`,
          };
          get().addToThemeHistory(historyEntry);

        } catch (error) {
          console.error('Failed to import theme:', error);
          throw new Error(`Invalid theme data format: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },

      validateTheme: (theme: SettingsData) => {
        const { branding } = theme;
        if (!branding?.visualBranding) {
          return {
            isCompliant: false,
            contrastRatios: {},
            warnings: [],
            recommendations: ['Theme configuration is incomplete'],
            score: 0,
            lastValidated: new Date(),
          };
        }

        // Validate color scheme
        const colorResults = validateColorScheme(branding.visualBranding.colorScheme);
        
        // Validate typography
        const typographyResults = validateTypography(branding.visualBranding.typography);

        // Combine results
        const allWarnings = [...colorResults.warnings, ...typographyResults.warnings];
        const allRecommendations = [...colorResults.recommendations, ...typographyResults.recommendations];
        const overallScore = Math.round((colorResults.score + typographyResults.score) / 2);

        const validationResults: ValidationResults = {
          isCompliant: colorResults.isCompliant && typographyResults.isCompliant,
          contrastRatios: colorResults.contrastRatios,
          warnings: allWarnings,
          recommendations: allRecommendations,
          score: overallScore,
          lastValidated: new Date(),
        };

        // Update store with validation results
        set({ themeValidationResults: validationResults });

        return validationResults;
      },

      addToThemeHistory: (entry: ThemeHistoryEntry) => {
        set(state => ({
          themeHistory: [...state.themeHistory, entry].slice(-50), // Keep last 50 entries
        }));
      },

      undoThemeChange: () => {
        set(state => {
          if (state.themeHistory.length > 0) {
            const lastEntry = state.themeHistory[state.themeHistory.length - 1];
            const newHistory = state.themeHistory.slice(0, -1);
            
            // Apply the previous theme state
            const updatedState: Partial<SettingsStoreState> = {
              themeHistory: newHistory,
              currentThemePreset: lastEntry.preset,
              themeCustomizations: lastEntry.customizations,
              hasUnsavedChanges: true,
            };

            // Update settings data to match the restored theme
            if (lastEntry.preset) {
              updatedState.settingsData = {
                ...state.settingsData,
                branding: {
                  ...state.settingsData.branding,
                  visualBranding: {
                    ...state.settingsData.branding.visualBranding,
                    colorScheme: lastEntry.preset.colors,
                    typography: lastEntry.preset.typography,
                  },
                  themeManagement: {
                    ...state.settingsData.branding.themeManagement,
                    currentPresetId: lastEntry.preset.id,
                    customizations: lastEntry.customizations,
                    lastModified: new Date(),
                    history: newHistory,
                  },
                },
              };
            }

            // Validate the restored theme
            if (updatedState.settingsData) {
              const validationResults = get().validateTheme(updatedState.settingsData);
              updatedState.themeValidationResults = validationResults;
            }

            return updatedState;
          }
          return state;
        });
      },

      redoThemeChange: () => {
        // For now, redo is not implemented as it requires a separate redo stack
        // This would need to be implemented with a more complex history management system
        console.log('Redo theme change - requires redo stack implementation');
      },
    }),
    {
      name: 'settings-store',
      partialize: state => ({
        settingsData: state.settingsData,
        expandedSections: state.expandedSections,
        showAdvancedOptions: state.showAdvancedOptions,
        currentThemePreset: state.currentThemePreset,
        themeCustomizations: state.themeCustomizations,
        themeValidationResults: state.themeValidationResults,
        themeHistory: state.themeHistory,
      }),
    }
  )
);

// Selector hooks for better performance
export const useSettingsData = () =>
  useSettingsStore(state => state.settingsData);
export const useActiveTab = () => useSettingsStore(state => state.activeTab);
export const useSettingsLoading = () =>
  useSettingsStore(state => state.isLoading);
export const useSettingsSaving = () =>
  useSettingsStore(state => state.isSaving);
export const useUnsavedChanges = () =>
  useSettingsStore(state => state.hasUnsavedChanges);
export const useValidationErrors = () =>
  useSettingsStore(state => state.validationErrors);
export const useExpandedSections = () =>
  useSettingsStore(state => state.expandedSections);
export const useShowAdvancedOptions = () =>
  useSettingsStore(state => state.showAdvancedOptions);

// Theme Management Selector Hooks
export const useCurrentThemePreset = () =>
  useSettingsStore(state => state.currentThemePreset);
export const useThemeCustomizations = () =>
  useSettingsStore(state => state.themeCustomizations);
export const useThemeValidationResults = () =>
  useSettingsStore(state => state.themeValidationResults);
export const useThemeHistory = () =>
  useSettingsStore(state => state.themeHistory);

// Action hooks
export const useSettingsActions = () => {
  const setActiveTab = useSettingsStore(state => state.setActiveTab);
  const setLoading = useSettingsStore(state => state.setLoading);
  const setSaving = useSettingsStore(state => state.setSaving);
  const setUnsavedChanges = useSettingsStore(state => state.setUnsavedChanges);
  const setValidationErrors = useSettingsStore(
    state => state.setValidationErrors
  );
  const setSettingsData = useSettingsStore(state => state.setSettingsData);
  const updateSection = useSettingsStore(state => state.updateSection);
  const setExpandedSections = useSettingsStore(
    state => state.setExpandedSections
  );
  const toggleExpandedSection = useSettingsStore(
    state => state.toggleExpandedSection
  );
  const setShowAdvancedOptions = useSettingsStore(
    state => state.setShowAdvancedOptions
  );
  const resetSettings = useSettingsStore(state => state.resetSettings);
  const clearValidationErrors = useSettingsStore(
    state => state.clearValidationErrors
  );

  // Theme Management Actions
  const setThemePreset = useSettingsStore(state => state.setThemePreset);
  const applyThemeCustomization = useSettingsStore(state => state.applyThemeCustomization);
  const saveThemeCustomization = useSettingsStore(state => state.saveThemeCustomization);
  const resetThemeCustomization = useSettingsStore(state => state.resetThemeCustomization);
  const exportTheme = useSettingsStore(state => state.exportTheme);
  const importTheme = useSettingsStore(state => state.importTheme);
  const validateTheme = useSettingsStore(state => state.validateTheme);
  const addToThemeHistory = useSettingsStore(state => state.addToThemeHistory);
  const undoThemeChange = useSettingsStore(state => state.undoThemeChange);
  const redoThemeChange = useSettingsStore(state => state.redoThemeChange);

  return {
    setActiveTab,
    setLoading,
    setSaving,
    setUnsavedChanges,
    setValidationErrors,
    setSettingsData,
    updateSection,
    setExpandedSections,
    toggleExpandedSection,
    setShowAdvancedOptions,
    resetSettings,
    clearValidationErrors,
    
    // Theme Management Actions
    setThemePreset,
    applyThemeCustomization,
    saveThemeCustomization,
    resetThemeCustomization,
    exportTheme,
    importTheme,
    validateTheme,
    addToThemeHistory,
    undoThemeChange,
    redoThemeChange,
  };
};
