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

    const deliveries = await mockApiService.getDeliveries(tenantId);
    const vehicles = await mockApiService.findMany('vehicles', { tenantId });
    const transactions = await mockApiService.getTransactions(tenantId);

    // Calculate distribution metrics
    const activeDeliveries = deliveries.filter(d => d.status === 'IN_PROGRESS');
    const completedDeliveries = deliveries.filter(
      d => d.status === 'COMPLETED'
    );
    const scheduledDeliveries = deliveries.filter(
      d => d.status === 'SCHEDULED'
    );

    const distributionData = {
      overview: {
        totalDeliveries: deliveries.length,
        activeDeliveries: activeDeliveries.length,
        completedDeliveries: completedDeliveries.length,
        scheduledDeliveries: scheduledDeliveries.length,
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter(v => v.status === 'ACTIVE').length,
        averageDeliveryTime: calculateAverageDeliveryTime(completedDeliveries),
        onTimeDeliveryRate: calculateOnTimeDeliveryRate(completedDeliveries),
      },
      deliveries: deliveries.map(delivery => ({
        id: delivery.id,
        vehicleId: delivery.vehicleId,
        driverId: delivery.driverId,
        status: delivery.status,
        fuelType: delivery.fuelType,
        quantity: delivery.quantity,
        scheduledAt: delivery.scheduledAt,
        startedAt: delivery.startedAt,
        completedAt: delivery.completedAt,
        route: {
          name: delivery.route.name,
          distance: delivery.route.distance,
          waypoints: delivery.route.waypoints.length,
        },
        progress: calculateDeliveryProgress(delivery),
      })),
      vehicles: vehicles.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        type: vehicle.type,
        capacity: vehicle.capacity,
        status: vehicle.status,
        licensePlate: vehicle.licensePlate,
        driver: vehicle.driver,
        currentDelivery: activeDeliveries.find(d => d.vehicleId === vehicle.id),
        utilizationRate: calculateVehicleUtilization(vehicle, deliveries),
      })),
      routes: getRouteAnalytics(deliveries),
      performance: {
        dailyDeliveries: getDailyDeliveryStats(deliveries),
        fuelTypeDistribution: getFuelTypeDistribution(deliveries),
        driverPerformance: getDriverPerformance(deliveries),
      },
    };

    return NextResponse.json({
      data: distributionData,
      meta: {
        tenantId,
        totalDeliveries: deliveries.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching distribution:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateAverageDeliveryTime(deliveries: any[]): number {
  const deliveriesWithTime = deliveries.filter(
    d => d.startedAt && d.completedAt
  );

  if (deliveriesWithTime.length === 0) return 0;

  const totalTime = deliveriesWithTime.reduce((sum, delivery) => {
    const start = new Date(delivery.startedAt);
    const end = new Date(delivery.completedAt);
    return sum + (end.getTime() - start.getTime());
  }, 0);

  return Math.round(totalTime / deliveriesWithTime.length / (1000 * 60)); // minutes
}

function calculateOnTimeDeliveryRate(deliveries: any[]): number {
  const completedDeliveries = deliveries.filter(d => d.status === 'COMPLETED');

  if (completedDeliveries.length === 0) return 0;

  const onTimeDeliveries = completedDeliveries.filter(delivery => {
    if (!delivery.startedAt || !delivery.completedAt) return false;

    const scheduled = new Date(delivery.scheduledAt);
    const completed = new Date(delivery.completedAt);
    const estimatedDuration = delivery.route.estimatedDuration || 60; // minutes

    const expectedCompletion = new Date(
      scheduled.getTime() + estimatedDuration * 60 * 1000
    );
    return completed <= expectedCompletion;
  });

  return Math.round(
    (onTimeDeliveries.length / completedDeliveries.length) * 100
  );
}

function calculateDeliveryProgress(delivery: any): number {
  if (delivery.status === 'SCHEDULED') return 0;
  if (delivery.status === 'IN_PROGRESS') return 50;
  if (delivery.status === 'COMPLETED') return 100;
  return 0;
}

function calculateVehicleUtilization(vehicle: any, deliveries: any[]): number {
  const vehicleDeliveries = deliveries.filter(d => d.vehicleId === vehicle.id);
  const completedDeliveries = vehicleDeliveries.filter(
    d => d.status === 'COMPLETED'
  );

  if (vehicleDeliveries.length === 0) return 0;

  return Math.round(
    (completedDeliveries.length / vehicleDeliveries.length) * 100
  );
}

function getRouteAnalytics(deliveries: any[]) {
  const routeMap = new Map();

  deliveries.forEach(delivery => {
    const routeName = delivery.route.name;
    const existing = routeMap.get(routeName) || {
      name: routeName,
      totalDeliveries: 0,
      completedDeliveries: 0,
      averageDistance: 0,
      averageDuration: 0,
    };

    existing.totalDeliveries += 1;
    if (delivery.status === 'COMPLETED') {
      existing.completedDeliveries += 1;
    }

    existing.averageDistance = delivery.route.distance;
    existing.averageDuration = delivery.route.estimatedDuration;

    routeMap.set(routeName, existing);
  });

  return Array.from(routeMap.values());
}

function getDailyDeliveryStats(deliveries: any[]) {
  const dailyMap = new Map();

  deliveries.forEach(delivery => {
    const date = new Date(delivery.scheduledAt).toDateString();
    const existing = dailyMap.get(date) || {
      date,
      totalDeliveries: 0,
      completedDeliveries: 0,
      totalVolume: 0,
    };

    existing.totalDeliveries += 1;
    if (delivery.status === 'COMPLETED') {
      existing.completedDeliveries += 1;
    }
    existing.totalVolume += delivery.quantity;

    dailyMap.set(date, existing);
  });

  return Array.from(dailyMap.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 days
}

function getFuelTypeDistribution(deliveries: any[]) {
  const fuelMap = new Map();

  deliveries.forEach(delivery => {
    const fuelType = delivery.fuelType;
    const existing = fuelMap.get(fuelType) || {
      fuelType,
      totalDeliveries: 0,
      totalVolume: 0,
    };

    existing.totalDeliveries += 1;
    existing.totalVolume += delivery.quantity;

    fuelMap.set(fuelType, existing);
  });

  return Array.from(fuelMap.values());
}

function getDriverPerformance(deliveries: any[]) {
  const driverMap = new Map();

  deliveries.forEach(delivery => {
    const driverId = delivery.driverId;
    const existing = driverMap.get(driverId) || {
      driverId,
      totalDeliveries: 0,
      completedDeliveries: 0,
      totalVolume: 0,
      averageDeliveryTime: 0,
    };

    existing.totalDeliveries += 1;
    if (delivery.status === 'COMPLETED') {
      existing.completedDeliveries += 1;
    }
    existing.totalVolume += delivery.quantity;

    driverMap.set(driverId, existing);
  });

  return Array.from(driverMap.values())
    .sort((a, b) => b.completedDeliveries - a.completedDeliveries)
    .slice(0, 5); // Top 5 drivers
}
