// next
import { NextRequest, NextResponse } from 'next/server';
// config
import { WABA_TEST_PHONE } from 'src/config/config-server';
import { IComponent } from 'src/core/schemas';
// libs
import db from 'src/libs/prisma';
import { sendWhatsAppMessage } from 'src/libs/whatsapp';
// utils
import { verifyTokenHasRole } from 'src/utils/jwt-utils';
import {
  detectVariableLocationV2,
  resolveTemplateVariables,
} from 'src/utils/resolveTemplateVariables';

// ----------------------------------------------------------------------

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string; clientId: string } }
) {
  const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { message: tokenVerification.message },
      { status: tokenVerification.status }
    );
  }

  try {
    const event = await db.messageEvent.findUnique({
      where: { id: Number(params.eventId) },
      include: { template: true },
    });

    if (!event || !event.isActive) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    const client = await db.client.findUnique({
      where: { id: Number(params.clientId) },
    });

    if (!client?.phone) {
      return NextResponse.json({ error: 'Client has no phone' }, { status: 400 });
    }

    const variables = await db.messageVariable.findMany({
      where: { eventId: event.id },
    });

    const parameters = resolveTemplateVariables({ client, variables });

    if (parameters.some((p) => !p.text)) {
      return NextResponse.json({ error: 'Missing template variables' }, { status: 400 });
    }

    const componentsJson = event.template.componentsJson as unknown as IComponent[];
    const varsLocation = detectVariableLocationV2(componentsJson);

    // 1. Extraer la URL de la imagen desde el "example" del JSON de la plantilla
    let imageUrl = '';
    const headerComponent = componentsJson.find((c) => c.type === 'HEADER' && c.format === 'IMAGE');

    if (headerComponent && headerComponent.example?.header_handle?.[0]) {
      imageUrl = headerComponent.example.header_handle[0];
    }

    const components = [];

    // 2. Configurar el Header con la imagen encontrada
    if (varsLocation.header && varsLocation.headerFormat === 'IMAGE') {
      if (imageUrl) {
        components.push({
          type: 'header',
          parameters: [
            {
              type: 'image',
              image: {
                link: event.headerImageUrl,
              },
            },
          ],
        });
      }
    }

    // 3. Configurar el Body con las variables de texto
    if (varsLocation.body) {
      components.push({
        type: 'body',
        parameters: parameters,
      });
    }

    const finalComponents = components.length > 0 ? components : undefined;

    await sendWhatsAppMessage({
      to: WABA_TEST_PHONE,
      template: event.template,
      components: finalComponents,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
