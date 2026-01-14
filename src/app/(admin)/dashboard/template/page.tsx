// sections
import { TemplateListView } from 'src/sections/admin/template/views';
// components
import ErrorCard from 'src/components/error-card';
// config
import { WABA_API_KEY, WABA_ACCOUNT_ID, WABA_URL, WABA_VERSION } from 'src/config/config-server';
// schemas
import { type ITemplate } from 'src/core/schemas';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Lista de Plantillas de WhatsApp',
};

// ----------------------------------------------------------------------

async function getWhatsAppTemplates(): Promise<ITemplate> {
  const url = `${WABA_URL}/${WABA_VERSION}/${WABA_ACCOUNT_ID}/message_templates`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${WABA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ITemplate = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching WhatsApp templates:', error);
    throw error;
  }
}

export default async function TemplateListPage() {
  try {
    const templatesData = await getWhatsAppTemplates();

    return <TemplateListView templatesData={templatesData} />;
  } catch (error: any) {
    return <ErrorCard message={error.message} />;
  }
}
