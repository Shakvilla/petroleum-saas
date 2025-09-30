import { DashboardLayout } from '@/components/dashboard-layout';
import { DistributionManagement } from '@/components/distribution-management';

interface DistributionPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function DistributionPage({
  params,
}: DistributionPageProps) {
  const { tenant } = await params;

  return (
    <DashboardLayout tenant={tenant}>
      <DistributionManagement />
    </DashboardLayout>
  );
}
