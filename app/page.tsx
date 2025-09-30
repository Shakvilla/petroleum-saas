import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to tenant selection page
  redirect('/tenant-selection');
}
