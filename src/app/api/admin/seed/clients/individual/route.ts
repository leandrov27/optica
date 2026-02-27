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
    // Ruta del archivo Excel
    const fileName = 'clientes.xlsx';
    const filePath = path.join(process.cwd(), 'public', 'data', fileName);
    console.log(`📂 Leyendo archivo: ${filePath}`);

    // Leer el Excel
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);
    console.log(`📊 Total filas en Excel: ${rows.length}`);

    // Contadores para estadísticas
    let totalInsertados = 0;
    let totalConInfoFiscal = 0;
    let errores = [];

    // Procesar fila por fila para manejar transacciones
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        // Extraer valores del Excel
        const displayNameInExcel = row.display_name;
        const typeInExcel = row.type;
        const phoneInExcel = row.telefono;
        const rfcInExcel = row.rfc;
        const cpInExcel = row.cp;

        // Validar campos requeridos
        if (!displayNameInExcel || !typeInExcel || !phoneInExcel) {
          errores.push({
            fila: i + 2, // +2 porque Excel empieza en 1 y la fila 1 es cabecera
            motivo: 'Campos requeridos faltantes (display_name, type, telefono)',
            datos: row,
          });
          continue;
        }

        // Preparar datos del cliente
        const clienteData = {
          displayName: String(displayNameInExcel).trim(),
          type: String(typeInExcel).trim() || 'INDIVIDUAL',
          phone: String(phoneInExcel).trim(),
        };

        // Verificar si ya existe un cliente con el mismo teléfono
        const clienteExistente = await db.client.findUnique({
          where: { phone: clienteData.phone },
          include: { taxInfo: true },
        });

        if (clienteExistente) {
          // Si el cliente ya existe, actualizar/crear información fiscal si es necesario
          if ((rfcInExcel || cpInExcel) && !clienteExistente.taxInfo) {
            await db.taxInfo.upsert({
              where: { clientId: clienteExistente.id },
              update: {
                rfc: rfcInExcel ? String(rfcInExcel).trim() : null,
                postalCode: cpInExcel ? String(cpInExcel).trim() : null,
                businessName: clienteExistente.displayName,
              },
              create: {
                clientId: clienteExistente.id,
                rfc: rfcInExcel ? String(rfcInExcel).trim() : null,
                postalCode: cpInExcel ? String(cpInExcel).trim() : null,
                businessName: clienteExistente.displayName,
              },
            });
            totalConInfoFiscal++;
          }
          continue; // Saltar cliente existente
        }

        // Crear cliente e información fiscal en una transacción
        const result = await db.$transaction(async (tx) => {
          // Crear cliente
          const cliente = await tx.client.create({
            data: clienteData as any,
          });

          let taxInfo = null;

          // Crear información fiscal si hay RFC o CP
          if (rfcInExcel || cpInExcel) {
            taxInfo = await tx.taxInfo.create({
              data: {
                clientId: cliente.id,
                rfc: rfcInExcel ? String(rfcInExcel).trim() : null,
                postalCode: cpInExcel ? String(cpInExcel).trim() : null,
                businessName: cliente.displayName,
              },
            });
          }

          return { cliente, taxInfo };
        });

        totalInsertados++;
        if (result.taxInfo) totalConInfoFiscal++;

        // Log cada 50 registros
        if ((i + 1) % 50 === 0) {
          console.log(`✅ Procesados ${i + 1}/${rows.length} registros`);
        }
      } catch (error) {
        errores.push({
          fila: i + 2,
          motivo: error.message,
          datos: row,
        });
        console.error(`❌ Error en fila ${i + 2}:`, error);
      }
    }

    return NextResponse.json({
      message: 'Importación completada',
      estadisticas: {
        totalEnExcel: rows.length,
        clientesInsertados: totalInsertados,
        conInfoFiscal: totalConInfoFiscal,
        errores: errores.length,
        clientesExistentesOmitidos: rows.length - totalInsertados - errores.length,
      },
      detallesErrores: errores.length > 0 ? errores : undefined,
    });
  } catch (error: any) {
    console.error('🔥 Error general en la importación:', error);

    // Mensajes de error más específicos
    if (error.code === 'ENOENT') {
      return NextResponse.json(
        {
          error: 'Archivo no encontrado',
          detalle: "Coloca el archivo 'clientes.xlsx' en la carpeta /public/data/",
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
