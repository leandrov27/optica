// next
import { NextResponse } from 'next/server';
// libs
import db from 'src/libs/prisma';
// utils
import { verifyTokenHasRole } from 'src/utils/jwt-utils';
// schemas
import { CreateNoteSchema, type ICreateNotePayload } from 'src/core/schemas';
// generated
import { Prisma } from 'prigen/client';

// ----------------------------------------------------------------------

//* CREATE NOTE
export async function POST(request: Request) {
  const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { message: tokenVerification.message },
      { status: tokenVerification.status }
    );
  }

  try {
    const data: ICreateNotePayload = await request.json();
    const validationSchema = CreateNoteSchema.safeParse(data);

    if (!validationSchema.success) {
      const errorMessages = validationSchema.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');

      return NextResponse.json({ message: errorMessages }, { status: 400 });
    }

    const parsed = validationSchema.data;

    // Asegurar precisión decimal
    const subtotal = new Prisma.Decimal(parsed.subtotal);
    const discount = new Prisma.Decimal(parsed.discount);
    const total = new Prisma.Decimal(parsed.total);

    await db.$transaction(async (tx) => {
      const lastNote = await tx.saleNote.findFirst({
        orderBy: { id: 'desc' },
        select: { folio: true },
      });

      let nextNumber = 1;
      if (lastNote?.folio) {
        const match = lastNote.folio.match(/NV-(\d+)/);
        if (match) nextNumber = parseInt(match[1], 10) + 1;
      }

      const newFolio = `NV-${String(nextNumber).padStart(6, '0')}`;

      const saleNote = await tx.saleNote.create({
        data: {
          folio: newFolio,
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

      if (parsed.noteDetails.length > 0) {
        await tx.noteDetail.createMany({
          data: parsed.noteDetails.map((detail) => ({
            noteId: saleNote.id,
            productId: detail.productId,
            quantity: detail.quantity,
            unitPrice: new Prisma.Decimal(detail.unitPrice),
            finalPrice: new Prisma.Decimal(detail.finalPrice),
            discountPct: new Prisma.Decimal(detail.discountPct ?? 0),
            amount: new Prisma.Decimal(detail.amount),
          })),
        });
      }
    });

    return NextResponse.json({ message: 'Nota creada correctamente' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
