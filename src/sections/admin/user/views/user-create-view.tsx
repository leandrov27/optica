'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserCreateForm from '../forms/user-create-form';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Registar Nuevo Usuario"
        links={[
          {
            name: 'Tablero de Ventas',
            href: paths.admin.root,
          },
          {
            name: 'Lista de Usuarios',
            href: paths.admin.user.list,
          },
          { name: 'Nuevo Usuario' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserCreateForm />

    </Container>
  );
}
