// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";

// ----------------------------------------------------------------------

//* DELETE NOTE
export async function DELETE(request: Request, { params }: { params: { nid: string } }) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const nid = Number(params.nid);

        if (isNaN(nid)) {
            return NextResponse.json(
                { message: 'ID debe ser un número' },
                { status: 400 }
            );
        }

        const existingNote = await db.saleNote.findUnique({
            where: { id: nid },
        });

        if (!existingNote) {
            return NextResponse.json(
                { message: 'Nota no encontrada' },
                { status: 404 }
            );
        }

        await db.saleNote.delete({
            where: { id: nid },
        });

        return NextResponse.json(
            { message: `Nota #${existingNote.id} eliminada con éxito` },
            { status: 200 }
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Nota no encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}