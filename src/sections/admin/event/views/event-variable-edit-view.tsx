'use client';

// react
import { useMemo } from 'react';
// @mui
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// components
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import Label from 'src/components/label';
import Image from 'src/components/image';
// schemas
import {
  CreateUpdateEventVariableSchema,
  type IComponent,
  type ICreateUpdateEventVariablePayload,
} from 'src/core/schemas';
// prisma
import { type VariableSource } from 'src/generated/prisma';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pkgs
import { toast } from 'sonner';
import { Alert } from '@mui/material';
// prisma
import { type JsonValue } from 'src/generated/prisma/runtime/client';

// ----------------------------------------------------------------------

interface IEventProp {
  id: number;
  name: string;
  eventDate: Date | null;
  headerImageUrl: string | null;
  template: {
    id: number;
    name: string;
    componentsJson: JsonValue;
    variablesCount: number;
  };
}

interface IEventVariableProp {
  id: number;
  eventId: number;
  position: number;
  source: 'CLIENT' | 'FIXED';
  value: string | null;
  fieldPath: string | null;
}

interface EventVariableEditViewProps {
  event: IEventProp;
  eventVariables: IEventVariableProp[];
}

// ----------------------------------------------------------------------

function buildPositionOptions(count: number) {
  return Array.from({ length: Math.max(0, count) }, (_, i) => i + 1);
}

function buildDefaultVariables(
  event: IEventProp,
  eventVariables: IEventVariableProp[]
): ICreateUpdateEventVariablePayload {
  const count = event.template.variablesCount ?? 0;

  const byPos = new Map<number, IEventVariableProp>();
  for (const v of eventVariables) byPos.set(v.position, v);

  const variables = Array.from({ length: count }, (_, i) => {
    const position = i + 1;
    const existing = byPos.get(position);

    if (existing) {
      return {
        id: existing.id ?? null,
        eventId: existing.eventId,
        position: existing.position,
        source: existing.source,
        value: existing.value !== null ? existing.value : '',
        fieldPath: existing.fieldPath,
      };
    }

    // NUEVA fila (sin id)
    return {
      id: 1,
      eventId: event.id,
      position,
      source: 'CLIENT' as const,
      value: '',
      fieldPath: 'displayName',
    };
  });

  return { eventId: event.id, headerImageUrl: event.headerImageUrl, variables };
}

function extractBodyText(components: any) {
  const body = components.find((c: IComponent) => c?.type === 'BODY') as IComponent;

  return typeof body?.text === 'string' ? body.text : '';
}

function extractHeaderText(components: any) {
  const header = components.find((c: IComponent) => c?.type === 'HEADER') as IComponent;

  if (!header) return '';

  if (header.format === 'TEXT' && typeof header.text === 'string') return header.text;

  if (header.format && header.format !== 'TEXT') return `[HEADER ${header.format}]`;

  return '';
}

function labelForRow(r: { source: any; fieldPath: string | null; value: string | null }) {
  return r.source === 'CLIENT'
    ? `CLIENT.${r.fieldPath ?? '(sin fieldPath)'}`
    : `FIXED: ${r.value ?? '(sin value)'}`;
}

// ----------------------------------------------------------------------

