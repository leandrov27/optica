'use client';

// @mui
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
// components
import Scrollbar from "src/components/scrollbar";
import Paginator from "src/components/paginator";
import SearchBar from "src/components/search-bar";
import NoResultsCard from "src/components/no-results-card";
import { TableHeadCustom, TableNoData } from "src/components/table";
// schemas
import { type IClientRaw } from "src/core/schemas";
//
import ClientTableRow from "./client-table-row";

// ----------------------------------------------------------------------

interface ClientTableProps {
    clients: IClientRaw[];
    currentPage: number;
    totalPages: number;
    searchTerm?: string;
    from: number;
    to: number;
    totalCount: number;
};

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'id', label: 'ID', align: 'center', width: 20 },
    { id: 'client', label: 'Cliente', align: 'center' },
    { id: 'phone', label: 'Teléfono', align: 'center' },
    { id: 'type', label: 'Tipo', align: 'center' },
    { id: 'actions', label: 'Operaciones', align: 'center', width: 20 },
];

// ----------------------------------------------------------------------

export default function ClientTable({
    clients,
    currentPage,
    totalPages,
    searchTerm = '',
    from,
    to,
    totalCount
}: ClientTableProps) {
    const shouldShowNoResults = clients.length === 0;

    return (
        <Card>
            <SearchBar />

            {!shouldShowNoResults ? (
                <>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size='small'>
                                <TableHeadCustom headLabel={TABLE_HEAD} />

                                <TableBody>
                                    {clients.map((client) => (
                                        <ClientTableRow
                                            key={client.id}
                                            row={client}
                                            itemsInPage={clients.length}
                                        />
                                    ))}

                                    <TableNoData notFound={clients.length === 0} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <Divider />
                </>
            ) : (
                <NoResultsCard
                    sx={{ p: 2 }}
                    searchValue={searchTerm}
                />
            )}

            <Divider />

            <Stack justifyContent="center" alignItems="center" sx={{ py: 2 }} gap={1}>
                <Typography variant="caption">
                    {totalCount === 0 ? (
                        'No se encontraron médicos.'
                    ) : (
                        <>
                            Mostrando del
                            <strong> {from} </strong>
                            al
                            <strong> {to} </strong>
                            de un total de
                            <strong> {totalCount} </strong>
                            registro{totalCount !== 1 ? 's' : ''}.
                        </>
                    )}
                </Typography>

                <Paginator currentPage={currentPage} totalPages={totalPages} />
            </Stack>
        </Card>
    )
}
