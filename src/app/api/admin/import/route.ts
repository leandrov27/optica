// node
import path from "path";
// next
import { NextResponse } from "next/server";
// libs
import db from "src/libs/prisma";
// config
import { JWT_SECRET } from "src/config/config-server";
// pkgs
import * as XLSX from "xlsx";

// ----------------------------------------------------------------------

export async function POST(request: Request) {
    const token = request.headers.get("authorization");

    if (token !== `Bearer ${JWT_SECRET}`) {
        return NextResponse.json({ error: "OPERACIÓN NO AUTORIZADA" }, { status: 401 });
    }

    try {
        // Ruta del archivo Excel
        const filePath = path.join(process.cwd(), "public", "data", "catalogo_sat.xlsx");

        // Leer el Excel
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        // Preparar datos
        const data = rows
            .map(row => {
                const name = row.name || "";
                const code = row.code_sat || "";

                if (!name || !code) return null;

                return {
                    name: String(name).trim(),
                    codeSat: String(code).trim(),
                };
            })
            .filter(Boolean);

        // Insertar todos los nuevos
        const result = await db.satCode.createMany({
            data: data as any,
            skipDuplicates: true, // Ignorar duplicados
        });

        return NextResponse.json({
            message: "Importación completada",
            registrosInsertados: result.count,
            totalEnExcel: rows.length
        });
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: error.message || 'Error en la importación' },
            { status: 500 }
        );
    }
}