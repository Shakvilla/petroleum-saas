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

    const vehicles = await mockApiService.findMany('vehicles', { tenantId });
    const deliveries = await mockApiService.getDeliveries(tenantId);

    // Calculate fleet metrics
    const activeVehicles = vehicles.filter(
      vehicle => vehicle.status === 'ACTIVE'
    );
    const maintenanceVehicles = vehicles.filter(
      vehicle => vehicle.status === 'MAINTENANCE'
    );
    const activeDeliveries = deliveries.filter(
      delivery => delivery.status === 'IN_PROGRESS'
    );

    const fleetData = {
      overview: {
        totalVehicles: vehicles.length,
        activeVehicles: activeVehicles.length,
        maintenanceVehicles: maintenanceVehicles.length,
        activeDeliveries: activeDeliveries.length,
        averageFuelEfficiency:
          vehicles.length > 0
            ? Math.round(
                (vehicles.reduce((sum, v) => sum + v.fuelEfficiency, 0) /
                  vehicles.length) *
                  100
              ) / 100
            : 0,
      },
      vehicles: vehicles.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        type: vehicle.type,
        capacity: vehicle.capacity,
        status: vehicle.status,
        licensePlate: vehicle.licensePlate,
        driver: vehicle.driver,
        lastMaintenance: vehicle.lastMaintenance,
        nextMaintenance: vehicle.nextMaintenance,
        mileage: vehicle.mileage,
        fuelEfficiency: vehicle.fuelEfficiency,
        location:
          activeDeliveries.find(d => d.vehicleId === vehicle.id)?.route
            ?.waypoints?.[0] || null,
      })),
      deliveries: activeDeliveries,
      maintenance: {
        dueSoon: vehicles.filter(vehicle => {
          const nextMaintenance = new Date(vehicle.nextMaintenance);
          const today = new Date();
          const daysUntilMaintenance = Math.ceil(
            (nextMaintenance.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return daysUntilMaintenance <= 7 && daysUntilMaintenance >= 0;
        }),
        overdue: vehicles.filter(vehicle => {
          const nextMaintenance = new Date(vehicle.nextMaintenance);
          const today = new Date();
          return nextMaintenance.getTime() < today.getTime();
        }),
      },
    };

    return NextResponse.json({
      data: fleetData,
      meta: {
        tenantId,
        totalVehicles: vehicles.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching fleet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
