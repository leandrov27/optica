// libs
import z from 'src/libs/zod';
// prisma
import {
    type Client,
    type Diagnosis,
    type TaxInfo,
    type Product,
    type Category,
    type User,
    type Setting,
    Prisma,
    SatCode,
} from 'src/generated/prisma';
//
import {
    CreateUpdateClientSchema,
    //
    CreateNoteSchema,
    UpdateNoteSchema,
    NoteDetailSchema,
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
    UpdateSettingsSchema,
    DiagnosisHistory,
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
    firstName: string;
    lastName: string;
    displayName: string;
    birthDate: string | null;
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
};

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
    }
    noteDetails: {
        description: string;
        productId: number;
        quantity: number;
        unitPrice: number;
        discountPct: number;
        amount: number;
        noteId?: number | undefined;
    }[];
}
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
}

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
    code: string;
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
export type ILoginPayload = { identity: string; password: string; };