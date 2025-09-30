import { DashboardLayout } from '@/components/dashboard-layout';
import { SettingsPageContent } from '@/components/settings/settings-page-content';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  return (
    <DashboardLayout tenant={tenant}>
      <SettingsPageContent tenant={tenant} />
    </DashboardLayout>
  );
}
