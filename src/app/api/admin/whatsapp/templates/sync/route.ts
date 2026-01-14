// next
import { NextRequest, NextResponse } from 'next/server';
// libs
import db from 'src/libs/prisma';
// utils
import { verifyTokenHasRole } from 'src/utils/jwt-utils';
// config
import { WABA_API_KEY, WABA_ACCOUNT_ID, WABA_URL, WABA_VERSION } from 'src/config/config-server';
// schemas
import { type ITemplate } from 'src/core/schemas';
// utils
import { extractVariablesFromComponents } from 'src/utils/resolveTemplateVariables';
// prisma
import { type TemplateStatus } from 'src/generated/prisma';

// ----------------------------------------------------------------------

export async function PUT(request: NextRequest) {
  const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { message: tokenVerification.message },
      { status: tokenVerification.status }
    );
  }

  const url = `${WABA_URL}/${WABA_VERSION}/${WABA_ACCOUNT_ID}/message_templates`;

  try {
    const metaResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${WABA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!metaResponse.ok) {
      const errorText = await metaResponse.text();
      return NextResponse.json(
        { message: errorText || 'Meta API error' },
        { status: metaResponse.status }
      );
    }

    const templatesData: ITemplate = await metaResponse.json();
    const metaTemplates = templatesData.data ?? [];

    const result = await db.$transaction(
      metaTemplates.map((template) => {
        const variableList = extractVariablesFromComponents(template.components);
        const variableCount = variableList.length;

        return db.whatsAppTemplate.upsert({
          where: { metaTemplateId: template.id },
          create: {
            metaTemplateId: template.id,
            name: template.name,
            category: template.category,
            language: template.language,
            status: (template.status as TemplateStatus) ?? 'APPROVED',
            componentsJson: template.components,
            variablesCount: variableCount,
            isActive: template.status === 'APPROVED' ? true : false,
          },
          update: {
            name: template.name,
            category: template.category,
            language: template.language,
            status: (template.status as TemplateStatus) ?? 'APPROVED',
            componentsJson: template.components,
            variablesCount: variableCount,
            isActive: template.status === 'APPROVED' ? true : false,
          },
        });
      })
    );

    return NextResponse.json(
      {
        message: "Plantillas sincronizadas correctamente"
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
