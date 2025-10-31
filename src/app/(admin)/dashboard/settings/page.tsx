// sections
import { SettingsEditView } from 'src/sections/admin/settings/views';
// components
import ErrorCard from 'src/components/error-card';
// libs
import db from 'src/libs/prisma';
// schemas
import { type ISettingsData } from 'src/core/schemas';

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Ajustes del Sistema',
};

// ----------------------------------------------------------------------

async function getSettingsData(): Promise<ISettingsData> {
    const settingsData = await db.setting.findFirst({
        where: { id: 1 }
    });

    if (!settingsData) {
        throw new Error('No se han podido cargar los ajustes del sistema.');
    }

    return settingsData;
}

// ----------------------------------------------------------------------

export default async function SettingsEditPage() {
    try {
        const settingsData = await getSettingsData();

        return <SettingsEditView settingsData={settingsData} />;
    } catch (error) {
        return <ErrorCard message={error.message} />;
    }
}
