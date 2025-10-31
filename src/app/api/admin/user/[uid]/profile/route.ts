// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// pkgs
import bcrypt from 'bcryptjs';
// schemas
import { UpdateUserProfileSchema, type IUpdateUserProfilePayload } from "src/core/schemas";

// ----------------------------------------------------------------------

//* UPDATE USER PROFILE
export async function PUT(request: Request, { params }: { params: { uid: string } }) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const uid = Number(params.uid);
        const data: IUpdateUserProfilePayload = await request.json();
        const validationSchema = UpdateUserProfileSchema.safeParse(data);

        if (!validationSchema.success) {
            const errorMessages = validationSchema.error.issues
                .map((err) => `${err.path.join('.')}: ${err.message}`)
                .join('; ');

            return NextResponse.json(
                { message: errorMessages },
                { status: 400 }
            );
        }

        // Extraer campos con tipo explícito
        const { current_password, new_password, phone } = validationSchema.data;

        // Obtener el usuario actual
        const user = await db.user.findUnique({
            where: { id: uid },
            select: { password: true },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Preparar datos de actualización
        const updatePayload: {
            phone?: string;
            password?: string;
        } = {};

        // Actualizar teléfono si viene en los datos
        if (phone !== undefined) {
            updatePayload.phone = phone;
        }

        // Manejo de contraseña
        if (new_password) {
            if (!current_password) {
                return NextResponse.json(
                    { message: 'Debes proporcionar tu contraseña actual para cambiarla' },
                    { status: 400 }
                );
            }

            const passwordsMatch = await bcrypt.compare(current_password, user.password);

            if (!passwordsMatch) {
                return NextResponse.json(
                    { message: 'La contraseña actual es incorrecta' },
                    { status: 400 }
                );
            }

            updatePayload.password = await bcrypt.hash(new_password, 10);
        }

        // Actualizar el perfil del usuario
        await db.user.update({
            where: { id: uid },
            data: updatePayload,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(
            { message: 'Datos actualizados corretamente' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);

        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Ocurrió un error desconocido al actualizar el perfil' },
            { status: 400 }
        );
    }
}