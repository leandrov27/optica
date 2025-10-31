// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

const CategorySchema = z.object({
    id: z
        .int()
        .positive(),
    name: z.string()
        .min(3, {
            error: ({ minimum }) => {
                return `La categoría debe tener al menos ${minimum} caracteres.`;
            },
        })
        .max(100, {
            error: ({ maximum }) => {
                return `La categoría no debe exceder más de ${maximum} caracteres.`;
            },
        })
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
            message: "La categoría solo puede contener letras y espacios.",
        })
        .toLowerCase()
        .trim(),
    icon: z.string()
        .nullable()
        .optional()
        .transform((value) => (value === "" ? null : value))
        .refine(
            (value) => {
                // Si el valor es `null` o una cadena vacía, no se aplica la validación de emoji
                if (value === null || value === "") return true;
                // Si hay un valor, se valida que sea un emoji válido
                return value!;
            },
            { message: "Debes seleccionar un emoji válido." }
        ),
});

// ----------------------------------------------------------------------

export const CreateCategorySchema = CategorySchema.omit({ id: true });
export const UpdateCategorySchema = CategorySchema.omit({ id: true });