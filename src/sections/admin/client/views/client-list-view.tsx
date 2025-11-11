'use client';

// @mui
import {
  Button,
  Container,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// types
import { type IClientRaw } from 'src/core/schemas';
//
import ClientTable from '../components/client-table';

// ----------------------------------------------------------------------

interface ClientListViewProps {
  clients: IClientRaw[];
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

export default function ClientListView({
  clients,
  searchTerm,
  //
  currentPage,
  totalPages,
  //
  totalItems,
  from,
  to,
}: ClientListViewProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Lista de Clientes"
        links={[
          {
            name: 'Panel de Control',
            href: paths.admin.root,
          },
          { name: 'Clientes' },
        ]}
        action={
          <Button sx={{ minWidth: 20 }} variant="contained" LinkComponent={RouterLink} href={paths.admin.client.create}>
            <Iconify icon="mingcute:add-line" />
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ClientTable
        clients={clients}
        searchTerm={searchTerm}
        //
        currentPage={currentPage}
        totalPages={totalPages}
        //
        totalCount={totalItems}
        from={from}
        to={to}
      />
    </Container>
  )
}