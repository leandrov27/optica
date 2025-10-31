'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import DiagnosisNewEditForm from '../forms/diagnosis-new-edit-form';

// ----------------------------------------------------------------------

export default function DiagnosisListView() {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Gestión de Diagnósticos"
                links={[
                    {
                        name: 'Panel de Control',
                        href: paths.admin.root,
                    },
                    { name: 'Diagnósticos' },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            <DiagnosisNewEditForm />
        </Container>
    )
}
