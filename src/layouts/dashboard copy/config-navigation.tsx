import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  dashboard: icon('ic_dashboard'),
  //
  client: icon('ic_client'),
  //
  note: icon('ic_note'),
  //
  product: icon('ic_product'),
  //
  category: icon('ic_category'),
  //
  user: icon('ic_user'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      {
        subheader: 'general',
        items: [
          {
            title: 'Tablero de Ventas',
            path: paths.admin.root,
            icon: ICONS.dashboard
          },
        ],
      },
      {
        subheader: 'Gestión',
        items: [
          {
            title: 'Clientes',
            path: paths.admin.client.list,
            icon: ICONS.client,
          },
          {
            title: 'Notas de Venta',
            path: paths.admin.note.list,
            icon: ICONS.note,
          },
          {
            title: 'Productos',
            path: paths.admin.product,
            icon: ICONS.product,
          },
          {
            title: 'Categorías',
            path: paths.admin.category,
            icon: ICONS.category,
          },
        ]
      },
      {
        subheader: 'Administración',
        items: [
          {
            title: 'Usuarios',
            path: paths.admin.user.list,
            icon: ICONS.user,
            children: [
              { title: 'Lista de Usuarios', path: paths.admin.user.list },
              { title: 'Registrar Usuario', path: paths.admin.user.create },
            ],
          },
        ]
      },
    ],
    []
  );

  return data;
}
