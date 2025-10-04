import { NextRequest, NextResponse } from 'next/server';

// Mock tenant data - replace with actual database queries
const mockTenants: Record<string, any> = {
  acme: {
    id: 'acme',
    name: 'ACME Petroleum',
    slug: 'acme',
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
    },
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      logo: '/logos/acme-logo.png',
      favicon: '/favicons/acme-favicon.ico',
    },
    features: {
      inventory: true,
      sales: true,
      reports: true,
      analytics: true,
      multiLocation: false,
      apiAccess: true,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  petrocorp: {
    id: 'petrocorp',
    name: 'PetroCorp Industries',
    slug: 'petrocorp',
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
    },
    branding: {
      primaryColor: '#059669',
      secondaryColor: '#047857',
      logo: '/logos/petrocorp-logo.png',
      favicon: '/favicons/petrocorp-favicon.ico',
    },
    features: {
      inventory: true,
      sales: true,
      reports: true,
      analytics: true,
      multiLocation: true,
      apiAccess: true,
    },
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-25T12:15:00Z',
  },
  fuelmax: {
    id: 'fuelmax',
    name: 'FuelMax Distribution',
    slug: 'fuelmax',
    settings: {
      timezone: 'America/Chicago',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      notifications: {
        email: true,
        sms: false,
        push: false,
      },
    },
    branding: {
      primaryColor: '#dc2626',
      secondaryColor: '#b91c1c',
      logo: '/logos/fuelmax-logo.png',
      favicon: '/favicons/fuelmax-favicon.ico',
    },
    features: {
      inventory: true,
      sales: true,
      reports: true,
      analytics: false,
      multiLocation: false,
      apiAccess: false,
    },
    createdAt: '2024-01-05T14:30:00Z',
    updatedAt: '2024-01-18T09:45:00Z',
  },
  'demo-tenant': {
    id: 'demo-tenant',
    name: 'Demo',
    slug: 'demo-tenant',
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
    },
    branding: {
      primaryColor: '#7c3aed',
      secondaryColor: '#5b21b6',
      logo: '/logos/demo-logo.png',
      favicon: '/favicons/demo-favicon.ico',
    },
    features: {
      inventory: true,
      sales: true,
      reports: true,
      analytics: true,
      multiLocation: true,
      apiAccess: true,
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
  },
  inventory: {
    id: 'inventory',
    name: 'Inventory Management Corp',
    slug: 'inventory',
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
    },
    branding: {
      primaryColor: '#059669',
      secondaryColor: '#047857',
      logo: '/logos/inventory-logo.png',
      favicon: '/favicons/inventory-favicon.ico',
    },
    features: {
      inventory: true,
      sales: true,
      reports: true,
      analytics: true,
      multiLocation: false,
      apiAccess: true,
    },
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z',
  },
  'petromax-energy': {
    id: 'petromax-energy',
    name: 'PetroMax Energy Solutions',
    slug: 'petromax-energy',
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      businessHours: {
        start: '06:00',
        end: '22:00',
        days: [1, 2, 3, 4, 5, 6],
      },
    },
    branding: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      logo: '/logos/petromax-logo.png',
      favicon: '/favicons/petromax-favicon.ico',
    },
    features: {
      realTimeUpdates: true,
      advancedAnalytics: true,
      mobileApp: true,
      apiAccess: true,
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
  },
  'demo-company': {
    id: 'demo-company',
    name: 'Demo Company',
    domain: 'demo-company',
    settings: {
      timezone: 'America/Chicago',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      businessHours: {
        start: '06:00',
        end: '22:00',
        days: [1, 2, 3, 4, 5, 6],
      },
    },
    branding: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      logo: '/logos/demo-company-logo.png',
      favicon: '/favicons/demo-company-favicon.ico',
    },
    features: {
      realTimeUpdates: true,
      advancedAnalytics: true,
      mobileApp: true,
      apiAccess: true,
    },
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await params;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const tenant = mockTenants[tenantId];

    if (!tenant) {
      return NextResponse.json(
        { error: `Tenant '${tenantId}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(tenant);
  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching tenant:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
