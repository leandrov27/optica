// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// auth
import { useAuthContext } from 'src/core/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function LoginButton({ sx }: Props) {
  const { authenticated, user, logout } = useAuthContext();

  const isAdmin = authenticated && user?.role === 'ADMIN';
  const isClient = authenticated && user?.role === 'CLIENT';

  const getLoginPath = () => {
    if (isAdmin) {
      return paths.admin.root;
    } else {
      return paths.auth.login;
    }
  };

  if (isClient) {
    return (
      <Button variant="outlined" onClick={logout} sx={{ mr: 1, ...sx }}>
        Cerrar sesión
      </Button>
    );
  }

  return (
    <Button component={RouterLink} href={getLoginPath()} variant="outlined" sx={{ mr: 1, ...sx }}>
      {isAdmin ? 'Tablero de Ventas' : 'Acceder'}
    </Button>
  );
}
