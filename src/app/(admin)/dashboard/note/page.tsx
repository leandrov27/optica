// sections
import { NoteListView } from 'src/sections/admin/note/views';
// components
import ErrorCard from 'src/components/error-card';
// libs
import db from 'src/libs/prisma';
// types
import { type INoteData } from 'src/core/schemas';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: 'Lista de Notas de Venta',
};

// ----------------------------------------------------------------------

interface NoteListPageProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

interface NotePaginated {
    notes: INoteData[];
    totalCount: number;
}

// ----------------------------------------------------------------------

const getNotesPaginated = async (
    itemsPerPage: number,
    search: string,
    page: number
): Promise<NotePaginated> => {
    const skip = (page - 1) * itemsPerPage;

    const where = search
        ? {
            client: {
                OR: [
                    { displayName: { contains: search } },
                    { phone: { contains: search } },
                    { email: { contains: search } },
                    {
                        taxInfo: {
                            OR: [
                                { rfc: { contains: search } },
                                { businessName: { contains: search } },
                            ],
                        },
                    },
                ],
            },
        }
        : {};

    const totalCount = await db.saleNote.count({ where });

    if (totalCount === 0 || skip >= totalCount) {
        return { notes: [], totalCount };
    }

    const notesRaw = await db.saleNote.findMany({
        where,
        skip,
        select: {
            id: true,
            client: {
                select: {
                    id: true,
                    displayName: true,
                    phone: true,
                    taxInfo: {
                        select: {
                            rfc: true,
                            businessName: true,
                        }
                    }
                }
            },
            total: true,
            date: true,
        },
        take: itemsPerPage,
        orderBy: { id: 'asc' },
    });

    const notes = notesRaw.map(note => ({
        ...note,
        total: Number(note.total)
    }));

    return { notes, totalCount };
};

// ----------------------------------------------------------------------

export default async function NoteListPage({ searchParams }: NoteListPageProps) {
    try {
        // Parsear parámetros de búsqueda
        const itemsPerPage = 3;
        const search = searchParams?.search || '';
        const page = Number(searchParams?.page) || 1;

        // Obtener datos paginados
        const { notes, totalCount } = await getNotesPaginated(
            itemsPerPage,
            search,
            page,
        );

        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const from = totalCount ? (page - 1) * itemsPerPage + 1 : 0;
        const to = Math.min(page * itemsPerPage, totalCount);

        // Pasar los datos tipados a la vista
        return (
            <NoteListView
                notes={notes}
                //
                searchTerm={search}
                //
                currentPage={page}
                totalPages={totalPages}
                //
                totalItems={totalCount}
                from={from}
                to={to}
            />
        )
    } catch (error) {
        return <ErrorCard message={error.message} />;
    }
}
