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
    const fileName = 'clientes_fiscales.xlsx';
    const filePath = path.join(process.cwd(), 'public', 'data', fileName);
    console.log(`📂 Leyendo archivo fiscal: ${filePath}`);

    // Leer el Excel
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);
    console.log(`📊 Total filas en Excel fiscal: ${rows.length}`);

    // Primero, obtener todos los clientes existentes para mapear
    const clientesExistentes = await db.client.findMany({
      select: {
        id: true,
        displayName: true,
        phone: true,
        email: true,
        type: true, // ← Importante: necesitamos el type actual
      },
    });

    // Crear múltiples mapas para diferentes estrategias de búsqueda
    const mapaPorDisplayName = new Map();
    const mapaPorDisplayNameNormalizado = new Map();

    clientesExistentes.forEach((cliente) => {
      // Mapa 1: DisplayName exacto
      const displayNameClean = cliente.displayName.trim().toLowerCase();
      mapaPorDisplayName.set(displayNameClean, cliente);

      // Mapa 2: DisplayName normalizado (sin acentos, espacios extra)
      const displayNameNormalizado = normalizarTexto(cliente.displayName);
      mapaPorDisplayNameNormalizado.set(displayNameNormalizado, cliente);
    });

    console.log(`🗺️ Total clientes en BD: ${clientesExistentes.length}`);

    // Contadores
    let clientesActualizados = 0;
    let typeActualizadoABusiness = 0;
    let infoFiscalCreada = 0;
    let infoFiscalActualizada = 0;
    let clientesNoEncontrados = 0;
    let coincidenciasPorDisplayName = 0;
    let errores = [];

    // Función para normalizar texto (quitar acentos, espacios)
    function normalizarTexto(texto: any) {
      if (!texto) return '';
      return texto
        .toString()
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/\s+/g, ' ') // Unificar espacios
        .replace(/[^\w\s]/g, '') // Eliminar caracteres especiales
        .trim();
    }

    // Función para buscar cliente
    function buscarCliente(displayNameExcel: any) {
      if (!displayNameExcel) return null;

      const displayNameExcelClean = String(displayNameExcel).trim().toLowerCase();
      const displayNameExcelNormalizado = normalizarTexto(displayNameExcel);

      // 1. Búsqueda exacta
      let cliente = mapaPorDisplayName.get(displayNameExcelClean);
      if (cliente) {
        coincidenciasPorDisplayName++;
        return cliente;
      }

      // 2. Búsqueda normalizada
      cliente = mapaPorDisplayNameNormalizado.get(displayNameExcelNormalizado);
      if (cliente) {
        coincidenciasPorDisplayName++;
        return cliente;
      }

      // 3. Búsqueda parcial (como último recurso)
      for (const [key, clienteBD] of mapaPorDisplayNameNormalizado.entries()) {
        if (
          displayNameExcelNormalizado.includes(key) ||
          key.includes(displayNameExcelNormalizado)
        ) {
          if (displayNameExcelNormalizado.length > 3 && key.length > 3) {
            // Evitar coincidencias muy cortas
            console.log(
              `🔍 Coincidencia parcial: "${displayNameExcel}" -> "${clienteBD.displayName}"`
            );
            return clienteBD;
          }
        }
      }

      return null;
    }

    // Procesar fila por fila
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        // Extraer valores
        const displayNameExcel = row.display_name || row.nombre || row.nombre_apellido;
        const rfcInExcel = row.rfc;
        const cpInExcel = row.cp;
        const razonSocialInExcel = row.razon_social;
        const regimenFiscalInExcel = row.regimen_fiscal;
        const usoCfdiInExcel = row.uso_cfdi;
        const metodoPagoInExcel = row.metodo_pago;
        const correoFacturacionInExcel = row.correo_facturacion;
        const domicilioInExcel = row.domicilio;

        // Validar campo requerido
        if (!displayNameExcel) {
          errores.push({
            fila: i + 2,
            motivo: 'Nombre requerido (display_name, nombre o nombre_apellido)',
            datos: row,
          });
          continue;
        }

        // Buscar cliente por displayName
        const clienteExistente = buscarCliente(displayNameExcel);

        if (!clienteExistente) {
          clientesNoEncontrados++;
          errores.push({
            fila: i + 2,
            motivo: `Cliente "${displayNameExcel}" no encontrado en la base de datos`,
            datos: {
              displayNameBuscado: displayNameExcel,
              sugerencia: 'Verifica que el nombre coincida exactamente con la importación anterior',
            },
          });
          continue;
        }

        // **ACTUALIZAR TYPE A BUSINESS SI TIENE DATOS FISCALES**
        // Verificar si el cliente tiene datos fiscales significativos
        const tieneDatosFiscales =
          rfcInExcel || cpInExcel || razonSocialInExcel || regimenFiscalInExcel || usoCfdiInExcel;

        let typeActualizado = false;

        if (tieneDatosFiscales && clienteExistente.type !== 'BUSINESS') {
          // Actualizar el type del cliente a BUSINESS
          await db.client.update({
            where: { id: clienteExistente.id },
            data: { type: 'BUSINESS' },
          });
          typeActualizadoABusiness++;
          typeActualizado = true;
          console.log(`🔄 Cliente ${clienteExistente.displayName} actualizado a BUSINESS`);
        }

        // Preparar datos de información fiscal
        const taxInfoData: any = {
          clientId: clienteExistente.id,
          rfc: rfcInExcel ? String(rfcInExcel).trim().toUpperCase() : null,
          postalCode: cpInExcel ? String(cpInExcel).trim() : null,
          businessName: razonSocialInExcel
            ? String(razonSocialInExcel).trim()
            : clienteExistente.displayName,
          taxRegime: regimenFiscalInExcel ? String(regimenFiscalInExcel).trim() : '601',
          cfdiUse: usoCfdiInExcel ? String(usoCfdiInExcel).trim().toUpperCase() : null,
          paymentMethod: metodoPagoInExcel ? String(metodoPagoInExcel).trim().toUpperCase() : 'PUE',
          billingEmail: correoFacturacionInExcel
            ? String(correoFacturacionInExcel).trim().toLowerCase()
            : clienteExistente.email || null,
          address: domicilioInExcel ? String(domicilioInExcel).trim() : null,
        };

        // Verificar si ya existe información fiscal
        const taxInfoExistente = await db.taxInfo.findUnique({
          where: { clientId: clienteExistente.id },
        });

        if (taxInfoExistente) {
          // Actualizar solo campos no nulos del Excel
          const datosActualizacion = {};
          Object.keys(taxInfoData).forEach((key) => {
            if (taxInfoData[key] !== null && taxInfoData[key] !== undefined) {
              if (key !== 'clientId') {
                // No actualizar la clave
                datosActualizacion[key] = taxInfoData[key];
              }
            }
          });

          if (Object.keys(datosActualizacion).length > 0) {
            await db.taxInfo.update({
              where: { clientId: clienteExistente.id },
              data: datosActualizacion,
            });
            infoFiscalActualizada++;
          }
        } else {
          // Crear nueva información fiscal
          await db.taxInfo.create({
            data: taxInfoData,
          });
          infoFiscalCreada++;
        }

        clientesActualizados++;

        // Log cada 50 registros
        if ((i + 1) % 50 === 0) {
          console.log(`✅ Procesados ${i + 1}/${rows.length} registros fiscales`);
          console.log(`🏢 Type actualizados a BUSINESS: ${typeActualizadoABusiness}`);
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

    // Generar reporte de coincidencias
    const reporteCoincidencias = {
      totalClientesBD: clientesExistentes.length,
      totalRegistrosExcel: rows.length,
      coincidenciasEncontradas: clientesActualizados,
      coincidenciasPorDisplayName,
      clientesActualizadosABusiness: typeActualizadoABusiness,
      porcentajeExito:
        rows.length > 0 ? ((clientesActualizados / rows.length) * 100).toFixed(2) + '%' : '0%',
    };

    return NextResponse.json({
      message: 'Importación fiscal completada',
      estadisticas: {
        totalEnExcel: rows.length,
        clientesActualizados,
        typeActualizadoABusiness,
        infoFiscalCreada,
        infoFiscalActualizada,
        clientesNoEncontrados,
        errores: errores.length,
      },
      reporteCoincidencias,
      valoresPorDefectoAplicados: {
        regimen_fiscal: '601',
        metodo_pago: 'PUE',
        type_actualizado_a: 'BUSINESS (si tiene datos fiscales)',
      },
      detallesErrores: errores.length > 0 ? errores.slice(0, 20) : undefined,
      recomendaciones: [
        'Clientes con datos fiscales han sido actualizados a type: BUSINESS',
        'Si un cliente ya era BUSINESS, no se cambió',
        'Clientes sin datos fiscales mantienen su type original',
      ],
    });
  } catch (error: any) {
    console.error('🔥 Error en la importación fiscal:', error);

    if (error.code === 'ENOENT') {
      return NextResponse.json(
        {
          error: 'Archivo no encontrado',
          detalle: "Coloca el archivo 'clientes_fiscales.xlsx' en la carpeta /public/data/",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Error en la importación fiscal',
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}
