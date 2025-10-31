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
import { type ICategoryData } from "src/core/schemas";
//
import CategoryTableRow from "./category-table-row";

// ----------------------------------------------------------------------

interface CategoryTableProps {
    categories: ICategoryData[];
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
    { id: 'id', label: 'ID', align: 'center', width: 20 },
    { id: 'name', label: 'Categoría', align: 'center' },
    { id: 'icon', label: 'Ícono', align: 'center' },
    { id: 'actions', label: 'Operaciones', align: 'center', width: 20 },
];

// ----------------------------------------------------------------------

export default function CategoryTable({
    categories,
    searchTerm = '',
    //
    currentPage,
    totalPages,
    //
    totalItems,
    from,
    to
}: CategoryTableProps) {
    const shouldShowNoResults = categories.length === 0;

    return (
        <Card>
            <SearchBar />

            <Divider />

            {!shouldShowNoResults ? (
                <>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size='small'>
                                <TableHeadCustom headLabel={TABLE_HEAD} />

                                <TableBody>
                                    {categories.map((category) => (
                                        <CategoryTableRow
                                            key={category.id}
                                            row={category}
                                            itemsInPage={categories.length}
                                        />
                                    ))}

                                    <TableNoData notFound={categories.length === 0} />
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
                        'No se encontraron categorías.'
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
