import { ApexOptions } from 'apexcharts';
// @mui
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories: string[];
    colors?: string[];
    series: {
      type: string; 
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ApexOptions;
  };
}

export default function BarChart({ title, subheader, chart, ...other }: Props) {
  const { categories, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    tooltip: {
      y: {
        formatter: (value: number) =>
          value.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
          }),
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '10%',
        borderRadius: 4,
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mt: 3, mx: 3 }}>
        <Chart
          dir="ltr"
          type="bar"
          series={series[0].data}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
