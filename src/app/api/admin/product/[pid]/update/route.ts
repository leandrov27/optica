// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { UpdateProductSchema, type IUpdateProductPayload } from "src/core/schemas";
// generated
import { Decimal } from "src/generated/prisma/runtime/library";

// ----------------------------------------------------------------------

//* UPDATE PRODUCT
export async function PUT(request: Request, { params }: { params: { pid: string } }) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const pid = Number(params.pid);
        const data: IUpdateProductPayload = await request.json();
        const validationSchema = UpdateProductSchema.safeParse(data);

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

        const updatedProduct = await db.product.update({
            where: { id: pid },
            data: {
                ...parsed,
                price: new Decimal(parsed.price),
            },
            select: {
                code: true
            }
        });

        return NextResponse.json(
            { message: `Producto #${updatedProduct.code} modificado correctamente` },
            { status: 201 }
        );
    } catch (error: any) {
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