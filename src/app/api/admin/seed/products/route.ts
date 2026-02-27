// node
import path from 'path';
// next
import { NextResponse } from 'next/server';
// libs
import db from 'src/libs/prisma';
// config
import { JWT_SECRET } from 'src/config/config-server';
// pkgs
import * as XLSX from 'xlsx';

// ----------------------------------------------------------------------

export async function POST(request: Request) {
  const token = request.headers.get('authorization');
  if (token !== `Bearer ${JWT_SECRET}`) {
    return NextResponse.json({ error: 'OPERACIÓN NO AUTORIZADA' }, { status: 401 });
  }

  try {
    // 1. Crear categoría por defecto si no existe
    console.log('🔍 Verificando existencia de categoría ID 1...');

    const defaultCategory = await db.category.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Lentes',
      },
    });

    console.log(`✅ Categoría ID 1: ${defaultCategory.name}`);

    // Ruta del archivo Excel
    const fileName = 'productos.xlsx';
    const filePath = path.join(process.cwd(), 'public', 'data', fileName);
    console.log(`📂 Leyendo archivo: ${filePath}`);

    // Leer el Excel
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);
    console.log(`📊 Total filas en Excel: ${rows.length}`);

    // Procesar datos
    const data = rows
      .map((row, index) => {
        // Extraer valores del Excel
        const codeInExcel = row.codigo;
        const idCategoryInExcel = row.id_categoria;
        const idSatCodeInExcel = row.id_sat_code;
        const descriptionInExcel = row.descripcion;
        const priceInExcel = row.precio;
        const notesInExel = row.notas;

        // Validar campos requeridos
        if (
          !codeInExcel ||
          !idCategoryInExcel ||
          priceInExcel === undefined ||
          priceInExcel === null
        ) {
          return null;
        }

        // Crear objeto para la BD
        return {
          code: String(codeInExcel).trim(),
          categoryId: parseInt(idCategoryInExcel) || 1,
          description: String(descriptionInExcel).trim(),
          price: Number(priceInExcel) || 0,
          notes: notesInExel ? String(notesInExel).trim() : null,
          satCodeId: idSatCodeInExcel ? parseInt(idSatCodeInExcel) : null,
        };
      })
      .filter(Boolean);

    // Insertar todos los nuevos
    const seedResult = await db.product.createMany({
      data: data as any,
      skipDuplicates: true, // Ignorar duplicados
    });

    return NextResponse.json({
      message: 'Importación completada',
      registrosInsertados: seedResult.count,
      totalEnExcel: rows.length,
    });
  } catch (error: any) {
    console.error('🔥 Error en la importación:', error);

    // Mensajes de error más específicos
    if (error.code === 'ENOENT') {
      return NextResponse.json(
        {
          error: 'Archivo no encontrado',
          detalle: "Coloca el archivo 'productos.xlsx' en la carpeta /public/data/",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Error en la importación',
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}
