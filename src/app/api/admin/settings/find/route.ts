// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";

// ----------------------------------------------------------------------

//* GET COMPANY SETTINGS
export async function GET() {
    try {
        const existingSettings = await db.setting.findUnique({
            where: { id: 1 },
            omit: {
                id: true
            }
        });

        return NextResponse.json(
            existingSettings || [],
            { status: 200 }
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