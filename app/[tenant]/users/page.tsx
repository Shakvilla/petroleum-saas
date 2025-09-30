import { DashboardLayout } from '@/components/dashboard-layout';
import { UsersPageContent } from '@/components/users/users-page-content';

export default async function UsersPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  return (
    <DashboardLayout tenant={tenant}>
      <UsersPageContent />
    </DashboardLayout>
  );
}
