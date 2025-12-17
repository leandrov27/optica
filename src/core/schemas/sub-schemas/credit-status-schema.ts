// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

export const CreditStatusSchema = z.enum(['PENDING', 'PARTIAL', 'PAID', 'OVERDUE'], {
    error: (ctx) => {
        return `Valor ${ctx.input} inválido. Se esperaba 'PENDIENTE', 'PARCIAL', 'PAGADO' o 'ATRASADO'`;
    },
});