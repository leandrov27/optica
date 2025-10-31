// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { UpdateCategorySchema, type IUpdateCategoryPayload } from "src/core/schemas";

// ----------------------------------------------------------------------

//* UPDATE CATEGORY
export async function PUT(request: Request, { params }: { params: { cid: string } }) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const cid = Number(params.cid);
        const data: IUpdateCategoryPayload = await request.json();
        const validationSchema = UpdateCategorySchema.safeParse(data);

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

        const updatedCategory = await db.category.update({
            where: { id: cid },
            data: parsed,
            select: {
                name: true
            }
        });

        return NextResponse.json(
            { message: `Categoría ${updatedCategory.name} modificada correctamente` },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'El nombre ingresado ya existe' },
                { status: 409 }
            );
        }

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