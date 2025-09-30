import { AuthLayout } from '@/components/auth/auth-layout';

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
