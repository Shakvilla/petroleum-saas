import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/components/responsive-provider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Home,
  ChevronRight,
  X,
  LogOut,
  User,
  HelpCircle,
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavigationItem[];
  description?: string;
}

export interface MobileNavigationSystemProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  notifications?: number;
  onLogout?: () => void;
  navigationItems?: NavigationItem[];
  className?: string;
}

const defaultNavigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: BarChart3, description: 'Overview and analytics' },
  { name: 'Inventory', href: '/inventory', icon: Fuel, description: 'Fuel stock management' },
  { name: 'Distribution', href: '/distribution', icon: Truck, description: 'Delivery management' },
  { name: 'Sales', href: '/sales', icon: DollarSign, description: 'Sales and revenue' },
  { name: 'Suppliers', href: '/suppliers', icon: Building2, description: 'Supplier management' },
  { name: 'Fleet', href: '/fleet', icon: Package, description: 'Vehicle fleet' },
  { name: 'Reports', href: '/reports', icon: FileText, description: 'Analytics and reports' },
  { name: 'Users', href: '/users', icon: Users, description: 'User management' },
  { name: 'Settings', href: '/settings', icon: Settings, description: 'System settings' },
];

export function MobileNavigationSystem({
  user,
  notifications = 0,
  onLogout,
  navigationItems = defaultNavigationItems,
  className,
}: MobileNavigationSystemProps) {
  const { isMobile, isTablet } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout?.();
    setIsOpen(false);
  };

  if (!isMobile && !isTablet) {
    return null; // Only show on mobile/tablet
  }

  return (
    <div className={cn('flex items-center', className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetTitle className="sr-only">
            Mobile Navigation Menu
          </SheetTitle>
          <MobileNavigationContent
            user={user}
            notifications={notifications}
            navigationItems={navigationItems}
            pathname={pathname}
            onNavigation={handleNavigation}
            onLogout={handleLogout}
            onClose={() => setIsOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface MobileNavigationContentProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  notifications: number;
  navigationItems: NavigationItem[];
  pathname: string;
  onNavigation: (href: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

function MobileNavigationContent({
  user,
  notifications,
  navigationItems,
  pathname,
  onNavigation,
  onLogout,
  onClose,
}: MobileNavigationContentProps) {
  const { isMobile } = useResponsive();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Fuel className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Petroleum SaaS</h2>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
              {user.role && (
                <Badge variant="secondary" className="text-xs mt-1">
                  {user.role}
                </Badge>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onNavigation('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigation('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigation('/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigation('/notifications')}
            className="relative p-1"
          >
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                {notifications > 99 ? '99+' : notifications}
              </Badge>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigation('/inventory/add')}
            className="flex items-center space-x-2 h-10"
          >
            <Fuel className="h-4 w-4" />
            <span className="text-xs">Add Stock</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigation('/distribution/new')}
            className="flex items-center space-x-2 h-10"
          >
            <Truck className="h-4 w-4" />
            <span className="text-xs">New Delivery</span>
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <MobileNavigationItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              onNavigation={onNavigation}
            />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Petroleum SaaS v1.0.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            © 2024 All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}

interface MobileNavigationItemProps {
  item: NavigationItem;
  isActive: boolean;
  onNavigation: (href: string) => void;
}

function MobileNavigationItem({ item, isActive, onNavigation }: MobileNavigationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      onNavigation(item.href);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors',
          isActive
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        <div className="flex items-center space-x-3">
          <item.icon className={cn(
            'h-5 w-5',
            isActive ? 'text-blue-600' : 'text-gray-500'
          )} />
          <div>
            <div className="font-medium text-sm">{item.name}</div>
            {item.description && (
              <div className="text-xs text-gray-500 mt-0.5">
                {item.description}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {item.badge && item.badge > 0 && (
            <Badge variant="secondary" className="text-xs">
              {item.badge > 99 ? '99+' : item.badge}
            </Badge>
          )}
          {hasChildren && (
            <ChevronRight className={cn(
              'h-4 w-4 transition-transform',
              isExpanded && 'rotate-90'
            )} />
          )}
        </div>
      </button>
      
      {hasChildren && isExpanded && (
        <div className="ml-8 mt-2 space-y-1">
          {item.children!.map((child) => (
            <button
              key={child.href}
              onClick={() => onNavigation(child.href)}
              className="w-full flex items-center space-x-3 p-2 rounded-lg text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <child.icon className="h-4 w-4" />
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Mobile Bottom Navigation Component
export interface MobileBottomNavigationProps {
  items: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }>;
  activePath?: string;
  onNavigation?: (href: string) => void;
  className?: string;
}

export function MobileBottomNavigation({
  items,
  activePath,
  onNavigation,
  className,
}: MobileBottomNavigationProps) {
  const { isMobile } = useResponsive();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    if (onNavigation) {
      onNavigation(href);
    } else {
      router.push(href);
    }
  };

  if (!isMobile) {
    return null;
  }

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40',
      'safe-area-bottom',
      className
    )}>
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive = activePath === item.href;
          
          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                'flex flex-col items-center justify-center p-2 min-w-0 flex-1',
                'transition-colors duration-200',
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              aria-label={item.name}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1 truncate">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
