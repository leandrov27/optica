'use client';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
// components
import FormProvider, { RHFPhoneField, RHFTextField } from 'src/components/hook-form';
import { Controller } from 'react-hook-form';
import Iconify from 'src/components/iconify';
//
import useCreateUser from '../hooks/useCreateUser';

// ----------------------------------------------------------------------

export default function UserCreateForm() {
    const {
        //^ states
        password,
        //* hookform
        isSubmitting,
        handleSubmit,
        onSubmit,
        control,
        methods,
    } = useCreateUser();

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <RHFTextField name="firstName" label="Nombre" disabled={isSubmitting} />

                            <RHFTextField name="lastName" label="Apellido" disabled={isSubmitting} />

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

                            <RHFTextField
                                name="password"
                                label="Contraseña"
                                type={password.value ? 'text' : 'password'}
                                disabled={isSubmitting}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={password.onToggle} edge="end" disabled={isSubmitting}>
                                                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Guardar
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
