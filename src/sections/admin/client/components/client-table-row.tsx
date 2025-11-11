'use client';

// @mui
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
// utils
import { PEN_ICON, TRASH_ICON } from 'src/utils/constants';
// schemas
import { type IClientRaw } from 'src/core/schemas';
// pkgs
import { upperCase } from 'lodash';
//
import useDeleteClient from '../hooks/useDeleteClient';

// ----------------------------------------------------------------------

interface ClientTableRowProps {
    row: IClientRaw;
    itemsInPage: number;
}

// ----------------------------------------------------------------------

export default function ClientTableRow({ row, itemsInPage }: ClientTableRowProps) {
    const {
        confirm,
        isDeleting,
        handleDeleteClient,
    } = useDeleteClient({ itemsInPage });

    const { id, displayName, phone, type } = row;

    const renderPrimary = (
        <TableRow hover>
            <TableCell align="left">
                <Label color="default">
                    <Iconify icon={'foundation:key'} width={14} sx={{ mr: 0.5 }} />
                    {id}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="primary" variant='soft'>
                    {upperCase(`${displayName}`)}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label variant='soft' color="info">
                    {phone}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label variant='soft' color="default">
                    {type === 'INDIVIDUAL' ? 'Persona Física' : 'Persona Moral'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Stack direction="row" gap={1} sx={{ ml: 1 }}>
                    <IconButton
                        color="primary"
                        size="small"
                        sx={{ border: '1px solid' }}
                        component={RouterLink}
                        href={paths.admin.client.edit(id.toString())}
                    >
                        <Iconify icon={PEN_ICON} />
                    </IconButton>

                    <IconButton
                        color="error"
                        size="small"
                        sx={{ border: '1px solid' }}
                        onClick={confirm.onTrue}
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
                title={`¿Eliminar Cliente N.º ${id}?`}
                content={`Confirme si realmente está intentando eliminar este registro de la base de datos.`}
                action={
                    <LoadingButton
                        color="error"
                        variant="contained"
                        loading={isDeleting}
                        onClick={() => handleDeleteClient(id)}
                        startIcon={<Iconify mr={-0.5} width={17} icon={TRASH_ICON} />}
                    >
                        Si, Eliminar
                    </LoadingButton>
                }
            />
        </>
    )
}
