// next
import { NextRequest, NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// utils
import { verifyTokenHasRole } from "src/utils/jwt-utils";

// ----------------------------------------------------------------------

//* SEARCH PRODUCT
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
        const products = await db.product.findMany({
            where: {
                OR: [
                    { description: { contains: q } },
                    { code: { contains: q } },
                ]
            },
            select: {
                id: true,
                description: true,
                price: true
            },
            take: limit,
            orderBy: { id: 'asc' },
        })

        return NextResponse.json(
            { products },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}