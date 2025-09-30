import { NextRequest, NextResponse } from 'next/server';
import { mockApiService } from '@/lib/mock-api/mock-api-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string; tankId: string }> }
) {
  try {
    const { tenantId, tankId } = await params;

    if (!tenantId || !tankId) {
      return NextResponse.json(
        { error: 'Tenant ID and Tank ID are required' },
        { status: 400 }
      );
    }

    const tank = await mockApiService.getTank(tankId, tenantId);

    if (!tank) {
      return NextResponse.json(
        { error: 'Tank not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: tank,
      meta: { tenantId },
    });
  } catch (error) {
    console.error('Error fetching tank:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string; tankId: string }> }
) {
  try {
    const { tenantId, tankId } = await params;
    const body = await request.json();

    if (!tenantId || !tankId) {
      return NextResponse.json(
        { error: 'Tenant ID and Tank ID are required' },
        { status: 400 }
      );
    }

    const updatedTank = await mockApiService.update('tanks', tankId, body, { tenantId });

    if (!updatedTank) {
      return NextResponse.json(
        { error: 'Tank not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: updatedTank,
      meta: { tenantId },
    });
  } catch (error) {
    console.error('Error updating tank:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string; tankId: string }> }
) {
  try {
    const { tenantId, tankId } = await params;

    if (!tenantId || !tankId) {
      return NextResponse.json(
        { error: 'Tenant ID and Tank ID are required' },
        { status: 400 }
      );
    }

    const deleted = await mockApiService.delete('tanks', tankId, { tenantId });

    if (!deleted) {
      return NextResponse.json(
        { error: 'Tank not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Tank deleted successfully',
      meta: { tenantId },
    });
  } catch (error) {
    console.error('Error deleting tank:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
