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

    const tanks = await mockApiService.getTanks(tenantId);

    return NextResponse.json({
      data: tanks,
      meta: {
        total: tanks.length,
        tenantId,
      },
    });
  } catch (error) {
    console.error('Error fetching tanks:', error);
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

    const newTank = await mockApiService.create('tanks', body, { tenantId });

    return NextResponse.json({
      data: newTank,
      meta: { tenantId },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tank:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
