'use client';

// react
import { useCallback, useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// routes
import { useRouter } from 'src/routes/hook';
// utils
import { CONFIRM_ICON } from 'src/utils/constants';
// schemas
import { CreateSatCodeSchema, ICreateSatCodePayload } from 'src/core/schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pkgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

interface SatCodeNewDialogProps {
    openDialog: boolean;
    onCloseDialog: VoidFunction;
}

// ----------------------------------------------------------------------

export default function SatCodeNewDialog({ openDialog = false, onCloseDialog }: SatCodeNewDialogProps) {
    const theme = useTheme();
    const router = useRouter();

    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const methods = useForm({
        resolver: zodResolver(CreateSatCodeSchema),
        defaultValues: {
            name: '',
            codeSat: '',
        },
    });

    const {
        reset,
        clearErrors,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = useCallback(async (formValues: ICreateSatCodePayload) => {
        try {
            const resp = await ax.post(API_ENDPOINTS.admin.sat.create, formValues);
            toast.success(resp.data.message);

            setIsSuccess(true);
            reset();
            router.refresh();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        }
    }, [reset, router]);

    const handleCancelAndClose = () => {
        onCloseDialog();
        handleCancel();
    }

    const handleCancel = useCallback(() => {
        clearErrors();
        reset({ name: '', codeSat: '' });
    }, [clearErrors, reset]);

    const resetSuccess = useCallback(() => {
        setIsSuccess(false);
    }, []);

    useEffect(() => {
        if (isSuccess) {
            resetSuccess();
            onCloseDialog();
        }
    }, [isSuccess, resetSuccess, onCloseDialog]);

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={openDialog}
            onClose={handleCancelAndClose}
            transitionDuration={{
                enter: theme.transitions.duration.shortest,
                exit: theme.transitions.duration.shortest - 80,
            }}
        >
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle textAlign="left" sx={{ py: 1.5 }}>Registrar Código SAT</DialogTitle>

                <IconButton
                    aria-label="close"
                    onClick={handleCancelAndClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 5,
                        color: theme.palette.grey[500],
                    })}
                >
                    <Iconify icon="ic:round-close" width={26} />
                </IconButton>

                <Divider />

                <DialogContent sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid xs={12} md={12} lg={12}>
                            <RHFTextField
                                name="name"
                                label="Descripción"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid xs={12} md={12} lg={12}>
                            <RHFTextField
                                name="codeSat"
                                label="Código SAT"
                                disabled={isSubmitting}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ py: 1.5 }}>
                    <Button
                        variant='outlined'
                        disabled={isSubmitting}
                        onClick={handleCancelAndClose}
                    >
                        Cancelar
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        startIcon={<Iconify mr={-0.5} width={17} icon={CONFIRM_ICON} />}
                    >
                        Guardar
                    </LoadingButton>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}
