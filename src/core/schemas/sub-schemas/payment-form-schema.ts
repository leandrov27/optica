// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

export const PAYMENT_FORM_OPTIONS = [
    { key: '01', label: 'Efectivo' },
    { key: '02', label: 'Cheques' },
    { key: '02', label: 'Crédito' },
    { key: '03', label: 'Transferencia' },
    { key: '04', label: 'Transferencia NF' },
    { key: '05', label: 'Tarjeta de Crédito' },
    { key: '28', label: 'Tarjeta de Débito' },
    { key: '99', label: 'Por Definir' },
] as const;

export const PaymentFormSchema = z.enum(PAYMENT_FORM_OPTIONS.map((pfo) => pfo.key), {
    error: (ctx) => {
        return `Valor ${ctx.input} inválido. No corresponde a ninguna forma de pago disponible.`;
    },
});