// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// pkgs
import bcrypt from 'bcryptjs';
// schemas
import { CreateUserSchema, type ICreateUserPayload } from "src/core/schemas";

// ----------------------------------------------------------------------

//* CREATE USER
export async function POST(request: Request) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const data: ICreateUserPayload = await request.json();
        const validationSchema = CreateUserSchema.safeParse(data);

        if (!validationSchema.success) {
            const errorMessages = validationSchema.error.issues
                .map((err) => `${err.path.join('.')}: ${err.message}`)
                .join('; ');

            return NextResponse.json(
                { message: errorMessages },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const parsed = validationSchema.data;

        await db.user.create({
            data: {
                ...parsed,
                displayName: `${parsed.firstName} ${parsed.lastName}`,
                password: hashedPassword,
            },
            select: {
                id: true,
                phone: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            { message: 'Usuario registrado correctamente' },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'Teléfono o documento ya existe' },
                { status: 409 }
            );
        }
        
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}