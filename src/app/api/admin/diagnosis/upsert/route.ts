// next
import { NextRequest, NextResponse } from "next/server";
import { CreateUpdateDiagnosisSchema, ICreateUpdateDiagnosisPayload } from "src/core/schemas";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";

// ----------------------------------------------------------------------

//* UPSERT CLIENT DIAGNOSES
export async function POST(request: NextRequest) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const data: ICreateUpdateDiagnosisPayload = await request.json();
        const validationSchema = CreateUpdateDiagnosisSchema.safeParse(data);

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
        const { clientId, diagnoses } = parsed;

        /*
        if (!diagnoses || diagnoses.length === 0) {
            return NextResponse.json(
                { message: "No hay diagnósticos para procesar." },
                { status: 400 }
            );
        }*/

        // 🔹 Paso 1: eliminar todos los diagnósticos previos del cliente
        await db.diagnosis.deleteMany({
            where: { clientId },
        });

        // 🔹 Paso 2: insertar los nuevos diagnósticos
        await db.$transaction(async (tx) => {
            // 1️⃣ Eliminar todos los diagnósticos del cliente
            await tx.diagnosis.deleteMany({ where: { clientId } });

            // 2️⃣ Insertar los nuevos diagnósticos
            await tx.diagnosis.createMany({
                data: diagnoses.map((diag) => ({
                    clientId,
                    date: diag.date || "",
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
        });

        return NextResponse.json(
            { message: `Diagnósticos actualizados correctamente.` },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}