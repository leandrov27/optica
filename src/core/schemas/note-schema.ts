// libs
import z from 'src/libs/zod';
import { dayjs } from 'src/libs/dayjs';
//
import { PaymentFormSchema } from './sub-schemas';

// ----------------------------------------------------------------------
// 🔹 Validador reutilizable para decimales con precisión (10,2)
const decimalValidator = z
    .union([z.string(), z.number()])
    .refine((val) => {
        const num = Number(val);
        if (isNaN(num) || num < 0) return false;
        const str = num.toString();
        if (str.includes('e') || str.includes('E')) return false;
        const [integer, decimal] = str.split('.');
        if (integer.length > 8) return false;
        if (decimal && decimal.length > 2) return false;
        return num <= 99999999.99;
    }, {
        message: 'Debe ser un número positivo con máximo 8 dígitos enteros y 2 decimales (0.01 - 99999999.99)',
    })
    .transform((val) => Number(val));

// ----------------------------------------------------------------------
// 🔹 Validador para descuentos en porcentaje (5,2)
const discountPctValidator = z
    .union([z.string(), z.number()])
    .refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0 && num <= 100;
    }, {
        message: 'El descuento debe ser un porcentaje válido (0 - 100)',
    })
    .transform((val) => Number(val));

// ----------------------------------------------------------------------
// 🔹 Esquema para los detalles de nota (NoteDetail)
export const NoteDetailSchema = z.object({
    noteId: z.number().int().positive().optional(),
    description: z.string(),
    productId: z.number().int().positive({ message: 'Seleccione un producto válido.' }),
    quantity: z.number().int().positive({ message: 'La cantidad debe ser mayor a 0.' }),
    unitPrice: decimalValidator,
    discountPct: discountPctValidator.default(0),
    amount: decimalValidator,
});

// ----------------------------------------------------------------------
// 🔹 Esquema principal para la nota de venta (SaleNote)
export const NoteSchema = z.object({
    id: z.number().int().positive().optional(),
    clientId: z.number().int().positive({ message: 'Seleccione un cliente.' }),
    deliveryDate: z
        .string()
        .refine((val) => val === '' || dayjs(val, 'YYYY-MM-DD', true).isValid(), {
            message: 'Formato de fecha no válido (Se espera: YYYY-MM-DD)',
        })
        .transform((val) => (val === '' ? null : val))
        .nullable(),
    requiresInvoice: z.boolean().default(false),
    subtotal: decimalValidator,
    discount: decimalValidator,
    total: decimalValidator,
    paymentForm: PaymentFormSchema,
    notes: z.string().nullable(),
    noteDetails: z.array(NoteDetailSchema)
        .nonempty({ message: 'Debe agregar al menos un producto a la nota.' })
        .refine((details) => {
            // Validar que el monto sea consistente
            return details.every(d => d.amount === Number((d.quantity * d.unitPrice * (1 - d.discountPct / 100)).toFixed(2)));
        }, { message: 'El importe de un producto no coincide con la cantidad, precio y descuento.' }),
});

// ----------------------------------------------------------------------
// 🔹 Schemas derivados para creación/actualización
export const CreateNoteSchema = NoteSchema.omit({ id: true });
export const UpdateNoteSchema = NoteSchema.omit({ id: true });