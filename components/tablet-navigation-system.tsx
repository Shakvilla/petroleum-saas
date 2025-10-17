import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/components/responsive-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
  Bell,
  Search,
  Building2,
  Package,
  FileText,
  Home,
  ChevronRight,
  LogOut,
  User,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';

export interface TabletNavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: TabletNavigationItem[];
  description?: string;
  category?: string;
}

export interface TabletNavigationSystemProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  notifications?: number;
  onLogout?: () => void;
  navigationItems?: TabletNavigationItem[];
  className?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

const defaultTabletNavigationItems: TabletNavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: BarChart3, 
    description: 'Overview and analytics',
    category: 'Main'
  },
  { 
    name: 'Inventory', 
    href: '/inventory', 
    icon: Fuel, 
    description: 'Fuel stock management',
    category: 'Operations'
  },
  { 
    name: 'Distribution', 
    href: '/distribution', 
    icon: Truck, 
    description: 'Delivery management',
    category: 'Operations'
  },
  { 
    name: 'Sales', 
    href: '/sales', 
    icon: DollarSign, 
    description: 'Sales and revenue',
    category: 'Business'
  },
  { 
    name: 'Suppliers', 
    href: '/suppliers', 
    icon: Building2, 
    description: 'Supplier management',
    category: 'Business'
  },
  { 
    name: 'Fleet', 
    href: '/fleet', 
    icon: Package, 
    description: 'Vehicle fleet',
    category: 'Operations'
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: FileText, 
    description: 'Analytics and reports',
    category: 'Analytics'
  },
  { 
    name: 'Users', 
    href: '/users', 
    icon: Users, 
    description: 'User management',
    category: 'Administration'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings, 
    description: 'System settings',
    category: 'Administration'
  },
];

export function TabletNavigationSystem({
  user,
  notifications = 0,
  onLogout,
  navigationItems = defaultTabletNavigationItems,
  className,
  showSearch = true,
  onSearch,
}: TabletNavigationSystemProps) {
  const { isTablet, isMobile } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleLogout = () => {
    onLogout?.();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Only show on tablet
  if (!isTablet || isMobile) {
    return null;
  }

  // Group navigation items by category
  const groupedItems = navigationItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, TabletNavigationItem[]>);

  return (
    <div className={cn(
      'flex flex-col h-full bg-white border-r border-gray-200',
      isCollapsed ? 'w-16' : 'w-64',
      'transition-all duration-300 ease-in-out',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Fuel className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Petroleum SaaS</h2>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search */}
      {showSearch && !isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* User Profile */}
      {user && !isCollapsed && (
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
                <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Collapsed User Avatar */}
      {user && isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation('/help')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Notifications */}
      <div className="p-4 border-b border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            isCollapsed && 'justify-center p-2'
          )}
          onClick={() => handleNavigation('/notifications')}
        >
          <div className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                {notifications > 99 ? '99+' : notifications}
              </Badge>
            )}
          </div>
          {!isCollapsed && (
            <span className="ml-3">Notifications</span>
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {category}
                </h3>
              )}
              <div className="space-y-1">
                {items.map((item) => (
                  <TabletNavigationItem
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    isCollapsed={isCollapsed}
                    onNavigation={handleNavigation}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      {!isCollapsed && (
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
      )}
    </div>
  );
}

interface TabletNavigationItemProps {
  item: TabletNavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  onNavigation: (href: string) => void;
}

function TabletNavigationItem({ 
  item, 
  isActive, 
  isCollapsed, 
  onNavigation 
}: TabletNavigationItemProps) {
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
        title={isCollapsed ? item.name : undefined}
      >
        <div className="flex items-center space-x-3">
          <item.icon className={cn(
            'h-5 w-5 flex-shrink-0',
            isActive ? 'text-blue-600' : 'text-gray-500'
          )} />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{item.name}</div>
              {item.description && (
                <div className="text-xs text-gray-500 mt-0.5 truncate">
                  {item.description}
                </div>
              )}
            </div>
          )}
        </div>
        {!isCollapsed && (
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
        )}
      </button>
      
      {hasChildren && isExpanded && !isCollapsed && (
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

// Tablet-specific layout component
export interface TabletLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  notifications?: number;
  onLogout?: () => void;
  navigationItems?: TabletNavigationItem[];
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export function TabletLayout({
  children,
  user,
  notifications = 0,
  onLogout,
  navigationItems,
  showSearch = true,
  onSearch,
  className,
}: TabletLayoutProps) {
  const { isTablet } = useResponsive();

  if (!isTablet) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn('flex h-screen bg-gray-50', className)}>
      <TabletNavigationSystem
        user={user}
        notifications={notifications}
        onLogout={onLogout}
        navigationItems={navigationItems}
        showSearch={showSearch}
        onSearch={onSearch}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
