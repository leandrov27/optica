const ROOTS = {
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  auth: {
    login: '/',
  },
  admin: {
    root: ROOTS.DASHBOARD,
    //
    client: {
      list: `${ROOTS.DASHBOARD}/client`,
      create: `${ROOTS.DASHBOARD}/client/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/client/${id}/edit`,
    },
    //
    diagnosis: `${ROOTS.DASHBOARD}/diagnosis`,
    note: {
      list: `${ROOTS.DASHBOARD}/note`,
      create: `${ROOTS.DASHBOARD}/note/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/note/${id}/edit`,
    },
    product: `${ROOTS.DASHBOARD}/product`,
    category: `${ROOTS.DASHBOARD}/category`,
    template: {
      list: `${ROOTS.DASHBOARD}/template`,
    },
    event: {
      list: `${ROOTS.DASHBOARD}/template/event`,
      create: `${ROOTS.DASHBOARD}/template/event/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/template/event/${id}/edit`,
      variable_edit: (id: string) => `${ROOTS.DASHBOARD}/template/event/${id}/variables`,
    },
    //
    user: {
      list: `${ROOTS.DASHBOARD}/user`,
      create: `${ROOTS.DASHBOARD}/user/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
    },
    settings: `${ROOTS.DASHBOARD}/settings`,
  },
};
