'use client';

import React from 'react';
import { useTenant } from '@/components/tenant-provider';
import { cn } from '@/lib/utils';

interface TenantBrandingProps {
  className?: string;
}

export const TenantBranding: React.FC<TenantBrandingProps> = ({
  className,
}) => {
  const { tenant } = useTenant();

  // Default branding if no tenant data
  if (!tenant) {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <span className="text-xl font-bold text-gray-900">PetroManager</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {tenant.branding?.logo ? (
        <img
          src={tenant.branding.logo}
          alt={`${tenant.name} logo`}
          className="w-8 h-8 rounded-lg"
        />
      ) : (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: tenant.branding?.primaryColor || '#3b82f6',
          }}
        >
          <span className="text-white font-bold text-sm">
            {tenant.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <span
        className="text-xl font-bold"
        style={{ color: tenant.branding?.primaryColor || '#1f2937' }}
      >
        {tenant.name}
      </span>
    </div>
  );
};
