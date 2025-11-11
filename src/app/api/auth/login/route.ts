// next
import { NextRequest, NextResponse } from 'next/server';
// libs
import db from 'src/libs/prisma';
// pkgs
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// schemas
import { type ILoginPayload } from 'src/core/schemas';
// config
import { JWT_SECRET } from 'src/config/config-server';

// ----------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const { identity, password }: Partial<ILoginPayload> = await request.json();

    if (!identity || !password) {
      return NextResponse.json(
        { message: 'Se requieren ambos campos: correo y contraseña' },
        { status: 400 }
      );
    }

    const user = await db.user.findFirst({
      where: { phone: identity },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        password: true,
        role: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Estas credenciales no coinciden con nuestros registros.' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Estas credenciales no coinciden con nuestros registros.' },
        { status: 401 }
      );
    }

    const { password: _, ...userSafe } = user;
    const accessToken = jwt.sign({
      id: user.id,
      phone: user.phone,
      role: user.role
    }, JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({
      message: 'Inicio de sesión exitoso.',
      accessToken,
      user: userSafe,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error interno del servidor: ' + error },
      { status: 500 }
    );
  }
}