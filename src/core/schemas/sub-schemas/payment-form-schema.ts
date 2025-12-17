// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

export const PAYMENT_FORM_OPTIONS = [
    { key: '01', label: 'Efectivo' },
    { key: '02', label: 'Crédito' },
    { key: '03', label: 'Cheques' },
    { key: '04', label: 'Transferencia' },
    { key: '05', label: 'Transferencia NF' },
    { key: '06', label: 'Tarjeta de Crédito' },
    { key: '28', label: 'Tarjeta de Débito' },
    { key: '99', label: 'Por Definir' },
] as const;

export const PaymentFormSchema = z.enum(PAYMENT_FORM_OPTIONS.map((pfo) => pfo.key), {
    error: (ctx) => {
        return `Valor ${ctx.input} inválido. No corresponde a ninguna forma de pago disponible.`;
    },
});

export function getPaymentMethodLabel(key: string): string {
    const method = PAYMENT_FORM_OPTIONS.find(option => option.key === key);
    return method ? method.label : key;
}