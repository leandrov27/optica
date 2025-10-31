'use client';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import FormProvider, { RHFPhoneField, RHFTextField } from 'src/components/hook-form';
import { Controller } from 'react-hook-form';
// schemas
import { type IUserData } from 'src/core/schemas';
//
import useEditUser from '../hooks/useEditUser';

// ----------------------------------------------------------------------

interface UserEditFormProps {
  user: IUserData;
}

export default function UserEditForm({ user }: UserEditFormProps) {
  const {
    //^ states
    password,
    //* hookform
    isSubmitting,
    handleSubmit,
    onSubmit,
    control,
    methods,
  } = useEditUser({ user });

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

              <RHFTextField name="document" label="Nro. de Documento" disabled={isSubmitting} />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Guardar Cambios
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
