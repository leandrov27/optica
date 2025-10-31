'use client';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
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
// assets
import { AvatarShape } from "src/assets/illustrations";
// schemas
import { type IUserData } from "src/core/schemas";
// utils
import { PEN_ICON, TRASH_ICON } from 'src/utils/constants';
//
//
import useDeleteUser from '../hooks/useDeleteUser';

// ----------------------------------------------------------------------

interface UserCardProps {
    row: IUserData;
    itemsInPage: number;
}

// ----------------------------------------------------------------------

export default function UserCard({ row, itemsInPage }: UserCardProps) {
    const theme = useTheme();

    const {
        confirm,
        isDeleting,
        handleDeleteUser,
    } = useDeleteUser({ itemsInPage });

    const { id, firstName, lastName, phone, status } = row;

    const renderPrimary = (
        <Card sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative' }}>
                <Label variant='filled' color="primary" sx={{ position: "absolute", zIndex: 9, top: 10, left: 10 }}>
                    <Iconify icon={'foundation:key'} width={14} sx={{ mr: 0.5 }} />
                    {id}
                </Label>

                <Label variant='filled' color={status === 'ACTIVO' ? 'success' : 'error'} sx={{ position: "absolute", zIndex: 9, top: 10, right: 10 }}>
                    {status}
                </Label>

                <AvatarShape
                    sx={{
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        mx: 'auto',
                        bottom: -26,
                        position: 'absolute',
                    }}
                />

                <Avatar
                    sx={{
                        width: 64,
                        height: 64,
                        zIndex: 11,
                        left: 0,
                        right: 0,
                        bottom: -32,
                        mx: 'auto',
                        position: 'absolute',
                        bgcolor: 'primary.light',
                    }}
                    alt={`${firstName}-${id}`}
                    src={undefined}
                >
                    {firstName.charAt(0).toUpperCase()}
                </Avatar>

                <Image
                    src="https://t4.ftcdn.net/jpg/06/56/40/39/360_F_656403907_xuQ9qZTbcFBCXI2OjjilpTo5Dl4R0d6u.jpg"
                    alt="astro_bg"
                    ratio="21/9"
                    overlay={alpha(theme.palette.grey[900], 0.48)}
                />
            </Box>

            <ListItemText
                sx={{ mt: 5, mb: 1, px: 2 }}
                primary={`${firstName} ${lastName}`}
                secondary={phone}
                primaryTypographyProps={{ typography: 'subtitle1' }}
                secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
            />

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack direction="row" spacing={2} justifyContent={'center'} sx={{ py: 1.5 }}>
                <Button
                    disabled={isDeleting}
                    component={RouterLink}
                    href={paths.admin.user.edit(id.toString())}
                    variant="soft"
                    color='primary'
                    size="small"
                    startIcon={<Iconify mr={-0.5} width={17} icon={PEN_ICON} />}
                >
                    Modificar Usuario
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
                title={`¿Eliminar Usuario N.º ${id}?`}
                content={`Confirme si realmente está intentando eliminar este registro de la base de datos.`}
                action={
                    <LoadingButton
                        color="error"
                        variant="contained"
                        loading={isDeleting}
                        onClick={() => handleDeleteUser(id)}
                        startIcon={<Iconify mr={-0.5} width={17} icon={TRASH_ICON} />}
                    >
                        Si, Eliminar
                    </LoadingButton>
                }
            />
        </>
    )
}
