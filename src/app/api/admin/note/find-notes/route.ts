// next
import { NextRequest, NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";

// ----------------------------------------------------------------------

//* SEARCH SALE NOTES BY CLIENT ID
export async function GET(request: NextRequest) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get("id");

    // Validar que el clientId existe y es un número
    if (!clientId || isNaN(Number(clientId))) {
        return NextResponse.json(
            { message: "ID de cliente no válido" },
            { status: 400 }
        );
    }

    try {
        const saleNotes = await db.saleNote.findMany({
            where: {
                clientId: Number(clientId)
            },
            select: {
                clientId: true,
                deliveryDate: true,
                requiresInvoice: true,
                subtotal: true,
                discount: true,
                total: true,
                noteDetails: {
                    select: {
                        id: true,
                        product: {
                            select: {
                                id: true,
                                description: true,
                                price: true
                            }
                        },
                        quantity: true,
                        discountPct: true,
                        noteId: true,
                        amount: true,
                        unitPrice: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        const formattedSaleNotes = saleNotes.map((saleNote) => ({
            clientId: saleNote.clientId,
            deliveryDate: saleNote.deliveryDate,
            requiresInvoice: saleNote.requiresInvoice,
            subtotal: Number(saleNote.subtotal),
            discount: Number(saleNote.discount),
            total: saleNote.total,
            noteDetails: saleNote.noteDetails.map((detail) => ({
                productId: detail.product.id,
                description: detail.product.description,
                unitPrice: Number(detail.product.price),
                quantity: detail.quantity,
                discountPct: Number(detail.discountPct),
                amount: detail.amount,
                noteId: detail.id
            })),
        }));

        return NextResponse.json(
            { formattedSaleNotes },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Error interno del servidor' },
            { status: 500 }
        );
    }
}