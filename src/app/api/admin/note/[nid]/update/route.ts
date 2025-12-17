// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { UpdateNoteSchema, type IUpdateNotePayload } from "src/core/schemas";
// generated
import { Decimal } from "src/generated/prisma/runtime/client";

// ----------------------------------------------------------------------

//* UPDATE NOTE
export async function POST(request: Request, { params }: { params: { nid: string } }) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const nid = Number(params.nid);
        const data: IUpdateNotePayload = await request.json();
        const validationSchema = UpdateNoteSchema.safeParse(data);

        if (!validationSchema.success) {
            const errorMessages = validationSchema.error.issues
                .map((err) => `${err.path.join('.')}: ${err.message}`)
                .join('; ');

            return NextResponse.json(
                { message: errorMessages },
                { status: 400 }
            );
        }

        const parsed = validationSchema.data;

        // Verificar si el cliente existe
        const existingSaleNote = await db.saleNote.findUnique({
            where: { id: nid }
        });

        if (!existingSaleNote) {
            return NextResponse.json(
                { message: 'Nota no encontrada' },
                { status: 404 }
            );
        }

        // Asegurar precisión decimal
        const subtotal = new Decimal(parsed.subtotal);
        const discount = new Decimal(parsed.discount);
        const total = new Decimal(parsed.total);

        await db.$transaction(async (tx) => {
            await tx.saleNote.update({
                where: { id: nid },
                data: {
                    clientId: parsed.clientId,
                    deliveryDate: parsed.deliveryDate,
                    requiresInvoice: parsed.requiresInvoice,
                    paymentForm: parsed.paymentForm,
                    notes: parsed.notes,
                    subtotal,
                    discount,
                    total,
                },
            });

            await tx.noteDetail.deleteMany({
                where: { noteId: nid },
            });

            if (parsed.noteDetails.length > 0) {
                await tx.noteDetail.createMany({
                    data: parsed.noteDetails.map((detail) => ({
                        noteId: nid,
                        productId: detail.productId,
                        quantity: detail.quantity,
                        unitPrice: new Decimal(detail.unitPrice),
                        finalPrice: new Decimal(detail.finalPrice),
                        discountPct: new Decimal(detail.discountPct ?? 0),
                        amount: new Decimal(detail.amount),
                    })),
                });
            }
        });

        return NextResponse.json(
            { message: 'Nota actualizada correctamente' },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Nota no encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}