'use client';

// react
import { useMemo } from "react";
// @mui
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import { Controller } from "react-hook-form";
import FormProvider, { RHFTextField } from "src/components/hook-form";
//
import ClientAutocomplete from '../widgets/client-autocomplete'
import useNewEditDiagnosis from '../hooks/useNewEditDiagnosis'
import DatePicker from "../widgets/date-picker";
import DiagnosisTable from "../components/diagnosis-table";

// ----------------------------------------------------------------------

export default function DiagnosisNewEditForm() {
    const {
        //^ states
        cliID,
        editIndex,
        //* hookform
        control,
        methods,
        isSubmitting,
        handleSubmit,
        //* field array
        fields,
        remove,
        addToTable,
        loadDiagnosis,
        handleClientChange,
        //& methods
        onSubmit,
    } = useNewEditDiagnosis();

    const formattedFields = useMemo(() => (
        fields.map((f) => ({
            id: f.diagnosisId ?? 0,
            clientId: f.clientId,
            date: f.date,
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

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid xs={12} md={12} lg={12}>
                    <Card sx={{ p: 3 }}>
                        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">
                                Formulario de Diagnóstico
                            </Typography>

                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                            >
                                Guardar Cambios
                            </LoadingButton>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid xs={12} md={6} lg={6}>
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

                            <Grid xs={8} md={4} lg={4}>
                                <DatePicker
                                    control={control}
                                    onSubmitting={isSubmitting}
                                />
                            </Grid>

                            <Grid xs={4} md={2} lg={2}>
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
                                    onClick={addToTable}
                                    variant={editIndex !== null ? "contained" : "outlined"}
                                    disabled={isSubmitting || cliID === 0}
                                >
                                    {editIndex !== null ? "Actualizar diagnóstico" : "Agregar a la tabla"}
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                {/* Tabla de diagnósticos */}
                <Grid xs={12} md={12} lg={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6">
                            Historial de Diagnósticos
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <DiagnosisTable
                            cliId={cliID}
                            diagnoses={formattedFields}
                            onRemove={remove}
                            onEdit={loadDiagnosis}
                        />
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    )
}