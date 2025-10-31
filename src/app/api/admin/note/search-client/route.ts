// next
import { NextRequest, NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";

// ----------------------------------------------------------------------

//* SEARCH CLIENT
export async function GET(request: NextRequest) {
    const tokenVerification = verifyTokenHasRole(request, 'ADMIN');
    if (!tokenVerification.isValid) {
        return NextResponse.json(
            { message: tokenVerification.message },
            { status: tokenVerification.status }
        );
    }

    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10", 10)

    try {
        const clients = await db.client.findMany({
            where: {
                OR: [
                    { displayName: { contains: q } },
                    { phone: { contains: q } },
                    { email: { contains: q } },
                    {
                        taxInfo: {
                            OR: [
                                { rfc: { contains: q } },
                                { businessName: { contains: q } },
                            ],
                        },
                    },
                ]
            },
            select: {
                id: true,
                displayName: true,
                phone: true,
                type: true,
            },
            take: limit,
            orderBy: { displayName: 'asc' },
        })

        return NextResponse.json(
            { clients },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}