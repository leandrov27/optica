// sections
import { DashboardView } from 'src/sections/admin/dashboard/views';
// components
import ErrorCard from 'src/components/error-card';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Panel de Control',
};

export default async function DashboardPage() {
  try {
    return <DashboardView />;
  } catch (error) {
    console.error('Error capturado:', error);
    return <ErrorCard message={error.message} />;
  }
}
