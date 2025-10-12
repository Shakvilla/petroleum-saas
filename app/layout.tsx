import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { TenantProvider } from '@/components/tenant-provider';
import { ThemeApplicationProvider } from '@/components/theme-application-provider';
import { UnifiedThemeProvider } from '@/components/unified-theme-provider';
import { ThemeVariableInjector, DynamicTailwindInjector } from '@/components/theme-variable-injector';
import RouteProgressBar from '@/components/route-progress-bar';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'PetroManager',
  description: 'Petroleum Management System',
  generator: 'Petroleum Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={poppins.variable}>
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
        <TenantProvider>
          <ThemeApplicationProvider>
            <ThemeVariableInjector />
            <DynamicTailwindInjector />
            <UnifiedThemeProvider>
              {children}
            </UnifiedThemeProvider>
          </ThemeApplicationProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
