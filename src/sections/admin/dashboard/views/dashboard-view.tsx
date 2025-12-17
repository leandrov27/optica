'use client';

// react
import { useState } from 'react';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
// routes
import { useRouter, useSearchParams } from 'src/routes/hook'
// components
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
// libs
import { dayjs } from 'src/libs/dayjs';
// assets
import { SeoIllustration } from 'src/assets/illustrations';
//
import PieChart from '../components/pie-chart';
import BarChart from '../components/bar-chart';
import DashboardWidgetWelcome from '../components/dashboard-widget-welcome';
import { useAuthContext } from 'src/core/auth/hooks';
import { PAYMENT_FORM_OPTIONS } from 'src/core/schemas';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

// ----------------------------------------------------------------------

type DashboardViewProps = {
    salesByPaymentMethod: any;
    initialFilters?: {
        dateFrom?: Date;
        dateTo?: Date;
        paymentMethod?: string;
    };
}

// ----------------------------------------------------------------------

export default function DashboardView({ salesByPaymentMethod, initialFilters }: DashboardViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const settings = useSettingsContext();
    const { user } = useAuthContext();

    // ========== CONSTANTS ========== //
    const minDate = dayjs('2025-01-01');
    const maxDate = dayjs().endOf('year');

    // ========== INICIALIZAR FECHAS DESDE PARÁMETROS O VALORES POR DEFECTO ========== //
    const getInitialDates = () => {
        if (initialFilters?.dateFrom && initialFilters?.dateTo) {
            return {
                startDate: dayjs(initialFilters.dateFrom),
                endDate: dayjs(initialFilters.dateTo)
            };
        }
        // Valores por defecto
        return {
            startDate: dayjs().startOf('day'),
            endDate: dayjs().startOf('day').add(7, 'days')
        };
    };

    const initialDates = getInitialDates();

    // ========== STATES PRINCIPALES ========== //
    const [startDate, setStartDate] = useState(initialDates.startDate);
    const [endDate, setEndDate] = useState(initialDates.endDate);
    const [paymentMethod, setPaymentMethod] = useState<string>(
        initialFilters?.paymentMethod || ''
    );
    const [dateError, setDateError] = useState(false);
    const [isFiltered, setIsFiltered] = useState(
        !!initialFilters?.dateFrom ||
        !!initialFilters?.dateTo ||
        !!initialFilters?.paymentMethod
    );

    // ========== HANDLERS ========== //
    const handleStartDateChange = (newStartDate: dayjs.Dayjs | null) => {
        if (!newStartDate) return;

        if (endDate.isBefore(newStartDate)) {
            setDateError(true);
        } else {
            setDateError(false);
            if (endDate.diff(newStartDate, 'day') > 30) {
                setEndDate(newStartDate.add(30, 'day'));
            }

            setStartDate(newStartDate);
        }
    };

    const handleEndDateChange = (newEndDate: dayjs.Dayjs | null) => {
        if (!newEndDate) return;

        if (newEndDate.isBefore(startDate)) {
            setDateError(true);
        } else {
            setDateError(false);
            if (newEndDate.diff(startDate, 'day') > 30) {
                setStartDate(newEndDate.subtract(30, 'day'));
            }

            setEndDate(newEndDate);
        }
    };

    const handlePaymentMethodChange = (event: SelectChangeEvent) => {
        setPaymentMethod(event.target.value);
    };

    const handleApplyFilters = () => {
        if (dateError) return;

        // Construir nuevos parámetros de búsqueda
        const params = new URLSearchParams();

        // Agregar fechas a los parámetros
        params.set('dateFrom', startDate.format('YYYY-MM-DD'));
        params.set('dateTo', endDate.format('YYYY-MM-DD'));

        // Agregar método de pago si está seleccionado
        if (paymentMethod) {
            params.set('paymentMethod', paymentMethod);
        }

        // Limpiar y actualizar la URL
        router.push(`?${params.toString()}`);
        setIsFiltered(true);
    };

    const handleClearFilters = () => {
        // Limpiar todos los parámetros
        router.push('?');

        // Resetear a valores por defecto
        setStartDate(dayjs().startOf('day'));
        setEndDate(dayjs().startOf('day').add(7, 'days'));
        setPaymentMethod('');
        setDateError(false);
        setIsFiltered(false);
    };

    const renderDateRange = (
        <Stack spacing={2} sx={{ mb: 1, px: 0 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">Filtros</Typography>

                {isFiltered && (
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Iconify icon="mdi:filter-remove" />}
                        onClick={handleClearFilters}
                        sx={{ height: 32 }}
                    >
                        Limpiar
                    </Button>
                )}
            </Stack>

            <Stack spacing={1.5}>
                <DatePicker
                    label="Desde"
                    value={startDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    onChange={handleStartDateChange}
                    disabled={false}
                />

                <DatePicker
                    label="Hasta"
                    value={endDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    onChange={handleEndDateChange}
                    disabled={false}
                    slotProps={{
                        textField: {
                            error: dateError,
                            helperText: dateError && 'La fecha final no puede ser anterior a la inicial.',
                        },
                    }}
                />

                <FormControl fullWidth>
                    <InputLabel id="payment-method-select-label">Método de Pago</InputLabel>
                    <Select
                        labelId="payment-method-select-label"
                        value={paymentMethod}
                        label="Método de Pago"
                        onChange={handlePaymentMethodChange}
                    >
                        <MenuItem value="">
                            <em>Todos los métodos</em>
                        </MenuItem>
                        {PAYMENT_FORM_OPTIONS.map((option) => (
                            <MenuItem key={option.key} value={option.key}>
                                {option.key} - {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            <Button
                variant="contained"
                startIcon={<Iconify icon="mdi:filter-apply" />}
                onClick={handleApplyFilters}
                disabled={dateError}
                fullWidth
                sx={{ mt: 1 }}
            >
                Aplicar Filtros
            </Button>

            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 1 }}
            >
                <Iconify icon="mdi:information" width={16} />
                <Typography variant="caption" color="text.secondary">
                    Máximo 30 días de rango
                </Typography>
            </Stack>

            {isFiltered && (
                <Stack spacing={0.5} sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Filtros activos:
                    </Typography>
                    <Typography variant="caption">
                        • Fechas: {startDate.format('DD/MM/YYYY')} - {endDate.format('DD/MM/YYYY')}
                    </Typography>
                    {paymentMethod && (
                        <Typography variant="caption">
                            • Método: {PAYMENT_FORM_OPTIONS.find(opt => opt.key === paymentMethod)?.label}
                        </Typography>
                    )}
                </Stack>
            )}
        </Stack>
    );

    const salesByPaymentBarChart = {
        categories: salesByPaymentMethod.series.map((item: any) => item.label),
        series: [
            {
                type: 'Ventas',
                data: [
                    {
                        name: 'Monto',
                        data: salesByPaymentMethod.series.map((item: any) => item.value),
                    },
                ],
            },
        ],
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Grid container spacing={3}>
                <Grid xs={12} md={8} lg={8}>
                    <DashboardWidgetWelcome
                        title={`Bienvenido de nuevo 👋 \n ${user?.firstName}`}
                        description="Aquí puedes monitorear las transacciones del su empresa."
                        img={<SeoIllustration />}
                    />
                </Grid>

                <Grid xs={12} md={4} lg={4}>
                    <Card sx={{ p: 2 }} style={{ textAlign: "center" }}>
                        {renderDateRange}
                    </Card>
                </Grid>

                <Grid xs={12} md={5} lg={5}>
                    <PieChart
                        title="Porcentaje de ventas por forma de pago"
                        chart={salesByPaymentMethod}
                    />
                </Grid>

                <Grid xs={12} md={7} lg={7}>
                    <BarChart
                        title="Ventas por forma de pago"
                        subheader={`Total del período: ${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`}
                        chart={salesByPaymentBarChart}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}
