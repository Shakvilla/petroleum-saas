// Documentation: /docs/authentication/logout.md

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { ErrorReportingService } from '@/lib/error-reporting';
import { ErrorLoggingService } from '@/lib/error-logging';

export interface LogoutOptions {
  redirectTo?: string;
  clearStorage?: boolean;
  showToast?: boolean;
}

export class LogoutService {
  /**
   * Perform complete logout
   */
  static async logout(options: LogoutOptions = {}): Promise<void> {
    const {
      redirectTo = '/auth/login',
      clearStorage = true,
      showToast = true,
    } = options;

    try {
      // Log logout attempt
      ErrorLoggingService.info('User logout initiated', {
        component: 'LogoutService',
        action: 'logout',
      });

      // Clear auth store
      const authStore = useAuthStore.getState();
      await authStore.logout();

      // Clear localStorage if requested
      if (clearStorage && typeof window !== 'undefined') {
        this.clearLocalStorage();
      }

      // Clear sessionStorage
      if (typeof window !== 'undefined') {
        this.clearSessionStorage();
      }

      // Clear any cached data
      this.clearCachedData();

      // Log successful logout
      ErrorLoggingService.info('User logout completed successfully', {
        component: 'LogoutService',
        action: 'logout',
      });

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
    } catch (error) {
      // Log logout error
      ErrorLoggingService.error(
        error instanceof Error ? error : new Error('Logout failed'),
        {
          component: 'LogoutService',
          action: 'logout',
        }
      );

      ErrorReportingService.reportError(
        error instanceof Error ? error : new Error('Logout failed'),
        {
          component: 'LogoutService',
          action: 'logout',
        }
      );

      // Still redirect even if logout fails
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
    }
  }

  /**
   * Clear localStorage data
   */
  private static clearLocalStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      // Clear auth-related localStorage items
      const keysToRemove = [
        'auth-storage',
        'petroleum-saas-logs',
        'tenant-storage',
        'ui-storage',
        'settings-storage',
      ];

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // Clear any other localStorage items that might contain sensitive data
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (
          key.includes('auth') ||
          key.includes('token') ||
          key.includes('user') ||
          key.includes('session')
        ) {
          localStorage.removeItem(key);
        }
      });

      ErrorLoggingService.debug('LocalStorage cleared', {
        component: 'LogoutService',
        action: 'clearLocalStorage',
      });
    } catch (error) {
      ErrorLoggingService.warn('Failed to clear localStorage', {
        component: 'LogoutService',
        action: 'clearLocalStorage',
      });
    }
  }

  /**
   * Clear sessionStorage data
   */
  private static clearSessionStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      // Clear all sessionStorage
      sessionStorage.clear();

      ErrorLoggingService.debug('SessionStorage cleared', {
        component: 'LogoutService',
        action: 'clearSessionStorage',
      });
    } catch (error) {
      ErrorLoggingService.warn('Failed to clear sessionStorage', {
        component: 'LogoutService',
        action: 'clearSessionStorage',
      });
    }
  }

  /**
   * Clear cached data
   */
  private static clearCachedData(): void {
    try {
      // Clear any cached API responses
      if (typeof window !== 'undefined' && 'caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
        });
      }

      ErrorLoggingService.debug('Cached data cleared', {
        component: 'LogoutService',
        action: 'clearCachedData',
      });
    } catch (error) {
      ErrorLoggingService.warn('Failed to clear cached data', {
        component: 'LogoutService',
        action: 'clearCachedData',
      });
    }
  }

  /**
   * Force logout (emergency logout)
   */
  static async forceLogout(): Promise<void> {
    try {
      // Clear everything immediately
      if (typeof window !== 'undefined') {
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();

        // Clear cookies
        document.cookie.split(';').forEach(cookie => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });

        // Redirect immediately
        window.location.href = '/auth/login';
      }
    } catch (error) {
      // Last resort - hard redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  }
}

// Hook for logout functionality
export function useLogout() {
  const router = useRouter();

  const logout = async (options: LogoutOptions = {}) => {
    await LogoutService.logout({
      ...options,
      redirectTo: options.redirectTo || '/auth/login',
    });
  };

  const forceLogout = async () => {
    await LogoutService.forceLogout();
  };

  return {
    logout,
    forceLogout,
  };
}

