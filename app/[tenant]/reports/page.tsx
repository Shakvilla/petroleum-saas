import { DashboardLayout } from '@/components/dashboard-layout';
import { ReportsManagement } from '@/components/reports-management';

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  return (
    <DashboardLayout tenant={tenant}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Generate comprehensive business reports
          </p>
        </div>
        <ReportsManagement tenant={tenant} />
      </div>
    </DashboardLayout>
  );
}
