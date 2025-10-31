// sections
import { CategoryListView } from 'src/sections/admin/category/views';
// components
import ErrorCard from 'src/components/error-card';
// libs
import db from 'src/libs/prisma';
// types
import { type ICategoryData } from 'src/core/schemas';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: 'Gestión de Categorías',
};

// ----------------------------------------------------------------------

interface CategoryListPageProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

interface CategoryPaginated {
    categories: ICategoryData[];
    totalCount: number;
}

// ----------------------------------------------------------------------

const getCategoriesPaginated = async (
    itemsPerPage: number,
    search: string,
    page: number
): Promise<CategoryPaginated> => {
    const skip = (page - 1) * itemsPerPage;

    const where = {
        OR: [
            { name: { contains: search } },
        ],
    };

    const totalCount = await db.category.count({ where });

    if (totalCount === 0 || skip >= totalCount) {
        return { categories: [], totalCount };
    }

    const categories = await db.category.findMany({
        where,
        skip,
        take: itemsPerPage,
        orderBy: { id: 'asc' },
    });

    return { categories: categories as ICategoryData[], totalCount };
};

// ----------------------------------------------------------------------

export default async function CategoryListPage({ searchParams }: CategoryListPageProps) {
    try {
        // Parsear parámetros de búsqueda
        const itemsPerPage = 3;
        const search = searchParams?.search || '';
        const page = Number(searchParams?.page) || 1;

        // Obtener datos paginados
        const { categories, totalCount } = await getCategoriesPaginated(
            itemsPerPage,
            search,
            page,
        );

        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const from = totalCount ? (page - 1) * itemsPerPage + 1 : 0;
        const to = Math.min(page * itemsPerPage, totalCount);

        // Pasar los datos tipados a la vista
        return (
            <CategoryListView
                categories={categories}
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
