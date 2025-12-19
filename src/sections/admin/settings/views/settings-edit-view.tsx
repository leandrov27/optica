'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// schemas
import { type ISettingsData } from "src/core/schemas"
//
import SettingsEditForm from '../forms/settings-edit-form';

// ----------------------------------------------------------------------

interface SettingsEditViewProps {
    settingsData: ISettingsData;
}

// ----------------------------------------------------------------------

export default function SettingsEditView({ settingsData }: SettingsEditViewProps) {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={`Ajustes del Sistema`}
                links={[
                    {
                        name: 'Tablero de Ventas',
                        href: paths.admin.root,
                    },
                    {
                        name: 'Ajustes del Sistema',
                    },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <SettingsEditForm settings={settingsData} />
        </Container>
    )
}
