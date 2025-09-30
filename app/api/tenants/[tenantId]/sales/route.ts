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

    const transactions = await mockApiService.getTransactions(tenantId);
    const deliveries = await mockApiService.getDeliveries(tenantId);

    // Calculate sales metrics
    const salesTransactions = transactions.filter(
      t => t.type === 'SALE' && t.status === 'COMPLETED'
    );
    const today = new Date().toDateString();
    const todaySales = salesTransactions.filter(
      t => new Date(t.timestamp).toDateString() === today
    );

    const totalRevenue = salesTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const todayRevenue = todaySales.reduce((sum, t) => sum + t.amount, 0);
    const totalVolume = salesTransactions.reduce((sum, t) => sum + t.volume, 0);

    const salesData = {
      overview: {
        totalRevenue,
        todayRevenue,
        totalVolume,
        totalTransactions: salesTransactions.length,
        averageTransactionValue:
          salesTransactions.length > 0
            ? Math.round(totalRevenue / salesTransactions.length)
            : 0,
        completionRate:
          transactions.length > 0
            ? Math.round((salesTransactions.length / transactions.length) * 100)
            : 0,
      },
      recentTransactions: transactions
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 10),
      topCustomers: this.getTopCustomers(salesTransactions),
      fuelTypeBreakdown: this.getFuelTypeBreakdown(salesTransactions),
      dailySales: this.getDailySales(salesTransactions),
      deliveryPerformance: {
        totalDeliveries: deliveries.length,
        completedDeliveries: deliveries.filter(d => d.status === 'COMPLETED')
          .length,
        inProgressDeliveries: deliveries.filter(d => d.status === 'IN_PROGRESS')
          .length,
        averageDeliveryTime: this.calculateAverageDeliveryTime(deliveries),
      },
    };

    return NextResponse.json({
      data: salesData,
      meta: {
        tenantId,
        totalTransactions: transactions.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function getTopCustomers(transactions: any[]) {
  const customerMap = new Map();

  transactions.forEach(transaction => {
    if (transaction.customer) {
      const customerId = transaction.customer.id;
      const existing = customerMap.get(customerId) || {
        id: customerId,
        name: transaction.customer.name,
        type: transaction.customer.type,
        totalAmount: 0,
        transactionCount: 0,
      };

      existing.totalAmount += transaction.amount;
      existing.transactionCount += 1;
      customerMap.set(customerId, existing);
    }
  });

  return Array.from(customerMap.values())
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);
}

function getFuelTypeBreakdown(transactions: any[]) {
  const breakdown = new Map();

  transactions.forEach(transaction => {
    const fuelType = transaction.fuelType;
    const existing = breakdown.get(fuelType) || {
      fuelType,
      totalAmount: 0,
      totalVolume: 0,
      transactionCount: 0,
    };

    existing.totalAmount += transaction.amount;
    existing.totalVolume += transaction.volume;
    existing.transactionCount += 1;
    breakdown.set(fuelType, existing);
  });

  return Array.from(breakdown.values());
}

function getDailySales(transactions: any[]) {
  const dailyMap = new Map();

  transactions.forEach(transaction => {
    const date = new Date(transaction.timestamp).toDateString();
    const existing = dailyMap.get(date) || {
      date,
      totalAmount: 0,
      totalVolume: 0,
      transactionCount: 0,
    };

    existing.totalAmount += transaction.amount;
    existing.totalVolume += transaction.volume;
    existing.transactionCount += 1;
    dailyMap.set(date, existing);
  });

  return Array.from(dailyMap.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 days
}

function calculateAverageDeliveryTime(deliveries: any[]) {
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
