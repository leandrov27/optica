// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { CardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
// utils
import { fCurrency } from 'src/utils/format-number';
// theme
import { ColorSchema } from 'src/theme/palette';
import { bgGradient } from 'src/theme/css';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  color?: ColorSchema;
  icon: string;
}

export default function DashboardWidgetBalance({
  title,
  total,
  icon,
  color = 'primary',
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette[color].light, 0.2),
          endColor: alpha(theme.palette[color].main, 0.2),
        }),
        width: 1,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        ...sx,
      }}
      {...other}
    >
      <Iconify
        icon={icon}
        sx={{
          p: 1.5,
          top: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: '50%',
          position: 'absolute',
          color: `${color}.lighter`,
          bgcolor: `${color}.dark`,
        }}
      />

      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography variant="subtitle2">{title}</Typography>

        <Typography variant="h3">{total ? fCurrency(total) : '0'}</Typography>
      </Stack>
    </Stack>
  );
}