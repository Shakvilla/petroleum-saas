'use client';

import React from 'react';
import VisualMarketingSection from './visual-marketing-section';
import { TenantBranding } from './tenant-branding';
import { TenantProvider } from '@/components/tenant-provider';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <TenantProvider>
      <div className="min-h-screen flex">
        {/* Left Panel - Form Content (40%) */}
        <div className="flex-1 lg:flex-[0.4] flex flex-col justify-center px-8 py-12 bg-white">
          {/* Header with tenant branding */}
          <div className="mb-8">
            <TenantBranding />
          </div>

          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>

        {/* Right Panel - Visual Marketing (60%) */}
        <div className="hidden lg:flex lg:flex-[0.6] bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
          <VisualMarketingSection />
        </div>
      </div>
    </TenantProvider>
  );
};
