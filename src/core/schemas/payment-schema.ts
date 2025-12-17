// libs
import z from 'src/libs/zod';
//
import {
    PaymentFormSchema,
} from './sub-schemas';

// ----------------------------------------------------------------------

export const PaymentSchema = z.object({
    id: z.number().int().positive().optional(),
    noteId: z.number().int().positive(),
    amount: z
        .union([z.string(), z.number()])
        .refine((val) => {
            // Convertir y validar en un solo paso
            const num = Number(val);
            if (isNaN(num) || num <= 0) return false;

            // Validar formato decimal(10,2)
            const str = num.toString();
            if (str.includes('e') || str.includes('E')) return false;

            const [integer, decimal] = str.split('.');
            if (integer.length > 8) return false;
            if (decimal && decimal.length > 2) return false;

            return num <= 99999999.99;
        }, {
            message: 'Debe ser un número positivo con máximo 8 dígitos enteros y 2 decimales (0.01 - 99999999.99)'
        })
        .transform((val) => Number(val)),
    paymentMethod: PaymentFormSchema,
    reference: z.string().max(50).optional().nullable(),
    notes: z.string().optional().nullable(),
});

// ----------------------------------------------------------------------

export const CreatePaymentSchema = PaymentSchema.omit({ id: true });