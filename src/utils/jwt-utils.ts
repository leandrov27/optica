// pkgs
import jwt from 'jsonwebtoken';
import { toast } from 'sonner';
// routes
import { paths } from 'src/routes/paths';
// types
import { type IAccessToken } from 'src/core/auth/types';
//
import { setSession } from './session-utils';

// ----------------------------------------------------------------------

export const jwtExpired = (exp: number) => {
  let expiredTimer: NodeJS.Timeout | null = null;

  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  if (expiredTimer) {
    clearTimeout(expiredTimer);
  }

  expiredTimer = setTimeout(() => {
    toast.error('Sesión Expirada. Inicie sesión nuevamente.', {
      duration: 5000,
      position: 'top-center',
      action: {
        label: 'Cerrar',
        onClick: () => {
          setSession(null);
          window.location.href = paths.auth.login;
        },
      },
    });

    setTimeout(() => {
      setSession(null);
      window.location.href = paths.auth.login;
    }, 5000);
  }, timeLeft);
};

// ----------------------------------------------------------------------

export function jwtDecode(value: string) {
  const token = jwt.decode(value) as IAccessToken;

  return token;
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export function verifyToken(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false, message: 'Token no proporcionado', status: 401 };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwtDecode(token);

    return { isValid: true, decodedToken };
  } catch (error) {
    return { isValid: false, message: 'Token inválido o expirado', status: 401 };
  }
}

// ----------------------------------------------------------------------

export function verifyTokenHasRole(request: Request, requiredRole?: 'ADMIN' | 'CLIENT') {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false, message: 'Token no proporcionado', status: 401 };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwtDecode(token);

    if (requiredRole && decodedToken.role !== requiredRole) {
      return {
        isValid: false,
        message: 'No posee autorización para realizar la operación',
        status: 403,
      };
    }

    return { isValid: true, decodedToken };
  } catch (error) {
    return { isValid: false, message: 'Token inválido o expirado', status: 401 };
  }
}