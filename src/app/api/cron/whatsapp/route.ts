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
      OR: [
        { type: 'BIRTHDAY' },
        {
          type: { not: 'BIRTHDAY' },
          eventDate: today.toDate(),
        },
      ],
    },
    include: { template: true },
  });

  console.log(`[CRON] Found ${events.length} events for today`);

  const results = {
    sent: 0,
    failed: 0,
    skipped: 0,
  };

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

    console.log(
      `[CRON] Event "${event.id}" (${event.type}): ${filteredClients.length} clients to process`
    );

    for (const client of filteredClients) {
      console.log(`[CRON] Processing client ${client.id} - phone: ${client.phone}`);

      try {
        const alreadySent = await db.messageLog.findFirst({
          where: {
            eventId: event.id,
            clientId: client.id,
            status: 'SENT',
            sentDay: today.toDate(),
          },
        });

        if (alreadySent) {
          console.log(`[CRON] Client ${client.id} already received message today, skipping`);
          results.skipped++;
          continue;
        }

        const variables = await db.messageVariable.findMany({
          where: { eventId: event.id },
        });

        const allParameters = resolveTemplateVariables({ client, variables });

        const componentsJson = event.template.componentsJson as unknown as IComponent[];
        const varsLocation = detectVariableLocationV2(componentsJson);

        const components = [];
        let bodyStartIndex = 0;

        if (varsLocation.header) {
          if (varsLocation.headerFormat === 'IMAGE') {
            components.push({
              type: 'header',
              parameters: [{ type: 'image', image: { link: event.headerImageUrl } }],
            });
          } else if (varsLocation.headerFormat === 'TEXT') {
            const headerParam = allParameters[0];
            if (headerParam) {
              components.push({ type: 'header', parameters: [headerParam] });
              bodyStartIndex = 1;
            }
          }
        }

        if (varsLocation.body) {
          const bodyParameters = allParameters.slice(bodyStartIndex);
          if (bodyParameters.length > 0) {
            components.push({ type: 'body', parameters: bodyParameters });
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

        console.log(`[CRON] ✅ Message sent to client ${client.id}`);
        results.sent++;
      } catch (error: any) {
        console.error(`[CRON] ❌ Failed for client ${client.id}:`, error.message);

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

        results.failed++;
        // El loop CONTINÚA al siguiente cliente aunque este falle
      }
    }
  }

  console.log(
    `[CRON] Done. Sent: ${results.sent}, Failed: ${results.failed}, Skipped: ${results.skipped}`
  );

  return NextResponse.json({ ok: true, results });
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
