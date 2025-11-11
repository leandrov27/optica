// sections
import { NoteEditView } from "src/sections/admin/note/views";
// components
import ErrorCard from "src/components/error-card";
// libs
import db from "src/libs/prisma";
// schemas
import { type INoteByID } from "src/core/schemas";

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Modificar Nota',
};

// ----------------------------------------------------------------------

async function getNoteById(id: string): Promise<INoteByID> {
    const noteById = await db.saleNote.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            folio: true,
            notes: true,
            clientId: true,
            deliveryDate: true,
            requiresInvoice: true,
            paymentForm: true,
            subtotal: true,
            discount: true,
            total: true,
            client: {
                select: {
                    displayName: true,
                    phone: true,
                    taxInfo: true
                }
            },
            noteDetails: {
                select: {
                    id: true,
                    product: {
                        select: {
                            id: true,
                            description: true,
                            price: true,
                        },
                    },
                    quantity: true,
                    discountPct: true,
                    noteId: true,
                    amount: true,
                    unitPrice: true,
                },
            },
        },
    });

    if (!noteById) {
        throw new Error("Nota no encontrada.");
    }

    const formattedNote: INoteByID = {
        id: noteById.id,
        folio: noteById.folio,
        clientId: noteById.clientId,
        notes: noteById.notes,
        deliveryDate: noteById.deliveryDate,
        requiresInvoice: noteById.requiresInvoice,
        paymentForm: noteById.paymentForm,
        subtotal: Number(noteById.subtotal),
        discount: Number(noteById.discount),
        total: Number(noteById.total),
        client: {
            displayName: noteById.client.displayName,
            phone: noteById.client.phone,
            taxInfo: {
                rfc: noteById.client.taxInfo?.rfc,
                businessName: noteById.client.taxInfo?.businessName,
                postalCode: noteById.client.taxInfo?.postalCode,
                taxRegime: noteById.client.taxInfo?.taxRegime,
                cfdiUse: noteById.client.taxInfo?.cfdiUse,
                paymentMethod: noteById.client.taxInfo?.paymentMethod,
                billingEmail: noteById.client.taxInfo?.billingEmail,
                address: noteById.client.taxInfo?.address,
            }
        },
        noteDetails: noteById.noteDetails.map((detail) => ({
            productId: detail.product.id,
            description: detail.product.description,
            unitPrice: Number(detail.unitPrice),
            quantity: detail.quantity,
            discountPct: Number(detail.discountPct),
            amount: Number(detail.amount),
            noteId: detail.noteId,
        })),
    };

    return formattedNote;
}

// ----------------------------------------------------------------------

export default async function NoteEditPage({ params }: { params: { id: string } }) {
    try {
        const note = await getNoteById(params.id);

        return (
            <NoteEditView note={note} />
        );
    } catch (error) {
        return (
            <ErrorCard
                message={error instanceof Error ? error.message : 'Error desconocido al cargar cliente'}
            />
        );
    }
}