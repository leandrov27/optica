// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { UpdateUserSchema, type IUpdateUserPayload } from "src/core/schemas";

// ----------------------------------------------------------------------

//* UPDATE USER
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
    const data: IUpdateUserPayload = await request.json();
    const validationSchema = UpdateUserSchema.safeParse(data);

    if (!validationSchema.success) {
      const errorMessages = validationSchema.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');

      return NextResponse.json(
        { message: errorMessages },
        { status: 400 }
      );
    }

    if (uid === 1 && data.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'No está permitido modificar el rol del usuario administrador principal' },
        { status: 401 }
      );
    }

    const parsed = validationSchema.data;

    await db.user.update({
      where: { id: uid },
      data: {
        ...parsed,
        displayName: `${parsed.firstName} ${parsed.lastName}`
      },
      select: {
        id: true,
        phone: true,
        document: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: `Usuario #${uid} modificado correctamente` },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Teléfono o documento ya existe' },
        { status: 409 }
      );
    }
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