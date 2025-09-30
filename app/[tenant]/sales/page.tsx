import { DashboardLayout } from '@/components/dashboard-layout';
import { SalesManagement } from '@/components/sales-management';

export default async function SalesPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  return (
    <DashboardLayout tenant={tenant}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600">
            Track sales performance and customer relationships
          </p>
        </div>
        <SalesManagement tenant={tenant} />
      </div>
    </DashboardLayout>
  );
}
