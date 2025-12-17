// libs
import axios from 'axios';
// config
import { APP_URL } from 'src/config/config-public';

// ----------------------------------------------------------------------

const ROOTS_API = {
  auth: '/api/auth',
  admin: '/api/admin',
}

// ----------------------------------------------------------------------

export const API_ENDPOINTS = {
  auth: {
    login: `${ROOTS_API.auth}/login`,
    me: `${ROOTS_API.auth}/me`,
  },
  admin: {
    client: {
      create: `${ROOTS_API.admin}/client/create`,
      update: (id: number) => `${ROOTS_API.admin}/client/${id}/update`,
      delete: (id: number) => `${ROOTS_API.admin}/client/${id}/delete`,
      show: (id: number) => `${ROOTS_API.admin}/client/${id}/show`,
      search: (query: string) => `${ROOTS_API.admin}/client/search?q=${encodeURIComponent(query)}`,
    },
    note: {
      create: `${ROOTS_API.admin}/note/create`,
      update: (id: number) => `${ROOTS_API.admin}/note/${id}/update`,
      delete: (id: number) => `${ROOTS_API.admin}/note/${id}/delete`,
      find_notes: (clientId: number) => `${ROOTS_API.admin}/note/find-notes?id=${encodeURIComponent(clientId)}`,
      search_client: (query: string) => `${ROOTS_API.admin}/note/search-client?q=${encodeURIComponent(query)}`,
      search_product: (query: string) => `${ROOTS_API.admin}/note/search-product?q=${encodeURIComponent(query)}`,
    },
    payment: {
      create: `${ROOTS_API.admin}/payment/create`,
    },
    sat: {
      create: `${ROOTS_API.admin}/sat/create`,
    },
    product: {
      create: `${ROOTS_API.admin}/product/create`,
      update: (id: number) => `${ROOTS_API.admin}/product/${id}/update`,
      delete: (id: number) => `${ROOTS_API.admin}/product/${id}/delete`,
      search_category: (query: string) => `${ROOTS_API.admin}/product/search-category?q=${encodeURIComponent(query)}`,
      search_sat: (query: string) => `${ROOTS_API.admin}/product/search-sat?q=${encodeURIComponent(query)}`,
    },
    category: {
      create: `${ROOTS_API.admin}/category/create`,
      update: (id: number) => `${ROOTS_API.admin}/category/${id}/update`,
      delete: (id: number) => `${ROOTS_API.admin}/category/${id}/delete`,
    },
    user: {
      create: `${ROOTS_API.admin}/user/create`,
      update: (id: number) => `${ROOTS_API.admin}/user/${id}/update`,
      delete: (id: number) => `${ROOTS_API.admin}/user/${id}/delete`,
      profile: (id: number) => `${ROOTS_API.admin}/user/${id}/profile`,
    },
    settings: {
      find: `${ROOTS_API.admin}/settings/find`,
      update: `${ROOTS_API.admin}/settings/update`,
    }
  }
} as const;

// ----------------------------------------------------------------------

const ax = axios.create({ baseURL: APP_URL });

ax.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Algo salió mal')
);

export default ax;
