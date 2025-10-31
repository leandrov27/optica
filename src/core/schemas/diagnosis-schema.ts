import z from 'src/libs/zod';

// ----------------------------------------------------------------------

const DiagnosisSchema = z.object({
    clientId: z.number().int().positive({ error: 'Seleccione un cliente.' }),
    date: z.string(),
    rightSphere: z.string(),
    rightCylinder: z.string(),
    rightAxis: z.string(),
    leftSphere: z.string(),
    leftCylinder: z.string(),
    leftAxis: z.string(),
    addition: z.string(),
    notes: z.string(),
});

const DiagnosisHistory = z.object({
    diagnosisId: z.number().int().optional(),
    clientId: z.number(),
    date: z.string(),
    rightSphere: z.string().nullable(),
    rightCylinder: z.string().nullable(),
    rightAxis: z.string().nullable(),
    leftSphere: z.string().nullable(),
    leftCylinder: z.string().nullable(),
    leftAxis: z.string().nullable(),
    addition: z.string().nullable(),
    notes: z.string().nullable(),
}).readonly();

// ----------------------------------------------------------------------

export const CreateUpdateDiagnosisSchema = DiagnosisSchema.extend({
    diagnoses: z.array(DiagnosisHistory)
});