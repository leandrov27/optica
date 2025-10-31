// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { CreateUpdateClientWithTaxInfoSchema, type ICreateUpdateClientWithTaxInfoPayload } from "src/core/schemas";

// ----------------------------------------------------------------------

//* CREATE CLIENT
export async function POST(request: Request) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
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

        // Preparar los datos para la creación
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

        // Si enableTaxInfo es true, agregar la relación con taxInfo
        if (parsed.enableTaxInfo) {
            // Asegurar que businessName tenga un valor por defecto si es undefined
            const businessName = parsed.taxInfo.businessName || `${parsed.firstName} ${parsed.lastName}`;

            await db.client.create({
                data: {
                    ...clientData,
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
                },
            });
        } else {
            // Crear solo el cliente sin información fiscal
            await db.client.create({
                data: clientData
            });
        }

        return NextResponse.json(
            { message: 'Cliente registrado correctamente' },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'Teléfono o email ya existe' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}