export default function EventVariableEditView({
  event,
  eventVariables,
}: EventVariableEditViewProps) {
  const router = useRouter();
  const settings = useSettingsContext();

  //^ vars
  const variablesCount = event?.template.variablesCount ?? 0;

  const positionOptions = useMemo(() => buildPositionOptions(variablesCount), [variablesCount]);

  // Detectar si el header es de tipo imagen
  const isImageHeader = useMemo(() => {
    const components = (event.template.componentsJson as unknown as IComponent[]) ?? [];
    const header = components.find((c) => c?.type === 'HEADER');
    return header?.format === 'IMAGE';
  }, [event.template.componentsJson]);

  const headerText = useMemo(
    () => extractHeaderText((event.template.componentsJson as unknown as IComponent[]) ?? []),
    [event.template.componentsJson]
  );

  const bodyText = useMemo(
    () => extractBodyText((event.template.componentsJson as unknown as IComponent[]) ?? []),
    [event.template.componentsJson]
  );

  //* hookform
  const defaultValues = useMemo(
    () => buildDefaultVariables(event, eventVariables),
    [event, eventVariables]
  );

  const methods = useForm({
    resolver: zodResolver(CreateUpdateEventVariableSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { fields } = useFieldArray({ control, name: 'variables' });

  const watchedVariables = useWatch({ control, name: 'variables' }) ?? [];

  const { headerImageUrl } = watch();

  const byPos = useMemo(() => {
    const map = new Map<number, (typeof watchedVariables)[number]>();
    for (const r of watchedVariables) map.set(Number(r.position), r);
    return map;
  }, [watchedVariables]);

  const previewParts = useMemo(() => {
    const parts: Array<
      { kind: 'text'; value: string } | { kind: 'var'; raw: string; label: string }
    > = [];
    const regex = /{{\s*(\d+)\s*}}/g;
    let last = 0;
    let m: RegExpExecArray | null;

    while ((m = regex.exec(bodyText)) !== null) {
      const start = m.index;
      const end = regex.lastIndex;
      const raw = bodyText.slice(start, end);

      if (start > last) parts.push({ kind: 'text', value: bodyText.slice(last, start) });

      const pos = Number(m[1]);
      const row = byPos.get(pos);
      parts.push({
        kind: 'var',
        raw,
        label: row
          ? labelForRow({ source: row.source, fieldPath: row.fieldPath, value: row.value })
          : '(sin asignar)',
      });

      last = end;
    }
    if (last < bodyText.length) parts.push({ kind: 'text', value: bodyText.slice(last) });
    return parts;
  }, [bodyText, byPos]);

  const handleSourceChange = (index: number, newSource: VariableSource) => {
    setValue(`variables.${index}.source`, newSource, { shouldDirty: true, shouldValidate: true });

    if (newSource === 'FIXED') {
      // FIXED => limpia fieldPath y prepara value
      setValue(`variables.${index}.fieldPath`, null, { shouldDirty: true, shouldValidate: true });
      // si value venía null, lo dejamos null y el usuario completa (zod lo pedirá)
      if (watchedVariables?.[index]?.value == '') {
        setValue(`variables.${index}.value`, '', { shouldDirty: true, shouldValidate: true });
      }
    } else {
      // CLIENT => limpia value y prepara fieldPath
      setValue(`variables.${index}.value`, '', { shouldDirty: true, shouldValidate: true });
      const current = watchedVariables?.[index]?.fieldPath;
      if (!current) {
        setValue(`variables.${index}.fieldPath`, 'displayName', {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  };

  const onSubmit = async (formValues: ICreateUpdateEventVariablePayload) => {
    try {
      const resp = await ax.put(
        API_ENDPOINTS.admin.event.variables(formValues.eventId),
        formValues
      );

      toast.success(resp.data.message);

      reset(formValues);
      router.refresh();
      router.replace(paths.admin.event.list);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Lista de Variables de Evento"
        links={[
          {
            name: 'Tablero de Ventas',
            href: paths.admin.root,
          },
          {
            name: 'Lista de Eventos de Mensajes',
            href: paths.admin.event.list,
          },
          { name: `Variables de Evento ${event.name}` },
        ]}
        sx={{
          mb: { xs: 2, md: 2 },
        }}
      />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12} md={7} lg={7}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6">Editar Variables</Typography>

              <Divider sx={{ my: 2 }} />

              <Stack justifyContent="center" spacing={3} flexDirection="row">
                <Typography variant="body2">
                  Evento: <strong>{event?.name}</strong>
                </Typography>
                -
                <Typography variant="body2">
                  Plantilla: <strong>{event?.template.name}</strong> — Variables esperadas:{' '}
                  <strong>{variablesCount}</strong>
                </Typography>
                -
                <Typography variant="body2" color="text.secondary">
                  Variables Existentes en DB: <strong>{eventVariables.length}</strong>
                </Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack justifyContent="center" spacing={2}>
                {fields.map((item, index) => {
                  const row = watchedVariables[index];

                  return (
                    <Card
                      key={item.id}
                      sx={{ p: 2, border: '1px solid gray' }}
                      style={{ width: '100%' }}
                    >
                      <Stack
                        justifyContent="center"
                        alignItems="center"
                        spacing={3}
                        flexDirection="row"
                      >
                        <Typography variant="subtitle2">
                          Fuente:
                          <Label style={{ textTransform: 'none' }} color="secondary">
                            {row.source}
                          </Label>
                        </Typography>
                        -
                        <Typography variant="subtitle2">
                          Posición:
                          <Label color="info"> {`{{${row.position}}}`}</Label>
                        </Typography>
                        -
                        <Typography variant="subtitle2">
                          Valor:
                          <Label style={{ textTransform: 'none' }} color="success">
                            {row.value ? `${row.value}` : 'SIN VALOR FIJO'}
                          </Label>
                        </Typography>
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={3} justifyContent="center">
                        <Grid xs={4} md={4} lg={4}>
                          <RHFTextField
                            name={`variables.${index}.value`}
                            label="Valor"
                            disabled={isSubmitting || row.source === 'CLIENT'}
                          />
                        </Grid>

                        <Grid xs={3} md={3} lg={3}>
                          <RHFSelect
                            name={`variables.${index}.position`}
                            label="Posición"
                            disabled={isSubmitting}
                          >
                            {positionOptions.map((position) => (
                              <MenuItem key={position} value={position}>
                                {position}
                              </MenuItem>
                            ))}
                          </RHFSelect>
                        </Grid>

                        <Grid xs={4} md={4} lg={4}>
                          <Controller
                            name={`variables.${index}.source`}
                            control={control}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                select
                                fullWidth
                                label="Source"
                                error={!!fieldState.error}
                                helperText="CLIENT usa fieldPath. FIXED usa value."
                                disabled={isSubmitting}
                                onChange={(e) => {
                                  const ns = e.target.value as VariableSource;
                                  field.onChange(ns);
                                  handleSourceChange(index, ns);
                                }}
                              >
                                <MenuItem value="CLIENT">CLIENT</MenuItem>
                                <MenuItem value="FIXED">FIXED</MenuItem>
                              </TextField>
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  );
                })}
              </Stack>

              <Stack flexDirection="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => reset(defaultValues)}
                  disabled={isSubmitting}
                >
                  Restaurar
                </Button>

                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Guardar Cambios
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>

          <Grid xs={12} md={5} lg={5}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6">Vista Previa</Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Stack spacing={0.5}>
                  <Typography variant="overline" color="text.secondary">
                    HEADER
                  </Typography>
                  <Typography
                    variant="body2"
                    color={headerText ? 'text.primary' : 'text.secondary'}
                  >
                    {headerText || '(Sin texto en header o header no textual)'}
                  </Typography>
                </Stack>

                {isImageHeader && (
                  <Alert severity="info" variant="outlined">
                    Si visualizas <strong>[HEADER IMAGE] </strong> debe obligatoriamente cargar una
                    url de imagen válida y con protocolo seguro <strong>HTTPS</strong>, caso
                    contrario el envío no funcionará.
                  </Alert>
                )}

                {/* Solo mostrar si es un header de imagen */}
                {isImageHeader && (
                  <Grid xs={12} md={12} lg={12}>
                    <Stack
                      spacing={2}
                      flexDirection="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <RHFTextField
                        name="headerImageUrl"
                        label="URL de Imagen de Plantilla"
                        disabled={isSubmitting}
                      />

                      <Image
                        sx={{ borderRadius: 1 }}
                        width={80}
                        src={(headerImageUrl as string) || '/assets/images/placeholder.png'}
                      />
                    </Stack>
                  </Grid>
                )}

                {isImageHeader && (
                  <Alert severity="warning" variant="outlined">
                    Una vez cargada la url, asegúrese que pueda visualizar la imagen en la vista
                    previa.
                  </Alert>
                )}

                <Divider />

                <Stack spacing={0.5}>
                  <Typography variant="overline" color="text.secondary">
                    BODY
                  </Typography>

                  <Typography variant="body1" component="div" sx={{ lineHeight: 1.9 }}>
                    {previewParts.length === 0 ? (
                      <span style={{ opacity: 0.7 }}>(Sin BODY)</span>
                    ) : (
                      previewParts.map((p, idx) => {
                        if (p.kind === 'text') return <div key={idx}>{p.value}</div>;
                        return (
                          <Tooltip key={idx} title={`${p.raw} → ${p.label}`} placement="top">
                            <Chip
                              size="small"
                              variant="outlined"
                              label={`${p.raw} = ${p.label}`}
                              sx={{ mx: 0.5, my: 0.5 }}
                            />
                          </Tooltip>
                        );
                      })
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
