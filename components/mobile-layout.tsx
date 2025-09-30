'use client';

import React, { useState, useEffect } from 'react';
import {
  useMobile,
  useOrientation,
  useSafeArea,
} from '@/hooks/utils/use-mobile';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function MobileLayout({
  children,
  sidebar,
  header,
  footer,
  className,
}: MobileLayoutProps) {
  const { isMobile, isTablet } = useMobile();
  const orientation = useOrientation();
  const safeArea = useSafeArea();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [header]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  if (!isMobile && !isTablet) {
    // Desktop layout
    return (
      <div className={cn('flex h-screen', className)}>
        {sidebar && (
          <aside className="w-64 bg-white border-r border-gray-200">
            {sidebar}
          </aside>
        )}
        <div className="flex-1 flex flex-col">
          {header && (
            <header
              ref={headerRef}
              className="bg-white border-b border-gray-200"
            >
              {header}
            </header>
          )}
          <main className="flex-1 overflow-auto">{children}</main>
          {footer && (
            <footer className="bg-white border-t border-gray-200">
              {footer}
            </footer>
          )}
        </div>
      </div>
    );
  }

  // Mobile/Tablet layout
  return (
    <div className={cn('flex flex-col h-screen', className)}>
      {/* Header */}
      {header && (
        <header
          ref={headerRef}
          className="bg-white border-b border-gray-200 z-40"
          style={{
            paddingTop: `${safeArea.top}px`,
          }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 text-center">{header}</div>
            <div className="w-9" /> {/* Spacer for balance */}
          </div>
        </header>
      )}

      {/* Main content */}
      <main
        className="flex-1 overflow-auto"
        style={{
          paddingBottom: `${safeArea.bottom}px`,
        }}
      >
        {children}
      </main>

      {/* Footer */}
      {footer && (
        <footer
          className="bg-white border-t border-gray-200"
          style={{
            paddingBottom: `${safeArea.bottom}px`,
          }}
        >
          {footer}
        </footer>
      )}

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      {sidebar && (
        <aside
          className={cn(
            'fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50',
            'transform transition-transform duration-300 ease-in-out',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'overflow-y-auto'
          )}
          style={{
            paddingTop: `${safeArea.top}px`,
            paddingBottom: `${safeArea.bottom}px`,
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="p-2"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4">{sidebar}</div>
        </aside>
      )}
    </div>
  );
}

// Mobile navigation component
interface MobileNavigationProps {
  items: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
    active?: boolean;
  }>;
  onItemClick?: (href: string) => void;
}

export function MobileNavigation({
  items,
  onItemClick,
}: MobileNavigationProps) {
  const { isMobile } = useMobile();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleItemClick = (href: string, index: number) => {
    setCurrentIndex(index);
    onItemClick?.(href);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < items.length - 1 ? prev + 1 : 0));
  };

  if (!isMobile) {
    return (
      <nav className="flex space-x-1">
        {items.map((item, index) => (
          <Button
            key={item.href}
            variant={item.active ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleItemClick(item.href, index)}
            className="flex items-center gap-2"
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </nav>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        onClick={goToPrevious}
        disabled={items.length <= 1}
        aria-label="Previous item"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1 text-center">
        <div className="flex items-center justify-center gap-2">
          {items[currentIndex]?.icon}
          <span className="font-medium">{items[currentIndex]?.label}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {currentIndex + 1} of {items.length}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={goToNext}
        disabled={items.length <= 1}
        aria-label="Next item"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Mobile bottom navigation
interface MobileBottomNavProps {
  items: Array<{
    label: string;
    href: string;
    icon: React.ReactNode;
    active?: boolean;
    badge?: number;
  }>;
  onItemClick?: (href: string) => void;
}

export function MobileBottomNav({ items, onItemClick }: MobileBottomNavProps) {
  const { isMobile } = useMobile();
  const safeArea = useSafeArea();

  if (!isMobile) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40"
      style={{
        paddingBottom: `${safeArea.bottom}px`,
      }}
    >
      <div className="flex items-center justify-around py-2">
        {items.map(item => (
          <button
            key={item.href}
            onClick={() => onItemClick?.(item.href)}
            className={cn(
              'flex flex-col items-center justify-center p-2 min-w-0 flex-1',
              'transition-colors duration-200',
              item.active
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            )}
            aria-label={item.label}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
