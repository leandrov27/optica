// config
import {
  WABA_API_KEY,
  WABA_PHONE_NUMBER_ID,
  WABA_URL,
  WABA_VERSION,
} from 'src/config/config-server';
// prisma
import { type WhatsAppTemplate } from 'prigen/client';

// ----------------------------------------------------------------------

type SendInput = {
  to: string;
  template: WhatsAppTemplate;
  components: any;
};

// ----------------------------------------------------------------------

export async function sendWhatsAppMessage({ to, template, components }: SendInput) {
  const url = `${WABA_URL}/${WABA_VERSION}/${WABA_PHONE_NUMBER_ID}/messages`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WABA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: template.name,
        language: { code: template.language },
        components,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message ?? 'WhatsApp API error');
  }

  return data;
}
