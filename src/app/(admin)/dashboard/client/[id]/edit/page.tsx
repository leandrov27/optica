// sections
import { ClientEditView } from 'src/sections/admin/client/views';
// components
import ErrorCard from 'src/components/error-card';
// libs
import db from 'src/libs/prisma';
// types
import {
  type IClientData,
  type IClientCreditNoteData,
  type IClientPaymentData,
} from 'src/core/schemas';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Modificar Cliente',
};

// ----------------------------------------------------------------------

const CREDIT_NOTES_PER_PAGE = 5;
const PAYMENTS_PER_PAGE = 5;

async function getClientData(
  id: string,
  creditNotesPage: number = 1,
  paymentsPage: number = 1
): Promise<{
  client: IClientData;
  creditNotes: IClientCreditNoteData[];
  payments: IClientPaymentData[];
  creditNotesPagination: {
    currentPage: number;
    totalPages: number;
    from: number;
    to: number;
    totalCount: number;
  };
  paymentsPagination: {
    currentPage: number;
    totalPages: number;
    from: number;
    to: number;
    totalCount: number;
  };
}> {
  const clientId = Number(id);

  // 1. Información básica del cliente
  const clientBase = await db.client.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      phone: true,
      displayName: true,
      email: true,
      type: true,
      birthDate: true,
      observations: true,
      taxInfo: {
        select: {
          rfc: true,
          businessName: true,
          taxRegime: true,
          cfdiUse: true,
          postalCode: true,
          billingEmail: true,
          paymentMethod: true,
          address: true,
        },
      },
      diagnoses: {
        select: {
          date: true,
          leftAxis: true,
          leftSphere: true,
          leftCylinder: true,
          di: true,
          rightAxis: true,
          rightSphere: true,
          rightCylinder: true,
          add: true,
          addi: true,
          addition: true,
          notes: true,
        },
      },
    },
  });

  if (!clientBase) {
    throw new Error('Cliente no encontrado.');
  }

  // 2. Paginar NOTAS DE CRÉDITO (solo saleNotes con paymentForm='80')
  const creditNotesWhere = {
    clientId: clientId,
    paymentForm: '80',
  };

  const creditNotesTotalCount = await db.saleNote.count({
    where: creditNotesWhere,
  });

  const creditNotesSkip = (creditNotesPage - 1) * CREDIT_NOTES_PER_PAGE;
  const creditNotesTotalPages = Math.ceil(creditNotesTotalCount / CREDIT_NOTES_PER_PAGE);
  const creditNotesFrom = creditNotesTotalCount ? creditNotesSkip + 1 : 0;
  const creditNotesTo = Math.min(creditNotesPage * CREDIT_NOTES_PER_PAGE, creditNotesTotalCount);

  const creditNotesData = await db.saleNote.findMany({
    where: creditNotesWhere,
    skip: creditNotesSkip,
    take: CREDIT_NOTES_PER_PAGE,
    select: {
      id: true,
      folio: true,
      date: true,
      subtotal: true,
      total: true,
      creditStatus: true,
      payments: {
        select: {
          id: true,
          amount: true,
          paymentMethod: true,
          paymentDate: true,
          reference: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  // 3. Formatear credit notes con info del cliente
  const formattedCreditNotes: IClientCreditNoteData[] = creditNotesData.map((note) => {
    const totalPayments = note.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

    return {
      id: note.id,
      folio: note.folio,
      date: note.date,
      subtotal: Number(note.subtotal),
      total: Number(note.total),
      creditStatus: note.creditStatus,
      payments: note.payments.map((payment) => ({
        ...payment,
        amount: Number(payment.amount),
        reference: payment.reference,
      })),
      totalPayments,
      pendingBalance: Number(note.total) - totalPayments,
      client: {
        id: clientBase.id,
        displayName: clientBase.displayName,
      },
    };
  });

  // 4. Paginar TODOS LOS PAGOS del cliente (INDEPENDIENTE de las saleNotes)
  // Esto trae TODOS los pagos, no solo los de las saleNotes de la página actual
  const paymentsWhere = {
    saleNote: {
      clientId: clientId,
    },
  };

  const paymentsTotalCount = await db.payment.count({
    where: paymentsWhere,
  });

  const paymentsSkip = (paymentsPage - 1) * PAYMENTS_PER_PAGE;
  const paymentsTotalPages = Math.ceil(paymentsTotalCount / PAYMENTS_PER_PAGE);
  const paymentsFrom = paymentsTotalCount ? paymentsSkip + 1 : 0;
  const paymentsTo = Math.min(paymentsPage * PAYMENTS_PER_PAGE, paymentsTotalCount);

  // IMPORTANTE: Esta consulta trae TODOS los pagos paginados
  const paymentsData = await db.payment.findMany({
    where: paymentsWhere,
    skip: paymentsSkip,
    take: PAYMENTS_PER_PAGE,
    select: {
      id: true,
      amount: true,
      paymentMethod: true,
      paymentDate: true,
      reference: true,
      saleNote: {
        select: {
          folio: true,
        },
      },
    },
    orderBy: {
      paymentDate: 'desc',
    },
  });

  const formattedPayments: IClientPaymentData[] = paymentsData.map((payment) => ({
    id: payment.id,
    amount: Number(payment.amount),
    paymentMethod: payment.paymentMethod,
    paymentDate: payment.paymentDate,
    reference: payment.reference,
    saleNoteFolio: payment.saleNote?.folio || null,
  }));

  // 5. Convertir cliente a IClientData (sin saleNotes)
  const clientData: IClientData = {
    type: clientBase.type as 'INDIVIDUAL' | 'BUSINESS',
    id: clientBase.id,
    displayName: clientBase.displayName,
    birthDate: clientBase.birthDate ? clientBase.birthDate : null,
    email: clientBase.email,
    phone: clientBase.phone,
    observations: clientBase.observations,
    diagnoses: clientBase.diagnoses.map((diagnosis) => ({
      date: diagnosis.date.toISOString(),
      leftAxis: diagnosis.leftAxis,
      leftSphere: diagnosis.leftSphere,
      leftCylinder: diagnosis.leftCylinder,
      di: diagnosis.di,
      rightAxis: diagnosis.rightAxis,
      rightSphere: diagnosis.rightSphere,
      rightCylinder: diagnosis.rightCylinder,
      add: diagnosis.add,
      addi: diagnosis.addi,
      addition: diagnosis.addition,
      notes: diagnosis.notes,
    })),
    taxInfo: clientBase.taxInfo
      ? {
          rfc: clientBase.taxInfo.rfc,
          businessName: clientBase.taxInfo.businessName,
          billingEmail: clientBase.taxInfo.billingEmail,
          postalCode: clientBase.taxInfo.postalCode,
          cfdiUse: clientBase.taxInfo.cfdiUse,
          taxRegime: clientBase.taxInfo.taxRegime,
          paymentMethod: clientBase.taxInfo.paymentMethod,
          address: clientBase.taxInfo.address,
        }
      : null,
    saleNotes: [], // Vacío porque creditNotes está separado
  };

  return {
    client: clientData,
    creditNotes: formattedCreditNotes,
    payments: formattedPayments,
    creditNotesPagination: {
      currentPage: creditNotesPage,
      totalPages: creditNotesTotalPages,
      from: creditNotesFrom,
      to: creditNotesTo,
      totalCount: creditNotesTotalCount,
    },
    paymentsPagination: {
      currentPage: paymentsPage,
      totalPages: paymentsTotalPages,
      from: paymentsFrom,
      to: paymentsTo,
      totalCount: paymentsTotalCount,
    },
  };
}

// ----------------------------------------------------------------------

export default async function ClientEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    creditNotesPage?: string;
    paymentsPage?: string;
  };
}) {
  try {
    const creditNotesPage = Number(searchParams?.creditNotesPage) || 1;
    const paymentsPage = Number(searchParams?.paymentsPage) || 1;

    const { client, creditNotes, payments, creditNotesPagination, paymentsPagination } =
      await getClientData(params.id, creditNotesPage, paymentsPage);

    return (
      <ClientEditView
        client={client}
        creditNotes={creditNotes}
        payments={payments}
        // Props para la tabla de crédito
        creditNotesCurrentPage={creditNotesPagination.currentPage}
        creditNotesTotalPages={creditNotesPagination.totalPages}
        creditNotesFrom={creditNotesPagination.from}
        creditNotesTo={creditNotesPagination.to}
        creditNotesTotalCount={creditNotesPagination.totalCount}
        // Props para la tabla de pagos
        paymentsCurrentPage={paymentsPagination.currentPage}
        paymentsTotalPages={paymentsPagination.totalPages}
        paymentsFrom={paymentsPagination.from}
        paymentsTo={paymentsPagination.to}
        paymentsTotalCount={paymentsPagination.totalCount}
      />
    );
  } catch (error) {
    return (
      <ErrorCard
        message={error instanceof Error ? error.message : 'Error desconocido al cargar cliente'}
      />
    );
  }
}
