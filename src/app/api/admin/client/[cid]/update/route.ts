// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { CreateUpdateClientSchema, type ICreateUpdateClientPayload } from "src/core/schemas";

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
    const data: ICreateUpdateClientPayload = await request.json();
    const validationSchema = CreateUpdateClientSchema.safeParse(data);

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

    const existingClient = await db.client.findUnique({
      where: { id: cid },
      include: {
        taxInfo: true,
        diagnoses: true
      }
    });

    if (!existingClient) {
      return NextResponse.json(
        { message: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

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

    let taxInfoData = {};

    if (parsed.enableTaxInfo) {
      const businessName = parsed.businessName || `${parsed.firstName} ${parsed.lastName}`;
      if (existingClient.taxInfo) {
        taxInfoData = {
          taxInfo: {
            update: {
              rfc: parsed.rfc || null,
              businessName,
              postalCode: parsed.postalCode || null,
              taxRegime: parsed.taxRegime || null,
              cfdiUse: parsed.cfdiUse || null,
              paymentMethod: parsed.paymentMethod || null,
              paymentForm: parsed.paymentForm || null,
              billingEmail: parsed.billingEmail || null,
              address: parsed.address || null,
            },
          },
        };
      } else {
        taxInfoData = {
          taxInfo: {
            create: {
              rfc: parsed.rfc || null,
              businessName,
              postalCode: parsed.postalCode || null,
              taxRegime: parsed.taxRegime || null,
              cfdiUse: parsed.cfdiUse || null,
              paymentMethod: parsed.paymentMethod || null,
              paymentForm: parsed.paymentForm || null,
              billingEmail: parsed.billingEmail || null,
              address: parsed.address || null,
            },
          },
        };
      }
    }

    await db.$transaction(async (tx) => {
      await tx.client.update({
        where: { id: cid },
        data: {
          ...clientData,
          ...taxInfoData,
        },
      });

      await tx.diagnosis.deleteMany({
        where: { clientId: cid },
      });

      if (parsed.diagnoses?.length) {
        await tx.diagnosis.createMany({
          data: parsed.diagnoses.map((diag) => ({
            clientId: cid,
            date: diag.date || '',
            leftAxis: diag.leftAxis || null,
            leftSphere: diag.leftSphere || null,
            leftCylinder: diag.leftCylinder || null,
            rightAxis: diag.rightAxis || null,
            rightSphere: diag.rightSphere || null,
            rightCylinder: diag.rightCylinder || null,
            addition: diag.addition || null,
            notes: diag.notes || null,
          })),
        });
      }
    });

    return NextResponse.json(
      { message: `Cliente #${cid} actualizado correctamente` },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Teléfono, RFC o email ya existe' },
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