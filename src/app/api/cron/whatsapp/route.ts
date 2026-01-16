// next
import { NextResponse } from 'next/server';
// libs
import db from 'src/libs/prisma';
import { sendWhatsAppMessage } from 'src/libs/whatsapp';
import { dayjs } from 'src/libs/dayjs';
// utils
import {
  detectVariableLocationV2,
  resolveTemplateVariables,
} from 'src/utils/resolveTemplateVariables';
// schemas
import { type IComponent } from 'src/core/schemas';

// ----------------------------------------------------------------------

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ----------------------------------------------------------------------

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = dayjs().utc().startOf('day');
  const todayMonth = today.month();
  const todayDate = today.date();

  const events = await db.messageEvent.findMany({
    where: {
      isActive: true,
      OR: [{ type: 'BIRTHDAY' }, { eventDate: { lte: today.toDate() } }],
    },
    include: { template: true },
  });

  for (const event of events) {
    const clients = await db.client.findMany({
      where: buildClientWhere(event),
    });

    const filteredClients =
      event.type === 'BIRTHDAY'
        ? clients.filter((client) => {
            if (!client.birthDate) return false;

            const birth = dayjs(client.birthDate).utc();
            const isLeapDay = birth.month() === 1 && birth.date() === 29;

            if (isLeapDay) {
              return todayMonth === 1 && todayDate === 28 && !isLeapYear(today.year());
            }

            return birth.month() === todayMonth && birth.date() === todayDate;
          })
        : clients;

    for (const client of filteredClients) {
      const alreadySent = await db.messageLog.findFirst({
        where: {
          eventId: event.id,
          clientId: client.id,
          status: 'SENT',
          sentDay: today.toDate(),
        },
      });

      if (alreadySent) continue;

      try {
        const variables = await db.messageVariable.findMany({
          where: { eventId: event.id },
        });

        // Obtenemos todos los parámetros resueltos (textos finales)
        const allParameters = resolveTemplateVariables({
          client,
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
          to: client.phone,
          template: event.template,
          components: finalComponents,
        });

        await db.messageLog.create({
          data: {
            clientId: client.id,
            eventId: event.id,
            templateId: event.templateId,
            phone: client.phone,
            status: 'SENT',
            sentDay: today.toDate(),
          },
        });
      } catch (error: any) {
        await db.messageLog.create({
          data: {
            clientId: client.id,
            eventId: event.id,
            templateId: event.templateId,
            phone: client.phone,
            status: 'FAILED',
            error: error.message,
            sentDay: today.toDate(),
          },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

function buildClientWhere(event: any) {
  if (event.type === 'BIRTHDAY') {
    return {
      birthDate: {
        not: null,
      },
    };
  }

  return {};
}
