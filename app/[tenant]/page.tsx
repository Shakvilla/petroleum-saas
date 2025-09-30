import { DashboardLayout } from '@/components/dashboard-layout';
import { ModernDashboardOverview } from '@/components/modern-dashboard-overview';

export default async function TenantDashboard({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  return (
    <DashboardLayout tenant={tenant}>
      <ModernDashboardOverview tenant={tenant} />
    </DashboardLayout>
  );
}
