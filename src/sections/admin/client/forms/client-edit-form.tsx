'use client';

// @mui
import Fade from '@mui/material/Fade';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import FormProvider, { RHFPhoneField, RHFSelect, RHFSwitch, RHFTextField } from 'src/components/hook-form';
import { Controller } from 'react-hook-form';
// schemas
import { type IClientData } from 'src/core/schemas';
import { CFDI_USE_OPTIONS, PAYMENT_FORM_OPTIONS, PaymentMethodSchema, TAX_REGIME_OPTIONS, TypeSchema } from 'src/core/schemas/sub-schemas';
//
import useEditClient from '../hooks/useEditClient';
import BirthtdatePicker from '../widgets/bday-picker';

// ----------------------------------------------------------------------

interface ClientEditFormProps {
  client: IClientData;
}

// ----------------------------------------------------------------------

export default function ClientEditForm({ client }: ClientEditFormProps) {
  const {
    //* hookform
    isTaxInfoEnabled,
    isSubmitting,
    handleSubmit,
    onSubmit,
    control,
    methods,
    // &
    handleResetTaxInfoData
  } = useEditClient({ client });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12} lg={12}>
          <Card sx={{ p: 2 }}>
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Stack flexDirection="column" gap={3}>
                <RHFSwitch
                  name="enableTaxInfo"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        {isTaxInfoEnabled ? 'Deshabilitar' : 'Habilitar'} datos de facturación
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Si está activo, podrá registrar información fiscal.
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, width: 1, justifyContent: 'space-between', display: 'flex' }}
                  disabled={isSubmitting}
                />
              </Stack>

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Guardar Cambios
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={isTaxInfoEnabled ? 6 : 12} lg={isTaxInfoEnabled ? 6 : 12} sx={{ transition: 'all 0.5s ease-in-out' }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Datos Personales
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid xs={6} md={6} lg={6}>
                <RHFTextField name="firstName" label="Nombre" disabled={isSubmitting} />
              </Grid>

              <Grid xs={6} md={6} lg={6}>
                <RHFTextField name="lastName" label="Apellido" disabled={isSubmitting} />
              </Grid>

              <Grid xs={12} md={12} lg={6}>
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
              </Grid>

              <Grid xs={12} md={12} lg={6}>
                <RHFTextField name="email" label="Correo" disabled={isSubmitting} />
              </Grid>

              <Grid xs={12} md={6} lg={6}>
                <RHFSelect name="type" label="Tipo de Cliente" disabled={isSubmitting}>
                  <MenuItem value={TypeSchema.enum.INDIVIDUAL}>
                    Persona Física
                  </MenuItem>

                  <MenuItem value={TypeSchema.enum.BUSINESS}>
                    Persona Moral (Empresa)
                  </MenuItem>
                </RHFSelect>
              </Grid>

              <Grid xs={12} md={6} lg={6}>
                <BirthtdatePicker
                  control={control}
                  onSubmitting={isSubmitting}
                />
              </Grid>

              <Grid xs={12} md={12} lg={12}>
                <RHFTextField name="observations" multiline minRows={3} label="Observaciones" disabled={isSubmitting} />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {isTaxInfoEnabled && (
          <Fade in={isTaxInfoEnabled} timeout={2500}>
            <Grid xs={12} md={6} lg={6}>
              <Card sx={{ p: 3 }}>
                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">
                    Datos de Facturación (México)
                  </Typography>

                  <Button onClick={handleResetTaxInfoData} variant="soft" disabled={isSubmitting || !isTaxInfoEnabled}>
                    Limpiar Sección
                  </Button>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid xs={12} md={6} lg={4}>
                    <RHFTextField name="taxInfo.rfc" label="RFC" placeholder="XAXX010101000" disabled={isSubmitting || !isTaxInfoEnabled} />
                  </Grid>

                  <Grid xs={12} md={6} lg={8}>
                    <RHFTextField name="taxInfo.businessName" label="Razón Social / Nombre" disabled={isSubmitting || !isTaxInfoEnabled} />
                  </Grid>

                  <Grid xs={12} md={6} lg={12}>
                    <RHFSelect name="taxInfo.taxRegime" label="Régimen Fiscal" disabled={isSubmitting || !isTaxInfoEnabled}>
                      {TAX_REGIME_OPTIONS.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                          {option.key} - {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>

                  <Grid xs={12} md={6} lg={12}>
                    <RHFSelect name="taxInfo.cfdiUse" label="Régimen Fiscal" disabled={isSubmitting || !isTaxInfoEnabled}>
                      {CFDI_USE_OPTIONS.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                          {option.key} - {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>

                  <Grid xs={12} md={6} lg={4}>
                    <RHFTextField name="taxInfo.postalCode" label="Código Postal" disabled={isSubmitting || !isTaxInfoEnabled} />
                  </Grid>

                  <Grid xs={12} md={6} lg={8}>
                    <RHFTextField name="taxInfo.billingEmail" label="Correo de facturación" disabled={isSubmitting || !isTaxInfoEnabled} />
                  </Grid>

                  <Grid xs={12} md={6} lg={6}>
                    <RHFSelect name="taxInfo.paymentMethod" label="Método de Pago" disabled={isSubmitting || !isTaxInfoEnabled}>
                      <MenuItem value={PaymentMethodSchema.enum.PUE}>
                        PUE - Pago en una sola exhibición
                      </MenuItem>

                      <MenuItem value={PaymentMethodSchema.enum.PPD}>
                        PPD - Pago en parcialidades o diferido
                      </MenuItem>
                    </RHFSelect>
                  </Grid>

                  <Grid xs={12} md={6} lg={6}>
                    <RHFSelect name="taxInfo.paymentForm" label="Forma de Pago" disabled={isSubmitting || !isTaxInfoEnabled}>
                      {PAYMENT_FORM_OPTIONS.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                          {option.key} - {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>

                  <Grid xs={12} md={3} lg={12}>
                    <RHFTextField name="taxInfo.address" label="Domicilio" disabled={isSubmitting || !isTaxInfoEnabled} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Fade>
        )}
      </Grid>
    </FormProvider>
  );
}
