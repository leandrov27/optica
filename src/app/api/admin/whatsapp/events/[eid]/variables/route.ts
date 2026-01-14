// next
import { NextRequest, NextResponse } from 'next/server';
import {
  CreateUpdateEventVariableSchema,
  ICreateUpdateEventVariablePayload,
} from 'src/core/schemas';
// libs
import db from 'src/libs/prisma';
// utils
import { verifyTokenHasRole } from 'src/utils/jwt-utils';

// ----------------------------------------------------------------------

export async function GET(request: NextRequest, { params }: { params: { eid: string } }) {
  const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { message: tokenVerification.message },
      { status: tokenVerification.status }
    );
  }

  try {
    const variables = await db.messageVariable.findMany({
      where: { eventId: Number(params.eid) },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json(variables);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { eid: string } }) {
  const tokenVerification = verifyTokenHasRole(request, 'ADMIN');

  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { message: tokenVerification.message },
      { status: tokenVerification.status }
    );
  }

  try {
    const eventId = Number(params.eid);

    if (isNaN(eventId)) {
      return NextResponse.json({ message: 'Invalid event ID' }, { status: 400 });
    }

    const data: ICreateUpdateEventVariablePayload = await request.json();
    const validationSchema = CreateUpdateEventVariableSchema.safeParse(data);

    if (!validationSchema.success) {
      const errorMessages = validationSchema.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');

      return NextResponse.json({ message: errorMessages }, { status: 400 });
    }

    const parsed = validationSchema.data;

    if (parsed.eventId !== eventId) {
      return NextResponse.json({ message: 'Event ID mismatch' }, { status: 400 });
    }

    await db.$transaction(async (tx) => {
      await tx.messageEvent.update({
        where: { id: eventId },
        data: {
          headerImageUrl: parsed.headerImageUrl ? parsed.headerImageUrl : null,
        },
      });

      await tx.messageVariable.deleteMany({
        where: { eventId: eventId },
      });

      const ops = parsed.variables.map((v) => {
        return tx.messageVariable.create({
          data: {
            eventId: eventId,
            position: v.position,
            source: v.source,
            value: v.value ?? null,
            fieldPath: v.fieldPath ?? null,
          },
        });
      });

      const results = await Promise.all(ops);

      return results.sort((a, b) => a.position - b.position);
    });

    return NextResponse.json(
      { message: `Variables de evento actualizadas correctamente` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating event variables:', error);

    return NextResponse.json(
      {
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}
