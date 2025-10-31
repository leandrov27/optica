'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ClientCreateForm from '../forms/client-create-form';

// ----------------------------------------------------------------------

export default function ClienteCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Registar Nuevo Cliente"
        links={[
          {
            name: 'Panel de Control',
            href: paths.admin.root,
          },
          {
            name: 'Lista de Clientes',
            href: paths.admin.client.list,
          },
          { name: 'Nuevo Cliente' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ClientCreateForm />

    </Container>
  );
}
