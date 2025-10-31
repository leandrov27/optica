// libs
import z from 'src/libs/zod';
// utils
import { capitalizeString } from 'src/utils/format-string';
//
import { PaymentMethodSchema, PaymentFormSchema, TaxRegimeSchema, CFDISchema } from './sub-schemas';

// ----------------------------------------------------------------------

const TaxInfoSchema = z.object({
    id: z
        .int()
        .positive(),
    rfc: z
        .string()
        .transform((value) => value.toUpperCase().trim())
        .optional(),
    businessName: z
        .string()
        .max(200, {
            error: ({ maximum }) => {
                return `La razón social no debe exceder los ${maximum} caracteres`;
            },
        })
        .transform((value) => capitalizeString(value))
        .optional(),
    billingEmail: z
        .email({ message: 'Formato de correo inválido' })
        .trim()
        .or(z.literal(''))
        .transform((val) => (val === '' ? null : val))
        .nullable(),
    postalCode: z
        .string()
        .min(5, {
            error: ({ minimum }) => {
                return `El código postal debe tener al menos ${minimum} caracteres`;
            },
        })
        .max(5, {
            error: ({ maximum }) => {
                return `El código postal no debe exceder los ${maximum} caracteres`;
            },
        })
        .trim()
        .or(z.literal(''))
        .transform((val) => (val === '' ? null : val))
        .nullable(),
    cfdiUse: CFDISchema
        .nullable(),
    taxRegime: TaxRegimeSchema
        .nullable(),
    paymentMethod: PaymentMethodSchema
        .nullable(),
    paymentForm: PaymentFormSchema
        .nullable(),
    address: z
        .string()
        .toLowerCase()
        .trim()
        .nullable(),
});

// ----------------------------------------------------------------------

export const CreateUpdateTaxInfoSchema = TaxInfoSchema.omit({ id: true });