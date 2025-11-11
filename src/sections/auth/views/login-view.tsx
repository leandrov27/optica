'use client';

// @mui
import {
    Alert,
    Stack,
    IconButton,
    Typography,
    InputAdornment,
    Card,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { Controller } from 'react-hook-form';
import Iconify from 'src/components/iconify';
// hookform
import FormProvider, { RHFPhoneField, RHFTextField } from 'src/components/hook-form';
// config
import { SOFT_NAME } from 'src/config/config-public';
// stores
import { useSettingsStore } from 'src/core/stores';
//
import useLogin from '../hooks/useLogin';

// ----------------------------------------------------------------------

export default function LoginView() {
    const settings = useSettingsStore((state) => state.settings);
    const appName = settings?.name ?? SOFT_NAME;

    const {
        //* state getters
        password,
        errorMsg,
        //& hookform
        handleSubmit,
        isSubmitting,
        onSubmit,
        control,
        methods,
    } = useLogin();

    const renderForm = (
        <Stack spacing={2.5}>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <Controller
                name="identity"
                control={control}
                render={({ field, fieldState }) => (
                    <RHFPhoneField
                        disabled={isSubmitting}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                )}
            />

            <RHFTextField
                name="password"
                label="Contraseña"
                disabled={isSubmitting}
                type={password.value ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton disabled={isSubmitting} onClick={password.onToggle} edge="end">
                                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
            >
                Acceder
            </LoadingButton>
        </Stack>
    );

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 3 }}>
                <Stack spacing={0} sx={{ mb: 2 }}>
                    <Typography variant="h4" textAlign="center">Iniciar Sesión</Typography>
                </Stack>

                {renderForm}
            </Card>
        </FormProvider>
    );
}
