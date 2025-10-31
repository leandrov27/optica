'use client';

// @mui
import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import Stack from '@mui/material/Stack';
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
// components
import Scrollbar from "src/components/scrollbar";
import Paginator from "src/components/paginator";
import SearchBar from "src/components/search-bar";
import NoResultsCard from "src/components/no-results-card";
// schemas
import { type IClientRaw } from "src/core/schemas";
//
import ClientCard from "./client-card";

// ----------------------------------------------------------------------

interface ClientContainerProps {
    clients: IClientRaw[];
    searchTerm: string;
    //
    currentPage: number;
    totalPages: number;
    //
    totalItems: number;
    from: number;
    to: number;
}

// ----------------------------------------------------------------------

export default function ClientContainer({
    clients,
    searchTerm = '',
    //
    currentPage,
    totalPages,
    //
    totalItems,
    from,
    to,
}: ClientContainerProps) {
    const shouldShowNoResults = clients.length === 0;

    return (
        <Card>
            <SearchBar placeholder="Buscar cliente por nombre, rfc, email o teléfono..." />

            <Divider sx={{ mb: 2 }} />

            {!shouldShowNoResults ? (
                <Scrollbar sx={{ height: (clients?.length > 0) ? 50 * 4.5 : 'auto', mt: -2 }}>
                    <Box
                        sx={{ p: 2 }}
                        gap={3}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        }}
                    >
                        {clients?.map((client) => (
                            <ClientCard
                                key={client.id}
                                row={client}
                                itemsInPage={clients.length}
                            />
                        ))}
                    </Box>
                </Scrollbar>
            ) : (
                <NoResultsCard
                    sx={{ px: 2, pb: 2 }}
                    searchValue={searchTerm}
                />
            )}

            <Divider />

            <Stack justifyContent="center" alignItems="center" sx={{ py: 2 }} gap={1}>
                <Typography variant="caption">
                    {totalItems === 0 ? (
                        'No se encontraron clientes.'
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
