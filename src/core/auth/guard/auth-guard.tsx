import { useEffect, useCallback, useState } from 'react';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
//
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

// ----------------------------------------------------------------------

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const { authenticated } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      router.replace(paths.auth.login);
    } else {
      setChecked(true);
    }
  }, [authenticated, router]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
