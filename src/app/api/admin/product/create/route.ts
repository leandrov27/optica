// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { CreateProductSchema, type ICreateProductPayload } from "src/core/schemas";
// generated
import { Decimal } from "src/generated/prisma/runtime/client";

// ----------------------------------------------------------------------

//* CREATE PRODUCT
export async function POST(request: Request) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const data: ICreateProductPayload = await request.json();
        const validationSchema = CreateProductSchema.safeParse(data);

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

        await db.product.create({
            data: {
                ...parsed,
                price: new Decimal(parsed.price),
            },
        });

        return NextResponse.json(
            { message: 'Producto registrado correctamente' },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'El código ingresado ya existe en otro producto' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}