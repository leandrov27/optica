// sections
import { UserCreateView } from "src/sections/admin/user/views";
// components
import ErrorCard from "src/components/error-card";

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Registrar Usuario',
};

// ----------------------------------------------------------------------

export default async function UserCreatePage() {
    try {
        return (
            <UserCreateView />
        );
    } catch (error) {
        return (
            <ErrorCard
                message={error.message}
            />
        );
    }
}
