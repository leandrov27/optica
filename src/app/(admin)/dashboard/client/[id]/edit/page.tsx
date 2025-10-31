// sections
import { ClientEditView } from "src/sections/admin/client/views";
// components
import ErrorCard from "src/components/error-card";
// libs
import db from "src/libs/prisma";
// schemas
import { type IClientData } from "src/core/schemas";

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Modificar Cliente',
};

// ----------------------------------------------------------------------

async function getClientById(id: string): Promise<IClientData> {
    const clientById = await db.client.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            birthDate: true,
            email: true,
            phone: true,
            type: true,
            observations: true,
            taxInfo: {
                select: {
                    rfc: true,
                    businessName: true,
                    postalCode: true,
                    taxRegime: true,
                    cfdiUse: true,
                    paymentMethod: true,
                    paymentForm: true,
                    billingEmail: true,
                    address: true
                }
            }
        }
    });

    if (!clientById) {
        throw new Error('Cliente no encontrado.');
    }

    return clientById;
}

// ----------------------------------------------------------------------

export default async function ClientEditPage({ params }: { params: { id: string } }) {
    try {
        const client = await getClientById(params.id);

        return (
            <ClientEditView client={client} />
        );
    } catch (error) {
        return (
            <ErrorCard
                message={error instanceof Error ? error.message : 'Error desconocido al cargar cliente'}
            />
        );
    }
}