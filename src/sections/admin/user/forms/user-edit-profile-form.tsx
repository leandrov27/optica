import { useCallback, useMemo } from 'react';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// hooks
import { useAuthContext } from 'src/core/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import FormProvider, { RHFPhoneField, RHFTextField } from 'src/components/hook-form';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Iconify from 'src/components/iconify';
// schemas
import { UpdateUserProfileSchema, type IUpdateUserProfilePayload } from 'src/core/schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pkgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export default function UserEditProfileForm() {
  const router = useRouter();
  const password = useBoolean();

  const { user } = useAuthContext();
  const currentUser = user;

  const defaultValues = useMemo<IUpdateUserProfilePayload>(
    () => ({
      phone: currentUser?.phone,
      current_password: '',
      new_password: '',
      confirm_password: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm<IUpdateUserProfilePayload>({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (formValues: IUpdateUserProfilePayload) => {
      try {
        if (currentUser) {
          const resp = await ax.put(API_ENDPOINTS.admin.user.profile(currentUser.id), formValues);
          toast.success(resp.data.message);
        }
        reset();
        router.replace(paths.admin.root);
      } catch (err: any) {
        toast.error(err.message);
      }
    },
    [currentUser, reset, router]
  );

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
                name="current_password"
                label="Contraseña Actual"
                type={password.value ? 'text' : 'password'}
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField
                name="new_password"
                label="Nueva Contraseña"
                type={password.value ? 'text' : 'password'}
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFTextField
                name="confirm_password"
                label="Confirmar Nueva Contraseña"
                type={password.value ? 'text' : 'password'}
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
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
