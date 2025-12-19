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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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

interface SalesDetails {
    sales: Array<{
        id: number;
        date: Date;
        paymentForm: string;
        total: number;
        client?: { displayName: string };
    }>;
    totalsByPayment: Array<{
        paymentMethod: string;
        total: number;
    }>;
    pagination: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
    totalAmount: number;
}

interface DashboardViewProps {
    salesByPaymentMethod: any;
    salesDetails: SalesDetails;
    initialFilters: {
        dateFrom?: Date;
        dateTo?: Date;
        paymentMethod?: string;
        page?: number;
    };
    defaultDateRange: 'today' | 'custom' | 'none';
}

// ----------------------------------------------------------------------

export default function DashboardView({
    salesByPaymentMethod,
    salesDetails,
    initialFilters,
    defaultDateRange
}: DashboardViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const settings = useSettingsContext();
    const { user } = useAuthContext();

    // ========== CONSTANTS ========== //
    const minDate = dayjs('2025-01-01');
    const maxDate = dayjs().endOf('year');

    // ========== INICIALIZAR FECHAS DESDE PARÁMETROS O VALORES POR DEFECTO ========== //
    const getInitialDates = () => {
        // Si hay fechas en los filtros iniciales, usarlas
        if (initialFilters?.dateFrom && initialFilters?.dateTo) {
            return {
                startDate: dayjs(initialFilters.dateFrom),
                endDate: dayjs(initialFilters.dateTo)
            };
        }
        // Por defecto: mostrar campos vacíos
        return {
            startDate: null,
            endDate: null
        };
    };

    const initialDates = getInitialDates();

    // ========== STATES PRINCIPALES ========== //
    const [startDate, setStartDate] = useState(initialDates.startDate);
    const [endDate, setEndDate] = useState(initialDates.endDate);
    const [paymentMethod, setPaymentMethod] = useState<string>(
        initialFilters?.paymentMethod || 'all'
    );
    const [dateError, setDateError] = useState(false);
    const [isFiltered, setIsFiltered] = useState(
        !!initialFilters?.dateFrom ||
        !!initialFilters?.dateTo ||
        (!!initialFilters?.paymentMethod && initialFilters.paymentMethod !== 'all')
    );

    // ========== FUNCIONES UTILITARIAS ========== //
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return dayjs(date).format('DD/MM/YYYY HH:mm');
    };

    const getPaymentMethodLabel = (key: string) => {
        const option = PAYMENT_FORM_OPTIONS.find(opt => opt.key === key);
        return option ? option.label : key;
    };

    const getChartPeriodText = () => {
        if (!startDate && !endDate) {
            return "Total histórico (sin filtro de fechas)";
        }
        if (startDate && endDate) {
            return `Período: ${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`;
        }
        return "Período personalizado";
    };

    // ========== HANDLERS ========== //
    const handleStartDateChange = (newStartDate: dayjs.Dayjs | null) => {
        if (!newStartDate) {
            setStartDate(null);
            return;
        }

        if (endDate && endDate.isBefore(newStartDate)) {
            setDateError(true);
        } else {
            setDateError(false);
            if (endDate && endDate.diff(newStartDate, 'day') > 30) {
                setEndDate(newStartDate.add(30, 'day'));
            }

            setStartDate(newStartDate);
        }
    };

    const handleEndDateChange = (newEndDate: dayjs.Dayjs | null) => {
        if (!newEndDate) {
            setEndDate(null);
            return;
        }

        if (startDate && newEndDate.isBefore(startDate)) {
            setDateError(true);
        } else {
            setDateError(false);
            if (startDate && newEndDate.diff(startDate, 'day') > 30) {
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

        // Solo agregar fechas si ambas están seleccionadas
        if (startDate && endDate) {
            params.set('dateFrom', startDate.format('YYYY-MM-DD'));
            params.set('dateTo', endDate.format('YYYY-MM-DD'));
        }

        // Agregar método de pago si está seleccionado y no es "all"
        if (paymentMethod && paymentMethod !== 'all') {
            params.set('paymentMethod', paymentMethod);
        }

        // Resetear a página 1 al aplicar nuevos filtros
        params.set('page', '1');

        // Limpiar y actualizar la URL
        router.push(`?${params.toString()}`);
        setIsFiltered(true);
    };

    const handleClearFilters = () => {
        // Limpiar todos los parámetros
        router.push('?');

        // Resetear estados
        setStartDate(null);
        setEndDate(null);
        setPaymentMethod('all');
        setDateError(false);
        setIsFiltered(false);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };

    // ========== COMPONENTES RENDERIZADOS ========== //
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
                    slotProps={{
                        textField: {
                            helperText: !startDate ? 'Dejar vacío para ver todas las fechas' : '',
                        },
                    }}
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
                            helperText: dateError
                                ? 'La fecha final no puede ser anterior a la inicial.'
                                : !endDate ? 'Dejar vacío para ver todas las fechas' : '',
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
                        <MenuItem value="all">
                            <em>Todos los métodos</em>
                        </MenuItem>
                        {PAYMENT_FORM_OPTIONS.map((option) => (
                            <MenuItem key={option.key} value={option.key}>
                                {option.label}
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
                    {startDate && endDate ? 'Máximo 30 días de rango' : 'Dejar fechas vacías para ver todo'}
                </Typography>
            </Stack>

            {/* Indicadores de estado */}
            {defaultDateRange === 'today' && !isFiltered && (
                <Chip
                    label="Tabla: Mostrando ventas de hoy"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                />
            )}

            {defaultDateRange === 'none' && !isFiltered && (
                <Chip
                    label="Charts: Mostrando todas las ventas"
                    color="info"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                />
            )}

            {isFiltered && (
                <Stack spacing={0.5} sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Filtros activos:
                    </Typography>
                    {startDate && endDate && (
                        <Typography variant="caption">
                            • Fechas: {startDate.format('DD/MM/YYYY')} - {endDate.format('DD/MM/YYYY')}
                        </Typography>
                    )}
                    {paymentMethod && paymentMethod !== 'all' && (
                        <Typography variant="caption">
                            • Método: {getPaymentMethodLabel(paymentMethod)}
                        </Typography>
                    )}
                    <Typography variant="caption">
                        • Mostrando {salesDetails.pagination.totalItems} ventas en total
                    </Typography>
                </Stack>
            )}
        </Stack>
    );

    const renderSalesTable = () => (
        <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Ventas del período
                    </Typography>

                    {/* Resumen de totales */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid xs={12} sm={6} md={3}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.lighter' }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Total General
                                </Typography>
                                <Typography variant="h5" color="primary.main">
                                    {formatCurrency(salesDetails.totalAmount)}
                                </Typography>
                            </Paper>
                        </Grid>

                        {salesDetails.totalsByPayment.map((item) => (
                            <Grid xs={12} sm={6} md={3} key={item.paymentMethod}>
                                <Paper sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {getPaymentMethodLabel(item.paymentMethod)}
                                    </Typography>
                                    <Typography variant="h6">
                                        {formatCurrency(item.total)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Tabla de ventas */}
                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha y Hora</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Método de Pago</TableCell>
                                <TableCell align="right">Monto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salesDetails.sales.length > 0 ? (
                                salesDetails.sales.map((sale) => (
                                    <TableRow key={sale.id} hover>
                                        <TableCell>
                                            {formatDate(sale.date)}
                                        </TableCell>
                                        <TableCell>
                                            {sale.client?.displayName || 'Sin cliente'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getPaymentMethodLabel(sale.paymentForm)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" fontWeight="medium">
                                                {formatCurrency(sale.total)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No hay ventas en el período seleccionado
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Paginación */}
                {salesDetails.pagination.totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                            count={salesDetails.pagination.totalPages}
                            page={salesDetails.pagination.currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                )}

                {/* Info de paginación */}
                <Typography variant="caption" color="text.secondary" align="center">
                    Mostrando {salesDetails.sales.length} de {salesDetails.pagination.totalItems} ventas
                    (Página {salesDetails.pagination.currentPage} de {salesDetails.pagination.totalPages})
                </Typography>
            </Stack>
        </Card>
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
                {/* Tabla de ventas */}
                <Grid xs={12} md={8} lg={8}>
                    {renderSalesTable()}
                </Grid>

                <Grid xs={12} md={4} lg={4}>
                    <Card sx={{ p: 2 }} style={{ textAlign: "center" }}>
                        {renderDateRange}
                    </Card>
                </Grid>
                
                {/* Gráficos */}
                <Grid xs={12} md={5} lg={5}>
                    <PieChart
                        title="Porcentaje de ventas por forma de pago"
                        chart={salesByPaymentMethod}
                        subheader={getChartPeriodText()}
                    />
                </Grid>

                <Grid xs={12} md={7} lg={7}>
                    <BarChart
                        title="Ventas por forma de pago"
                        subheader={getChartPeriodText()}
                        chart={salesByPaymentBarChart}
                    />
                </Grid>


            </Grid>
        </Container>
    )
}