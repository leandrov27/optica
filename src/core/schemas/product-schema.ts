// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

const ProductSchema = z.object({
    id: z
        .int()
        .positive(),
    categoryId: z
        .number()
        .int()
        .positive({ error: 'Seleccione una categoría.' }),
    satCodeId: z
        .number()
        .int()
        .positive({ error: 'Seleccione una clave SAT.' }),
    code: z.preprocess(
        (val) => {
            if (val === '' || val === undefined) return null;
            if (typeof val === 'string') return val.toUpperCase().trim();
            return val;
        },
        z
            .string()
            .max(50, {
                error: ({ maximum }) =>
                    `El código del servicio no debe exceder más de ${maximum} caracteres.`,
            })
            .nullable()
    ),
    description: z
        .string()
        .min(1, { error: `La descripción del servicio es requerida.` })
        .max(255, {
            error: ({ maximum }) => {
                return `La descripción del servicio no debe exceder más de ${maximum} caracteres.`;
            },
        })
        .toLowerCase()
        .trim(),
    price: z
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
    notes: z
        .string()
        .max(255, {
            error: ({ maximum }) => {
                return `Las notas del servicio no deben exceder más de ${maximum} caracteres.`;
            },
        })
        .toLowerCase()
        .trim()
        .nullable(),
});

// ----------------------------------------------------------------------

export const CreateProductSchema = ProductSchema.omit({ id: true });
export const UpdateProductSchema = ProductSchema.omit({ id: true });