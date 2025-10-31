// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";

// ----------------------------------------------------------------------

//* DELETE USER
export async function DELETE(request: Request, { params }: { params: { uid: string } }) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const uid = Number(params.uid);

        if (isNaN(uid)) {
            return NextResponse.json(
                { message: 'ID debe ser un número' },
                { status: 400 }
            );
        }

        if (uid === 1) {
            return NextResponse.json(
                { message: 'No está permitido eliminar el usuario administrador principal' },
                { status: 401 }
            );
        }

        const existingUser = await db.user.findUnique({
            where: { id: uid },
        });

        if (!existingUser) {
            return NextResponse.json(
                { message: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        await db.user.delete({
            where: { id: uid },
        });

        return NextResponse.json(
            { message: `Usuario #${uid} eliminado con éxito` },
            { status: 200 }
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}