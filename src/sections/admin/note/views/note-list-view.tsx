'use client';

// @mui
import {
    Button,
    Container,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// types
import { type INoteData } from 'src/core/schemas';
//
import NoteListTable from '../components/note-list-table';

// ----------------------------------------------------------------------

interface NoteListViewProps {
    notes: INoteData[];
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

export default function NoteListView({
    notes,
    searchTerm,
    //
    currentPage,
    totalPages,
    //
    totalItems,
    from,
    to,
}: NoteListViewProps) {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Lista de Notas"
                links={[
                    {
                        name: 'Panel de Control',
                        href: paths.admin.root,
                    },
                    { name: 'Notas' },
                ]}
                action={
                    <Button sx={{ minWidth: 20 }} variant="contained" LinkComponent={RouterLink} href={paths.admin.note.create}>
                        <Iconify icon="mingcute:add-line" />
                    </Button>
                }
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            
            <NoteListTable
                notes={notes}
                currentPage={currentPage}
                totalPages={totalPages}
                searchTerm={searchTerm}
                from={from}
                to={to}
                totalItems={totalItems}
            />
        </Container>
    )
}