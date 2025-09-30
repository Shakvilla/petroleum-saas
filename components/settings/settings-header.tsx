'use client';

import { TenantAwareButton } from '@/components/ui/tenant-aware-button';
import { TenantAwareBadge } from '@/components/ui/tenant-aware-badge';
import { Separator } from '@/components/ui/separator';
import { Save, RotateCcw, X, AlertTriangle } from 'lucide-react';
import type { SettingsTab } from '@/types/settings';
import type { Tenant } from '@/types';

interface SettingsHeaderProps {
  tenant: Tenant | null;
  activeTab: SettingsTab;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
  onCancel: () => void;
}

const tabLabels: Record<SettingsTab, string> = {
  profile: 'Company Profile',
  operations: 'Business Operations',
  security: 'Security & Access',
  integrations: 'Integrations',
  notifications: 'Notifications',
  compliance: 'Compliance',
  branding: 'Branding',
  'data-management': 'Data Management',
};

export function SettingsHeader({
  tenant,
  activeTab,
  hasUnsavedChanges,
  isSaving,
  onSave,
  onReset,
  onCancel,
}: SettingsHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title and status */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {tabLabels[activeTab]}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {tenant?.name || 'Company'} Settings
            </p>
          </div>

          {hasUnsavedChanges && (
            <TenantAwareBadge
              variant="outline"
              className="text-amber-600 border-amber-200"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Unsaved Changes
            </TenantAwareBadge>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <>
              <TenantAwareButton
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isSaving}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </TenantAwareButton>

              <TenantAwareButton
                variant="outline"
                size="sm"
                onClick={onReset}
                disabled={isSaving}
                className="text-gray-600 hover:text-gray-900"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </TenantAwareButton>
            </>
          )}

          <Separator orientation="vertical" className="h-6" />

          <TenantAwareButton
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            size="sm"
            className="min-w-[100px]"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </TenantAwareButton>
        </div>
      </div>
    </div>
  );
}
