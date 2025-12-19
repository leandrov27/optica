'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserEditProfileForm from '../forms/user-edit-profile-form';

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();

  const renderHeader = () => (
    <CustomBreadcrumbs
      heading={`Perfil de Usuario`}
      links={[
        {
          name: 'Tablero de Ventas',
          href: paths.admin.root,
        },
        {
          name: 'Mi Perfil',
        },
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );


  const renderMainContent = () => {
    return <UserEditProfileForm />;
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {renderHeader()}
      {renderMainContent()}
    </Container>
  );
}