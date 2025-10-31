'use client';

import { m } from 'framer-motion';

// @mui
import { Typography, Button } from '@mui/material';
// layouts
import CompactLayout from 'src/layouts/compact';
// assets
import { ForbiddenIllustration } from 'src/assets/illustrations';
// components
import { RouterLink } from 'src/routes/components';
import { MotionContainer, varBounce } from 'src/components/animate';

// ----------------------------------------------------------------------

type Props = {
  reason: string;
};

export default function UnauthorizedView({ reason }: Props) {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Acceso Restringido
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            {reason}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          Regresar a Inicio
        </Button>
      </MotionContainer>
    </CompactLayout>
  );
}
