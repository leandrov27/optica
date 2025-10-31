// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

export const PaymentMethodSchema = z.enum(['PUE', 'PPD'], {
  error: (ctx) => {
    return `Valor ${ctx.input} inválido. Se esperaba 'PUE' o 'PPD'`;
  },
});