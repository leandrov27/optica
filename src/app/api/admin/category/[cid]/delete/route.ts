// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";

// ----------------------------------------------------------------------

//* DELETE CATEGORY
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

        const existingCategory = await db.category.findUnique({
            where: { id: cid },
        });

        if (!existingCategory) {
            return NextResponse.json(
                { message: 'Categoría no encontrada' },
                { status: 404 }
            );
        }

        await db.category.delete({
            where: { id: cid },
        });

        return NextResponse.json(
            { message: `Categoría ${existingCategory.name} eliminada con éxito` },
            { status: 200 }
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Categoría no encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}