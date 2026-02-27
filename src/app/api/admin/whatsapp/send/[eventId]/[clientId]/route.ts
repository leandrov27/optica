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

    /*
    const client = await db.client.findUnique({
      where: { id: Number(params.clientId) },
    });

    if (!client?.phone) {
      return NextResponse.json({ error: 'Client has no phone' }, { status: 400 });
    }*/

    const variables = await db.messageVariable.findMany({
      where: { eventId: event.id },
    });

    // Obtenemos todos los parámetros resueltos (textos finales)
    const allParameters = resolveTemplateVariables({
      //client,
      client: null!,
      variables,
    });

    const componentsJson = event.template.componentsJson as unknown as IComponent[];
    const varsLocation = detectVariableLocationV2(componentsJson);

    const components = [];

    /**
     * LÓGICA DE HEADER
     */
    let bodyStartIndex = 0;

    if (varsLocation.header) {
      if (varsLocation.headerFormat === 'IMAGE') {
        // Caso Imagen: No usa variables de texto, usa la URL
        components.push({
          type: 'header',
          parameters: [
            {
              type: 'image',
              image: { link: event.headerImageUrl },
            },
          ],
        });
      } else if (varsLocation.headerFormat === 'TEXT') {
        // Caso Texto con variables: Meta espera que la primera variable sea para el Header
        const headerParam = allParameters[0];
        if (headerParam) {
          components.push({
            type: 'header',
            parameters: [headerParam],
          });
          bodyStartIndex = 1; // La siguiente variable será para el Body
        }
      }
    }

    /**
     * LÓGICA DE BODY
     */
    if (varsLocation.body) {
      // Extraemos solo las variables que corresponden al body
      const bodyParameters = allParameters.slice(bodyStartIndex);

      if (bodyParameters.length > 0) {
        components.push({
          type: 'body',
          parameters: bodyParameters,
        });
      }
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
