// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { CreateCategorySchema, type ICreateCategoryPayload } from "src/core/schemas";

// ----------------------------------------------------------------------

//* CREATE CATEGORY
export async function POST(request: Request) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const data: ICreateCategoryPayload = await request.json();
        const validationSchema = CreateCategorySchema.safeParse(data);

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

        await db.category.create({ data: parsed });

        return NextResponse.json(
            { message: 'Categoría registrada correctamente' },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'El nombre ingresado ya existe' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}