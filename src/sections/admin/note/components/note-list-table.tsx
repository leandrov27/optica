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
import { type INoteData } from "src/core/schemas";
//
import NoteListTableRow from "./note-list-table-row";

// ----------------------------------------------------------------------

interface NoteListTableProps {
    notes: INoteData[];
    searchTerm?: string;
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
    { id: 'client', label: 'Cliente', align: 'center' },
    { id: 'total', label: 'Total', align: 'center' },
    { id: 'date', label: 'Fecha', align: 'center' },
    { id: 'actions', label: 'Operaciones', align: 'center', width: 20 },
];

// ----------------------------------------------------------------------

export default function NoteListTable({
    notes,
    searchTerm = '',
    //
    currentPage,
    totalPages,
    //
    totalItems,
    from,
    to
}: NoteListTableProps) {
    const shouldShowNoResults = notes.length === 0;

    return (
        <Card>
            <SearchBar placeholder="Buscar por cliente por rfc, nombre, email, telefono o razón social..." />

            <Divider />

            {!shouldShowNoResults ? (
                <>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size='small'>
                                <TableHeadCustom headLabel={TABLE_HEAD} />

                                <TableBody>
                                    {notes.map((note) => (
                                        <NoteListTableRow
                                            key={note.id}
                                            row={note}
                                            itemsInPage={notes.length}
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
                    sx={{ p: 2 }}
                    searchValue={searchTerm}
                />
            )}

            <Divider />

            <Stack justifyContent="center" alignItems="center" sx={{ py: 2 }} gap={1}>
                <Typography variant="caption">
                    {totalItems === 0 ? (
                        'No se encontraron productos.'
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

                <Paginator currentPage={currentPage} totalPages={totalPages} />
            </Stack>
        </Card>
    )
}
