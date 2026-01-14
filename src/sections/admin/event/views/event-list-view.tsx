'use client';

// @mui
import { Button, Container } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// types
import { type IMessageEventData } from 'src/core/schemas';
//
import EventTable from '../components/event-table';
import useEventDialogStore from '../stores/useEventDialogStore';
import EventNewEditDialog from '../forms/event-new-edit-dialog';

// ----------------------------------------------------------------------

interface EventListViewProps {
  events: IMessageEventData[];
  //
  searchTerm: string;
  //
  currentPage: number;
  totalPages: number;
  //
  totalItems: number;
  from: number;
  to: number;
}

// ----------------------------------------------------------------------

export default function EventListView({
  events,
  //
  searchTerm,
  //
  currentPage,
  totalPages,
  //
  totalItems,
  from,
  to,
}: EventListViewProps) {
  const settings = useSettingsContext();

  const open = useEventDialogStore((state) => state.open);
  const event = useEventDialogStore((state) => state.event);

  const openDialog = useEventDialogStore((state) => state.openDialog);
  const closeDialog = useEventDialogStore((state) => state.closeDialog);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Lista de Eventos de Mensajes"
        links={[
          {
            name: 'Tablero de Ventas',
            href: paths.admin.root,
          },
          { name: 'Eventos de Mensajes' },
        ]}
        action={
          <Button sx={{ minWidth: 20 }} variant="contained" onClick={() => openDialog()}>
            <Iconify icon="mingcute:add-line" />
          </Button>
        }
        sx={{
          mb: { xs: 2, md: 2 },
        }}
      />

      <EventTable
        events={events}
        currentPage={currentPage}
        totalPages={totalPages}
        searchTerm={searchTerm}
        from={from}
        to={to}
        totalItems={totalItems}
      />

      <EventNewEditDialog
        openDialog={open}
        onCloseDialog={closeDialog}
        event={event ?? undefined}
      />
    </Container>
  );
}
