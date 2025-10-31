'use client';

// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import ListItemText from '@mui/material/ListItemText';
// components
import Image from 'src/components/image';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { ConfirmDialog } from 'src/components/custom-dialog';
// routes
import { paths } from 'src/routes/paths';
// schemas
import { type IClientRaw } from "src/core/schemas";
// utils
import { PEN_ICON, TRASH_ICON } from 'src/utils/constants';
//
import useDeleteClient from '../hooks/useDeleteClient';

// ----------------------------------------------------------------------

interface ClientCardProps {
    row: IClientRaw;
    itemsInPage: number;
}

// ----------------------------------------------------------------------

export default function ClientCard({ row, itemsInPage }: ClientCardProps) {
    const {
        confirm,
        isDeleting,
        handleDeleteClient,
    } = useDeleteClient({ itemsInPage });

    const { id, displayName, phone, type } = row;

    const renderPrimary = (
        <Card sx={{ textAlign: 'center' }}>
            <Label variant='filled' color="primary" sx={{ position: "absolute", zIndex: 9, top: 10, left: 10 }}>
                <Iconify icon={'foundation:key'} width={14} sx={{ mr: 0.5 }} />
                {id}
            </Label>

            <ListItemText
                sx={{ mt: 4.5, mb: 1, px: 2 }}
                primary={displayName}
                secondary={phone}
                primaryTypographyProps={{ typography: 'subtitle1' }}
                secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
            />

            <Label variant='soft' color="default" sx={{ mb: 2 }}>
                {type === 'INDIVIDUAL' ? 'Persona Física' : 'Persona Moral'}
            </Label>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack direction="row" spacing={2} justifyContent={'center'} sx={{ py: 1.5 }}>
                <Button
                    disabled={isDeleting}
                    component={RouterLink}
                    href={paths.admin.client.edit(id.toString())}
                    variant="soft"
                    color='primary'
                    size="small"
                    startIcon={<Iconify mr={-0.5} width={17} icon={PEN_ICON} />}
                >
                    Modificar Cliente
                </Button>

                <LoadingButton
                    loading={isDeleting}
                    onClick={confirm.onTrue}
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Iconify mr={-0.5} width={17} icon={TRASH_ICON} />}
                >
                    Eliminar
                </LoadingButton>
            </Stack>
        </Card>
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
