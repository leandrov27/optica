// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

export const EventTypeSchema = z.enum(['BIRTHDAY', 'CUSTOM'], {
  error: (ctx) => {
    return `Valor ${ctx.input} inválido. Se esperaba 'CUMPLEAÑOS' o 'PERSONALIZADO'`;
  },
});
