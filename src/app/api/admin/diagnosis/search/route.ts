// next
import { NextRequest, NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";

// ----------------------------------------------------------------------

//* SEARCH DIAGNOSES BY CLIENT ID
export async function GET(request: NextRequest) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get("id");

    // Validar que el clientId existe y es un número
    if (!clientId || isNaN(Number(clientId))) {
        return NextResponse.json(
            { message: "ID de cliente no válido" },
            { status: 400 }
        );
    }

    try {
        const diagnoses = await db.diagnosis.findMany({
            where: {
                clientId: Number(clientId)
            },
            select: {
                id: true,
                date: true,
                rightSphere: true,
                rightCylinder: true,
                rightAxis: true,
                leftSphere: true,
                leftCylinder: true,
                leftAxis: true,
                addition: true,
                notes: true,
                clientId: true,
            },
            orderBy: {
                date: 'desc'
            }
        });

        return NextResponse.json(
            {
                diagnoses,
                count: diagnoses.length
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Error interno del servidor' },
            { status: 500 }
        );
    }
}