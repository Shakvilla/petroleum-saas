import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Tenant,
  TenantSettings,
  BrandingConfig,
  FeatureFlags,
} from '@/types';

interface TenantState {
  current: Tenant | null;
  settings: TenantSettings | null;
  branding: BrandingConfig | null;
  features: FeatureFlags | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  cache: Map<string, any>;
}

interface TenantActions {
  setTenant: (tenant: Tenant) => void;
  updateSettings: (settings: Partial<TenantSettings>) => void;
  updateBranding: (branding: Partial<BrandingConfig>) => void;
  updateFeatures: (features: Partial<FeatureFlags>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
  setCache: (key: string, value: any) => void;
  getCache: (key: string) => any;
  clearCache: () => void;
  clearCacheKey: (key: string) => void;
}

type TenantStore = TenantState & TenantActions;

export const useTenantStore = create<TenantStore>()(
  persist(
    (set, get) => ({
      // Initial state
      current: null,
      settings: null,
      branding: null,
      features: null,
      isLoading: false,
      error: null,
      lastUpdated: null,
      cache: new Map(),

      // Actions
      setTenant: (tenant: Tenant) => {
        set({
          current: tenant,
          settings: tenant.settings,
          branding: tenant.branding,
          features: tenant.features,
          error: null,
          lastUpdated: new Date(),
        });
      },

      updateSettings: (settings: Partial<TenantSettings>) => {
        const { current } = get();
        if (!current) return;

        const updatedSettings = { ...current.settings, ...settings };
        const updatedTenant = { ...current, settings: updatedSettings };

        set({
          current: updatedTenant,
          settings: updatedSettings,
        });
      },

      updateBranding: (branding: Partial<BrandingConfig>) => {
        const { current } = get();
        if (!current) return;

        const updatedBranding = { ...current.branding, ...branding };
        const updatedTenant = { ...current, branding: updatedBranding };

        set({
          current: updatedTenant,
          branding: updatedBranding,
        });
      },

      updateFeatures: (features: Partial<FeatureFlags>) => {
        const { current } = get();
        if (!current) return;

        const updatedFeatures = { ...current.features, ...features };
        const updatedTenant = { ...current, features: updatedFeatures };

        set({
          current: updatedTenant,
          features: updatedFeatures,
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          current: null,
          settings: null,
          branding: null,
          features: null,
          error: null,
          lastUpdated: null,
          cache: new Map(),
        });
      },

      setCache: (key: string, value: any) => {
        set(state => {
          const newCache = new Map(state.cache);
          newCache.set(key, value);
          return { cache: newCache };
        });
      },

      getCache: (key: string) => {
        return get().cache.get(key);
      },

      clearCache: () => {
        set({ cache: new Map() });
      },

      clearCacheKey: (key: string) => {
        set(state => {
          const newCache = new Map(state.cache);
          newCache.delete(key);
          return { cache: newCache };
        });
      },
    }),
    {
      name: 'tenant-storage',
      partialize: state => ({
        current: state.current,
        settings: state.settings,
        branding: state.branding,
        features: state.features,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
