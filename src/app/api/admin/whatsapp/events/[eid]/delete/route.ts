// next
import { NextResponse } from 'next/server';
// libs
import db from 'src/libs/prisma';
// utils
import { verifyTokenHasRole } from 'src/utils/jwt-utils';

// ----------------------------------------------------------------------

//* DELETE MESSAGE EVENT
export async function DELETE(request: Request, { params }: { params: { eid: string } }) {
  const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { message: tokenVerification.message },
      { status: tokenVerification.status }
    );
  }

  try {
    const eid = Number(params.eid);

    if (isNaN(eid)) {
      return NextResponse.json({ message: 'ID debe ser un número' }, { status: 400 });
    }

    const existingMessageEvent = await db.messageEvent.findUnique({
      where: { id: eid },
    });

    if (!existingMessageEvent) {
      return NextResponse.json({ message: 'Evento no encontrado' }, { status: 404 });
    }

    await db.messageEvent.delete({
      where: { id: eid },
    });

    return NextResponse.json(
      { message: `Evento ${existingMessageEvent.name} eliminado con éxito` },
      { status: 200 }
    );
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Evento no encontrado' }, { status: 404 });
    }

    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
