'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Settings,
  Shield,
  Plug,
  Bell,
  FileCheck,
  Palette,
  Database,
  AlertTriangle,
} from 'lucide-react';
import type { SettingsTab } from '@/types/settings';

interface SettingsNavigationProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  hasUnsavedChanges: boolean;
}

const navigationItems = [
  {
    id: 'profile' as SettingsTab,
    label: 'Company Profile',
    description: 'Basic company information and contact details',
    icon: Building2,
    badge: null,
  },
  {
    id: 'operations' as SettingsTab,
    label: 'Business Operations',
    description: 'Business hours, operational parameters, and workflows',
    icon: Settings,
    badge: null,
  },
  {
    id: 'security' as SettingsTab,
    label: 'Security & Access',
    description: 'Authentication, permissions, and security policies',
    icon: Shield,
    badge: null,
  },
  {
    id: 'integrations' as SettingsTab,
    label: 'Integrations',
    description: 'External systems, APIs, and data synchronization',
    icon: Plug,
    badge: null,
  },
  {
    id: 'notifications' as SettingsTab,
    label: 'Notifications',
    description: 'Alert thresholds, communication channels, and templates',
    icon: Bell,
    badge: null,
  },
  {
    id: 'compliance' as SettingsTab,
    label: 'Compliance',
    description: 'Regulatory standards, reporting, and safety protocols',
    icon: FileCheck,
    badge: null,
  },
  {
    id: 'branding' as SettingsTab,
    label: 'Branding',
    description: 'Visual identity, themes, and localization',
    icon: Palette,
    badge: null,
  },
  {
    id: 'data-management' as SettingsTab,
    label: 'Data Management',
    description: 'Backup, export, retention, and privacy settings',
    icon: Database,
    badge: null,
  },
];

export function SettingsNavigation({
  activeTab,
  onTabChange,
  hasUnsavedChanges,
}: SettingsNavigationProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure your company settings
        </p>
        {hasUnsavedChanges && (
          <div className="mt-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-amber-600">Unsaved changes</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full text-left p-3 rounded-lg transition-all duration-200 group',
                'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                isActive
                  ? 'bg-blue-50 border border-blue-200 shadow-sm'
                  : 'border border-transparent hover:border-gray-200'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={cn(
                        'text-sm font-medium truncate',
                        isActive ? 'text-blue-900' : 'text-gray-900'
                      )}
                    >
                      {item.label}
                    </h3>
                    {item.badge && (
                      <Badge
                        variant={isActive ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p
                    className={cn(
                      'text-xs mt-1 line-clamp-2',
                      isActive ? 'text-blue-700' : 'text-gray-600'
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-1">Changes are saved automatically</p>
        </div>
      </div>
    </div>
  );
}
