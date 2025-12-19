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
import { type IUserData } from 'src/core/schemas';
//
import UserContainer from '../components/user-container';

// ----------------------------------------------------------------------

interface UserListViewProps {
  users: IUserData[];
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

export default function UserListView({
  users,
  searchTerm,
  //
  currentPage,
  totalPages,
  //
  totalItems,
  from,
  to,
}: UserListViewProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Lista de Usuarios"
        links={[
          {
            name: 'Tablero de Ventas',
            href: paths.admin.root,
          },
          { name: 'Usuarios' },
        ]}
        action={
          <Button sx={{ minWidth: 20 }} variant="contained" LinkComponent={RouterLink} href={paths.admin.user.create}>
            <Iconify icon="mingcute:add-line" />
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserContainer
        users={users}
        searchTerm={searchTerm}
        //
        currentPage={currentPage}
        totalPages={totalPages}
        //
        totalItems={totalItems}
        from={from}
        to={to}
      />
    </Container>
  )
}