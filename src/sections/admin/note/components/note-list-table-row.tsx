'use client';

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
// routes
import { paths } from 'src/routes/paths';
// schemas
import { type INoteData } from 'src/core/schemas';
// utils
import { formatDate } from 'src/utils/format-date';
import { PEN_ICON, TRASH_ICON } from 'src/utils/constants';
// stores
import { useSettingsStore } from 'src/core/stores';
//
import useDeleteNote from '../hooks/useDeleteNote';

// ----------------------------------------------------------------------

interface NoteListTableRowProps {
    row: INoteData;
    itemsInPage: number;
}

// ----------------------------------------------------------------------

export default function NoteListTableRow({ row, itemsInPage }: NoteListTableRowProps) {
    const {
        confirm,
        isDeleting,
        handleDeleteNote,
    } = useDeleteNote({ itemsInPage });

    const { id, client, total, date } = row;

    const settings = useSettingsStore((state) => state.settings);

    const renderPrimary = (
        <TableRow hover>
            <TableCell align="left">
                <Label color="default">
                    <Iconify icon={'foundation:key'} width={14} sx={{ mr: 0.5 }} />
                    {id}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="secondary">
                    <Iconify icon={'heroicons-solid:hashtag'} width={14} />
                    {client.id} · {client.displayName}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="success" variant='soft'>
                    {settings?.currencySymbol} {Number(total)}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="default" variant='soft'>
                    {formatDate(date)}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Stack direction="row" gap={1} sx={{ ml: 1 }}>
                    <IconButton
                        color="primary"
                        size="small"
                        sx={{ border: '1px solid' }}
                        component={RouterLink}
                        href={paths.admin.note.edit(id.toString())}
                    >
                        <Iconify icon={PEN_ICON} />
                    </IconButton>

                    <IconButton
                        color="error"
                        size="small"
                        sx={{ border: '1px solid' }}
                        onClick={() => { confirm.onTrue(); }}
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
                title={`¿Eliminar Nota N.º ${id}?`}
                content={`Confirme si realmente está intentando eliminar este registro de la base de datos.`}
                action={
                    <LoadingButton
                        color="error"
                        variant="contained"
                        loading={isDeleting}
                        onClick={() => handleDeleteNote(id)}
                        startIcon={<Iconify mr={-0.5} width={17} icon={TRASH_ICON} />}
                    >
                        Si, Eliminar
                    </LoadingButton>
                }
            />
        </>
    );
}
