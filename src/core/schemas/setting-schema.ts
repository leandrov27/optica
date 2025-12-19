// libs
import z from 'src/libs/zod';
// utils
import { isPhoneValid } from 'src/utils/phone-validation';
// types
import { type CustomFile } from 'src/components/upload';

// ----------------------------------------------------------------------

const SettingSchema = z.object({
    id: z
        .int()
        .positive(),
    name: z
        .string()
        .min(3, {
            error: ({ minimum }) => {
                return `El nombre de su negocio debe tener al menos ${minimum} caracteres.`;
            },
        })
        .max(100, {
            error: ({ maximum }) => {
                return `El nombre de su negocio no debe exceder más de ${maximum} caracteres.`;
            },
        })
        .trim(),
    address: z
        .string()
        .min(10, {
            error: ({ minimum }) => {
                return `La dirección de su negocio debe tener al menos ${minimum} caracteres.`;
            },
        })
        .max(150, {
            error: ({ maximum }) => {
                return `La dirección de su negocio no debe exceder más de ${maximum} caracteres.`;
            },
        })
        .trim(),
    phone: z
        .string()
        .min(6, {
            error: ({ minimum }) => {
                return `El teléfono debe tener al menos ${minimum} caracteres`;
            },
        })
        .refine((value: string) => isPhoneValid(value), {
            message: 'Formato inválido para el país seleccionado',
        }),
    companyLogoUrl: z
        .union([z.string(), z.custom<CustomFile>(), z.null()])
        .transform((value) => {
            if (value === null || typeof value === 'string') {
                return value;
            }
            return value;
        })
        .nullable(),
    businessLogoUrl: z
        .union([z.string(), z.custom<CustomFile>(), z.null()])
        .transform((value) => {
            if (value === null || typeof value === 'string') {
                return value;
            }
            return value;
        })
        .nullable(),
    localeCode: z
        .string()
        .min(5, {
            error: ({ minimum }) => {
                return `La localización debe tenre al menos ${minimum} caracteres.`;
            },
        })
        .trim(),
    currencyCode: z
        .string()
        .min(3, {
            error: ({ minimum }) => {
                return `El código de país debe tener al menos ${minimum} caracteres.`;
            },
        })
        .trim(),
    currencySymbol: z
        .string()
        .min(1, {
            error: ({ minimum }) => {
                return `El símbolo de moneda es obligatorio.`;
            },
        })
        .trim(),
});

// ----------------------------------------------------------------------

export const UpdateSettingsSchema = SettingSchema.omit({ id: true });