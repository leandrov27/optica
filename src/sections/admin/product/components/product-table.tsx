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
import { type IProductData } from "src/core/schemas";
//
import ProductTableRow from "./product-table-row";

// ----------------------------------------------------------------------

interface ProductTableProps {
    products: IProductData[];
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
    { id: 'code', label: 'Código', align: 'center' },
    { id: 'description', label: 'Descripción', align: 'center' },
    { id: 'price', label: 'Precio', align: 'center' },
    { id: 'category', label: 'Categoría', align: 'center' },
    { id: 'actions', label: 'Operaciones', align: 'center', width: 20 },
];

// ----------------------------------------------------------------------

export default function ProductTable({
    products,
    searchTerm = '',
    //
    currentPage,
    totalPages,
    //
    totalItems,
    from,
    to
}: ProductTableProps) {
    const shouldShowNoResults = products.length === 0;

    return (
        <Card>
            <SearchBar placeholder="Buscar producto por descripción o código..." />

            <Divider />

            {!shouldShowNoResults ? (
                <>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size='small'>
                                <TableHeadCustom headLabel={TABLE_HEAD} />

                                <TableBody>
                                    {products.map((product) => (
                                        <ProductTableRow
                                            key={product.id}
                                            row={product}
                                            itemsInPage={products.length}
                                        />
                                    ))}

                                    <TableNoData notFound={products.length === 0} />
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
