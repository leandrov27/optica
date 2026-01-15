// libs
import z from 'src/libs/zod';
// prisma
import {
  type Client,
  type Diagnosis,
  type Product,
  type Category,
  type User,
  type Setting,
  type MessageEvent,
  type SatCode,
  type WhatsAppTemplate,
} from 'prigen/client';
//
import {
  CreateUpdateClientSchema,
  //
  CreateNoteSchema,
  UpdateNoteSchema,
  NoteDetailSchema,
  //
  CreatePaymentSchema,
  //
  CreateProductSchema,
  UpdateProductSchema,
  //
  CreateCategorySchema,
  UpdateCategorySchema,
  //
  CreateUserSchema,
  UpdateUserSchema,
  UpdateUserProfileSchema,
  //
  CreateUpdateMessageEventSchema,
  CreateUpdateEventVariableSchema,
  //
  UpdateSettingsSchema,
  DiagnosisHistory,
  type ICreditStatus,
} from 'src/core/schemas';
import { CreateSatCodeSchema } from './sat-code-schema';

// ----------------------------------------------------------------------

//* ----------------------------------------------------------------------
//* CLIENT ---------------------------------------------------------------
//* ----------------------------------------------------------------------
export type ICreateUpdateClientPayload = z.infer<typeof CreateUpdateClientSchema>;
export type IClientRaw = Pick<Client, 'id' | 'displayName' | 'phone' | 'type'>;
export type IClientData = {
  type: 'INDIVIDUAL' | 'BUSINESS';
  id: number;
  displayName: string;
  birthDate: Date | null;
  email: string | null;
  phone: string;
  observations: string | null;
  diagnoses: {
    date: string;
    leftAxis: string | null;
    leftSphere: string | null;
    leftCylinder: string | null;
    di: string | null;
    rightAxis: string | null;
    rightSphere: string | null;
    rightCylinder: string | null;
    add: string | null;
    addi: string | null;
    addition: string | null;
    notes: string | null;
  }[];
  taxInfo: {
    rfc: string | null;
    businessName: string;
    billingEmail: string | null;
    postalCode: string | null;
    cfdiUse: string | null;
    taxRegime: string | null;
    paymentMethod: string | null;
    address: string | null;
  } | null;
  saleNotes: {
    id: number;
    folio: string | null;
    date: Date;
    subtotal: number;
    total: number;
    creditStatus: ICreditStatus;
    payments: {
      id: number;
      amount: number;
      paymentMethod: string;
      paymentDate: Date;
      reference: string | null;
    }[];
  }[];
};

// Tipo para las props del componente ClientEditView
export type IClientEditViewProps = {
  client: IClientData;
  // Props para la tabla de saleNotes
  saleNotesCurrentPage: number;
  saleNotesTotalPages: number;
  saleNotesFrom: number;
  saleNotesTo: number;
  saleNotesTotalCount: number;
  // Props para la tabla de payments
  paymentsCurrentPage: number;
  paymentsTotalPages: number;
  paymentsFrom: number;
  paymentsTo: number;
  paymentsTotalCount: number;
};

//* ----------------------------------------------------------------------
//* PAYMENT --------------------------------------------------------------
//* ----------------------------------------------------------------------
export type ICreatePaymentPayload = z.infer<typeof CreatePaymentSchema>;

//* ----------------------------------------------------------------------
//* DIAGNOSIS ------------------------------------------------------------
//* ----------------------------------------------------------------------
export type IDiagnosisData = Diagnosis;
export type IDiagnosisItem = z.infer<typeof DiagnosisHistory>;

//* ----------------------------------------------------------------------
//* NOTE -----------------------------------------------------------------
//* ----------------------------------------------------------------------
export type ICreateNotePayload = z.infer<typeof CreateNoteSchema>;
export type IUpdateNotePayload = z.infer<typeof UpdateNoteSchema>;
export type INoteDetailPayload = z.infer<typeof NoteDetailSchema>;
export type INoteProduct = Pick<Product, 'id' | 'description' | 'price'>;
export type INoteByID = {
  id: number;
  folio: string | null;
  clientId: number;
  subtotal: number;
  discount: number;
  total: number;
  deliveryDate: string | null;
  requiresInvoice: boolean;
  paymentForm: string;
  notes: string | null;
  client: {
    displayName: string;
    phone: string;
    taxInfo: {
      id?: number;
      clientId?: number;
      rfc?: string | null;
      businessName?: string;
      postalCode?: string | null;
      taxRegime?: string | null;
      cfdiUse?: string | null;
      paymentMethod?: string | null;
      paymentForm?: string | null;
      billingEmail?: string | null;
      address?: string | null;
    } | null;
  };
  noteDetails: {
    description: string;
    productId: number;
    quantity: number;
    unitPrice: number;
    finalPrice: number;
    discountPct: number;
    amount: number;
    noteId?: number | undefined;
  }[];
};
export type INoteData = {
  id: number;
  date: Date;
  client: {
    id: number;
    displayName: string;
    phone: string;
    taxInfo: {
      rfc: string | null;
      businessName: string;
    } | null;
  };
  total: any;
};

