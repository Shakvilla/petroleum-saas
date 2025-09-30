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

    // Mock users data for the tenant
    const users = [
      {
        id: 'user-001',
        name: 'John Smith',
        email: 'john.smith@petromaxenergy.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        lastLoginAt: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        permissions: [
          { resource: 'tanks', action: 'read' },
          { resource: 'tanks', action: 'write' },
          { resource: 'deliveries', action: 'read' },
          { resource: 'deliveries', action: 'write' },
          { resource: 'users', action: 'manage' },
        ],
        tenantId,
      },
      {
        id: 'user-002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@petromaxenergy.com',
        role: 'MANAGER',
        status: 'ACTIVE',
        lastLoginAt: '2024-01-15T09:15:00Z',
        createdAt: '2024-01-02T00:00:00Z',
        permissions: [
          { resource: 'tanks', action: 'read' },
          { resource: 'tanks', action: 'write' },
          { resource: 'deliveries', action: 'read' },
          { resource: 'deliveries', action: 'write' },
        ],
        tenantId,
      },
      {
        id: 'user-003',
        name: 'Mike Wilson',
        email: 'mike.wilson@petromaxenergy.com',
        role: 'OPERATOR',
        status: 'ACTIVE',
        lastLoginAt: '2024-01-15T08:45:00Z',
        createdAt: '2024-01-03T00:00:00Z',
        permissions: [
          { resource: 'tanks', action: 'read' },
          { resource: 'deliveries', action: 'read' },
        ],
        tenantId,
      },
      {
        id: 'user-004',
        name: 'Lisa Brown',
        email: 'lisa.brown@petromaxenergy.com',
        role: 'VIEWER',
        status: 'INACTIVE',
        lastLoginAt: '2024-01-10T16:20:00Z',
        createdAt: '2024-01-04T00:00:00Z',
        permissions: [{ resource: 'tanks', action: 'read' }],
        tenantId,
      },
    ];

    const userStats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'ACTIVE').length,
      inactiveUsers: users.filter(u => u.status === 'INACTIVE').length,
      roleDistribution: {
        ADMIN: users.filter(u => u.role === 'ADMIN').length,
        MANAGER: users.filter(u => u.role === 'MANAGER').length,
        OPERATOR: users.filter(u => u.role === 'OPERATOR').length,
        VIEWER: users.filter(u => u.role === 'VIEWER').length,
      },
    };

    return NextResponse.json({
      data: {
        users,
        stats: userStats,
      },
      meta: {
        tenantId,
        totalUsers: users.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
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

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      ...body,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      tenantId,
    };

    return NextResponse.json(
      {
        data: newUser,
        meta: { tenantId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
