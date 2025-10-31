// sections
import { NoteCreateView } from "src/sections/admin/note/views";
// components
import ErrorCard from "src/components/error-card";

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Registrar Nota',
};

// ----------------------------------------------------------------------

export default async function NoteCreatePage() {
    try {
        return (
            <NoteCreateView />
        );
    } catch (error) {
        return (
            <ErrorCard message={error.message} />
        );
    }
}
