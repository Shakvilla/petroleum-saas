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
    const deliveries = await mockApiService.getDeliveries(tenantId);
    const transactions = await mockApiService.getTransactions(tenantId);
    const alerts = await mockApiService.getAlerts(tenantId);

    // Generate comprehensive reports
    const reports = {
      inventoryReport: {
        title: 'Inventory Status Report',
        generatedAt: new Date().toISOString(),
        summary: {
          totalTanks: tanks.length,
          activeTanks: tanks.filter(t => t.status === 'ACTIVE').length,
          totalVolume: tanks.reduce((sum, t) => sum + t.currentLevel, 0),
          totalCapacity: tanks.reduce((sum, t) => sum + t.capacity, 0),
          utilizationRate:
            tanks.length > 0
              ? Math.round(
                  (tanks.reduce((sum, t) => sum + t.currentLevel, 0) /
                    tanks.reduce((sum, t) => sum + t.capacity, 0)) *
                    100
                )
              : 0,
        },
        details: tanks.map(tank => ({
          id: tank.id,
          name: tank.name,
          type: tank.type,
          capacity: tank.capacity,
          currentLevel: tank.currentLevel,
          percentage: Math.round((tank.currentLevel / tank.capacity) * 100),
          status: tank.status,
          location: tank.location.name,
        })),
      },
      deliveryReport: {
        title: 'Delivery Performance Report',
        generatedAt: new Date().toISOString(),
        summary: {
          totalDeliveries: deliveries.length,
          completedDeliveries: deliveries.filter(d => d.status === 'COMPLETED')
            .length,
          inProgressDeliveries: deliveries.filter(
            d => d.status === 'IN_PROGRESS'
          ).length,
          scheduledDeliveries: deliveries.filter(d => d.status === 'SCHEDULED')
            .length,
          averageDeliveryTime: calculateAverageDeliveryTime(deliveries),
        },
        details: deliveries.map(delivery => ({
          id: delivery.id,
          vehicleId: delivery.vehicleId,
          driverId: delivery.driverId,
          status: delivery.status,
          fuelType: delivery.fuelType,
          quantity: delivery.quantity,
          scheduledAt: delivery.scheduledAt,
          startedAt: delivery.startedAt,
          completedAt: delivery.completedAt,
          route: delivery.route.name,
        })),
      },
      salesReport: {
        title: 'Sales Performance Report',
        generatedAt: new Date().toISOString(),
        summary: {
          totalRevenue: transactions
            .filter(t => t.type === 'fuel_sale')
            .reduce((sum, t) => sum + t.amount, 0),
          totalVolume: transactions
            .filter(t => t.type === 'fuel_sale' && t.volume)
            .reduce((sum, t) => sum + (t.volume || 0), 0),
          totalTransactions: transactions.filter(t => t.type === 'fuel_sale')
            .length,
          averageTransactionValue:
            transactions.filter(t => t.type === 'fuel_sale').length > 0
              ? Math.round(
                  transactions
                    .filter(t => t.type === 'fuel_sale')
                    .reduce((sum, t) => sum + t.amount, 0) /
                    transactions.filter(t => t.type === 'fuel_sale').length
                )
              : 0,
        },
        details: transactions
          .filter(t => t.type === 'fuel_sale')
          .map(transaction => ({
            id: transaction.id,
            amount: transaction.amount,
            volume: transaction.volume || 0,
            fuelType: transaction.fuelType,
            customer: transaction.customer?.name,
            location: transaction.location?.name,
            timestamp: transaction.timestamp,
            status: transaction.status,
          })),
      },
      alertsReport: {
        title: 'System Alerts Report',
        generatedAt: new Date().toISOString(),
        summary: {
          totalAlerts: alerts.length,
          activeAlerts: alerts.filter(a => a.status === 'ACTIVE').length,
          resolvedAlerts: alerts.filter(a => a.status === 'RESOLVED').length,
          criticalAlerts: alerts.filter(a => a.priority === 'CRITICAL').length,
          highPriorityAlerts: alerts.filter(a => a.priority === 'HIGH').length,
        },
        details: alerts.map(alert => ({
          id: alert.id,
          type: alert.type,
          title: alert.title,
          message: alert.message,
          priority: alert.priority,
          status: alert.status,
          entityType: alert.entityType,
          entityId: alert.entityId,
          timestamp: alert.timestamp,
          acknowledged: alert.acknowledged,
          acknowledgedBy: alert.acknowledgedBy,
        })),
      },
    };

    return NextResponse.json({
      data: reports,
      meta: {
        tenantId,
        generatedAt: new Date().toISOString(),
        reportTypes: Object.keys(reports),
      },
    });
  } catch (error) {
    console.error('Error generating reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateAverageDeliveryTime(deliveries: any[]): number {
  const completedDeliveries = deliveries.filter(
    d => d.status === 'COMPLETED' && d.startedAt && d.completedAt
  );

  if (completedDeliveries.length === 0) return 0;

  const totalTime = completedDeliveries.reduce((sum, delivery) => {
    const start = new Date(delivery.startedAt);
    const end = new Date(delivery.completedAt);
    return sum + (end.getTime() - start.getTime());
  }, 0);

  return Math.round(totalTime / completedDeliveries.length / (1000 * 60)); // minutes
}
