import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';

// ----------------------------------------------------------------------

interface Props extends PaperProps {
  query?: string;
}

export default function SearchNotFound({ query, sx, ...other }: Props) {
  return query ? (
    <Paper
      sx={{
        bgcolor: 'unset',
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" gutterBottom>
        No Encontrado
      </Typography>

      <Typography variant="body2">
        No se encontraron resultados para &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> Intente verificar por errores tipográficos o usar palabras completas.
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      Ingrese las palabras clave
    </Typography>
  );
}
