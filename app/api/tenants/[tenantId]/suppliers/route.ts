import { NextRequest, NextResponse } from 'next/server';
import { mockApiService } from '@/lib/mock-api/mock-api-service';

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

    // Mock suppliers data for the tenant
    const suppliers = [
      {
        id: 'supplier-001',
        name: 'PetroSupply Co',
        type: 'WHOLESALER',
        contact: {
          name: 'Robert Davis',
          email: 'robert@petrosupply.com',
          phone: '+1-555-1001',
        },
        address: {
          street: '1000 Industrial Blvd',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA',
        },
        fuelTypes: ['GASOLINE', 'DIESEL', 'KEROSENE'],
        rating: 4.8,
        status: 'ACTIVE',
        lastDelivery: '2024-01-14T15:30:00Z',
        totalDeliveries: 156,
        averageDeliveryTime: 45,
        tenantId,
      },
      {
        id: 'supplier-002',
        name: 'FuelMax Distributors',
        type: 'DISTRIBUTOR',
        contact: {
          name: 'Jennifer Lee',
          email: 'jennifer@fuelmax.com',
          phone: '+1-555-1002',
        },
        address: {
          street: '2500 Energy Way',
          city: 'Dallas',
          state: 'TX',
          zipCode: '75201',
          country: 'USA',
        },
        fuelTypes: ['GASOLINE', 'DIESEL'],
        rating: 4.6,
        status: 'ACTIVE',
        lastDelivery: '2024-01-13T11:20:00Z',
        totalDeliveries: 89,
        averageDeliveryTime: 52,
        tenantId,
      },
      {
        id: 'supplier-003',
        name: 'Aviation Fuel Specialists',
        type: 'SPECIALIST',
        contact: {
          name: 'David Chen',
          email: 'david@aviationfuel.com',
          phone: '+1-555-1003',
        },
        address: {
          street: '500 Airport Blvd',
          city: 'Houston',
          state: 'TX',
          zipCode: '77032',
          country: 'USA',
        },
        fuelTypes: ['KEROSENE'],
        rating: 4.9,
        status: 'ACTIVE',
        lastDelivery: '2024-01-15T08:00:00Z',
        totalDeliveries: 34,
        averageDeliveryTime: 38,
        tenantId,
      },
      {
        id: 'supplier-004',
        name: 'Lubricant Solutions Inc',
        type: 'SPECIALIST',
        contact: {
          name: 'Maria Rodriguez',
          email: 'maria@lubricantsolutions.com',
          phone: '+1-555-1004',
        },
        address: {
          street: '750 Chemical Row',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'USA',
        },
        fuelTypes: ['LUBRICANT'],
        rating: 4.7,
        status: 'INACTIVE',
        lastDelivery: '2024-01-05T14:15:00Z',
        totalDeliveries: 23,
        averageDeliveryTime: 67,
        tenantId,
      },
    ];

    const supplierStats = {
      totalSuppliers: suppliers.length,
      activeSuppliers: suppliers.filter(s => s.status === 'ACTIVE').length,
      inactiveSuppliers: suppliers.filter(s => s.status === 'INACTIVE').length,
      averageRating:
        suppliers.length > 0
          ? Math.round(
              (suppliers.reduce((sum, s) => sum + s.rating, 0) /
                suppliers.length) *
                100
            ) / 100
          : 0,
      totalDeliveries: suppliers.reduce((sum, s) => sum + s.totalDeliveries, 0),
      typeDistribution: {
        WHOLESALER: suppliers.filter(s => s.type === 'WHOLESALER').length,
        DISTRIBUTOR: suppliers.filter(s => s.type === 'DISTRIBUTOR').length,
        SPECIALIST: suppliers.filter(s => s.type === 'SPECIALIST').length,
      },
    };

    return NextResponse.json({
      data: {
        suppliers,
        stats: supplierStats,
      },
      meta: {
        tenantId,
        totalSuppliers: suppliers.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await params;
    const body = await request.json();

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    // Create new supplier
    const newSupplier = {
      id: `supplier-${Date.now()}`,
      ...body,
      status: 'ACTIVE',
      rating: 0,
      totalDeliveries: 0,
      averageDeliveryTime: 0,
      tenantId,
    };

    return NextResponse.json(
      {
        data: newSupplier,
        meta: { tenantId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
