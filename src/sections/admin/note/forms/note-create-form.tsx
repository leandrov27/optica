'use client';

// @mui
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSwitch } from 'src/components/hook-form';
import { Controller } from "react-hook-form";
import Label from "src/components/label";
// stores
import { useSettingsStore } from "src/core/stores";
//
import useCreateNote from '../hooks/useCreateNote';
import NoteTable from "../components/note-table";
import ClientAutocomplete from '../widgets/client-autocomplete';
import ProductAutocomplete from '../widgets/product-autocomplete';
import DatePicker from '../widgets/date-picker';

// ----------------------------------------------------------------------

export default function NoteCreateForm() {
  const settings = useSettingsStore((state) => state.settings);

  const {
    methods,
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    noteDetails,
    subtotal,
    discount,
    total,
    handleClientChange,
    handleDetailChange,
    addItem,
    removeItem
  } = useCreateNote();

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12} lg={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid xs={12} md={6} lg={8}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Cliente
                </Typography>

                <Controller
                  name="clientId"
                  control={control}
                  render={({ fieldState }) => (
                    <ClientAutocomplete
                      onSubmitting={isSubmitting}
                      helperText={fieldState.error?.message}
                      error={fieldState.invalid}
                      onHandleChange={handleClientChange}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} md={4} lg={4}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Fecha de Entrega
                </Typography>

                <DatePicker
                  name="deliveryDate"
                  label="Fecha de Entrega"
                  control={control}
                  onSubmitting={isSubmitting}
                />
              </Grid>
            </Grid>

            <Grid xs={12} md={6} lg={12}>
              <RHFSwitch
                name="requiresInvoice"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      ¿Requiere Factura?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Si está activo, se usarán los datos fiscales del cliente.
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between', display: 'flex' }}
                disabled={isSubmitting}
              />
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid xs={12} md={12} lg={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Productos
                </Typography>

                <Controller
                  name="noteDetails"
                  control={control}
                  render={({ fieldState }) => (
                    <ProductAutocomplete
                      onSubmitting={isSubmitting}
                      helperText={fieldState.error?.message}
                      error={fieldState.invalid}
                      onHandleChange={addItem}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} md={12} lg={12} sx={{ mb: 2 }}>
                <NoteTable
                  notes={noteDetails}
                  onRemove={removeItem}
                  onDetailChange={handleDetailChange}
                  onSubmitting={isSubmitting}
                />
              </Grid>

              {noteDetails.length > 0 && (
                <>
                  <Grid xs={4} sm={4}>
                    <Stack flexDirection="row" justifyContent="center" alignItems="center" spacing={2}>
                      <Typography variant="subtitle2">
                        Sub-Total:
                      </Typography>

                      <Label color="success">
                        {settings?.currencySymbol} {subtotal}
                      </Label>
                    </Stack>
                  </Grid>

                  <Grid xs={4} sm={4}>
                    <Stack flexDirection="row" justifyContent="center" alignItems="center" spacing={2}>
                      <Typography variant="subtitle2">
                        Descuento Total:
                      </Typography>

                      <Label color="secondary">
                        {settings?.currencySymbol} {discount}
                      </Label>
                    </Stack>
                  </Grid>

                  <Grid xs={4} sm={4}>
                    <Stack flexDirection="row" justifyContent="center" alignItems="center" spacing={2}>
                      <Typography variant="subtitle2">
                        Total:
                      </Typography>

                      <Label color="success">
                        {settings?.currencySymbol} {total}
                      </Label>
                    </Stack>
                  </Grid>
                </>
              )}
            </Grid>

            <Stack sx={{ mt: 4 }} direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="inherit"
                disabled={isSubmitting}
                onClick={() => methods.reset()}
              >
                Limpiar
              </Button>

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Guardar Nota
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
