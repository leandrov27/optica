// sections
import { UserListView } from 'src/sections/admin/user/views';
// components
import ErrorCard from 'src/components/error-card';
// libs
import db from 'src/libs/prisma';
// types
import { type IRole, type IUserData } from 'src/core/schemas';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: 'Lista de Usuarios',
};

// ----------------------------------------------------------------------

interface UserListPageProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

interface UserPaginated {
    users: IUserData[];
    totalCount: number;
}

// ----------------------------------------------------------------------

const getUsersPaginated = async (
    itemsPerPage: number,
    search: string,
    page: number
): Promise<UserPaginated> => {
    const skip = (page - 1) * itemsPerPage;
    const terms = search.trim().split(/\s+/);

    const where = {
        AND: [
            { role: 'ADMIN' as IRole },
            ...terms.map((term) => ({
                OR: [
                    { displayName: { contains: term } },
                    { document: { contains: term } },
                    { phone: { contains: term } },
                ],
            })),
        ],
    };

    const totalCount = await db.user.count({ where });

    if (totalCount === 0 || skip >= totalCount) {
        return { users: [], totalCount };
    }

    const users = await db.user.findMany({
        where,
        skip,
        take: itemsPerPage,
        orderBy: { id: 'asc' },
        // include: { ... } // relaciones opcionales
    });

    return { users: users as IUserData[], totalCount };
};

// ----------------------------------------------------------------------

export default async function UserListPage({ searchParams }: UserListPageProps) {
    try {
        // Parsear parámetros de búsqueda
        const itemsPerPage = 3;
        const search = searchParams?.search || '';
        const page = Number(searchParams?.page) || 1;

        // Obtener datos paginados
        const { users, totalCount } = await getUsersPaginated(
            itemsPerPage,
            search,
            page,
        );

        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const from = totalCount ? (page - 1) * itemsPerPage + 1 : 0;
        const to = Math.min(page * itemsPerPage, totalCount);

        // Pasar los datos tipados a la vista
        return (
            <UserListView
                users={users}
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
