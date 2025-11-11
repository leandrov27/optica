// libs
import z from 'src/libs/zod';
import { ZodIssueCode } from 'zod';
// utils
import { isPhoneValid } from 'src/utils/phone-validation';

// ----------------------------------------------------------------------

export const LoginSchema = z.object({
  identity: z
    .string()
    .min(1, 'Teléfono es requerido'),
  password: z.string().min(1, 'Ingrese su contraseña'),
}).check((ctx) => {
  const { identity } = ctx.value;

  // Check for empty or missing input
  if (!identity || identity.trim() === '') {
    ctx.issues.push({
      path: ['identity'],
      code: ZodIssueCode.custom,
      message: 'El número de teléfono es requerido',
      input: identity,
    });
    return;
  }

  // Check minimum length (adjust based on requirements)
  if (identity.length < 7) {
    ctx.issues.push({
      path: ['identity'],
      code: ZodIssueCode.custom,
      message: 'Ingrese su número de teléfono',
      input: identity,
    });
    return;
  }

  // Validate phone number format
  if (!isPhoneValid(identity)) {
    ctx.issues.push({
      path: ['identity'],
      code: ZodIssueCode.custom,
      message: 'Formato inválido para el país seleccionado',
      input: identity,
    });
    return;
  }
});