// libs
import ax from "src/libs/fetcher";
// pkgs
import Cookies from "js-cookie";
//
import { jwtDecode, jwtExpired } from "./jwt-utils";

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

// ----------------------------------------------------------------------

export const getSession = () => {
  return Cookies.get(STORAGE_KEY);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    Cookies.set(STORAGE_KEY, accessToken);

    ax.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    const { exp } = jwtDecode(accessToken);
    jwtExpired(exp);
  } else {
    Cookies.remove(STORAGE_KEY);
    delete ax.defaults.headers.common.Authorization;
  }
};