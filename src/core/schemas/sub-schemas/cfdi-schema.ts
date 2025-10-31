// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

export const CFDI_USE_OPTIONS = [
    { key: 'G01', label: 'Adquisición de Mercancías' },
    { key: 'G03', label: 'Gastos en General' },
    { key: 'P01', label: 'Por Definir' },
    { key: 'S01', label: 'Sin Efectos Fiscales' },
] as const;

export const CFDISchema = z.enum(CFDI_USE_OPTIONS.map((cuo) => cuo.key), {
    error: (ctx) => {
        return `Valor ${ctx.input} inválido. No corresponde a un uso válido.`;
    },
});