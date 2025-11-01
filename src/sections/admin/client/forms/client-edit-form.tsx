'use client';

// react
import { useMemo } from 'react';
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
import {
  CFDI_USE_OPTIONS,
  PAYMENT_FORM_OPTIONS,
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

                  <Grid xs={12} md={6} lg={6}>
                    <RHFSelect name="paymentMethod" label="Método de Pago" disabled={isSubmitting || !isTaxInfoEnabled}>
                      <MenuItem value={PaymentMethodSchema.enum.PUE}>
                        PUE - Pago en una sola exhibición
                      </MenuItem>

                      <MenuItem value={PaymentMethodSchema.enum.PPD}>
                        PPD - Pago en parcialidades o diferido
                      </MenuItem>
                    </RHFSelect>
                  </Grid>

                  <Grid xs={12} md={6} lg={6}>
                    <RHFSelect name="paymentForm" label="Forma de Pago" disabled={isSubmitting || !isTaxInfoEnabled}>
                      {PAYMENT_FORM_OPTIONS.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                          {option.key} - {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>

                  <Grid xs={12} md={3} lg={12}>
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

              <Grid xs={12} md={12} lg={12}>
                <RHFTextField
                  name="notes"
                  label="Notas"
                  disabled={isSubmitting}
                />
              </Grid>

              {/* Sección Ojo Izquierdo */}
              <Grid xs={12}>
                <Typography variant="subtitle1">
                  Ojo Izquierdo (OI)
                </Typography>
              </Grid>

              <Grid xs={4} md={4} lg={4}>
                <RHFTextField
                  name="leftSphere"
                  label="Esfera"
                  disabled={isSubmitting}
                  placeholder="ej. -1.25"
                />
              </Grid>

              <Grid xs={4} md={4} lg={4}>
                <RHFTextField
                  name="leftCylinder"
                  label="Cilindro"
                  disabled={isSubmitting}
                  placeholder="ej. -0.50"
                />
              </Grid>

              <Grid xs={4} md={4} lg={4}>
                <RHFTextField
                  name="leftAxis"
                  label="Eje"
                  disabled={isSubmitting}
                  placeholder="1-180"
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
                <Divider sx={{ mt: 1, mb: 2.5 }} />

                <LoadingButton
                  fullWidth
                  onClick={addDiagnoseItem}
                  variant={editIndex !== null ? "contained" : "outlined"}
                  disabled={isSubmitting}
                >
                  {editIndex !== null ? "Actualizar Diagnóstico" : "Agregar Diagnóstico"}
                </LoadingButton>
              </Grid>

              {/* Tabla de diagnósticos */}
              <Grid xs={12} md={12} lg={12}>
                <DiagnosisTable
                  diagnoses={formattedFields}
                  onRemove={removeDiagnoseItem}
                  onEdit={editDiagnoseItem}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
