// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

const SatCodeSchema = z.object({
    id: z
        .int()
        .positive(),
    name: z.string()
        .min(3, {
            error: ({ minimum }) => {
                return `La descripción debe tener al menos ${minimum} caracteres.`;
            },
        })
        .max(150, {
            error: ({ maximum }) => {
                return `La descripción no debe exceder más de ${maximum} caracteres.`;
            },
        })
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
            message: "La descripción solo puede contener letras y espacios.",
        })
        .toLowerCase()
        .trim(),
    codeSat: z.string()
        .min(3, {
            error: ({ minimum }) => {
                return `El código sat debe tener al menos ${minimum} caracteres.`;
            },
        })
        .max(40, {
            error: ({ maximum }) => {
                return `El código sat no debe exceder más de ${maximum} caracteres.`;
            },
        })
        .regex(/^\d+$/, {
            message: "El código sat solo puede contener números.",
        })
        .toLowerCase()
        .trim(),
});

// ----------------------------------------------------------------------

export const CreateSatCodeSchema = SatCodeSchema.omit({ id: true });