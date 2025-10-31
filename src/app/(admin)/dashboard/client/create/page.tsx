// sections
import { ClientCreateView } from "src/sections/admin/client/views";
// components
import ErrorCard from "src/components/error-card";

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Registrar Cliente',
};

// ----------------------------------------------------------------------

export default async function ClientCreatePage() {
    try {
        return (
            <ClientCreateView />
        );
    } catch (error) {
        return (
            <ErrorCard message={error.message} />
        );
    }
}
