'use client';

// @mui
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// routes
import { RouterLink } from "src/routes/components";
import { paths } from "src/routes/paths";
// components
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFSwitch, RHFTextField } from 'src/components/hook-form';
import { Controller } from "react-hook-form";
import Iconify from "src/components/iconify";
import Label from "src/components/label";
// schemas
import { PAYMENT_FORM_OPTIONS } from "src/core/schemas";
// stores
import { useSettingsStore } from "src/core/stores";
// utils
import { PEN_ICON } from "src/utils/constants";
//
import useCreateNote from '../hooks/useCreateNote';
import NoteTable from "../components/note-table";
import ClientAutocomplete from '../widgets/client-autocomplete';
import ProductAutocomplete from '../widgets/product-autocomplete';
import DatePicker from '../widgets/date-picker';
import ClientCreateDialog from "../../client/forms/client-create-dialog";
import ProductNewEditDialog from "../../product/forms/product-new-edit-dialog";

// ----------------------------------------------------------------------

export default function NoteCreateForm() {
  const settings = useSettingsStore((state) => state.settings);

  const clientDialog = useBoolean();
  const productDialog = useBoolean();

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

  const { watch } = methods;
  const values = watch();

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12} lg={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid xs={12} md={6} lg={8}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Cliente
                  </Typography>
                  <Stack flexDirection="row" alignItems="flex-start" justifyContent="center" gap={1} sx={{ width: '100%', flexShrink: 1 }}>
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

                    {values.clientId > 0 && (
                      <Button component={RouterLink} href={paths.admin.client.edit(values.clientId.toString())} sx={{ minWidth: 20, mt: 1.5, flexShrink: 0, }} variant="contained" size="small">
                        <Iconify icon={PEN_ICON} />
                      </Button>
                    )}

                    <Button onClick={clientDialog.onTrue} sx={{ minWidth: 20, mt: 1.5, flexShrink: 0, }} variant="contained" size="small">
                      <Iconify icon="mingcute:add-line" />
                    </Button>
                  </Stack>
                </Grid>

                <Grid xs={12} md={6} lg={4}>
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

                <Grid xs={12} md={12} lg={12}>
                  <RHFSelect name="paymentForm" label="Forma de Pago" disabled={isSubmitting}>
                    {PAYMENT_FORM_OPTIONS.map((option) => (
                      <MenuItem key={option.key} value={option.key}>
                        {option.key} - {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>

                <Grid xs={12} md={12} lg={12}>
                  <RHFTextField multiline minRows={3} name="notes" label="Notas" disabled={isSubmitting} />
                </Grid>
              </Grid>

              <Grid xs={12} md={12} lg={12}>
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
                  sx={{ mx: 0, mt: 2, width: 1, justifyContent: 'space-between', display: 'flex' }}
                  disabled={isSubmitting}
                />
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid xs={12} md={12} lg={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Productos
                  </Typography>

                  <Stack flexDirection="row" alignItems="flex-start" justifyContent="center" gap={1} sx={{ width: '100%', flexShrink: 1 }}>
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

                    <Button onClick={productDialog.onTrue} sx={{ minWidth: 20, mt: 1.5, flexShrink: 0, }} variant="contained" size="small">
                      <Iconify icon="mingcute:add-line" />
                    </Button>
                  </Stack>
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
        </Grid >
      </FormProvider >

      <ClientCreateDialog
        openDialog={clientDialog.value}
        onCloseDialog={clientDialog.onFalse}
      />

      <ProductNewEditDialog
        openDialog={productDialog.value}
        onCloseDialog={productDialog.onFalse}
      />
    </>
  );
}
