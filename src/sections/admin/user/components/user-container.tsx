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
import { type IUserData } from "src/core/schemas";
//
import UserCard from "./user-card";

// ----------------------------------------------------------------------

interface UserContainerProps {
    users: IUserData[];
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

export default function UserContainer({
    users,
    searchTerm = '',
    //
    currentPage,
    totalPages,
    //
    totalItems,
    from,
    to,
}: UserContainerProps) {
    const shouldShowNoResults = users.length === 0;

    return (
        <Card>
            <SearchBar />

            <Divider sx={{ mb: 2 }} />

            {!shouldShowNoResults ? (
                <Scrollbar sx={{ height: (users?.length > 0) ? 70 * 4.5 : 'auto', mt: -2 }}>
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
                        {users?.map((user) => (
                            <UserCard
                                key={user.id}
                                row={user}
                                itemsInPage={users.length}
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
                        'No se encontraron usuarios.'
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
