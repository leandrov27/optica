'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import NoteCreateForm from '../forms/note-create-form';

// ----------------------------------------------------------------------

export default function NoteCreateView() {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Registar Nueva Nota de Venta"
                links={[
                    {
                        name: 'Panel de Control',
                        href: paths.admin.root,
                    },
                    {
                        name: 'Lista de Notas de Venta',
                        href: paths.admin.note.list,
                    },
                    { name: 'Nueva Nota de Venta' },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <NoteCreateForm />
        </Container>
    )
}
