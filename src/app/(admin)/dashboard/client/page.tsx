// sections
import { ClientListView } from 'src/sections/admin/client/views';
// components
import ErrorCard from 'src/components/error-card';
// libs
import db from 'src/libs/prisma';
// types
import { type IClientRaw } from 'src/core/schemas';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: 'Lista de Clientes',
};

// ----------------------------------------------------------------------

interface ClientListPageProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

interface ClientPaginated {
    clients: IClientRaw[];
    totalCount: number;
}

// ----------------------------------------------------------------------

const getClientsPaginated = async (
    itemsPerPage: number,
    search: string,
    page: number
): Promise<ClientPaginated> => {
    const skip = (page - 1) * itemsPerPage;

    const where = search
        ? {
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
        }
        : {};

    const totalCount = await db.client.count({ where });

    if (totalCount === 0 || skip >= totalCount) {
        return { clients: [], totalCount };
    }

    const clients = await db.client.findMany({
        where,
        skip,
        select: {
            id: true,
            displayName: true,
            phone: true,
            type: true
        },
        take: itemsPerPage,
        orderBy: { id: 'asc' },
    });

    return { clients, totalCount };
};

// ----------------------------------------------------------------------

export default async function ClientListPage({ searchParams }: ClientListPageProps) {
    try {
        // Parsear parámetros de búsqueda
        const itemsPerPage = 3;
        const search = searchParams?.search || '';
        const page = Number(searchParams?.page) || 1;

        // Obtener datos paginados
        const { clients, totalCount } = await getClientsPaginated(
            itemsPerPage,
            search,
            page,
        );

        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const from = totalCount ? (page - 1) * itemsPerPage + 1 : 0;
        const to = Math.min(page * itemsPerPage, totalCount);

        // Pasar los datos tipados a la vista
        return (
            <ClientListView
                clients={clients}
                searchTerm={search}
                //
                currentPage={page}
                totalPages={totalPages}
                //
                totalItems={totalCount}
                from={from}
                to={to}
            />
        );
    } catch (error) {
        return <ErrorCard message={error.message} />;
    }
}
