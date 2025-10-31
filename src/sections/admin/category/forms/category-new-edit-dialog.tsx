'use client';

// react
import { useEffect } from 'react';
// @mui
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from 'src/components/iconify';
import { Controller } from 'react-hook-form';
import FormProvider, { RHFEmojiField, RHFTextField } from 'src/components/hook-form';
// schemas
import {
    type ICategoryData,
} from 'src/core/schemas';
// utils
import { CONFIRM_ICON } from 'src/utils/constants';
//
import useNewEditCategory from '../hooks/useNewEditCategory';

// ----------------------------------------------------------------------

interface CategoryNewEditDialogProps {
    category?: ICategoryData;
    //
    openDialog: boolean;
    onCloseDialog: VoidFunction;
}

// ----------------------------------------------------------------------

export default function CategoryNewEditDialog({ category, openDialog = false, onCloseDialog }: CategoryNewEditDialogProps) {
    const theme = useTheme();

    const {
        //^ states
        isEdit,
        isSuccess,
        //* hookform
        control,
        methods,
        isSubmitting,
        handleSubmit,
        //& methods
        handleCancel,
        resetSuccess,
        onSubmit,
    } = useNewEditCategory({ category });

    useEffect(() => {
        if (isSuccess) {
            resetSuccess();
            onCloseDialog();
        }
    }, [isSuccess, resetSuccess, onCloseDialog]);

    const handleCancelAndClose = () => {
        onCloseDialog();
        handleCancel();
    }

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
                <DialogTitle textAlign="center" sx={{ py: 1.5 }}>{isEdit ? 'Modificar' : 'Registrar'} Categoría</DialogTitle>

                <Divider />

                <DialogContent sx={{ p: 2 }}>
                    <RHFTextField
                        name="name"
                        label="Nombre de la categoría"
                        disabled={isSubmitting}
                        sx={{ mb: 2 }}
                    />

                    <Controller
                        name="icon"
                        control={control}
                        render={({ field }) => (
                            <RHFEmojiField
                                {...field}
                                onChange={field.onChange}
                                onSubmitting={isSubmitting}
                            />
                        )}
                    />
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
                        {isEdit ? 'Guardar Cambios' : 'Guardar'}
                    </LoadingButton>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}
