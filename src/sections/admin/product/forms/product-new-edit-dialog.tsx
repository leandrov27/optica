'use client';

// react
import { useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
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
import { Controller } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// schemas
import { type IProductData } from 'src/core/schemas';
// utils
import { CONFIRM_ICON } from 'src/utils/constants';
// [category]
import useCategoryDialogStore from '../../category/stores/useCategoryDialogStore';
import CategoryNewEditDialog from '../../category/forms/category-new-edit-dialog';
//
import useNewEditProduct from '../hooks/useNewEditProduct';
import CategoryAutocomplete from '../widgets/category-autocomplete';
import SatAutocomplete from '../widgets/sat-autocomplete';
import SatCodeNewDialog from './sat-code-new-dialog';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

interface ProductNewEditDialogProps {
    product?: IProductData;
    //
    openDialog: boolean;
    onCloseDialog: VoidFunction;
}

// ----------------------------------------------------------------------

export default function ProductNewEditDialog({ product, openDialog = false, onCloseDialog }: ProductNewEditDialogProps) {
    const theme = useTheme();

    const categoryDialogStatus = useCategoryDialogStore((state) => state.open);
    const openCategoryDialog = useCategoryDialogStore((state) => state.openDialog);
    const closeCategoryDialog = useCategoryDialogStore((state) => state.closeDialog);

    const satDialog = useBoolean();
    
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
    } = useNewEditProduct({ product });

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
                <DialogTitle textAlign="left" sx={{ py: 1.5 }}>{isEdit ? 'Modificar' : 'Registrar'} Producto</DialogTitle>

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
                            <Stack flexDirection="row" alignItems="flex-start" justifyContent="center" gap={1} sx={{ width: '100%', flexShrink: 1 }}>
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <CategoryAutocomplete
                                            onSubmitting={isSubmitting}
                                            helperText={fieldState.error?.message}
                                            error={fieldState.invalid}
                                            onHandleChange={field.onChange}
                                        />
                                    )}
                                />

                                <Button onClick={() => openCategoryDialog()} sx={{ minWidth: 20, mt: 1.5, flexShrink: 0, }} variant="contained" size="small">
                                    <Iconify icon="mingcute:add-line" />
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid xs={12} md={12} lg={12}>
                            <Stack flexDirection="row" alignItems="flex-start" justifyContent="center" gap={1} sx={{ width: '100%', flexShrink: 1 }}>
                                <Controller
                                    name="satCodeId"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <SatAutocomplete
                                            onSubmitting={isSubmitting}
                                            helperText={fieldState.error?.message}
                                            error={fieldState.invalid}
                                            onHandleChange={field.onChange}
                                        />
                                    )}
                                />

                                <Button onClick={satDialog.onTrue} sx={{ minWidth: 20, mt: 1.5, flexShrink: 0, }} variant="contained" size="small">
                                    <Iconify icon="mingcute:add-line" />
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid xs={4} md={4} lg={4}>
                            <RHFTextField
                                name="code"
                                label="Código"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid xs={8} md={8} lg={8}>
                            <RHFTextField
                                name="price"
                                label="Precio"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid xs={12} md={12} lg={12}>
                            <RHFTextField
                                name="description"
                                label="Descripción"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid xs={12} md={12} lg={12}>
                            <RHFTextField
                                name="notes"
                                label="Notas"
                                multiline
                                minRows={3}
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
                        {isEdit ? 'Guardar Cambios' : 'Guardar'}
                    </LoadingButton>
                </DialogActions>
            </FormProvider>

            <CategoryNewEditDialog
                openDialog={categoryDialogStatus}
                onCloseDialog={closeCategoryDialog}
            />

            <SatCodeNewDialog
                openDialog={satDialog.value}
                onCloseDialog={satDialog.onFalse}
            />
        </Dialog>
    );
}
