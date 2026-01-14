import path from "path";
import { NextResponse } from "next/server";
import db from "src/libs/prisma";
import * as XLSX from "xlsx";
import { JWT_SECRET } from "src/config/config-server";

// PRODUCTOS IMPORT DATA ------------------------------------------------
/*const data = rows
    .map((row, index) => {
        // Extraer valores del Excel
        const codigo = row.codigo;
        const descripcion = row.descripcion;
        const precio = row.precio;
        const notas = row.notas;
        const id_categoria = row.id_categoria;
        const id_sat_code = row.id_sat_code;

        // Validar campos requeridos
        if (!codigo || !descripcion || precio === undefined || precio === null) {
            return null;
        }

        // Crear objeto para la BD
        return {
            code: String(codigo).trim(),
            description: String(descripcion).trim(),
            price: Number(precio) || 0,
            notes: notas ? String(notas).trim() : null,
            categoryId: parseInt(id_categoria) || 1,
            satCodeId: id_sat_code ? parseInt(id_sat_code) : null
        };
    })
    .filter(Boolean);
*/
// ----------------------------------------------------------------------

export async function POST(request: Request) {
    const token = request.headers.get("authorization");
    if (token !== `Bearer ${JWT_SECRET}`) {
        return NextResponse.json({ error: "OPERACIÓN NO AUTORIZADA" }, { status: 401 });
    }

    try {
        // Ruta del archivo Excel
        //const fileName = "productos.xlsx";
        //const fileName = "clientes.xlsx";
        const fileName = "clientes_fiscales.xlsx";
        const filePath = path.join(process.cwd(), "public", "data", fileName);
        console.log(`📂 Leyendo archivo: ${filePath}`);

        // Leer el Excel
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);
        console.log(`📊 Total filas en Excel: ${rows.length}`);
        // Procesar datos
        const data = rows
            .map((row) => {
                // Verificar nombres exactos de columnas
                console.log("Columnas disponibles:", Object.keys(row));

                const display_name = row.display_name || row["display_name"] || row["Display Name"] || row["DISPLAY_NAME"];
                const regimen_fiscal = row.regimen_fiscal;
                const uso_cfdi = row.uso_cfdi;
                const metodo_pago = row.metodo_pago;
                const telefono = row.phone || row["phone"] || row["Phone"] || row["PHONE"] || row["telefono"] || row["Telefono"];
                const type = row.type || row["type"] || row["Type"] || row["TYPE"] || "INDIVIDUAL";
                const rfc = row.rfc || row["rfc"] || row["Rfc"] || row["RFC"];
                const cp = row.cp || row["cp"] || row["Cp"] || row["CP"] || row["codigo_postal"] || row["postal_code"];

                // Validar campos requeridos
                if (!display_name || !telefono) {
                    console.log(`❌ Fila inválida: display_name="${display_name}", telefono="${telefono}"`);
                    return null;
                }

                console.log(`✅ Fila válida: ${display_name} - ${telefono}`);

                return {
                    display_name,
                    telefono,
                    type,
                    rfc,
                    cp
                };
            })
            .filter(Boolean);

        console.log(`✅ Filas válidas para procesar: ${data.length}`);
        if (data.length === 0) {
            return NextResponse.json({
                error: "No hay datos válidos en el Excel. Verifica los nombres de las columnas.",
                columnasEsperadas: ["display_name", "phone", "type", "rfc", "cp"]
            }, { status: 400 });
        }

        // Insertar clientes uno por uno
        let insertados = 0;
        let actualizados = 0;
        let errores = 0;

        for (const item of data) { // Procesa solo 10 para debug
            console.log(`\n🔍 Procesando: ${item?.display_name} (${item?.telefono})`);

            try {
                // Verificar si ya existe el cliente
                const clienteExistente = await db.client.findUnique({
                    where: { phone: String(item?.telefono).trim() }
                });

                let cliente;
                let esNuevo = false;

                if (clienteExistente) {
                    // Actualizar cliente existente
                    cliente = await db.client.update({
                        where: { id: clienteExistente.id },
                        data: {
                            displayName: String(item?.display_name).trim(),
                            type: item?.type as any,
                        }
                    });
                    actualizados++;
                    console.log(`✏️  Cliente ACTUALIZADO: ${item?.display_name}`);
                } else {
                    // Crear nuevo cliente
                    cliente = await db.client.create({
                        data: {
                            displayName: String(item?.display_name).trim(),
                            phone: String(item?.telefono).trim(),
                            type: item?.type as any,
                        }
                    });
                    esNuevo = true;
                    insertados++;
                    console.log(`➕ Cliente NUEVO: ${item?.display_name}`);
                }

                // Si tiene RFC o CP, manejar info fiscal
                if (item?.rfc || item?.cp) {
                    const infoFiscalExistente = await db.taxInfo.findUnique({
                        where: { clientId: cliente.id }
                    });

                    if (infoFiscalExistente) {
                        // Actualizar info fiscal existente
                        await db.taxInfo.update({
                            where: { clientId: cliente.id },
                            data: {
                                rfc: item?.rfc ? String(item?.rfc).trim() : null,
                                businessName: String(item?.display_name).trim(),
                                postalCode: item?.cp ? String(item?.cp).trim() : null,
                            }
                        });
                        console.log(`   📄 Info fiscal ACTUALIZADA`);
                    } else {
                        // Crear nueva info fiscal
                        await db.taxInfo.create({
                            data: {
                                clientId: cliente.id,
                                rfc: item?.rfc ? String(item?.rfc).trim() : null,
                                businessName: String(item?.display_name).trim(),
                                postalCode: item?.cp ? String(item?.cp).trim() : null,
                            }
                        });
                        console.log(`   📄 Info fiscal CREADA`);
                    }
                }

            } catch (error: any) {
                errores++;
                console.error(`❌ Error procesando ${item?.telefono}:`, error.message);
                console.error("Detalle del error:", error);
            }
        }

        return NextResponse.json({
            message: "Importación completada (solo 10 filas procesadas para debug)",
            clientesInsertados: insertados,
            clientesActualizados: actualizados,
            totalEnExcel: rows.length,
            clientesConInfoFiscal: data.filter(item => item?.rfc || item?.cp).length,
            errores: errores,
            siguientePaso: "Si esto funciona, quita el .slice(0, 10) para procesar todo"
        });

    } catch (error: any) {
        console.error("🔥 Error en la importación:", error);

        // Mensajes de error más específicos
        if (error.code === 'ENOENT') {
            return NextResponse.json(
                {
                    error: "Archivo no encontrado",
                    detalle: "Coloca el archivo 'productos.xlsx' en la carpeta /public/data/"
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                error: "Error en la importación",
                detalle: error.message
            },
            { status: 500 }
        );
    }
}