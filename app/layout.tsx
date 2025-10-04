import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { TenantProvider } from '@/components/tenant-provider';
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
      <body className={poppins.variable}>
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
        <TenantProvider>{children}</TenantProvider>
      </body>
    </html>
  );
}
