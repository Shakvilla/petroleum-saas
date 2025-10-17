import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/components/responsive-provider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronRight,
  ChevronDown,
  Home,
  MoreHorizontal,
} from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

export interface ResponsiveBreadcrumbSystemProps {
  items: BreadcrumbItem[];
  maxItems?: number;
  showHome?: boolean;
  homeHref?: string;
  onItemClick?: (href: string) => void;
  className?: string;
  separator?: React.ReactNode;
  showIcons?: boolean;
  truncateLabels?: boolean;
}

const defaultMaxItems = {
  mobile: 2,
  tablet: 4,
  desktop: 6,
};

export function ResponsiveBreadcrumbSystem({
  items,
  maxItems,
  showHome = true,
  homeHref = '/',
  onItemClick,
  className,
  separator,
  showIcons = true,
  truncateLabels = true,
}: ResponsiveBreadcrumbSystemProps) {
  const { isMobile, isTablet } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();

  const getMaxItems = () => {
    if (maxItems) return maxItems;
    if (isMobile) return defaultMaxItems.mobile;
    if (isTablet) return defaultMaxItems.tablet;
    return defaultMaxItems.desktop;
  };

  const handleItemClick = (href: string) => {
    if (onItemClick) {
      onItemClick(href);
    } else {
      router.push(href);
    }
  };

  const maxVisibleItems = getMaxItems();
  const shouldTruncate = items.length > maxVisibleItems;

  let visibleItems: BreadcrumbItem[] = [];
  let hiddenItems: BreadcrumbItem[] = [];

  if (shouldTruncate) {
    // Always show the last item (current page)
    const lastItem = items[items.length - 1];
    
    // Show first item (or home) and last item, with ellipsis in between
    if (showHome) {
      visibleItems = [
        { label: 'Home', href: homeHref, icon: Home },
        ...items.slice(-maxVisibleItems + 1),
      ];
    } else {
      visibleItems = items.slice(-maxVisibleItems);
    }
    
    // Hidden items are everything in between
    const startIndex = showHome ? 1 : 0;
    const endIndex = items.length - maxVisibleItems + (showHome ? 1 : 0);
    hiddenItems = items.slice(startIndex, endIndex);
  } else {
    if (showHome) {
      visibleItems = [
        { label: 'Home', href: homeHref, icon: Home },
        ...items,
      ];
    } else {
      visibleItems = items;
    }
  }

  const defaultSeparator = separator || <ChevronRight className="h-4 w-4" />;

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap">
          {visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;
            const isFirst = index === 0;
            
            return (
              <React.Fragment key={`${item.href || item.label}-${index}`}>
                {index > 0 && (
                  <BreadcrumbSeparator className="mx-2">
                    {defaultSeparator}
                  </BreadcrumbSeparator>
                )}
                
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center space-x-2">
                      {showIcons && item.icon && (
                        <item.icon className="h-4 w-4 text-gray-500" />
                      )}
                      <span className={cn(
                        'font-medium text-gray-900',
                        isMobile && truncateLabels ? 'text-sm' : 'text-base',
                        truncateLabels && 'truncate max-w-32'
                      )}>
                        {item.label}
                      </span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <button
                        onClick={() => item.href && handleItemClick(item.href)}
                        className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                      >
                        {showIcons && item.icon && (
                          <item.icon className="h-4 w-4 text-gray-500" />
                        )}
                        <span className={cn(
                          'text-gray-600 hover:text-blue-600',
                          isMobile && truncateLabels ? 'text-sm' : 'text-base',
                          truncateLabels && 'truncate max-w-32'
                        )}>
                          {item.label}
                        </span>
                      </button>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                
                {/* Show ellipsis dropdown for hidden items */}
                {isFirst && shouldTruncate && hiddenItems.length > 0 && (
                  <>
                    <BreadcrumbSeparator className="mx-2">
                      {defaultSeparator}
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-gray-500 hover:text-gray-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More breadcrumbs</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          {hiddenItems.map((hiddenItem, hiddenIndex) => (
                            <DropdownMenuItem
                              key={`${hiddenItem.href || hiddenItem.label}-${hiddenIndex}`}
                              onClick={() => hiddenItem.href && handleItemClick(hiddenItem.href)}
                              className="flex items-center space-x-2"
                            >
                              {showIcons && hiddenItem.icon && (
                                <hiddenItem.icon className="h-4 w-4" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">
                                  {hiddenItem.label}
                                </div>
                                {hiddenItem.description && (
                                  <div className="text-xs text-gray-500 truncate">
                                    {hiddenItem.description}
                                  </div>
                                )}
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

// Mobile-optimized breadcrumb component
export interface MobileBreadcrumbProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  backHref?: string;
  onBackClick?: () => void;
  className?: string;
}

export function MobileBreadcrumb({
  items,
  showBackButton = true,
  backHref,
  onBackClick,
  className,
}: MobileBreadcrumbProps) {
  const { isMobile } = useResponsive();
  const router = useRouter();

  if (!isMobile) {
    return null;
  }

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const currentItem = items[items.length - 1];
  const parentItem = items[items.length - 2];

  return (
    <div className={cn('flex items-center justify-between p-4 bg-white border-b border-gray-200', className)}>
      <div className="flex items-center space-x-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2"
            aria-label="Go back"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
        )}
        
        <div className="flex items-center space-x-2">
          {currentItem.icon && (
            <currentItem.icon className="h-5 w-5 text-gray-500" />
          )}
          <div>
            <h1 className="font-semibold text-gray-900 text-lg">
              {currentItem.label}
            </h1>
            {parentItem && (
              <p className="text-sm text-gray-500">
                {parentItem.label}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Optional action button */}
      <div className="flex items-center space-x-2">
        {/* Add any action buttons here */}
      </div>
    </div>
  );
}

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbsFromPath(
  pathname: string,
  routeMap: Record<string, { label: string; icon?: React.ComponentType<{ className?: string }> }> = {}
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    const routeConfig = routeMap[currentPath];
    const label = routeConfig?.label || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      label,
      href: currentPath,
      icon: routeConfig?.icon,
    });
  });

  return breadcrumbs;
}

// Hook for breadcrumb management
export function useBreadcrumbs(
  pathname: string,
  routeMap: Record<string, { label: string; icon?: React.ComponentType<{ className?: string }> }> = {}
) {
  const breadcrumbs = React.useMemo(() => {
    return generateBreadcrumbsFromPath(pathname, routeMap);
  }, [pathname, routeMap]);

  return breadcrumbs;
}

// Predefined route maps for common petroleum SaaS routes
export const petroleumRouteMap: Record<string, { label: string; icon?: React.ComponentType<{ className?: string }> }> = {
  '/': { label: 'Dashboard', icon: Home },
  '/inventory': { label: 'Inventory', icon: () => <div>⛽</div> },
  '/inventory/add': { label: 'Add Stock', icon: () => <div>➕</div> },
  '/inventory/edit': { label: 'Edit Stock', icon: () => <div>✏️</div> },
  '/distribution': { label: 'Distribution', icon: () => <div>🚛</div> },
  '/distribution/new': { label: 'New Delivery', icon: () => <div>📦</div> },
  '/sales': { label: 'Sales', icon: () => <div>💰</div> },
  '/suppliers': { label: 'Suppliers', icon: () => <div>🏢</div> },
  '/fleet': { label: 'Fleet', icon: () => <div>🚚</div> },
  '/reports': { label: 'Reports', icon: () => <div>📊</div> },
  '/users': { label: 'Users', icon: () => <div>👥</div> },
  '/settings': { label: 'Settings', icon: () => <div>⚙️</div> },
};
