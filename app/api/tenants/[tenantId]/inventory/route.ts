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
    const alerts = await mockApiService.getAlerts(tenantId);

    // Calculate inventory metrics
    const totalVolume = tanks.reduce((sum, tank) => sum + tank.currentLevel, 0);
    const totalCapacity = tanks.reduce((sum, tank) => sum + tank.capacity, 0);
    const utilizationRate = totalCapacity > 0 ? (totalVolume / totalCapacity) * 100 : 0;
    
    const criticalTanks = tanks.filter(tank => {
      const percentage = (tank.currentLevel / tank.capacity) * 100;
      return percentage < 20;
    });

    const inventoryData = {
      overview: {
        totalVolume,
        totalCapacity,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        activeTanks: tanks.filter(tank => tank.status === 'ACTIVE').length,
        criticalAlerts: alerts.filter(alert => 
          alert.entityType === 'TANK' && alert.priority === 'CRITICAL'
        ).length,
      },
      tanks: tanks.map(tank => ({
        id: tank.id,
        name: tank.name,
        type: tank.type,
        capacity: tank.capacity,
        currentLevel: tank.currentLevel,
        percentage: Math.round((tank.currentLevel / tank.capacity) * 100),
        status: tank.status,
        location: tank.location,
        lastUpdated: tank.lastUpdated,
      })),
      alerts: alerts.filter(alert => alert.entityType === 'TANK'),
      efficiency: {
        averageUtilization: Math.round(utilizationRate * 100) / 100,
        criticalTanksCount: criticalTanks.length,
        maintenanceDue: tanks.filter(tank => tank.status === 'MAINTENANCE').length,
      },
    };

    return NextResponse.json({
      data: inventoryData,
      meta: {
        tenantId,
        totalTanks: tanks.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
