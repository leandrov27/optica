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
import { type IClientCreditNoteData } from "src/core/schemas";
//
import ClientNoteListTableRow from "./client-note-list-table-row";
import CreditPaginator from "../widgets/credit-paginator";

// ----------------------------------------------------------------------

interface ClientNoteListTableProps {
    notes: IClientCreditNoteData[];
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
    { id: 'client', label: 'Cliente', align: 'center' },
    { id: 'subTotal', label: 'Sub-Total', align: 'center' },
    { id: 'total', label: 'Total', align: 'center' },
    { id: 'totalPayments', label: 'Total Abonado', align: 'center' },
    { id: 'pendingBalance', label: 'Balance Pendiente', align: 'center' },
    { id: 'date', label: 'Fecha', align: 'center' },
    { id: 'creditStatus', label: 'Estado', align: 'center' },
    { id: 'actions', label: 'Operaciones', align: 'center', width: 20 },
];

// ----------------------------------------------------------------------

export default function ClientNoteListTable({
    notes,
    //
    currentPage,
    totalPages,
    //
    totalItems,
    from,
    to
}: ClientNoteListTableProps) {
    const shouldShowNoResults = notes.length === 0;

    return (
        <>
            {!shouldShowNoResults ? (
                <>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size='small'>
                                <TableHeadCustom headLabel={TABLE_HEAD} />

                                <TableBody>
                                    {notes.map((note) => (
                                        <ClientNoteListTableRow
                                            key={note.id}
                                            row={note}
                                        />
                                    ))}

                                    <TableNoData notFound={notes.length === 0} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <Divider />
                </>
            ) : (
                <NoResultsCard
                    sx={{ p: 0 }}
                    title="Sin Notas de Venta a Crédito" 
                    description="No se encontraron notas de venta a crédito para el cliente seleccionado."
                />
            )}

            <Divider />

            <Stack justifyContent="center" alignItems="center" sx={{ py: 2 }} gap={1}>
                <Typography variant="caption">
                    {totalItems === 0 ? (
                        'No se encontraron notas de venta a crédito.'
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

                <CreditPaginator currentPage={currentPage} totalPages={totalPages} paramName="creditNotesPage" />
            </Stack>
        </>
    )
}