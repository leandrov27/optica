'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// schemas
import { type IClientData } from 'src/core/schemas';
//
import ClientEditForm from '../forms/client-edit-form';

// ----------------------------------------------------------------------

interface ClientEditViewProps {
  client: IClientData;
}

// ----------------------------------------------------------------------

export default function ClientEditView({ client }: ClientEditViewProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Modificar Cliente"
        links={[
          {
            name: 'Panel de Control',
            href: paths.admin.root,
          },
          {
            name: 'Lista de Clientes',
            href: paths.admin.client.list,
          },
          { name: `Modificar Cliente #${client.id}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ClientEditForm client={client} />

    </Container>
  );
}
