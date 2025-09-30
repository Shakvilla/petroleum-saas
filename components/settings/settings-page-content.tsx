'use client';

import { useState, useEffect } from 'react';
import { useTenant } from '@/components/tenant-provider';
import { useSettingsStore, useSettingsActions } from '@/stores/settings-store';
import { SettingsNavigation } from './settings-navigation';
import { SettingsContent } from './settings-content';
import { SettingsHeader } from './settings-header';
import { SettingsFooter } from './settings-footer';
import { SettingsLoading } from './settings-loading';
import { SettingsError } from './settings-error';
import type { SettingsTab } from '@/types/settings';

interface SettingsPageContentProps {
  tenant: string;
}

export function SettingsPageContent({ tenant }: SettingsPageContentProps) {
  const { tenant: tenantContext } = useTenant();
  const {
    activeTab,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    validationErrors,
    settingsData,
    expandedSections,
    showAdvancedOptions,
  } = useSettingsStore();

  const {
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
  } = useSettingsActions();

  const [error, setError] = useState<string | null>(null);

  // Load settings data on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/tenants/${tenant}/settings`);
        if (!response.ok) throw new Error('Failed to load settings');
        const result = await response.json();
        setSettingsData(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load settings'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [tenant, setLoading, setSettingsData]);

  // Handle tab change
  const handleTabChange = (tab: SettingsTab) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to switch tabs?'
      );
      if (!confirmed) return;
    }
    setActiveTab(tab);
    clearValidationErrors();
  };

  // Handle section update
  const handleSectionUpdate = (section: SettingsTab, data: any) => {
    updateSection(section, data);
  };

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/tenants/${tenant}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
      });
      if (!response.ok) throw new Error('Failed to save settings');

      setUnsavedChanges(false);
      console.log('Settings saved for tenant:', tenant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all settings to default values? This action cannot be undone.'
    );
    if (confirmed) {
      resetSettings();
      setError(null);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmed) return;
    }
    resetSettings();
    setError(null);
  };

  if (isLoading) {
    return <SettingsLoading />;
  }

  if (error) {
    return (
      <SettingsError error={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Navigation Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <SettingsNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <SettingsHeader
          tenant={tenantContext}
          activeTab={activeTab}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          onSave={handleSave}
          onReset={handleReset}
          onCancel={handleCancel}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <SettingsContent
            activeTab={activeTab}
            settingsData={settingsData}
            validationErrors={validationErrors}
            expandedSections={expandedSections}
            showAdvancedOptions={showAdvancedOptions}
            onSectionUpdate={handleSectionUpdate}
            onToggleExpandedSection={toggleExpandedSection}
            onSetShowAdvancedOptions={setShowAdvancedOptions}
          />
        </div>

        {/* Footer */}
        <SettingsFooter
          hasUnsavedChanges={hasUnsavedChanges}
          validationErrors={validationErrors}
          isSaving={isSaving}
          onSave={handleSave}
          onReset={handleReset}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
