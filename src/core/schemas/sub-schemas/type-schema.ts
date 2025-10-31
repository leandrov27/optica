// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

export const TypeSchema = z.enum(['INDIVIDUAL', 'BUSINESS'], {
  error: (ctx) => {
    return `Valor ${ctx.input} inválido. Se esperaba 'PERSONA FÍSICA' o 'PERSONA MORAL'`;
  },
});