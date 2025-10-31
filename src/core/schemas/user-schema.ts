// libs
import z from 'src/libs/zod';
// utils
import { isPhoneValid } from 'src/utils/phone-validation';
import { capitalizeString } from 'src/utils/format-string';
//
import { RoleSchema } from './sub-schemas';

// ----------------------------------------------------------------------

const AdminRoleOnly = z.literal('ADMIN');

const UserSchema = z.object({
    id: z
        .int()
        .positive(),
    firstName: z
        .string()
        .min(3, {
            error: ({ minimum }) => {
                return `El nombre debe tener al menos ${minimum} caracteres`;
            },
        })
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
            message: 'El nombre solo puede contener letras y espacios',
        })
        .transform((value) => capitalizeString(value)),
    lastName: z
        .string()
        .min(4, {
            error: ({ minimum }) => {
                return `El apellido debe tener al menos ${minimum} caracteres`;
            },
        })
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
            message: 'El apellido solo puede contener letras y espacios',
        })
        .transform((value) => capitalizeString(value)),
    displayName: z
        .string()
        .transform((value) => capitalizeString(value)),
    phone: z
        .string()
        .min(6, {
            error: ({ minimum }) => {
                return `El teléfono debe tener al menos ${minimum} caracteres`;
            },
        })
        .refine((value: string) => isPhoneValid(value), {
            message: 'Formato inválido para el país seleccionado',
        })
        .trim(),
    document: z
        .string()
        .min(7, {
            error: ({ minimum }) => {
                return `El documento debe tener al menos ${minimum} caracteres`;
            },
        })
        .trim(),
    password: z
        .string()
        .min(6, {
            error: ({ minimum }) => {
                return `La contraseña debe tener al menos ${minimum} caracteres`;
            },
        }),
    role: RoleSchema,
});

const UserProfileSchema = z.object({
    phone: z.string()
        .min(6, {
            error: ({ minimum }) => {
                return `El teléfono debe tener al menos ${minimum} caracteres`;
            },
        })
        .refine((value: string) => isPhoneValid(value), {
            message: 'Formato inválido para el país seleccionado',
        }),
    current_password: z.string()
        .min(6, {
            error: ({ minimum }) => {
                return `Su contraseña actual tiene al menos ${minimum} caracteres`;
            },
        }),
    new_password: z.string()
        .min(6, {
            error: ({ minimum }) => {
                return `La nueva contraseña debe tener al menos ${minimum} caracteres`;
            },
        }),
    confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
    message: 'La confirmación de contraseña no coincide',
    path: ['confirm_password'],
});

// ----------------------------------------------------------------------

export const UpdateUserProfileSchema = UserProfileSchema;

export const CreateUserSchema = UserSchema.omit({ id: true, displayName: true, }).extend({
    role: AdminRoleOnly,
});

export const UpdateUserSchema = UserSchema.omit({ id: true, displayName: true, password: true }).extend({
    role: AdminRoleOnly,
});