'use client';

import type React from 'react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { TenantProvider, useTenant } from '@/components/tenant-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  BarChart3,
  Fuel,
  Truck,
  Users,
  DollarSign,
  Settings,
  Menu,
  Bell,
  Search,
  Building2,
  Package,
  FileText,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Navigation items without tenant prefix - will be prefixed dynamically
const navigationItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Inventory', href: '/inventory', icon: Fuel },
  { name: 'Distribution', href: '/distribution', icon: Truck },
  { name: 'Sales', href: '/sales', icon: DollarSign },
  { name: 'Suppliers', href: '/suppliers', icon: Building2 },
  { name: 'Fleet', href: '/fleet', icon: Package },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  tenant: string;
}

// Inner component that has access to tenant context
function DashboardLayoutInner({ children, tenant }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { tenant: tenantContext } = useTenant();

  // Create tenant-aware navigation
  const navigation = navigationItems.map(item => ({
    ...item,
    href: `/${tenant}${item.href === '/' ? '' : item.href}`,
  }));

  // Function to check if a navigation item is current
  const isCurrentPage = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center px-6 border-b">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Fuel className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-bold text-gray-900">
                    {tenantContext?.name || 'PetroManager'}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {tenant}
                  </div>
                </div>
              </div>
            </div>
            <nav className="flex-1 space-y-2 px-4 py-6">
              {navigation.map(item => {
                const isCurrent = isCurrentPage(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200 shadow-sm">
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Fuel className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">
                  {tenantContext?.name || 'PetroManager'}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {tenant} Dashboard
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-2 px-4 py-6">
              {navigation.map(item => {
                const isCurrent = isCurrentPage(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-2 lg:gap-x-4">
              <div className="text-sm font-medium text-gray-900 capitalize hidden sm:block">
                {tenantContext?.name || `${tenant} Petroleum`}
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 text-xs"
              >
                Active
              </Badge>
            </div>

            <div className="flex flex-1 justify-end gap-x-2 lg:gap-x-4">
              <div className="flex items-center gap-x-2 lg:gap-x-4">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-48 lg:w-64 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                    3
                  </Badge>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback className="text-xs">SJ</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>Sarah Johnson</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs font-normal text-gray-500">
                      admin@{tenant}.com
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-4 sm:py-6 lg:py-8 bg-gray-50 min-h-screen">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Main component that wraps with providers
export function DashboardLayout({ children, tenant }: DashboardLayoutProps) {
  // Create a QueryClient instance
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TenantProvider initialTenantId={tenant}>
        <DashboardLayoutInner tenant={tenant}>{children}</DashboardLayoutInner>
      </TenantProvider>
    </QueryClientProvider>
  );
}
