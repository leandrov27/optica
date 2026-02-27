// next
import { NextResponse } from 'next/server';
// libs
import db from 'src/libs/prisma';
// config
import { ADMIN_PASSWORD, ADMIN_PHONE, JWT_SECRET } from 'src/config/config-server';
import { SOFT_NAME } from 'src/config/config-public';
// pkgs
import bcrypt from 'bcryptjs';

// ----------------------------------------------------------------------

//* SEED DATABASE
export async function POST(request: Request) {
  const token = request.headers.get('authorization');

  if (token !== `Bearer ${JWT_SECRET}`) {
    return NextResponse.json({ error: 'OPERACIÓN NO AUTORIZADA' }, { status: 401 });
  }

  try {
    // --- Crear empresa si no existe ---
    await db.setting.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: SOFT_NAME,
        address: 'Mexico City',
        currencyCode: 'MXN',
        localeCode: 'es-MX',
        currencySymbol: '$',
        phone: ADMIN_PHONE,
      },
    });

    console.log('✅ Ajustes iniciales creados o ya existían');

    // --- Hash de la contraseña ---
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const existingUser = await db.user.findFirst({
      where: { phone: ADMIN_PHONE },
    });

    if (existingUser) {
      await db.user.update({
        where: { id: existingUser.id },
        data: {
          phone: ADMIN_PHONE,
          password: hashedPassword,
          firstName: 'Administrador',
          lastName: 'Maestro',
          displayName: 'Administrador Maestro',
          role: 'ADMIN',
          status: 'ACTIVO',
        },
      });
    } else {
      await db.user.create({
        data: {
          firstName: 'Administrador',
          lastName: 'Maestro',
          displayName: 'Administrador Maestro',
          phone: ADMIN_PHONE,
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVO',
        },
      });
    }

    console.log('✅ Usuario principal creado o actualizado.');

    return NextResponse.json({ message: 'Siembra completada con éxito' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
