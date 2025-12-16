'use client';

// react
import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers';
// components
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
// libs
import { dayjs } from 'src/libs/dayjs';
//
import PieChart from '../components/pie-chart';
import BarChart from '../components/bar-chart';

// ----------------------------------------------------------------------

type DashboardViewProps = {
    salesByPaymentMethod: any;
}

// ----------------------------------------------------------------------

export default function DashboardView({ salesByPaymentMethod }: DashboardViewProps) {
    const settings = useSettingsContext();

    // ========== CONSTANTS ========== //
    const minDate = dayjs('2025-01-01');
    const maxDate = dayjs().endOf('year');
    const initialStartDate = dayjs().startOf('day');
    const initialEndDate = initialStartDate.add(7, 'days');

    // ========== STATES PRINCIPALES ========== //
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [dateError, setDateError] = useState(false);

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
            // Si el nuevo rango excede los 30 días, ajusta startDate automáticamente
            if (newEndDate.diff(startDate, 'day') > 30) {
                setStartDate(newEndDate.subtract(30, 'day'));
            }

            setEndDate(newEndDate);
        }
    };

    const renderDateRange = (
        <Stack spacing={1.5} sx={{ mb: 1, px: 2.5 }}>
            <Typography variant="subtitle2">Rango de Fechas</Typography>

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
            </Stack>
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
            {renderDateRange}

            <PieChart
                title="Current Download"
                chart={salesByPaymentMethod}
            />

            <BarChart
                title="Ventas por forma de pago"
                subheader="Total del período seleccionado"
                chart={salesByPaymentBarChart}
            />

            <Card sx={{ p: 3 }} style={{ textAlign: "center" }}>
                <Typography component="div" variant="h5" sx={{ mb: 2 }}>
                    ¡Hola, te damos la bienvenida!
                </Typography>

                <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                <Typography sx={{ pb: 3 }} variant="h2" color='text.secondary' component="div">
                    The <Typography variant="h2" component='span' color='primary.main'>RNPM</Typography> Stack
                </Typography>

                <Grid container justifyContent={'center'}>
                    <Grid xs={6} sm={2} md={2} sx={{ mb: 3 }}>
                        <Box sx={{ mx: 'auto', maxWidth: 280, textAlign: 'center' }}>

                            <Iconify icon={'bxl:react'} width={46} sx={{ color: 'primary.main' }} />

                            <Typography variant="subtitle1" gutterBottom>
                                React.js
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: 'text.secondary', mt: -1.5 }}>v18.2</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={6} sm={2} md={2} sx={{ mb: 3 }}>
                        <Box sx={{ mx: 'auto', maxWidth: 280, textAlign: 'center' }}>

                            <Iconify icon={'teenyicons:nextjs-outline'} width={46} sx={{ color: 'primary.main' }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Next.js
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: 'text.secondary', mt: -1.5 }}>v14</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={6} sm={2} md={2} sx={{ mb: 3 }}>
                        <Box sx={{ mx: 'auto', maxWidth: 280, textAlign: 'center' }}>

                            <Iconify icon={'simple-icons:prisma'} width={46} sx={{ color: 'primary.main' }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Prisma
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: 'text.secondary', mt: -1.5 }}>v7.1</Typography>
                        </Box>
                    </Grid>


                    <Grid xs={6} sm={2} md={2} sx={{ mb: 3 }}>
                        <Box sx={{ mx: 'auto', maxWidth: 280, textAlign: 'center' }}>

                            <Iconify icon={'devicon-plain:materialui'} width={46} sx={{ color: 'primary.main' }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Material UI
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: 'text.secondary', mt: -1.5 }}>v5.15</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

                <Typography variant="subtitle2" color='text.secondary' component="div">
                    App: <Typography variant="subtitle2" component='span' color='primary.main'>v1.0</Typography>
                </Typography>
            </Card>
        </Container>
    )
}
