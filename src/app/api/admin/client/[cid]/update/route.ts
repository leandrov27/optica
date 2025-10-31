// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { CreateUpdateClientWithTaxInfoSchema, type ICreateUpdateClientWithTaxInfoPayload } from "src/core/schemas";

// ----------------------------------------------------------------------

//* UPDATE CLIENT
export async function PUT(request: Request, { params }: { params: { cid: string } }) {
  const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { message: tokenVerification.message },
      { status: tokenVerification.status }
    );
  }

  try {
    const cid = Number(params.cid);
    const data: ICreateUpdateClientWithTaxInfoPayload = await request.json();
    const validationSchema = CreateUpdateClientWithTaxInfoSchema.safeParse(data);

    if (!validationSchema.success) {
      const errorMessages = validationSchema.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');

      return NextResponse.json(
        { message: errorMessages },
        { status: 400 }
      );
    }

    const parsed = validationSchema.data;

    // Verificar si el cliente existe
    const existingClient = await db.client.findUnique({
      where: { id: cid },
      include: { taxInfo: true }
    });

    if (!existingClient) {
      return NextResponse.json(
        { message: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    // Preparar los datos del cliente
    const clientData = {
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      displayName: `${parsed.firstName} ${parsed.lastName}`,
      birthDate: parsed.birthDate,
      email: parsed.email,
      phone: parsed.phone,
      type: parsed.type,
      observations: parsed.observations,
    };

    // Manejar la información fiscal condicionalmente
    let taxInfoData = {};

    if (parsed.enableTaxInfo) {
      const businessName = parsed.taxInfo.businessName || `${parsed.firstName} ${parsed.lastName}`;

      if (existingClient.taxInfo) {
        // Si ya existe taxInfo, actualizar
        taxInfoData = {
          taxInfo: {
            update: {
              rfc: parsed.taxInfo.rfc || null,
              businessName: businessName,
              postalCode: parsed.taxInfo.postalCode || null,
              taxRegime: parsed.taxInfo.taxRegime || null,
              cfdiUse: parsed.taxInfo.cfdiUse || null,
              paymentMethod: parsed.taxInfo.paymentMethod || null,
              paymentForm: parsed.taxInfo.paymentForm || null,
              billingEmail: parsed.taxInfo.billingEmail || null,
              address: parsed.taxInfo.address || null,
            }
          }
        };
      } else {
        // Si no existe taxInfo, crear
        taxInfoData = {
          taxInfo: {
            create: {
              rfc: parsed.taxInfo.rfc || null,
              businessName: businessName,
              postalCode: parsed.taxInfo.postalCode || null,
              taxRegime: parsed.taxInfo.taxRegime || null,
              cfdiUse: parsed.taxInfo.cfdiUse || null,
              paymentMethod: parsed.taxInfo.paymentMethod || null,
              paymentForm: parsed.taxInfo.paymentForm || null,
              billingEmail: parsed.taxInfo.billingEmail || null,
              address: parsed.taxInfo.address || null,
            }
          }
        };
      }
    }

    await db.client.update({
      where: { id: cid },
      data: {
        ...clientData,
        ...taxInfoData
      }
    });
    
    return NextResponse.json(
      { message: `Cliente #${cid} modificado correctamente` },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Teléfono o documento ya existe' },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Cliente no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}