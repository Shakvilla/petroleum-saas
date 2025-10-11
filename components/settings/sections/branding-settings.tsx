'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  TenantAwareCard,
  TenantAwareCardContent,
  TenantAwareCardDescription,
  TenantAwareCardHeader,
  TenantAwareCardTitle,
} from '@/components/ui/tenant-aware-card';
import { TenantAwareButton } from '@/components/ui/tenant-aware-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TenantAwareBadge } from '@/components/ui/tenant-aware-badge';
import { Palette, Image, Globe, Monitor } from 'lucide-react';
import type { BrandingSettingsData } from '@/types/settings';
import { ThemePresetSelector } from '../theme-preset-selector';
import { ThemeCustomizer } from '../theme-customizer';
import { ThemeValidationDashboard } from '../theme-validation-dashboard';
import { useSettingsStore } from '@/stores/settings-store';
import { THEME_PRESETS, getThemePresetById } from '@/lib/theme-presets-data';
import type { ThemePreset, ThemeCustomization } from '@/types/theme-presets';

interface BrandingSettingsProps {
  data: BrandingSettingsData;
  validationErrors: Record<string, string[]>;
  onUpdate: (data: BrandingSettingsData) => void;
}

export function BrandingSettings({
  data,
  validationErrors,
  onUpdate,
}: BrandingSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'presets' | 'customize' | 'validation'
  >('presets');

  // Get theme management state from store
  const {
    currentThemePreset,
    themeCustomizations,
    themeValidationResults,
    themeHistory,
    setThemePreset,
    applyThemeCustomization,
    saveThemeCustomization,
    resetThemeCustomization,
    exportTheme,
    importTheme,
    validateTheme,
    undoThemeChange,
    redoThemeChange,
  } = useSettingsStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<BrandingSettingsData>({
    defaultValues: data,
  });

  const watchedValues = watch();

  const onSubmit = (formData: BrandingSettingsData) => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    Object.keys(data).forEach(key => {
      setValue(
        key as keyof BrandingSettingsData,
        data[key as keyof BrandingSettingsData]
      );
    });
  };

  const getFieldError = (fieldPath: string) => {
    return (
      validationErrors[fieldPath]?.[0] ||
      errors[fieldPath as keyof BrandingSettingsData]?.message
    );
  };

  // Handle preset selection
  const handlePresetSelect = (preset: ThemePreset) => {
    setThemePreset(preset);
    setActiveTab('customize');
  };

  // Handle preset application
  const handlePresetApply = (preset: ThemePreset) => {
    setThemePreset(preset);
    // Update the branding data with the new theme
    const updatedData = {
      ...data,
      visualBranding: {
        ...data.visualBranding,
        colorScheme: preset.colors,
        typography: preset.typography,
      },
      themeManagement: {
        ...data.themeManagement,
        currentPresetId: preset.id,
        lastApplied: new Date(),
        lastModified: new Date(),
      },
    };
    onUpdate(updatedData);
  };

  // Handle theme export
  const handleThemeExport = (preset: ThemePreset) => {
    exportTheme();
  };

  // Handle theme import
  const handleThemeImport = (preset: ThemePreset) => {
    importTheme('');
  };

  // Handle theme customization
  const handleCustomizationChange = (customization: ThemeCustomization) => {
    applyThemeCustomization(customization);
  };

  // Handle theme save
  const handleThemeSave = () => {
    saveThemeCustomization();
  };

  // Handle theme reset
  const handleThemeReset = () => {
    resetThemeCustomization();
  };

  // Get current preset
  const currentPreset = currentThemePreset || getThemePresetById(data.themeManagement?.currentPresetId || 'corporate-blue');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Branding</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure visual identity, themes, and localization
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <TenantAwareBadge
              variant="outline"
              className="text-amber-600 border-amber-200"
            >
              Unsaved changes
            </TenantAwareBadge>
          )}
          {!isEditing ? (
            <TenantAwareButton onClick={() => setIsEditing(true)}>
              Edit Branding
            </TenantAwareButton>
          ) : (
            <div className="flex gap-2">
              <TenantAwareButton variant="outline" onClick={handleCancel}>
                Cancel
              </TenantAwareButton>
              <TenantAwareButton onClick={handleSubmit(onSubmit)}>
                Save Changes
              </TenantAwareButton>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'presets', label: 'Presets', icon: Palette },
            { id: 'customize', label: 'Customize', icon: Monitor },
            { id: 'validation', label: 'Validation', icon: Globe },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'presets' && (
        <ThemePresetSelector
          selectedPresetId={currentPreset?.id}
          onPresetSelect={handlePresetSelect}
          onPresetApply={handlePresetApply}
          onPresetExport={handleThemeExport}
          onPresetImport={handleThemeImport}
          onUndo={undoThemeChange}
          onRedo={redoThemeChange}
          canUndo={themeHistory.length > 1}
          canRedo={false} // This would need to be tracked in the store
        />
      )}

      {activeTab === 'customize' && currentPreset && (
        <ThemeCustomizer
          basePreset={currentPreset}
          customizations={themeCustomizations || undefined}
          onCustomizationChange={handleCustomizationChange}
          onSave={handleThemeSave}
          onReset={handleThemeReset}
          onUndo={undoThemeChange}
          onRedo={redoThemeChange}
          canUndo={themeHistory.length > 1}
          canRedo={false} // This would need to be tracked in the store
        />
      )}

      {activeTab === 'customize' && !currentPreset && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Please select a theme preset first.</p>
        </div>
      )}

      {activeTab === 'validation' && (
        <ThemeValidationDashboard
          validationResults={themeValidationResults}
          onValidate={() => {
            // Create a mock SettingsData for validation
            const mockSettingsData = {
              profile: {} as any,
              operations: {} as any,
              security: {} as any,
              integrations: {} as any,
              notifications: {} as any,
              analytics: {} as any,
              branding: data,
              system: {} as any,
              compliance: {} as any,
              dataManagement: {} as any,
            };
            validateTheme(mockSettingsData);
          }}
        />
      )}

    </div>
  );
}
