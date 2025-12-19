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
// schemas
import { type ICategoryData } from 'src/core/schemas';
//
import CategoryTable from '../components/category-table';
import CategoryNewEditDialog from '../forms/category-new-edit-dialog';
import useCategoryDialogStore from '../stores/useCategoryDialogStore';

// ----------------------------------------------------------------------

interface CategoryListViewProps {
  categories: ICategoryData[];
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

export default function CategoryListView({
  categories,
  searchTerm,
  //
  currentPage,
  totalPages,
  //
  totalItems,
  from,
  to,
}: CategoryListViewProps) {
  const settings = useSettingsContext();

  const open = useCategoryDialogStore((state) => state.open);
  const category = useCategoryDialogStore((state) => state.category);

  const openDialog = useCategoryDialogStore((state) => state.openDialog);
  const closeDialog = useCategoryDialogStore((state) => state.closeDialog);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Gestión de Categorías"
        links={[
          {
            name: 'Tablero de Ventas',
            href: paths.admin.root,
          },
          { name: 'Gestión de Categorías' },
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

      <CategoryTable
        categories={categories}
        currentPage={currentPage}
        totalPages={totalPages}
        searchTerm={searchTerm}
        from={from}
        to={to}
        totalItems={totalItems}
      />

      <CategoryNewEditDialog
        openDialog={open}
        onCloseDialog={closeDialog}
        category={category ?? undefined}
      />
    </Container>
  );
}
