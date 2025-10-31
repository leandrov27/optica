// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";

// ----------------------------------------------------------------------

//* DELETE PRODUCT
export async function DELETE(request: Request, { params }: { params: { pid: string } }) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const pid = Number(params.pid);

        if (isNaN(pid)) {
            return NextResponse.json(
                { message: 'ID debe ser un número' },
                { status: 400 }
            );
        }

        const existingProduct = await db.product.findUnique({
            where: { id: pid },
        });

        if (!existingProduct) {
            return NextResponse.json(
                { message: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        await db.product.delete({
            where: { id: pid },
        });

        return NextResponse.json(
            { message: `Producto #${existingProduct.code} eliminado con éxito` },
            { status: 200 }
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}