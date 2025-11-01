// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { CreateUpdateClientSchema, type ICreateUpdateClientPayload } from "src/core/schemas";

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

        const diagnosesData = parsed.diagnoses.map(diagnose => ({
            date: diagnose.date ? diagnose.date : '',
            rightSphere: diagnose.rightSphere || null,
            rightCylinder: diagnose.rightCylinder || null,
            rightAxis: diagnose.rightAxis || null,
            leftSphere: diagnose.leftSphere || null,
            leftCylinder: diagnose.leftCylinder || null,
            leftAxis: diagnose.leftAxis || null,
            addition: diagnose.addition || null,
            notes: diagnose.notes || null,
        }));

        if (parsed.enableTaxInfo) {
            const businessName = parsed.businessName || `${parsed.firstName} ${parsed.lastName}`;

            await db.client.create({
                data: {
                    ...clientData,
                    taxInfo: {
                        create: {
                            rfc: parsed.rfc || null,
                            businessName: businessName,
                            postalCode: parsed.postalCode || null,
                            taxRegime: parsed.taxRegime || null,
                            cfdiUse: parsed.cfdiUse || null,
                            paymentMethod: parsed.paymentMethod || null,
                            paymentForm: parsed.paymentForm || null,
                            billingEmail: parsed.billingEmail || null,
                            address: parsed.address || null,
                        }
                    },
                    diagnoses: {
                        create: diagnosesData
                    }
                },
            });
        } else {
            await db.client.create({
                data: {
                    ...clientData,
                    diagnoses: {
                        create: diagnosesData
                    }
                }
            });
        }

        return NextResponse.json(
            { message: 'Cliente registrado correctamente' },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'Teléfono, RFC o email ya existen' },
                { status: 409 }
            );
        }
        
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}