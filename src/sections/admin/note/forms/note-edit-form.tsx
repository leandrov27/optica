'use client';

// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from "@mui/material/CircularProgress";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSwitch } from 'src/components/hook-form';
import { Controller } from "react-hook-form";
import Iconify from "src/components/iconify";
import Label from "src/components/label";
// stores
import { useSettingsStore } from "src/core/stores";
//
import useEditNote from '../hooks/useEditNote';
import NoteTable from "../components/note-table";
import ProductAutocomplete from '../widgets/product-autocomplete';
import DatePicker from '../widgets/date-picker';
// schemas
import { type INoteByID } from "src/core/schemas";
// pkgs
import { PDFDownloadLink } from "@react-pdf/renderer";
//
import NotePDF from "../components/note-pdf";
import ProductNewEditDialog from '../../product/forms/product-new-edit-dialog';

// ----------------------------------------------------------------------

interface NoteEditFormProps {
  note: INoteByID;
}

// ----------------------------------------------------------------------

export default function NoteEditForm({ note }: NoteEditFormProps) {
  const settings = useSettingsStore((state) => state.settings);

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
    handleDetailChange,
    addItem,
    removeItem
  } = useEditNote({ note });

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ pt: 2, px: 2 }}>
          <Grid container spacing={2}>
            <Grid xs={12} md={6} lg={8}>
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
                sx={{ mt: 2, ml: -0.5, justifyContent: 'space-between', display: 'flex' }}
                disabled={isSubmitting}
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
                <Grid xs={12} sm={4}>
                  <Stack flexDirection="row" justifyContent="center" alignItems="center" spacing={2}>
                    <Typography variant="subtitle2">
                      Sub-Total:
                    </Typography>

                    <Label color="success">
                      {settings?.currencySymbol} {subtotal}
                    </Label>
                  </Stack>
                </Grid>

                <Grid xs={12} sm={4}>
                  <Stack flexDirection="row" justifyContent="center" alignItems="center" spacing={2}>
                    <Typography variant="subtitle2">
                      Descuento Total:
                    </Typography>

                    <Label color="secondary">
                      {settings?.currencySymbol} {discount}
                    </Label>
                  </Stack>
                </Grid>

                <Grid xs={12} sm={4}>
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

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <PDFDownloadLink
              document={
                <NotePDF
                  note={note}
                  businessName={settings?.name}
                  businessPhone={settings?.phone}
                  logo={settings?.businessLogoUrl}
                  currencySymbol={settings?.currencySymbol}
                />
              }
              fileName={`${note.folio}.pdf`}
              style={{ textDecoration: 'none', color: 'inherit', position: 'absolute', bottom: 20, left: 20 }}
            >
              {({ loading }) => (
                <Button
                  variant="outlined"
                  color="error"
                  disabled={loading || isSubmitting}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      PDF...
                    </>
                  ) : (
                    <>
                      <Iconify icon="solar:import-bold" width={20} sx={{ mr: 1 }} />
                      PDF
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ mb: 2 }}
            >
              Guardar Cambios
            </LoadingButton>
          </Stack>
        </Card>
      </FormProvider>

      <ProductNewEditDialog
        openDialog={productDialog.value}
        onCloseDialog={productDialog.onFalse}
      />
    </>
  );
}
