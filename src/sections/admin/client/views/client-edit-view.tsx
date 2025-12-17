'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// schemas
import {
  type IClientData,
  type IClientCreditNoteData,
  type IClientPaymentData
} from 'src/core/schemas';
//
import ClientEditForm from '../forms/client-edit-form';

// ----------------------------------------------------------------------

interface ClientEditViewProps {
  client: IClientData;
  creditNotes: IClientCreditNoteData[];
  payments: IClientPaymentData[];
  // Props para la tabla de crédito
  creditNotesCurrentPage: number;
  creditNotesTotalPages: number;
  creditNotesFrom: number;
  creditNotesTo: number;
  creditNotesTotalCount: number;
  // Props para la tabla de pagos
  paymentsCurrentPage: number;
  paymentsTotalPages: number;
  paymentsFrom: number;
  paymentsTo: number;
  paymentsTotalCount: number;
}

// ----------------------------------------------------------------------

export default function ClientEditView({
  client,
  creditNotes,
  payments,
  // Tabla de crédito
  creditNotesCurrentPage,
  creditNotesTotalPages,
  creditNotesFrom,
  creditNotesTo,
  creditNotesTotalCount,
  // Tabla de pagos
  paymentsCurrentPage,
  paymentsTotalPages,
  paymentsFrom,
  paymentsTo,
  paymentsTotalCount
}: ClientEditViewProps) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Modificar Cliente"
        links={[
          {
            name: 'Panel de Control',
            href: paths.admin.root,
          },
          {
            name: 'Lista de Clientes',
            href: paths.admin.client.list,
          },
          { name: `Modificar Cliente #${client.id}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ClientEditForm
        client={client}
        creditNotes={creditNotes}
        payments={payments}
        //
        creditNotesCurrentPage={creditNotesCurrentPage}
        creditNotesTotalPages={creditNotesTotalPages}
        creditNotesFrom={creditNotesFrom}
        creditNotesTo={creditNotesTo}
        creditNotesTotalCount={creditNotesTotalCount}
        //
        paymentsCurrentPage={paymentsCurrentPage}
        paymentsTotalPages={paymentsTotalPages}
        paymentsFrom={paymentsFrom}
        paymentsTo={paymentsTo}
        paymentsTotalCount={paymentsTotalCount}
      />
    </Container>
  );
}
