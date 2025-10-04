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
import { ThemePreview } from '../theme-preview';
import { ThemePresets } from '../theme-presets';
import { ThemeValidation } from '../theme-validation';

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
    'presets' | 'customize' | 'preview' | 'validation'
  >('presets');

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
  const handlePresetSelect = (preset: any) => {
    const updatedData = {
      ...data,
      visualBranding: {
        ...data.visualBranding,
        colorScheme: preset.colors as any,
        typography: preset.typography as any,
      },
    };
    onUpdate(updatedData);
    setActiveTab('preview');
  };

  // Handle theme export
  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'theme.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Handle theme import
  const handleImport = (importedTheme: BrandingSettingsData) => {
    onUpdate(importedTheme);
  };

  // Handle theme reset
  const handleReset = () => {
    onUpdate(data);
  };

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
            { id: 'preview', label: 'Preview', icon: Image },
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
        <ThemePresets onPresetSelect={handlePresetSelect} currentTheme={data} />
      )}

      {activeTab === 'preview' && (
        <ThemePreview
          brandingData={data}
          onThemeChange={onUpdate as any}
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleReset}
        />
      )}

      {activeTab === 'validation' && <ThemeValidation brandingData={data} />}

      {activeTab === 'customize' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Visual Branding */}
          <TenantAwareCard>
            <TenantAwareCardHeader>
              <TenantAwareCardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Visual Branding
              </TenantAwareCardTitle>
              <TenantAwareCardDescription>
                Configure logos, colors, and typography
              </TenantAwareCardDescription>
            </TenantAwareCardHeader>
            <TenantAwareCardContent className="space-y-6">
              {/* Logo Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  Logo Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryLogo">Primary Logo URL</Label>
                    <Input
                      id="primaryLogo"
                      {...register('visualBranding.logo.primary')}
                      disabled={!isEditing}
                      placeholder="https://example.com/logo.png"
                      className={
                        getFieldError('visualBranding.logo.primary')
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError('visualBranding.logo.primary') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('visualBranding.logo.primary')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryLogo">Secondary Logo URL</Label>
                    <Input
                      id="secondaryLogo"
                      {...register('visualBranding.logo.secondary')}
                      disabled={!isEditing}
                      placeholder="https://example.com/logo-light.png"
                      className={
                        getFieldError('visualBranding.logo.secondary')
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError('visualBranding.logo.secondary') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('visualBranding.logo.secondary')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logoSmall">Small Logo URL</Label>
                    <Input
                      id="logoSmall"
                      {...register('visualBranding.logo.sizes.small')}
                      disabled={!isEditing}
                      placeholder="https://example.com/logo-small.png"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logoMedium">Medium Logo URL</Label>
                    <Input
                      id="logoMedium"
                      {...register('visualBranding.logo.sizes.medium')}
                      disabled={!isEditing}
                      placeholder="https://example.com/logo-medium.png"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logoLarge">Large Logo URL</Label>
                    <Input
                      id="logoLarge"
                      {...register('visualBranding.logo.sizes.large')}
                      disabled={!isEditing}
                      placeholder="https://example.com/logo-large.png"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    {...register('visualBranding.favicon')}
                    disabled={!isEditing}
                    placeholder="https://example.com/favicon.ico"
                    className={
                      getFieldError('visualBranding.favicon')
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {getFieldError('visualBranding.favicon') && (
                    <p className="text-sm text-red-600">
                      {getFieldError('visualBranding.favicon')}
                    </p>
                  )}
                </div>
              </div>

              {/* Color Scheme */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Color Scheme</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        {...register('visualBranding.colorScheme.primary')}
                        disabled={!isEditing}
                        placeholder="#1e40af"
                        className={
                          getFieldError('visualBranding.colorScheme.primary')
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      <div
                        className="w-10 h-10 rounded border border-gray-300"
                        style={{
                          backgroundColor:
                            watchedValues.visualBranding?.colorScheme
                              ?.primary || '#1e40af',
                        }}
                      />
                    </div>
                    {getFieldError('visualBranding.colorScheme.primary') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('visualBranding.colorScheme.primary')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        {...register('visualBranding.colorScheme.secondary')}
                        disabled={!isEditing}
                        placeholder="#3b82f6"
                        className={
                          getFieldError('visualBranding.colorScheme.secondary')
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      <div
                        className="w-10 h-10 rounded border border-gray-300"
                        style={{
                          backgroundColor:
                            watchedValues.visualBranding?.colorScheme
                              ?.secondary || '#3b82f6',
                        }}
                      />
                    </div>
                    {getFieldError('visualBranding.colorScheme.secondary') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('visualBranding.colorScheme.secondary')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        {...register('visualBranding.colorScheme.accent')}
                        disabled={!isEditing}
                        placeholder="#f59e0b"
                        className={
                          getFieldError('visualBranding.colorScheme.accent')
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      <div
                        className="w-10 h-10 rounded border border-gray-300"
                        style={{
                          backgroundColor:
                            watchedValues.visualBranding?.colorScheme?.accent ||
                            '#f59e0b',
                        }}
                      />
                    </div>
                    {getFieldError('visualBranding.colorScheme.accent') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('visualBranding.colorScheme.accent')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="successColor">Success Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="successColor"
                        {...register('visualBranding.colorScheme.success')}
                        disabled={!isEditing}
                        placeholder="#10b981"
                        className={
                          getFieldError('visualBranding.colorScheme.success')
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      <div
                        className="w-10 h-10 rounded border border-gray-300"
                        style={{
                          backgroundColor:
                            watchedValues.visualBranding?.colorScheme
                              ?.success || '#10b981',
                        }}
                      />
                    </div>
                    {getFieldError('visualBranding.colorScheme.success') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('visualBranding.colorScheme.success')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warningColor">Warning Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="warningColor"
                        {...register('visualBranding.colorScheme.warning')}
                        disabled={!isEditing}
                        placeholder="#f59e0b"
                        className={
                          getFieldError('visualBranding.colorScheme.warning')
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      <div
                        className="w-10 h-10 rounded border border-gray-300"
                        style={{
                          backgroundColor:
                            watchedValues.visualBranding?.colorScheme
                              ?.warning || '#f59e0b',
                        }}
                      />
                    </div>
                    {getFieldError('visualBranding.colorScheme.warning') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('visualBranding.colorScheme.warning')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="errorColor">Error Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="errorColor"
                        {...register('visualBranding.colorScheme.error')}
                        disabled={!isEditing}
                        placeholder="#ef4444"
                        className={
                          getFieldError('visualBranding.colorScheme.error')
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      <div
                        className="w-10 h-10 rounded border border-gray-300"
                        style={{
                          backgroundColor:
                            watchedValues.visualBranding?.colorScheme?.error ||
                            '#ef4444',
                        }}
                      />
                    </div>
                    {getFieldError('visualBranding.colorScheme.error') && (
                      <p className="text-sm text-red-600">
                        {getFieldError('visualBranding.colorScheme.error')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Typography</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select
                      value={
                        watchedValues.visualBranding?.typography?.fontFamily ||
                        'Inter'
                      }
                      onValueChange={value =>
                        setValue('visualBranding.typography.fontFamily', value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headingFont">Heading Font</Label>
                    <Select
                      value={
                        watchedValues.visualBranding?.typography?.headingFont ||
                        'Inter'
                      }
                      onValueChange={value =>
                        setValue('visualBranding.typography.headingFont', value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Same as body font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TenantAwareCardContent>
          </TenantAwareCard>

          {/* Display Preferences */}
          <TenantAwareCard>
            <TenantAwareCardHeader>
              <TenantAwareCardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Display Preferences
              </TenantAwareCardTitle>
              <TenantAwareCardDescription>
                Configure dashboard layout and default views
              </TenantAwareCardDescription>
            </TenantAwareCardHeader>
            <TenantAwareCardContent className="space-y-6">
              {/* Dashboard Layout */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Dashboard Layout</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={
                        watchedValues.displayPreferences.dashboardLayout.theme
                      }
                      onValueChange={value =>
                        setValue(
                          'displayPreferences.dashboardLayout.theme',
                          value as any
                        )
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sidebar Collapsed</Label>
                      <p className="text-sm text-gray-600">
                        Start with sidebar collapsed by default
                      </p>
                    </div>
                    <Switch
                      checked={
                        watchedValues.displayPreferences.dashboardLayout
                          .sidebarCollapsed
                      }
                      onCheckedChange={checked =>
                        setValue(
                          'displayPreferences.dashboardLayout.sidebarCollapsed',
                          checked
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Default Widgets</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'overview',
                      'inventory',
                      'deliveries',
                      'sales',
                      'alerts',
                      'reports',
                    ].map(widget => (
                      <div key={widget} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`widget-${widget}`}
                          checked={
                            watchedValues.displayPreferences?.dashboardLayout?.defaultWidgets?.includes(
                              widget
                            ) || false
                          }
                          onChange={e => {
                            const current =
                              watchedValues.displayPreferences?.dashboardLayout
                                ?.defaultWidgets || [];
                            const updated = e.target.checked
                              ? [...current, widget]
                              : current.filter(w => w !== widget);
                            setValue(
                              'displayPreferences.dashboardLayout.defaultWidgets',
                              updated
                            );
                          }}
                          disabled={!isEditing}
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor={`widget-${widget}`}
                          className="text-sm capitalize"
                        >
                          {widget}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TenantAwareCardContent>
          </TenantAwareCard>

          {/* Localization */}
          <TenantAwareCard>
            <TenantAwareCardHeader>
              <TenantAwareCardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization
              </TenantAwareCardTitle>
              <TenantAwareCardDescription>
                Configure language, currency, and regional settings
              </TenantAwareCardDescription>
            </TenantAwareCardHeader>
            <TenantAwareCardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={watchedValues.localization.language}
                    onValueChange={value =>
                      setValue('localization.language', value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={watchedValues.localization.currency}
                    onValueChange={value =>
                      setValue('localization.currency', value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">
                        AUD - Australian Dollar
                      </SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={watchedValues.localization.dateFormat}
                    onValueChange={value =>
                      setValue('localization.dateFormat', value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">
                        MM/DD/YYYY (US)
                      </SelectItem>
                      <SelectItem value="DD/MM/YYYY">
                        DD/MM/YYYY (EU)
                      </SelectItem>
                      <SelectItem value="YYYY-MM-DD">
                        YYYY-MM-DD (ISO)
                      </SelectItem>
                      <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select
                    value={watchedValues.localization.timeFormat}
                    onValueChange={value =>
                      setValue('localization.timeFormat', value as any)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={watchedValues.localization.timezone}
                  onValueChange={value =>
                    setValue('localization.timezone', value)
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">
                      Eastern Time
                    </SelectItem>
                    <SelectItem value="America/Chicago">
                      Central Time
                    </SelectItem>
                    <SelectItem value="America/Denver">
                      Mountain Time
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      Pacific Time
                    </SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Number Format */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Number Format</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="decimalSeparator">Decimal Separator</Label>
                    <Input
                      id="decimalSeparator"
                      {...register(
                        'localization.numberFormat.decimalSeparator'
                      )}
                      disabled={!isEditing}
                      placeholder="."
                      maxLength={1}
                      className={
                        getFieldError(
                          'localization.numberFormat.decimalSeparator'
                        )
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError(
                      'localization.numberFormat.decimalSeparator'
                    ) && (
                      <p className="text-sm text-red-600">
                        {getFieldError(
                          'localization.numberFormat.decimalSeparator'
                        )}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thousandsSeparator">
                      Thousands Separator
                    </Label>
                    <Input
                      id="thousandsSeparator"
                      {...register(
                        'localization.numberFormat.thousandsSeparator'
                      )}
                      disabled={!isEditing}
                      placeholder=","
                      maxLength={1}
                      className={
                        getFieldError(
                          'localization.numberFormat.thousandsSeparator'
                        )
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError(
                      'localization.numberFormat.thousandsSeparator'
                    ) && (
                      <p className="text-sm text-red-600">
                        {getFieldError(
                          'localization.numberFormat.thousandsSeparator'
                        )}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currencySymbol">Currency Symbol</Label>
                    <Input
                      id="currencySymbol"
                      {...register('localization.numberFormat.currencySymbol')}
                      disabled={!isEditing}
                      placeholder="$"
                      className={
                        getFieldError(
                          'localization.numberFormat.currencySymbol'
                        )
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {getFieldError(
                      'localization.numberFormat.currencySymbol'
                    ) && (
                      <p className="text-sm text-red-600">
                        {getFieldError(
                          'localization.numberFormat.currencySymbol'
                        )}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currencyPosition">Currency Position</Label>
                    <Select
                      value={
                        watchedValues.localization.numberFormat.currencyPosition
                      }
                      onValueChange={value =>
                        setValue(
                          'localization.numberFormat.currencyPosition',
                          value as any
                        )
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="before">
                          Before amount ($100)
                        </SelectItem>
                        <SelectItem value="after">
                          After amount (100$)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TenantAwareCardContent>
          </TenantAwareCard>
        </form>
      )}
    </div>
  );
}
