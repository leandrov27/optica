// libs
import z from 'src/libs/zod';
//
import { EventTypeSchema } from './sub-schemas';

// ----------------------------------------------------------------------

const MessageEventSchema = z.object({
  id: z.int().positive(),
  name: z
    .string()
    .min(3, {
      error: ({ minimum }) => {
        return `El nombre debe tener al menos ${minimum} caracteres.`;
      },
    })
    .max(100, {
      error: ({ maximum }) => {
        return `El nombre no debe exceder más de ${maximum} caracteres.`;
      },
    })
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
      message: 'El nombre solo puede contener letras y espacios.',
    })
    .toLowerCase()
    .trim(),
  type: EventTypeSchema,
  eventDate: z.coerce.date().nullable(),
  isActive: z.boolean(),
  templateId: z.number().int().positive({ error: 'Seleccione una plantilla.' }),
});

export const CreateUpdateMessageEventSchema = MessageEventSchema.omit({ id: true }).check((ctx) => {
  const { value, issues } = ctx;

  if (value.type === 'CUSTOM' && !value.eventDate) {
    issues.push({
      code: 'custom',
      path: ['eventDate'],
      message: 'La fecha de ejecución es obligatoria cuando el tipo de evento es PERSONALIZADO.',
      input: [value.eventDate],
    });
  }
});

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

const MessageVariableSchema = z
  .object({
    id: z.int().positive(),
    eventId: z.number().int().positive({ error: 'Seleccione un evento asociado.' }),
    position: z.number().int().positive(),
    source: z.enum(['CLIENT', 'FIXED'], {
      error: (ctx) => {
        return `Valor ${ctx.input} inválido. Se esperaba 'CLIENTE' o 'FIJO'`;
      },
    }),
    value: z.string().trim().nullable(),
    fieldPath: z.string().trim().nullable(),
  })
  .check((ctx) => {
    const { value, issues } = ctx;

    if (value.source === 'FIXED') {
      if (!value.value || !value.value.trim()) {
        issues.push({
          code: 'custom',
          path: ['value'],
          message: 'El valor es obligatorio cuando el source es FIJO.',
          input: [value.value],
        });
      }

      if (value.fieldPath) {
        issues.push({
          code: 'custom',
          path: ['fieldPath'],
          message: 'fieldPath debe ser null cuando el source es FIJO.',
          input: [value.fieldPath],
        });
      }
    }

    if (value.source === 'CLIENT') {
      if (!value.fieldPath || !value.fieldPath.trim()) {
        issues.push({
          code: 'custom',
          path: ['fieldPath'],
          message: 'El fieldPath es obligatorio cuando el source es CLIENTE.',
          input: [value.fieldPath],
        });
      }

      if (value.value) {
        issues.push({
          code: 'custom',
          path: ['value'],
          message: 'value debe ser null cuando el source es CLIENTE.',
          input: [value.value],
        });
      }
    }
  });

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

export const EventVariableSchema = z
  .object({
    eventId: z.number().int().positive(),
    variables: z
      .array(MessageVariableSchema)
      .min(1, { message: 'Debe existir al menos una variable.' }),
    headerImageUrl: z.preprocess(
      (val) => (val === '' ? null : val),
      z
        .url({ message: 'Se espera una dirección HTTPS válida' })
        .regex(/^https:\/\//, 'Debe ser una dirección HTTPS')
        .nullable()
    ),
  })
  .check((ctx) => {
    const positions = ctx.value.variables.map((v) => v.position);
    const unique = new Set(positions);

    if (unique.size !== positions.length) {
      ctx.issues.push({
        code: 'custom',
        path: ['variables'],
        message: 'Las posiciones no pueden repetirse (DB: @@unique([eventId, position])).',
        input: ctx.value.variables,
      });
    }
  });

export const CreateUpdateEventVariableSchema = EventVariableSchema;
