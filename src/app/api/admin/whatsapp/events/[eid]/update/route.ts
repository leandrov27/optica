// next
import { NextResponse } from 'next/server';
// libs
import db from 'src/libs/prisma';
import { dayjs } from 'src/libs/dayjs';
// utils
import { verifyTokenHasRole } from 'src/utils/jwt-utils';
// schemas
import {
  type ICreateUpdateMessageEventPayload,
  CreateUpdateMessageEventSchema,
} from 'src/core/schemas';

// ----------------------------------------------------------------------

//* UPDATE MESSAGE EVENT
export async function PUT(request: Request, { params }: { params: { eid: string } }) {
  const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { message: tokenVerification.message },
      { status: tokenVerification.status }
    );
  }

  try {
    const eid = Number(params.eid);
    const data: ICreateUpdateMessageEventPayload = await request.json();
    const validationSchema = CreateUpdateMessageEventSchema.safeParse(data);

    if (!validationSchema.success) {
      const errorMessages = validationSchema.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');

      return NextResponse.json({ message: errorMessages }, { status: 400 });
    }

    const parsed = validationSchema.data;

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

    const updatedMessageEvent = await db.messageEvent.update({
      where: { id: eid },
      data: {
        name: parsed.name,
        type: parsed.type,
        eventDate,
        templateId: selectedTemplate.id,
        isActive: parsed.isActive,
      },
    });

    return NextResponse.json(
      { message: `Evento ${updatedMessageEvent.name} modificado correctamente` },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