export type IClientCreditNoteData = {
  id: number;
  folio: string | null;
  date: Date;
  subtotal: number;
  total: number;
  creditStatus: ICreditStatus;
  payments: {
    id: number;
    amount: number;
    paymentMethod: string;
    paymentDate: Date;
    reference: string | null;
  }[];
  // Campos calculados
  totalPayments: number; // Suma de todos los pagos
  pendingBalance: number; // total - totalPayments
  client: {
    id: number;
    displayName: string;
  };
};
export type IClientPaymentData = {
  id: number;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  reference: string | null;
  saleNoteFolio: string | null;
};

//* ----------------------------------------------------------------------
//* SAT CODE -------------------------------------------------------------
//* ----------------------------------------------------------------------
export type ICreateSatCodePayload = z.infer<typeof CreateSatCodeSchema>;

//* ----------------------------------------------------------------------
//* PRODUCT --------------------------------------------------------------
//* ----------------------------------------------------------------------
export type ICreateProductPayload = z.infer<typeof CreateProductSchema>;
export type IUpdateProductPayload = z.infer<typeof UpdateProductSchema>;
export type IProductRaw = Omit<Product, 'createdAt'>;
export type IProductData = {
  id: number;
  code: string | null;
  notes: string | null;
  description: string;
  price: any;
  satCodeId: number;
  category: {
    id: number;
    name: string;
    icon: string | null;
  };
};
export type ISatCodesData = SatCode;

//* ----------------------------------------------------------------------
//* CATEGORY -------------------------------------------------------------
//* ----------------------------------------------------------------------
export type ICreateCategoryPayload = z.infer<typeof CreateCategorySchema>;
export type IUpdateCategoryPayload = z.infer<typeof UpdateCategorySchema>;
export type ICategoryData = Omit<Category, 'createdAt'>;

//* ----------------------------------------------------------------------
//* USER -----------------------------------------------------------------
//* ----------------------------------------------------------------------
export type ICreateUserPayload = z.infer<typeof CreateUserSchema>;
export type IUpdateUserPayload = z.infer<typeof UpdateUserSchema>;
export type IUpdateUserProfilePayload = z.infer<typeof UpdateUserProfileSchema>;
export type IUserData = Omit<User, 'password' | 'createdAt' | 'updatedAt'>;

//* ----------------------------------------------------------------------
//* SETTING --------------------------------------------------------------
//* ----------------------------------------------------------------------
export type IUpdateSettingsPayload = z.infer<typeof UpdateSettingsSchema>;
export type ISettingsData = Setting;

//* ----------------------------------------------------------------------
//* AUTH -----------------------------------------------------------------
//* ----------------------------------------------------------------------
export type ILoginPayload = { identity: string; password: string };

//* ----------------------------------------------------------------------
//* TEMPLATE -------------------------------------------------------------
//* ----------------------------------------------------------------------
export type IWhatsAppTemplate = Pick<WhatsAppTemplate, 'id' | 'name'>;

export type ITemplate = {
  data: Datum[];
  paging: Paging;
};

export type Datum = {
  name: string;
  parameter_format: string;
  components: IComponent[];
  language: string;
  status: string;
  category: string;
  id: string;
};

export type IComponent = {
  type: 'HEADER' | 'BODY' | 'FOOTER';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  example?: Example;
  buttons?: Button[];
};

export type Button = {
  type: string;
  text: string;
  url: string;
};

export type Example = {
  body_text?: Array<string[]>;
  header_text?: string[];
  header_handle?: string[];
};

export type Paging = {
  cursors: Cursors;
};

export type Cursors = {
  before: string;
  after: string;
};

//* ----------------------------------------------------------------------
//* MESSAGE EVENT --------------------------------------------------------
//* ----------------------------------------------------------------------
export type ICreateUpdateMessageEventPayload = z.infer<typeof CreateUpdateMessageEventSchema>;
export type IMessageEventRaw = MessageEvent;
export type IMessageEventData = {
  id: number;
  name: string;
  type: 'BIRTHDAY' | 'CUSTOM';
  eventDate: Date | null;
  headerImageUrl: string | null;
  isActive: boolean;
  template: {
    id: number;
    name: string;
    variablesCount: number;
  };
};

//* ----------------------------------------------------------------------
//* MESSAGE VARIABLE -----------------------------------------------------
//* ----------------------------------------------------------------------
export type ICreateUpdateEventVariablePayload = z.infer<typeof CreateUpdateEventVariableSchema>;
