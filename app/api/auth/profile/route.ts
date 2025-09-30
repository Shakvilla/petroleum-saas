import { NextRequest, NextResponse } from 'next/server';
import { mockApiService } from '@/lib/mock-api/mock-api-service';

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  return await mockApiService.validateToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        permissions: user.permissions,
        profile: user.profile,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updates = body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.id;
    delete updates.email;
    delete updates.role;
    delete updates.tenantId;
    delete updates.permissions;
    delete updates.isActive;
    delete updates.createdAt;

    const updatedUser = await mockApiService.updateUserProfile(
      user.id,
      updates
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        tenantId: updatedUser.tenantId,
        permissions: updatedUser.permissions,
        profile: updatedUser.profile,
        isActive: updatedUser.isActive,
        lastLogin: updatedUser.lastLogin,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
