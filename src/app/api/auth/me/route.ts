// next
import { NextRequest, NextResponse } from 'next/server';
// libs
import db from 'src/libs/prisma';
// pkgs
import jwt from 'jsonwebtoken';

// utils
import { verifyToken } from 'src/utils/jwt-utils';

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json(
      { message: 'Token de acceso no proporcionado' },
      { status: 401 }
    );
  }

  try {
    const { isValid, message, status, decodedToken } = verifyToken(request);

    if (!isValid) {
      return NextResponse.json(
        { message: message || 'Token inválido' },
        { status: status || 401 }
      );
    }

    if (!decodedToken?.id) {
      return NextResponse.json(
        { message: 'Token no contiene información de usuario válida' },
        { status: 401 }
      );
    }

    const userId = Number(decodedToken.id);

    const user = await db.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        document: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth error:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { message: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}
