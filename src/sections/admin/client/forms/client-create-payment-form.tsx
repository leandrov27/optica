'use client';

// @mui
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
// schemas
import { PAYMENT_FORM_OPTIONS } from 'src/core/schemas';
// utils
import { CONFIRM_ICON } from 'src/utils/constants';
//
import useCreatePayment from "../hooks/useCreatePayment"

// ----------------------------------------------------------------------

interface ClientCreatePaymentFormProps {
    noteId: number;
    maxAmount: number;
    onClose?: () => void;
    onSuccess?: () => void;
}

// ----------------------------------------------------------------------

export default function ClientCreatePaymentForm({
    noteId,
    maxAmount,
    onClose,
    onSuccess
}: ClientCreatePaymentFormProps) {
    const {
        //~
        isSubmitting,
        handleSubmit,
        sendForm,
        methods,
    } = useCreatePayment({
        noteId,
        maxAmount,
        onSuccess,
        onClose
    });

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(sendForm)}>
            <Grid container spacing={2}>
                <Grid xs={6} md={6} lg={6}>
                    <RHFTextField
                        name="amount"
                        label="Monto"
                        disabled={isSubmitting}
                    />
                </Grid>

                <Grid xs={6} md={6} lg={6}>
                    <RHFTextField
                        name="reference"
                        label="Referencia (opcional)"
                        disabled={isSubmitting}
                    />
                </Grid>

                <Grid xs={12} md={12} lg={12}>
                    <RHFSelect name="paymentMethod" label="Forma de Pago" disabled={isSubmitting}>
                        {PAYMENT_FORM_OPTIONS.map((option) => (
                            <MenuItem key={option.key} value={option.key}>
                                {option.key} - {option.label}
                            </MenuItem>
                        ))}
                    </RHFSelect>
                </Grid>

                <Grid xs={12} md={12} lg={12}>
                    <RHFTextField
                        name="notes"
                        label="Notas (opcional)"
                        multiline
                        minRows={3}
                        disabled={isSubmitting}
                    />
                </Grid>

                <Grid xs={12} md={12} lg={12}>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        startIcon={<Iconify mr={-0.5} width={17} icon={CONFIRM_ICON} />}
                    >
                        Registrar Pago
                    </LoadingButton>
                </Grid>
            </Grid>
        </FormProvider>
    )
}
