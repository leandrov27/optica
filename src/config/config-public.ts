import { paths } from "src/routes/paths";

// ----------------------------------------------------------------------

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Empresys';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';
export const VPS_URL = process.env.NEXT_PUBLIC_VPS_URL;

// ----------------------------------------------------------------------

export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'v1.0';
export const APP_DEV = process.env.NEXT_PUBLIC_APP_DEV || 'Empresys';
export const SOFT_NAME = process.env.NEXT_PUBLIC_APP_DEV || 'Óptica Visión';

// ----------------------------------------------------------------------

export const ADMIN_PATH_AFTER_LOGIN = paths.admin.client.list;