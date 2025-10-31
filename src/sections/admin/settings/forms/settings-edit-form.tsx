'use client';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import FormProvider, { RHFPhoneField, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
import { Controller } from 'react-hook-form';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fData } from 'src/utils/format-number';
// schemas
import { type ISettingsData } from 'src/core/schemas';
//
import useEditSettings from '../hooks/useEditSettings';
import CountryAutocomplete from '../widgets/country-autocomplete';

// ----------------------------------------------------------------------

interface SettingsEditFormProps {
    settings: ISettingsData;
};

// ----------------------------------------------------------------------

export default function SettingsEditForm({ settings }: SettingsEditFormProps) {
    const confirm = useBoolean();

    const {
        //* hookform
        control,
        methods,
        isSubmitting,
        handleSubmit,
        //& methods
        handleDropBusinessLogo,
        handleUndropBusinessLogo,
        //
        handleDropCompanyLogo,
        handleUndropCompanyLogo,
        //
        onSubmit,
    } = useEditSettings({ settings });

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid xs={12} md={12} lg={12}>
                    <Card sx={{ p: 2 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(1, 1fr)',
                            }}
                        >
                            <Stack spacing={5} flexDirection={{ sx: "column", md: "row" }} justifyContent="space-around" alignItems="center">
                                <Stack spacing={1} flexDirection="column" justifyContent="center" alignItems="center">
                                    <Typography variant='h6'>
                                        Logo de la Óptica
                                    </Typography>
                                    <RHFUploadAvatar
                                        name="businessLogoUrl"
                                        maxSize={3145728}
                                        onDrop={handleDropBusinessLogo}
                                        onReset={handleUndropBusinessLogo}
                                        isSubmitting={isSubmitting}
                                        disabled={isSubmitting}
                                        helperText={
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    mt: 1,
                                                    mx: 'auto',
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    color: 'text.disabled',
                                                }}
                                            >
                                                Tipos permitidos: <strong>*.jpeg, *.jpg, *.png, *.gif</strong>
                                                <br /> Tam. máximo: <strong>{fData(3000000)}</strong>
                                            </Typography>
                                        }
                                    />
                                </Stack>

                                <Stack spacing={1} flexDirection="column" justifyContent="center" alignItems="center">
                                    <Typography variant='h6'>
                                        Logo de la Empresa
                                    </Typography>
                                    <RHFUploadAvatar
                                        name="companyLogoUrl"
                                        maxSize={3145728}
                                        onDrop={handleDropCompanyLogo}
                                        onReset={handleUndropCompanyLogo}
                                        isSubmitting={isSubmitting}
                                        disabled={isSubmitting}
                                        helperText={
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    mt: 1,
                                                    mx: 'auto',
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    color: 'text.disabled',
                                                }}
                                            >
                                                Tipos permitidos: <strong>*.jpeg, *.jpg, *.png, *.gif</strong>
                                                <br /> Tam. máximo: <strong>{fData(3000000)}</strong>
                                            </Typography>
                                        }
                                    />
                                </Stack>
                            </Stack>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(1, 1fr)',
                            }}
                        >
                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center" gap={2}>
                                <RHFTextField name="name" label="Nombre del Negocio" disabled={isSubmitting} />

                                <RHFTextField name="address" label="Dirección" disabled={isSubmitting} />
                            </Stack>

                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center" gap={2}>
                                <RHFTextField name="currencyCode" label="Moneda" disabled={true} />

                                <RHFTextField name="currencySymbol" label="Símbolo de Moneda" />
                            </Stack>

                            <Stack flexDirection="row" justifyContent="space-between" alignItems="center" gap={2}>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <RHFPhoneField
                                            value={field.value}
                                            onChange={field.onChange}
                                            fullWidth
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            label="Teléfono"
                                            disabled={isSubmitting}
                                        />
                                    )}
                                />

                                <Controller
                                    name="localeCode"
                                    control={control}
                                    render={({ field, fieldState }) => {
                                        const { setValue } = methods;

                                        return (
                                            <CountryAutocomplete
                                                onSubmitting={isSubmitting}
                                                helperText={fieldState.error?.message}
                                                error={fieldState.invalid}
                                                onHandleChange={(selected) => {
                                                    if (!selected) {
                                                        // Si se limpió la selección
                                                        field.onChange('');
                                                        setValue('currencyCode', '');
                                                        setValue('currencySymbol', '');
                                                        return;
                                                    }

                                                    // Actualiza localeCode en el form
                                                    field.onChange(selected.languageCode);

                                                    // Actualiza la moneda y símbolo
                                                    setValue('currencyCode', selected.currencyCode ?? '');
                                                    setValue('currencySymbol', selected.currencySymbol ?? '');
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </Stack>
                        </Box>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="button" onClick={confirm.onTrue} variant="contained" loading={isSubmitting}>
                                Guardar Cambios
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                onProcessing={isSubmitting}
                title={`¿Modificar Datos Sensibles?`}
                content={`Confirme si realmente está intentando modificar estos datos, una configuración errónea podría romper la funcionalidad.`}
                action={
                    <LoadingButton
                        color="inherit"
                        variant="contained"
                        loading={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                        startIcon={<Iconify mr={-0.5} width={17} icon="" />}
                    >
                        Si, Confirmar
                    </LoadingButton>
                }
            />
        </FormProvider>
    );
}
