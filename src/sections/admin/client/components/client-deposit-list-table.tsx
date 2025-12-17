'use client';

// @mui
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
// components
import Scrollbar from "src/components/scrollbar";
import NoResultsCard from "src/components/no-results-card";
import { TableHeadCustom, TableNoData } from "src/components/table";
// schemas
import { type IClientPaymentData } from "src/core/schemas";
//
import CreditPaginator from "../widgets/credit-paginator";
import ClientDepositListTableRow from "./client-deposit-list-table-row";

// ----------------------------------------------------------------------

interface ClientDepositListTableProps {
    payments: IClientPaymentData[];
    //
    currentPage: number;
    totalPages: number;
    //
    totalItems: number;
    from: number;
    to: number;
};

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'id', label: 'ID', align: 'left', width: 20 },
    { id: 'folio', label: 'Folio', align: 'center' },
    { id: 'amount', label: 'Monto Abonado', align: 'center' },
    { id: 'date', label: 'Fecha', align: 'center' },
];

// ----------------------------------------------------------------------

export default function ClientDepositListTable({
    payments,
    //
    currentPage,
    totalPages,
    //
    totalItems,
    from,
    to
}: ClientDepositListTableProps) {
    const shouldShowNoResults = payments.length === 0;

    return (
        <>
            {!shouldShowNoResults ? (
                <>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size='small'>
                                <TableHeadCustom headLabel={TABLE_HEAD} />

                                <TableBody>
                                    {payments.map((payment) => (
                                        <ClientDepositListTableRow
                                            key={payment.id}
                                            row={payment}
                                            itemsInPage={payments.length}
                                        />
                                    ))}

                                    <TableNoData notFound={payments.length === 0} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <Divider />
                </>
            ) : (
                <NoResultsCard sx={{ p: 0 }} title="Sin Historial de Pagos" description="No se ha encontrado ningún pago o depósito en la base de datos."/>
            )}

            <Divider />

            <Stack justifyContent="center" alignItems="center" sx={{ py: 2 }} gap={1}>
                <Typography variant="caption">
                    {totalItems === 0 ? (
                        'No se encontraron pagos o depósitos.'
                    ) : (
                        <>
                            Mostrando del
                            <strong> {from} </strong>
                            al
                            <strong> {to} </strong>
                            de un total de
                            <strong> {totalItems} </strong>
                            registro{totalItems !== 1 ? 's' : ''}.
                        </>
                    )}
                </Typography>

                <CreditPaginator currentPage={currentPage} totalPages={totalPages} paramName="paymentsPage" />
            </Stack>
        </>
    )
}