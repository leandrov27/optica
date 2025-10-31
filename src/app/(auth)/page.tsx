// sections
import { LoginView } from 'src/sections/auth/views';
// config
import { APP_NAME } from 'src/config/config-public';

// ----------------------------------------------------------------------

export const metadata = {
  title: `${APP_NAME}: Login`,
};

export default function LoginPage() {
  return <LoginView />;
}
