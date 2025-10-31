// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

export const RoleSchema = z.enum(['ADMIN', 'CLIENT'], {
  error: (ctx) => {
    return `Valor ${ctx.input} inválido. Se esperaba 'ADMINISTRADOR' o 'CLIENTE'`;
  },
});