'use client';

// react
import { useCallback, useEffect, useMemo, useReducer } from "react";
// libs
import ax, { API_ENDPOINTS } from "src/libs/fetcher";
// utils
import { getSession, setSession } from "src/utils/session-utils";
import { isValidToken } from "src/utils/jwt-utils";
//
import { AuthContext } from "./auth-context";
import { type AuthStateType, type ActionMapType, type AuthUserType } from "../types";

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

// ----------------------------------------------------------------------

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = getSession();

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await ax.get(API_ENDPOINTS.auth.me);
        const { user } = response.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (identity: string, password: string): Promise<AuthUserType> => {
    try {
      const response = await ax.post(API_ENDPOINTS.auth.login, { identity, password });
      const { accessToken, user } = response.data;

      setSession(accessToken);

      dispatch({
        type: Types.LOGIN,
        payload: { user },
      });

      return user as AuthUserType;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error(error.message);
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      logout,
    }),
    [login, logout, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
