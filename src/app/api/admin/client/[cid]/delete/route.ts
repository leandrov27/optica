// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";

// ----------------------------------------------------------------------

//* DELETE CLIENT
export async function DELETE(request: Request, { params }: { params: { cid: string } }) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const cid = Number(params.cid);

        if (isNaN(cid)) {
            return NextResponse.json(
                { message: 'ID debe ser un número' },
                { status: 400 }
            );
        }

        const existingClient = await db.client.findUnique({
            where: { id: cid },
        });

        if (!existingClient) {
            return NextResponse.json(
                { message: 'Cliente no encontrado' },
                { status: 404 }
            );
        }

        await db.client.delete({
            where: { id: cid },
        });

        return NextResponse.json(
            { message: `Cliente #${cid} eliminado con éxito` },
            { status: 200 }
        );
    } catch (error) {
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