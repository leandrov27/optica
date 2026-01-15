// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { CreateProductSchema, type ICreateProductPayload } from "src/core/schemas";
// generated
import { Prisma } from "prigen/client";

// ----------------------------------------------------------------------

function generateProductCode() {
    return `PROD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

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
        const productData = {
            ...parsed,
            code: parsed.code ?? generateProductCode(),
        };

        await db.product.create({
            data: {
                ...productData,
                price: new Prisma.Decimal(parsed.price),
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