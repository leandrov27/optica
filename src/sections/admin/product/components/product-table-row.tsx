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
import { type IProductData } from 'src/core/schemas';
// utils
import { PEN_ICON, TRASH_ICON } from 'src/utils/constants';
// stores
import { useSettingsStore } from 'src/core/stores';
//
import useDeleteProduct from '../hooks/useDeleteProduct';
import useProductDialogStore from '../stores/useProductDialogStore';

// ----------------------------------------------------------------------

interface ProductTableRowProps {
    row: IProductData;
    itemsInPage: number;
}

// ----------------------------------------------------------------------

export default function ProductTableRow({ row, itemsInPage }: ProductTableRowProps) {
    const {
        confirm,
        isDeleting,
        handleDeleteProduct,
    } = useDeleteProduct({ itemsInPage });

    const { id, code, description, price, category } = row;

    const openDialog = useProductDialogStore((state) => state.openDialog);

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
                    <Iconify icon={'heroicons-solid:hashtag'} width={14} sx={{ mr: 0.5 }} />
                    {code}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="primary" variant='soft'>
                    {description}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="success" variant='soft'>
                    {settings?.currencySymbol} {Number(price)}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="primary" variant='soft'>
                    {category.icon ?? null} {category.name}
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
                title={`¿Eliminar Producto N.º ${id}?`}
                content={`Confirme si realmente está intentando eliminar este registro de la base de datos.`}
                action={
                    <LoadingButton
                        color="error"
                        variant="contained"
                        loading={isDeleting}
                        onClick={() => handleDeleteProduct(id)}
                        startIcon={<Iconify mr={-0.5} width={17} icon={TRASH_ICON} />}
                    >
                        Si, Eliminar
                    </LoadingButton>
                }
            />
        </>
    );
}
