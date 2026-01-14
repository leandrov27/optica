// next
import { NextRequest, NextResponse } from 'next/server';
// libs
import db from 'src/libs/prisma';
import { dayjs } from 'src/libs/dayjs';
// utils
import { verifyTokenHasRole } from 'src/utils/jwt-utils';
// schemas
import {
  CreateUpdateMessageEventSchema,
  type ICreateUpdateMessageEventPayload,
} from 'src/core/schemas';

// ----------------------------------------------------------------------

//* CREATE MESSAGE EVENT
export async function POST(request: NextRequest) {
  const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { message: tokenVerification.message },
      { status: tokenVerification.status }
    );
  }

  try {
    const data: ICreateUpdateMessageEventPayload = await request.json();
    const validationSchema = CreateUpdateMessageEventSchema.safeParse(data);

    if (!validationSchema.success) {
      const errorMessages = validationSchema.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');

      return NextResponse.json({ message: errorMessages }, { status: 400 });
    }

    const parsed = validationSchema.data;

    if (parsed.type === 'BIRTHDAY') {
      const existingBirthdayEvent = await db.messageEvent.findFirst({
        where: { type: 'BIRTHDAY' },
      });

      if (existingBirthdayEvent) {
        return NextResponse.json(
          { message: 'Ya existe un evento de cumpleaños, no se puede crear otro.' },
          { status: 400 }
        );
      }
    }

    const selectedTemplate = await db.whatsAppTemplate.findFirst({
      where: {
        id: parsed.templateId,
      },
      select: {
        id: true,
      },
    });

    if (!selectedTemplate) {
      return NextResponse.json(
        { message: 'La plantilla seleccionada no existe o ha sido eliminada' },
        { status: 404 }
      );
    }

    const eventDate =
      parsed.type === 'BIRTHDAY'
        ? null
        : parsed.eventDate
        ? dayjs(parsed.eventDate).utc().startOf('day').toDate()
        : null;

    await db.messageEvent.create({
      data: {
        name: parsed.name,
        type: parsed.type,
        eventDate,
        templateId: selectedTemplate.id,
        isActive: parsed.isActive,
      },
    });

    return NextResponse.json({ message: 'Evento registrado correctamente' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
