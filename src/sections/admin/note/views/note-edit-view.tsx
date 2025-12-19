'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// schemas
import { type INoteByID } from 'src/core/schemas';
import NoteEditForm from '../forms/note-edit-form';
//

// ----------------------------------------------------------------------

interface NoteEditViewProps {
    note: INoteByID;
}

// ----------------------------------------------------------------------

export default function NoteEditView({ note }: NoteEditViewProps) {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Modificar Nota de Venta"
                links={[
                    {
                        name: 'Tablero de Ventas',
                        href: paths.admin.root,
                    },
                    {
                        name: 'Lista de Notas de Venta',
                        href: paths.admin.note.list,
                    },
                    { name: `Modificar Nota de Venta #${note.id}` },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <NoteEditForm note={note} />
        </Container>
    );
}
