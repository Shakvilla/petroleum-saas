import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '@/types';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

interface UIActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      sidebarOpen: true,
      notifications: [],
      loading: false,
      error: null,

      // Actions
      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme });

        // Apply theme to document
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');

          if (theme === 'system') {
            const systemTheme = window.matchMedia(
              '(prefers-color-scheme: dark)'
            ).matches
              ? 'dark'
              : 'light';
            root.classList.add(systemTheme);
          } else {
            root.classList.add(theme);
          }
        }
      },

      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (sidebarOpen: boolean) => {
        set({ sidebarOpen });
      },

      showNotification: (notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
          ...notification,
          id,
        };

        set(state => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-dismiss after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().hideNotification(id);
          }, notification.duration || 5000);
        }
      },

      hideNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(
            notification => notification.id !== id
          ),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'ui-storage',
      partialize: state => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
