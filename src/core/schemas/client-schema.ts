// libs
import z from 'src/libs/zod';
import { dayjs } from 'src/libs/dayjs';
// utils
import { isPhoneValid } from 'src/utils/phone-validation';
import { capitalizeString } from 'src/utils/format-string';
//
import {
    CFDISchema,
    PaymentMethodSchema,
    TaxRegimeSchema,
    TypeSchema
} from './sub-schemas';

// ----------------------------------------------------------------------

const rfcBaseRegex = /^([A-ZÑ&]{3,4})([0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01]))([A-Z\d]{2})([A\d])$/;
const RFC_GENERIC = 'XAXX010101000';

export const DiagnosisHistory = z.object({
    diagnosisId: z.number().int().optional(),
    date: z.any().nullable(),
    leftSphere: z.string().nullable(),
    leftCylinder: z.string().nullable(),
    leftAxis: z.string().nullable(),
    di: z.string().nullable(),
    rightSphere: z.string().nullable(),
    rightCylinder: z.string().nullable(),
    rightAxis: z.string().nullable(),
    addition: z.string().nullable(),
    add: z.string().nullable(),
    addi: z.string().nullable(),
    notes: z.string().nullable(),
}).readonly();

// ----------------------------------------------------------------------

const ClientSchema = z.object({
    //* -----------
    //* CLIENT INFO
    //* -----------
    id: z
        .int()
        .positive(),
    displayName: z
        .string()
        .min(1, { error: "El nombre y apellido es requerido" })
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
            message: 'El nombre y apellido solo puede contener letras y espacios',
        })
        .transform((value) => capitalizeString(value)),
    birthDate: z
        .string().refine((val) => dayjs(val, 'YYYY-MM-DD', true).isValid(), { error: 'Formato de fecha no válido (Se espera: YYYY-MM-DD)' })
        .or(z.literal(''))
        .transform((val) => (val === '' ? null : val))
        .nullable(),
    email: z
        .email({ error: 'Formato de correo inválido' })
        .trim()
        .or(z.literal(''))
        .transform((val) => (val === '' ? null : val))
        .nullable(),
    phone: z
        .string()
        .min(4, { error: "El teléfono debe tener al menos 6 caracteres" })
        .refine((value: string) => isPhoneValid(value), { error: 'Formato inválido para el país seleccionado' })
        .trim(),
    type: TypeSchema,
    observations: z
        .string()
        .toLowerCase()
        .trim()
        .nullable(),
    //^ --------
    //^ TAX INFO
    //^ --------
    rfc: z
        .string()
        .transform((value) => value.toUpperCase().trim())
        .nullable(),
    businessName: z
        .string()
        .max(200, { error: "La razón social no debe exceder los 200 caracteres" })
        .transform((value) => capitalizeString(value))
        .nullable(),
    billingEmail: z
        .email({ error: 'Formato de correo inválido' })
        .trim()
        .or(z.literal(''))
        .transform((val) => (val === '' ? null : val))
        .nullable(),
    postalCode: z
        .string()
        .min(5, { error: "El código postal debe tener al menos 5 caracteres" })
        .max(5, { error: "El código postal debe tener 5 caracteres" })
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
    address: z
        .string()
        .toLowerCase()
        .trim()
        .nullable(),
    //~ --------------
    //~ DIAGNOSIS INFO
    //~ --------------
    date: z
        .any()
        .nullable(),
    leftAxis: z
        .string()
        .trim(),
    leftSphere: z
        .string()
        .trim(),
    leftCylinder: z
        .string()
        .trim(),
    di: z
        .string()
        .trim(),
    rightAxis: z
        .string()
        .trim(),
    rightSphere: z
        .string()
        .trim(),
    rightCylinder: z
        .string()
        .trim(),
    addition: z
        .string()
        .trim(),
    add: z
        .string()
        .trim(),
    addi: z
        .string()
        .trim(),
    notes: z
        .string()
        .toLowerCase()
        .trim(),
    diagnoses: z
        .array(DiagnosisHistory)
});


// ----------------------------------------------------------------------

export const CreateUpdateClientSchema = ClientSchema.omit({ id: true }).extend({
    enableTaxInfo: z.boolean().default(false)
}).check((ctx) => {
    const { value, issues } = ctx;
    const {
        //*
        enableTaxInfo,
        type,
        //^
        rfc,
        businessName,
        postalCode,
        billingEmail,
        address
    } = value;

    if (!enableTaxInfo) {
        return;
    }

    if (rfc) {
        if (rfc !== RFC_GENERIC) {
            if (type === 'INDIVIDUAL' && rfc.length !== 13) {
                issues.push({
                    code: 'custom',
                    path: ['rfc'],
                    message: 'El RFC de una persona física debe tener exactamente 13 caracteres',
                    input: [rfc],
                });
            }

            if (type === 'BUSINESS' && rfc.length !== 12) {
                issues.push({
                    code: 'custom',
                    path: ['rfc'],
                    message: 'El RFC de una persona moral debe tener exactamente 12 caracteres',
                    input: [rfc],
                });
            }

            if (!rfcBaseRegex.test(rfc)) {
                issues.push({
                    code: 'custom',
                    path: ['rfc'],
                    message: 'El RFC no tiene un formato válido',
                    input: [rfc],
                });
            }
        }
    }

    if (enableTaxInfo && !value.rfc) {
        issues.push({
            code: 'custom',
            path: ['rfc'],
            message: 'El RFC es requerido cuando la información fiscal está habilitada',
            input: [rfc]
        });
    }

    if (enableTaxInfo && !value.businessName) {
        issues.push({
            code: 'custom',
            path: ['businessName'],
            message: 'La razón social es requerida cuando la información fiscal está habilitada',
            input: [businessName]
        });
    }

    if (enableTaxInfo && !value.postalCode) {
        issues.push({
            code: 'custom',
            path: ['postalCode'],
            message: 'El código postal es requerido cuando la información fiscal está habilitada',
            input: [postalCode]
        });
    }

    if (enableTaxInfo && !value.billingEmail) {
        issues.push({
            code: 'custom',
            path: ['billingEmail'],
            message: 'El correo de facturación es requerido cuando la información fiscal está habilitada',
            input: [billingEmail]
        });
    }

    if (enableTaxInfo && !value.address) {
        issues.push({
            code: 'custom',
            path: ['address'],
            message: 'El domicilio es requerido cuando la información fiscal está habilitada',
            input: [address]
        });
    }
});