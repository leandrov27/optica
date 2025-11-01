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
            phone: true,
            displayName: true,
            email: true,
            type: true,
            birthDate: true,
            observations: true,
            taxInfo: {
                select: {
                    rfc: true,
                    businessName: true,
                    taxRegime: true,
                    cfdiUse: true,
                    postalCode: true,
                    billingEmail: true,
                    paymentMethod: true,
                    paymentForm: true,
                    address: true
                }
            },
            diagnoses: {
                select: {
                    date: true,
                    leftAxis: true,
                    leftSphere: true,
                    leftCylinder: true,
                    rightAxis: true,
                    rightSphere: true,
                    rightCylinder: true,
                    addition: true,
                    notes: true,
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