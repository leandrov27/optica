// libs
import z from 'src/libs/zod';
//
import { RoleSchema } from './role-schema';
import { TypeSchema } from './type-schema';
import { TaxRegimeSchema } from './tax-regime-schema';
import { CFDISchema } from './cfdi-schema';
import { PaymentMethodSchema } from './payment-method-schema';
import { PaymentFormSchema } from './payment-form-schema';
import { CreditStatusSchema } from './credit-status-schema';
import { EventTypeSchema } from './event-type-schema';

// ----------------------------------------------------------------------

export type IPaymentMethod = z.infer<typeof PaymentMethodSchema>;

export type IPaymentForm = z.infer<typeof PaymentFormSchema>;

export type IEventType = z.infer<typeof EventTypeSchema>;

export type IRole = z.infer<typeof RoleSchema>;

export type IType = z.infer<typeof TypeSchema>;

export type ITaxRegime = z.infer<typeof TaxRegimeSchema>;

export type ICFDIUse = z.infer<typeof CFDISchema>;

export type ICreditStatus = z.infer<typeof CreditStatusSchema>;
