'use client';

import { m } from 'framer-motion';

// @mui
import { Typography, Stack } from '@mui/material';
// assets
import { SeverErrorIllustration } from 'src/assets/illustrations';
// components
import { MotionContainer, varBounce } from 'src/components/animate';

// ----------------------------------------------------------------------

type Props = {
  message: string;
};

// ----------------------------------------------------------------------

export default function ErrorCard({ message }: Props) {
  return (
    <Stack
      sx={{
        m: 'auto',
        maxWidth: 600,
        textAlign: 'center',
        justifyContent: 'center',
      }}
    >
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Error Interno del Servidor
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            {message != null ? message : 'No tienes permisos suficientes.'}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 9 } }} />
        </m.div>
      </MotionContainer>
    </Stack>
  );
}
