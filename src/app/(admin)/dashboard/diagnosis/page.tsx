// sections
import { DiagnosisListView } from 'src/sections/admin/diagnosis/views';
// components
import ErrorCard from 'src/components/error-card';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: 'Gestión de Diagnósticos',
};

// ----------------------------------------------------------------------

export default async function CategoryListPage() {
    try {
        return <DiagnosisListView />;
    } catch (error) {
        return <ErrorCard message={error.message} />;
    }
}
