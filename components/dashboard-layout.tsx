'use client';

import type React from 'react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { TenantProvider, useTenant } from '@/components/tenant-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/lib/auth/logout';
import { useToast } from '@/hooks/use-toast';
import { useResponsive, ResponsiveProvider } from '@/components/responsive-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
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
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useLogout();
  const { toast } = useToast();
  const { isMobile, isTablet } = useResponsive();

  // Create tenant-aware navigation
  const navigation = navigationItems.map(item => ({
    ...item,
    href: `/${tenant}${item.href === '/' ? '' : item.href}`,
  }));

  // Function to check if a navigation item is current
  const isCurrentPage = (href: string) => {
    return pathname === href;
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout({
        redirectTo: '/auth/login',
        clearStorage: true,
        showToast: true,
      });
      
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account.',
      });
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'There was an error logging out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Responsive Mobile/Tablet Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className={cn(
          'p-0',
          isMobile ? 'w-72' : 'w-80'
        )}>
          <SheetTitle className="sr-only">
            Navigation Menu
          </SheetTitle>
          <div className="flex h-full flex-col">
            <div className={cn(
              'flex items-center border-b',
              isMobile ? 'h-14 px-4' : 'h-16 px-6'
            )}>
              <div className="flex items-center">
                <div className={cn(
                  'bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg',
                  isMobile ? 'p-1.5' : 'p-2'
                )}>
                  <Fuel className={cn(
                    'text-white',
                    isMobile ? 'h-4 w-4' : 'h-5 w-5'
                  )} />
                </div>
                <div className={cn(
                  isMobile ? 'ml-2' : 'ml-3'
                )}>
                  <div className={cn(
                    'font-bold text-gray-900',
                    isMobile ? 'text-xs' : 'text-sm'
                  )}>
                    {tenantContext?.name || 'PetroManager'}
                  </div>
                  <div className={cn(
                    'text-gray-500 capitalize',
                    isMobile ? 'text-xs' : 'text-xs'
                  )}>
                    {tenant}
                  </div>
                </div>
              </div>
            </div>
            <nav className={cn(
              'flex-1 space-y-2 py-6',
              isMobile ? 'px-3' : 'px-4'
            )}>
              {navigation.map(item => {
                const isCurrent = isCurrentPage(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center font-medium rounded-xl transition-all duration-200',
                      isMobile ? 'px-3 py-2.5 text-sm' : 'px-4 py-3 text-sm',
                      isCurrent
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={cn(
                      'mr-3',
                      isMobile ? 'h-4 w-4' : 'h-5 w-5'
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Responsive Desktop Sidebar */}
      <div className={cn(
        'fixed inset-y-0 flex-col bg-white border-r border-gray-200 shadow-sm',
        'hidden lg:flex', // Fixed: removed conflicting classes
        isTablet ? 'lg:w-72' : 'lg:w-64'
      )}>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Fuel className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <div className={cn(
                  'font-bold text-gray-900',
                  isTablet ? 'text-base' : 'text-lg'
                )}>
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
                    className={cn(
                      'group flex items-center font-medium rounded-xl transition-all duration-200',
                      isTablet ? 'px-3 py-2.5 text-sm' : 'px-4 py-3 text-sm',
                      isCurrent
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <item.icon className={cn(
                      'mr-3',
                      isTablet ? 'h-4 w-4' : 'h-5 w-5'
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Responsive Main Content */}
      <div className={cn(
        isTablet ? 'lg:pl-72' : 'lg:pl-64'
      )}>
        {/* Responsive Top Navigation */}
        <div className={cn(
          'sticky top-0 z-40 flex shrink-0 items-center border-b border-gray-200 bg-white shadow-sm',
          isMobile ? 'h-14 px-3' : isTablet ? 'h-16 px-4' : 'h-16 px-4 sm:px-6 lg:px-8',
          isMobile ? 'gap-x-2' : isTablet ? 'gap-x-3' : 'gap-x-4 sm:gap-x-6'
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className={cn(
              isMobile ? 'h-5 w-5' : 'h-6 w-6'
            )} />
          </Button>

          <div className={cn(
            'flex flex-1 self-stretch',
            isMobile ? 'gap-x-2' : isTablet ? 'gap-x-3' : 'gap-x-4 lg:gap-x-6'
          )}>
            <div className={cn(
              'flex items-center',
              isMobile ? 'gap-x-1' : isTablet ? 'gap-x-2' : 'gap-x-2 lg:gap-x-4'
            )}>
              <div className={cn(
                'font-medium text-gray-900 capitalize',
                isMobile ? 'text-xs hidden' : isTablet ? 'text-sm' : 'text-sm',
                isMobile ? 'hidden' : 'block'
              )}>
                {tenantContext?.name || `${tenant} Petroleum`}
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  'bg-green-100 text-green-800',
                  isMobile ? 'text-xs' : 'text-xs'
                )}
              >
                Active
              </Badge>
            </div>

            <div className={cn(
              'flex flex-1 justify-end',
              isMobile ? 'gap-x-1' : isTablet ? 'gap-x-2' : 'gap-x-2 lg:gap-x-4'
            )}>
              <div className={cn(
                'flex items-center',
                isMobile ? 'gap-x-1' : isTablet ? 'gap-x-2' : 'gap-x-2 lg:gap-x-4'
              )}>
                <div className={cn(
                  'relative',
                  isMobile ? 'hidden' : isTablet ? 'block' : 'hidden sm:block'
                )}>
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className={cn(
                      'pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500',
                      isTablet ? 'w-32' : 'w-48 lg:w-64'
                    )}
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100"
                >
                  <Bell className={cn(
                    'text-gray-600',
                    isMobile ? 'h-4 w-4' : 'h-5 w-5'
                  )} />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                    3
                  </Badge>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        'relative rounded-full',
                        isMobile ? 'h-7 w-7' : 'h-8 w-8'
                      )}
                    >
                      <Avatar className={cn(
                        isMobile ? 'h-7 w-7' : 'h-8 w-8'
                      )}>
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback className={cn(
                          isMobile ? 'text-xs' : 'text-xs'
                        )}>
                          SJ
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={cn(
                    'align-end',
                    isMobile ? 'w-48' : 'w-56'
                  )}>
                    <DropdownMenuLabel>Sarah Johnson</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs font-normal text-gray-500">
                      admin@{tenant}.com
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Page Content */}
        <main className={cn(
          'bg-gray-50 min-h-screen',
          isMobile ? 'py-3' : isTablet ? 'py-4' : 'py-4 sm:py-6 lg:py-8'
        )}>
          <div className={cn(
            isMobile ? 'px-3' : isTablet ? 'px-4' : 'px-4 sm:px-6 lg:px-8'
          )}>
            {children}
          </div>
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
        <ResponsiveProvider>
          <DashboardLayoutInner tenant={tenant}>{children}</DashboardLayoutInner>
        </ResponsiveProvider>
      </TenantProvider>
    </QueryClientProvider>
  );
}
