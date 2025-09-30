'use client';

import { CompanyProfileSettings } from './sections/company-profile-settings';
import { BusinessOperationsSettings } from './sections/business-operations-settings';
import { SecuritySettings } from './sections/security-settings';
import { IntegrationSettings } from './sections/integration-settings';
import { NotificationSettings } from './sections/notification-settings';
import { ComplianceSettings } from './sections/compliance-settings';
import { BrandingSettings } from './sections/branding-settings';
import { DataManagementSettings } from './sections/data-management-settings';
import type { SettingsTab, SettingsData } from '@/types/settings';

interface SettingsContentProps {
  activeTab: SettingsTab;
  settingsData: SettingsData;
  validationErrors: Record<string, string[]>;
  expandedSections: string[];
  showAdvancedOptions: boolean;
  onSectionUpdate: (section: SettingsTab, data: any) => void;
  onToggleExpandedSection: (section: string) => void;
  onSetShowAdvancedOptions: (show: boolean) => void;
}

export function SettingsContent({
  activeTab,
  settingsData,
  validationErrors,
  expandedSections,
  showAdvancedOptions,
  onSectionUpdate,
  onToggleExpandedSection,
  onSetShowAdvancedOptions,
}: SettingsContentProps) {
  const commonProps = {
    data: settingsData,
    validationErrors,
    expandedSections,
    showAdvancedOptions,
    onUpdate: onSectionUpdate,
    onToggleExpandedSection,
    onSetShowAdvancedOptions,
  };

  switch (activeTab) {
    case 'profile':
      return (
        <CompanyProfileSettings
          {...commonProps}
          data={settingsData.profile}
          onUpdate={data => onSectionUpdate('profile', data)}
        />
      );

    case 'operations':
      return (
        <BusinessOperationsSettings
          {...commonProps}
          data={settingsData.operations}
          onUpdate={data => onSectionUpdate('operations', data)}
        />
      );

    case 'security':
      return (
        <SecuritySettings
          {...commonProps}
          data={settingsData.security}
          onUpdate={data => onSectionUpdate('security', data)}
        />
      );

    case 'integrations':
      return (
        <IntegrationSettings
          {...commonProps}
          data={settingsData.integrations}
          onUpdate={data => onSectionUpdate('integrations', data)}
        />
      );

    case 'notifications':
      return (
        <NotificationSettings
          {...commonProps}
          data={settingsData.notifications}
          onUpdate={data => onSectionUpdate('notifications', data)}
        />
      );

    case 'compliance':
      return (
        <ComplianceSettings
          {...commonProps}
          data={settingsData.compliance}
          onUpdate={data => onSectionUpdate('compliance', data)}
        />
      );

    case 'branding':
      return (
        <BrandingSettings
          {...commonProps}
          data={settingsData.branding}
          onUpdate={data => onSectionUpdate('branding', data)}
        />
      );

    case 'data-management':
      return (
        <DataManagementSettings
          {...commonProps}
          data={settingsData.dataManagement}
          onUpdate={data => onSectionUpdate('data-management', data)}
        />
      );

    default:
      return (
        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Settings Section Not Found
            </h3>
            <p className="text-gray-600">
              The requested settings section could not be found.
            </p>
          </div>
        </div>
      );
  }
}
