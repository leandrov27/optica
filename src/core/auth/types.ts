export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type IAccessToken = {
  id: number;
  phone: string;
  role: 'ADMIN' | 'CLIENT';
  exp: number;
  iat: number;
};

type IAuthenticatedUser = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'ADMIN' | 'CLIENT';
};

export type AuthUserType = null | IAuthenticatedUser | Record<string, any>;

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: AuthUserType;
};

// ----------------------------------------------------------------------

export type JWTContextType = {
  user: AuthUserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (
    identity: string, 
    password: string
  ) => Promise<AuthUserType>;
  logout: () => Promise<void>;
};