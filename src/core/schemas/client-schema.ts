// libs
import z from 'src/libs/zod';
import { dayjs } from 'src/libs/dayjs';
// utils
import { isPhoneValid } from 'src/utils/phone-validation';
import { capitalizeString } from 'src/utils/format-string';
//
import { TypeSchema } from './sub-schemas';
import { CreateUpdateTaxInfoSchema } from './tax-info-schema';

// ----------------------------------------------------------------------

const ClientSchema = z.object({
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
        .max(100, {
            error: ({ maximum }) => {
                return `El nombre no debe exceder los ${maximum} caracteres`;
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
        .max(100, {
            error: ({ maximum }) => {
                return `El apellido no debe exceder los ${maximum} caracteres`;
            },
        })
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
            message: 'El apellido solo puede contener letras y espacios',
        })
        .transform((value) => capitalizeString(value)),
    displayName: z
        .string()
        .transform((value) => capitalizeString(value)),
    birthDate: z
        .string().refine((val) => dayjs(val, 'YYYY-MM-DD', true).isValid(), {
            message: 'Formato de fecha no válido (Se espera: YYYY-MM-DD)',
        })
        .or(z.literal(''))
        .transform((val) => (val === '' ? null : val))
        .nullable(),
    email: z
        .email({ message: 'Formato de correo inválido' })
        .trim()
        .or(z.literal(''))
        .transform((val) => (val === '' ? null : val))
        .nullable(),
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
    observations: z
        .string()
        .toLowerCase()
        .trim()
        .nullable(),
    type: TypeSchema,
});

// ----------------------------------------------------------------------

const CreateUpdateClientSchema = ClientSchema.omit({ id: true, displayName: true });

// ----------------------------------------------------------------------

/**
 * RFC mexicano (válido para personas físicas y morales)
 */
const rfcBaseRegex = /^([A-ZÑ&]{3,4})([0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01]))([A-Z\d]{2})([A\d])$/;

// ----------------------------------------------------------------------

export const CreateUpdateClientWithTaxInfoSchema = CreateUpdateClientSchema.extend({
    enableTaxInfo: z.boolean(),
    taxInfo: CreateUpdateTaxInfoSchema,
}).check((ctx) => {
    const { value, issues } = ctx;
    const { enableTaxInfo, taxInfo, type } = value;

    // Solo validar taxInfo si está habilitado
    if (!enableTaxInfo) {
        return;
    }

    if (taxInfo.rfc) {
        if (type === 'INDIVIDUAL' && taxInfo.rfc.length !== 13) {
            issues.push({
                code: "custom",
                path: ['taxInfo.rfc'],
                message: 'El RFC de una persona física debe tener exactamente 13 caracteres',
                input: [taxInfo.rfc]
            });
        }

        if (type === 'BUSINESS' && taxInfo.rfc.length !== 12) {
            issues.push({
                code: "custom",
                path: ['taxInfo.rfc'],
                message: 'El RFC de una persona moral debe tener exactamente 12 caracteres',
                input: [taxInfo.rfc]
            });
        }

        if (!rfcBaseRegex.test(taxInfo.rfc)) {
            issues.push({
                code: "custom",
                path: ['taxInfo.rfc'],
                message: 'El RFC no tiene un formato válido para el tipo seleccionado',
                input: [taxInfo.rfc]
            });
        }
    }

    // Validar businessName solo si taxInfo está habilitado
    if (!taxInfo.businessName) {
        issues.push({
            code: "custom",
            path: ['taxInfo.businessName'],
            message: 'La razón social es requerida cuando la información fiscal está habilitada',
            input: [taxInfo.businessName]
        });
    }

    if (!taxInfo.rfc) {
        issues.push({
            code: "custom",
            path: ['taxInfo.rfc'],
            message: 'El RFC es requerido cuando la información fiscal está habilitada',
            input: [taxInfo.rfc]
        });
    }
    if (!taxInfo.postalCode) {
        issues.push({
            code: "custom",
            path: ['taxInfo.postalCode'],
            message: 'El código postal es requerido cuando la información fiscal está habilitada',
            input: [taxInfo.postalCode]
        });
    }

    if (!taxInfo.billingEmail) {
        issues.push({
            code: "custom",
            path: ['taxInfo.billingEmail'],
            message: 'El correo de facturación es requerido cuando la información fiscal está habilitada',
            input: [taxInfo.billingEmail]
        });
    }

    if (!taxInfo.address) {
        issues.push({
            code: "custom",
            path: ['taxInfo.address'],
            message: 'El domicilio es requerido cuando la información fiscal está habilitada',
            input: [taxInfo.address]
        });
    }
});