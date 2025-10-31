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
import { ConfirmDialog } from 'src/components/custom-dialog';
// schemas
import { type ICategoryData } from 'src/core/schemas';
// utils
import { PEN_ICON, TRASH_ICON } from 'src/utils/constants';
//
import useDeleteCategory from '../hooks/useDeleteCategory';
import useCategoryDialogStore from '../stores/useCategoryDialogStore';

// ----------------------------------------------------------------------

interface CategoryTableRowProps {
    row: ICategoryData;
    itemsInPage: number;
}

// ----------------------------------------------------------------------

export default function CategoryTableRow({ row, itemsInPage }: CategoryTableRowProps) {
    const {
        confirm,
        isDeleting,
        handleDeleteCategory,
    } = useDeleteCategory({ itemsInPage });

    const { id, name, icon } = row;

    const openDialog = useCategoryDialogStore((state) => state.openDialog);

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
                    {name}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="default" variant='soft'>
                    {icon ? icon : 'NO'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Stack direction="row" gap={1}>
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
                title={`¿Eliminar Categoría N.º ${id}?`}
                content={`Confirme si realmente está intentando eliminar este registro de la base de datos.`}
                action={
                    <LoadingButton
                        color="error"
                        variant="contained"
                        loading={isDeleting}
                        onClick={() => handleDeleteCategory(id)}
                        startIcon={<Iconify mr={-0.5} width={17} icon={TRASH_ICON} />}
                    >
                        Si, Eliminar
                    </LoadingButton>
                }
            />
        </>
    );
}
