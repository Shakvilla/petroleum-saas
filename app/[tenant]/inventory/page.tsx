import { DashboardLayout } from '@/components/dashboard-layout';
import { InventoryManagement } from '@/components/inventory-management';

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  return (
    <DashboardLayout tenant={tenant}>
      <InventoryManagement tenant={tenant} />
    </DashboardLayout>
  );
}
