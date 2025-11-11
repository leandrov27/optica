'use client';

// react
import { useMemo } from 'react';
// @mui
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
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
import Iconify from 'src/components/iconify';
// schemas
import {
  CFDI_USE_OPTIONS,
  TAX_REGIME_OPTIONS,
  PaymentMethodSchema,
  TypeSchema
} from 'src/core/schemas/sub-schemas';
import { type IClientData } from 'src/core/schemas';
//
import BirthtdatePicker from '../widgets/bday-picker';
import DatePicker from '../widgets/date-picker';
import DiagnosisTable from '../components/diagnosis-table';
import useEditClient from '../hooks/useEditClient';

// ----------------------------------------------------------------------

interface ClientEditFormProps {
  client: IClientData;
}

// ----------------------------------------------------------------------

export default function ClientEditForm({ client }: ClientEditFormProps) {
  const {
    //~
    isSubmitting,
    handleSubmit,
    sendForm,
    methods,
    control,
    //*
    isTaxInfoEnabled,
    handleResetTaxInfoData,
    //^
    fields,
    editIndex,
    addDiagnoseItem,
    editDiagnoseItem,
    removeDiagnoseItem,
  } = useEditClient({ client });

  const formattedFields = useMemo(() => (
    fields.map((f, index) => ({
      id: f.diagnosisId ?? index,
      clientId: 0,
      date: f.date || '',
      rightSphere: f.rightSphere,
      rightCylinder: f.rightCylinder,
      rightAxis: f.rightAxis,
      leftSphere: f.leftSphere,
      leftCylinder: f.leftCylinder,
      leftAxis: f.leftAxis,
      di: f.di,
      addition: f.addition,
      notes: f.notes,
    }))
  ), [fields]);

  const { formState: { errors } } = methods;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(sendForm)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12} lg={12}>
          <Card sx={{ p: 2 }}>
            <RHFSwitch
              name="enableTaxInfo"
              labelPlacement="start" // Esto coloca el texto a la izquierda
              label={
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {isTaxInfoEnabled ? 'Deshabilitar' : 'Habilitar'} datos de facturación
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Si está activo, podrá registrar información fiscal.
                  </Typography>
                </Box>
              }
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                m: 0,
              }}
              disabled={isSubmitting}
            />
          </Card>
        </Grid>

        {/** DATOS PERSONALES */}
        <Grid xs={12} md={isTaxInfoEnabled ? 6 : 12} lg={isTaxInfoEnabled ? 6 : 12} sx={{ transition: 'all 0.5s ease-in-out' }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6">
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

        {/** DATOS FISCALES */}
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
                    <RHFTextField name="rfc" label="RFC" placeholder="XAXX010101000" disabled={isSubmitting || !isTaxInfoEnabled} />
                  </Grid>

                  <Grid xs={12} md={6} lg={8}>
                    <RHFTextField name="businessName" label="Razón Social / Nombre" disabled={isSubmitting || !isTaxInfoEnabled} />
                  </Grid>

                  <Grid xs={12} md={6} lg={12}>
                    <RHFSelect name="taxRegime" label="Régimen Fiscal" disabled={isSubmitting || !isTaxInfoEnabled}>
                      {TAX_REGIME_OPTIONS.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                          {option.key} - {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>

                  <Grid xs={12} md={6} lg={12}>
                    <RHFSelect name="cfdiUse" label="Uso CFDI" disabled={isSubmitting || !isTaxInfoEnabled}>
                      {CFDI_USE_OPTIONS.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                          {option.key} - {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>

                  <Grid xs={12} md={6} lg={4}>
                    <RHFTextField name="postalCode" label="Código Postal" disabled={isSubmitting || !isTaxInfoEnabled} />
                  </Grid>

                  <Grid xs={12} md={6} lg={8}>
                    <RHFTextField name="billingEmail" label="Correo de facturación" disabled={isSubmitting || !isTaxInfoEnabled} />
                  </Grid>

                  <Grid xs={12} md={12} lg={12}>
                    <RHFSelect name="paymentMethod" label="Método de Pago" disabled={isSubmitting || !isTaxInfoEnabled}>
                      <MenuItem value={PaymentMethodSchema.enum.PUE}>
                        PUE - Pago en una sola exhibición
                      </MenuItem>

                      <MenuItem value={PaymentMethodSchema.enum.PPD}>
                        PPD - Pago en parcialidades o diferido
                      </MenuItem>
                    </RHFSelect>
                  </Grid>

                  <Grid xs={12} md={12} lg={12}>
                    <RHFTextField name="address" label="Domicilio" disabled={isSubmitting || !isTaxInfoEnabled} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Fade>
        )}

        {/** DIAGNÓSTICOS */}
        <Grid xs={12} md={12} lg={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6">
              Formulario de Diagnóstico
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid xs={8} md={4} lg={6}>
                <DatePicker
                  control={control}
                  onSubmitting={isSubmitting}
                />
              </Grid>

              <Grid xs={4} md={2} lg={6}>
                <RHFTextField
                  name="addition"
                  label="Adición"
                  disabled={isSubmitting}
                  placeholder="ej. +2.00"
                />
              </Grid>

              {/* Sección Ojo Izquierdo */}
              <Grid xs={12}>
                <Typography variant="subtitle1">
                  Ojo Izquierdo (OI)
                </Typography>
              </Grid>

              <Grid xs={3} md={3} lg={3}>
                <RHFTextField
                  name="leftSphere"
                  label="Esfera"
                  disabled={isSubmitting}
                  placeholder="ej. -1.25"
                />
              </Grid>

              <Grid xs={3} md={3} lg={3}>
                <RHFTextField
                  name="leftCylinder"
                  label="Cilindro"
                  disabled={isSubmitting}
                  placeholder="ej. -0.50"
                />
              </Grid>

              <Grid xs={3} md={3} lg={3}>
                <RHFTextField
                  name="leftAxis"
                  label="Eje"
                  disabled={isSubmitting}
                  placeholder="1-180"
                />
              </Grid>

              <Grid xs={3} md={3} lg={3}>
                <RHFTextField
                  name="di"
                  label="DI"
                  disabled={isSubmitting}
                  placeholder=""
                />
              </Grid>

              {/* Sección Ojo Derecho */}
              <Grid xs={12}>
                <Typography variant="subtitle1">
                  Ojo Derecho (OD)
                </Typography>
              </Grid>

              <Grid xs={4} md={4} lg={4}>
                <RHFTextField
                  name="rightSphere"
                  label="Esfera"
                  disabled={isSubmitting}
                  placeholder="ej. -1.25"
                />
              </Grid>

              <Grid xs={4} md={4} lg={4}>
                <RHFTextField
                  name="rightCylinder"
                  label="Cilindro"
                  disabled={isSubmitting}
                  placeholder="ej. -0.50"
                />
              </Grid>

              <Grid xs={4} md={4} lg={4}>
                <RHFTextField
                  name="rightAxis"
                  label="Eje"
                  disabled={isSubmitting}
                  placeholder="1-180"
                />
              </Grid>

              <Grid xs={12} md={12} lg={12}>
                <RHFTextField
                  multiline
                  minRows={3}
                  name="notes"
                  label="Notas"
                  disabled={isSubmitting}
                />
              </Grid>

              {/* Tabla de diagnósticos */}
              <Grid xs={12} md={12} lg={12}>
                <DiagnosisTable
                  diagnoses={formattedFields}
                  onRemove={removeDiagnoseItem}
                  onEdit={editDiagnoseItem}
                />
              </Grid>

              <Grid xs={12} md={12} lg={12}>
                <Divider sx={{ mt: 1, mb: 2.5 }} />

                <LoadingButton
                  color={editIndex !== null ? "primary" : "success"}
                  onClick={addDiagnoseItem}
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    float: 'inline-end'
                  }}
                >
                  {editIndex !== null ? "Actualizar Diagnóstico" : "Agregar Diagnóstico"}
                </LoadingButton>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Fab
          type="submit"
          sx={{
            position: 'fixed',
            right: 20,
            bottom: 20
          }}
          color="primary"
          aria-label="guardar"
          disabled={isSubmitting}
        >
          <Iconify icon="fluent:save-20-regular" width={38} />
        </Fab>
      </Grid>
    </FormProvider>
  );
}
