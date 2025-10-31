// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";
// schemas
import { UpdateSettingsSchema, type IUpdateSettingsPayload } from "src/core/schemas";
import { handleImageVPS } from "src/utils/upload-vps";

// ----------------------------------------------------------------------

//* UPDATE COMPANY SETTINGS
export async function PUT(request: Request) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    try {
        const data: IUpdateSettingsPayload = await request.json();
        const validationSchema = UpdateSettingsSchema.safeParse(data);

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

        // traer logos antiguo (si existe)
        const existingAssets = await db.setting.findUnique({
            where: { id: 1 },
            select: {
                businessLogoUrl: true,
                companyLogoUrl: true
            }
        });

        if (!existingAssets) {
            return NextResponse.json({ message: "Ajustes del sistema no encontrados" }, { status: 404 });
        }

        const logoBusiness = await handleImageVPS(parsed.businessLogoUrl as string, existingAssets.businessLogoUrl ?? null);
        const logoCompany = await handleImageVPS(parsed.companyLogoUrl as string, existingAssets.companyLogoUrl ?? null);

        await db.setting.update({
            where: { id: 1 },
            data: {
                ...parsed,
                businessLogoUrl: logoBusiness,
                companyLogoUrl: logoCompany
            },
        });

        return NextResponse.json(
            { message: `Ajustes aplicados correctamente` },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'No se ha podido encontrar los ajustes del sistema.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}