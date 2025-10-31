// @mui
import { Box, BoxProps, Card, Typography, useTheme } from '@mui/material';
//
import Iconify from '../iconify';

//* ======================================================================

type Props = {
  title?: string,
  description?: string,
  searchValue?: string,
  sx?: BoxProps
}

//* ======================================================================

export default function NoResultsCard({ title, description, searchValue, sx }: Props) {
  const primary = useTheme().palette.primary.main;

  return (
    <Box textAlign={'center'} {...sx}>
      <Card sx={{ p: 3, border: `1px dashed ${primary}` }}>
        <Iconify sx={{ color: 'primary.main' }} icon={'bi:patch-question'} width={50} height={50} />

        <Typography gutterBottom variant="h4" color={'primary'}>
          {searchValue ? 'Sin Coincidencias' : title ? title : 'Sin Resultados'}
        </Typography>

        {searchValue ? (
          <Typography variant="body2" sx={{ maxWidth: 490, mx: 'auto' }}>
            No se encontraron registros coincidentes con el término de búsqueda "
            <strong style={{ color: primary }}>{searchValue}</strong>
            ".
          </Typography>
        ) : (
          <Typography variant="body2">
            {description ? description : 'No se ha encontrado ningún registro en la base de datos.'}
          </Typography>
        )}
      </Card>
    </Box>
  );
}
