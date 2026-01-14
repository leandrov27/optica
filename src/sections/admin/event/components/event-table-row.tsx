'use client';

// react
import { useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { ConfirmDialog } from 'src/components/custom-dialog';
// schemas
import { type IMessageEventData } from 'src/core/schemas';
// utils
import { PEN_ICON, TRASH_ICON } from 'src/utils/constants';
// libs
import { dayjs } from 'src/libs/dayjs';
import ax from 'src/libs/fetcher';
// routes
import { paths } from 'src/routes/paths';
// pkgs
import { toast } from 'sonner';
//
import useDeleteEvent from '../hooks/useDeleteEvent';
import useEventDialogStore from '../stores/useEventDialogStore';

// ----------------------------------------------------------------------

interface EventTableRowProps {
  row: IMessageEventData;
  itemsInPage: number;
}

// ----------------------------------------------------------------------

export default function EventTableRow({ row, itemsInPage }: EventTableRowProps) {
  const { confirm, isDeleting, handleDeleteEvent } = useDeleteEvent({ itemsInPage });

  const { id, name, type, eventDate, isActive, template } = row;

  const openDialog = useEventDialogStore((state) => state.openDialog);

  const [sendTest, setSendTest] = useState<boolean>(false);
  const handleTest = async () => {
    setSendTest(true);
    try {
      await ax.post(`/api/admin/whatsapp/send/${row.id}/1`);
      toast.success('Evento de prueba enviado correctamente.');
    } catch (error) {
      console.log(error);
      toast.error(error?.error || 'Error al enviar prueba');
    } finally {
      setSendTest(false);
    }
  };

  const renderPrimary = (
    <TableRow hover>
      <TableCell align="left">
        <Label color="default">
          <Iconify icon={'foundation:key'} width={14} sx={{ mr: 0.5 }} />
          {id}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Label style={{ textTransform: 'none' }} color="primary">
          {name}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Label color="info" style={{ textTransform: 'none' }}>
          {eventDate ? dayjs(eventDate).utc().format('ddd DD [de] MMMM [del] YYYY') : 'AUTOMÁTICO'}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Label style={{ textTransform: 'none' }} color="primary" variant="soft">
          {template.name}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Label color="secondary" variant="soft">
          {type === 'BIRTHDAY' ? 'CUMPLEAÑOS' : 'PERSONALIZADO'}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Label color={isActive ? 'success' : 'warning'} variant="soft">
          {isActive ? 'ACTIVO' : 'INACTIVO'}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
          <Label color="default" variant="soft">
            {template.variablesCount}
          </Label>

          <IconButton
            color="secondary"
            size="small"
            component={RouterLink}
            href={paths.admin.event.variable_edit(id.toString())}
          >
            <Iconify icon={PEN_ICON} />
          </IconButton>
        </Stack>
      </TableCell>

      <TableCell align="center">
        <Stack direction="row" gap={1}>
          <LoadingButton loading={sendTest} onClick={handleTest} variant="outlined" size="small">
            Probar
          </LoadingButton>

          <IconButton
            color="primary"
            size="small"
            sx={{ border: '1px solid' }}
            onClick={() => openDialog(row)}
          >
            <Iconify icon={PEN_ICON} />
          </IconButton>

          <IconButton
            color="error"
            size="small"
            sx={{ border: '1px solid' }}
            onClick={() => {
              confirm.onTrue();
            }}
          >
            <Iconify icon={TRASH_ICON} />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        onProcessing={isDeleting}
        title={`¿Eliminar Evento N.º ${id}?`}
        content={`Confirme si realmente está intentando eliminar este registro de la base de datos.`}
        action={
          <LoadingButton
            color="error"
            variant="contained"
            loading={isDeleting}
            onClick={() => handleDeleteEvent(id)}
            startIcon={<Iconify mr={-0.5} width={17} icon={TRASH_ICON} />}
          >
            Si, Eliminar
          </LoadingButton>
        }
      />
    </>
  );
}
