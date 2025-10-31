// sections
import { ProductListView } from 'src/sections/admin/product/views';
// components
import ErrorCard from 'src/components/error-card';
// libs
import db from 'src/libs/prisma';
// types
import { type ICategoryData, type IProductData } from 'src/core/schemas';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: 'Gestión de Productos',
};

// ----------------------------------------------------------------------

interface ProductListPageProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

interface ProductPaginated {
    products: IProductData[];
    totalCount: number;
}

// ----------------------------------------------------------------------

const getCategories = async (): Promise<ICategoryData[]> => {
    const categories = await db.category.findMany();

    return categories || [];
}

// ----------------------------------------------------------------------

const getProductsPaginated = async (
    itemsPerPage: number,
    search: string,
    page: number
): Promise<ProductPaginated> => {
    const skip = (page - 1) * itemsPerPage;

    const where = {
        OR: [
            { description: { contains: search } },
            { code: { contains: search } },
        ],
    };

    const totalCount = await db.product.count({ where });

    if (totalCount === 0 || skip >= totalCount) {
        return { products: [], totalCount };
    }

    const rawProducts = await db.product.findMany({
        where,
        skip,
        select: {
            id: true,
            code: true,
            description: true,
            price: true,
            notes: true,
            category: {
                select: {
                    id: true,
                    name: true,
                    icon: true,
                },
            },
        },
        take: itemsPerPage,
        orderBy: { id: 'asc' },
    });

    const products = rawProducts.map(product => ({
        ...product,
        price: Number(product.price)
    }));

    return { products, totalCount };
};

// ----------------------------------------------------------------------

export default async function CategoryListPage({ searchParams }: ProductListPageProps) {
    try {
        // Parsear parámetros de búsqueda
        const itemsPerPage = 3;
        const search = searchParams?.search || '';
        const page = Number(searchParams?.page) || 1;

        // Obtener categorías
        const categories = await getCategories();

        // Obtener datos paginados
        const { products, totalCount } = await getProductsPaginated(
            itemsPerPage,
            search,
            page,
        );

        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const from = totalCount ? (page - 1) * itemsPerPage + 1 : 0;
        const to = Math.min(page * itemsPerPage, totalCount);

        // Pasar los datos tipados a la vista
        return (
            <ProductListView
                products={products}
                categories={categories}
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
        );
    } catch (error) {
        return <ErrorCard message={error.message} />;
    }
}
