'use client';

// react
import { useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Alert, Box, Collapse, Stack, Typography, useTheme } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFSwitch, RHFTextField } from 'src/components/hook-form';
// schemas
import { EventTypeSchema, type IMessageEventData } from 'src/core/schemas';
// utils
import { CONFIRM_ICON } from 'src/utils/constants';
//
import useNewEditEvent from '../hooks/useNewEditEvent';
import EventDatePicker from '../widgets/event-date-picker';
import { Controller } from 'react-hook-form';
import TemplateAutocomplete from '../widgets/template-autocomplete';
import Label from 'src/components/label';
import Image from 'src/components/image';

// ----------------------------------------------------------------------

interface EventNewEditDialogProps {
  event?: IMessageEventData;
  //
  openDialog: boolean;
  onCloseDialog: VoidFunction;
}

// ----------------------------------------------------------------------

export default function EventNewEditDialog({
  event,
  openDialog = false,
  onCloseDialog,
}: EventNewEditDialogProps) {
  const theme = useTheme();

  const {
    //^ states
    isEdit,
    isSuccess,
    //* hookform
    control,
    methods,
    isSubmitting,
    handleSubmit,
    //& methods
    handleCancel,
    resetSuccess,
    onSubmit,
  } = useNewEditEvent({ event });

  useEffect(() => {
    if (isSuccess) {
      resetSuccess();
      onCloseDialog();
    }
  }, [isSuccess, resetSuccess, onCloseDialog]);

  const handleCancelAndClose = () => {
    setCloseAlert(false);
    onCloseDialog();
    handleCancel();
  };

  const [closeAlert, setCloseAlert] = useState<boolean>(false);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={openDialog}
      onClose={handleCancelAndClose}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: theme.transitions.duration.shortest - 80,
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle textAlign="left" sx={{ py: 1.5 }}>
          {isEdit ? 'Modificar' : 'Registrar'} Evento
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleCancelAndClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 5,
            color: theme.palette.grey[500],
          })}
        >
          <Iconify icon="ic:round-close" width={26} />
        </IconButton>

        <Divider />

        <DialogContent sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid xs={12} md={12} lg={12}>
              <Box sx={{ width: '100%' }}>
                <Collapse in={!closeAlert}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setCloseAlert(true);
                        }}
                      >
                        <Iconify icon="ic:round-close" width={14} />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    Para eventos de tipo <strong>CUMPLEAÑOS </strong>, la fecha de ejecución no se
                    utiliza. El sistema valida y ejecuta automáticamente los eventos de cumpleaños
                    de cada cliente de forma diaria.
                  </Alert>
                </Collapse>
              </Box>
            </Grid>

            <Grid xs={12} md={6} lg={6}>
              <RHFTextField name="name" label="Nombre Descriptivo" disabled={isSubmitting} />
            </Grid>

            <Grid xs={12} md={6} lg={6}>
              <RHFSelect name="type" label="Tipo de Evento" disabled={isSubmitting}>
                <MenuItem value={EventTypeSchema.enum.BIRTHDAY}>CUMPLEAÑOS</MenuItem>
                <MenuItem value={EventTypeSchema.enum.CUSTOM}>PERSONALIZADO</MenuItem>
              </RHFSelect>
            </Grid>

            <Grid xs={12} md={12} lg={12}>
              <EventDatePicker control={control} onSubmitting={isSubmitting} />
            </Grid>

            <Grid xs={12} md={12} lg={12}>
              {event && (
                <Stack flexDirection="row" spacing={1} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Selección actual:</Typography>

                  <Label color="info" style={{ textTransform: 'none' }}>
                    {event.template.name} ({event.template.variablesCount} variable(s))
                  </Label>
                </Stack>
              )}

              <Controller
                name="templateId"
                control={control}
                render={({ field, fieldState }) => (
                  <TemplateAutocomplete
                    onSubmitting={isSubmitting}
                    helperText={fieldState.error?.message}
                    error={fieldState.invalid}
                    onHandleChange={field.onChange}
                  />
                )}
              />
            </Grid>

            <Grid xs={12} md={12} lg={12}>
              <RHFSwitch
                name="isActive"
                labelPlacement="start"
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Estado del Evento
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Si está inactivo, el evento será ignorado por el CRON.
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
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ py: 1.5 }}>
          <Button variant="outlined" disabled={isSubmitting} onClick={handleCancelAndClose}>
            Cancelar
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            startIcon={<Iconify mr={-0.5} width={17} icon={CONFIRM_ICON} />}
          >
            {isEdit ? 'Guardar Cambios' : 'Guardar'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
