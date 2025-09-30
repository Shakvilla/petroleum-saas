import { DashboardLayout } from '@/components/dashboard-layout';
import { FleetTracker } from '@/components/fleet-tracker';

export default async function FleetPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  return (
    <DashboardLayout tenant={tenant}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600">
            Monitor and manage your delivery fleet
          </p>
        </div>
        <FleetTracker />
      </div>
    </DashboardLayout>
  );
}
