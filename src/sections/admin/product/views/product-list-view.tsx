'use client';

// @mui
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// types
import { type ICategoryData, type IProductData } from 'src/core/schemas';
//
import ProductTable from '../components/product-table';
import ProductNewEditDialog from '../forms/product-new-edit-dialog';
import useProductDialogStore from '../stores/useProductDialogStore';

// ----------------------------------------------------------------------

interface ProductListViewProps {
    products: IProductData[];
    categories: ICategoryData[];
    //
    searchTerm: string;
    //
    currentPage: number;
    totalPages: number;
    //
    totalItems: number;
    from: number;
    to: number;
}

// ----------------------------------------------------------------------

export default function ProductListView({
    products,
    categories,
    //
    searchTerm,
    //
    currentPage,
    totalPages,
    //
    totalItems,
    from,
    to,
}: ProductListViewProps) {
    const settings = useSettingsContext();

    const open = useProductDialogStore((state) => state.open);
    const product = useProductDialogStore((state) => state.product);

    const openDialog = useProductDialogStore((state) => state.openDialog);
    const closeDialog = useProductDialogStore((state) => state.closeDialog);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Catálogo de Productos"
                links={[
                    {
                        name: 'Panel de Control',
                        href: paths.admin.root,
                    },
                    { name: 'Productos' },
                ]}
                action={
                    <Button sx={{ minWidth: 20 }} variant="contained" onClick={() => openDialog()}>
                        <Iconify icon="mingcute:add-line" />
                    </Button>
                }
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <ProductTable
                products={products}
                currentPage={currentPage}
                totalPages={totalPages}
                searchTerm={searchTerm}
                from={from}
                to={to}
                totalItems={totalItems}
            />

            <ProductNewEditDialog
                categories={categories}
                openDialog={open}
                onCloseDialog={closeDialog}
                product={product ?? undefined}
            />
        </Container>
    )
}