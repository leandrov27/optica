'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// schemas
import { type IUserData } from 'src/core/schemas';
//
import UserEditForm from '../forms/user-edit-form';

// ----------------------------------------------------------------------

interface UserEditViewProps {
  user: IUserData;
}

// ----------------------------------------------------------------------

export default function UserEditView({ user }: UserEditViewProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Modificar Usuario"
        links={[
          {
            name: 'Tablero de Ventas',
            href: paths.admin.root,
          },
          {
            name: 'Lista de Usuarios',
            href: paths.admin.user.list,
          },
          { name: `Modificar Usuario #${user.id}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserEditForm user={user} />
      
    </Container>
  );
}
