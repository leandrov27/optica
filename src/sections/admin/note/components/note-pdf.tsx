import { useMemo } from 'react';
import { Page, View, Text, Image, Document, Font, StyleSheet } from '@react-pdf/renderer';
// utils
import { formatDate } from 'src/utils/format-date';
import { LOGO_PLACEHOLDER_PATH } from 'src/utils/constants';
// libs
import dayjs from 'dayjs';
// schemas
import { type INoteByID } from 'src/core/schemas';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        col4: { width: '25%' },
        col6: { width: '50%' },
        col8: { width: '75%' },
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb16: { marginBottom: 16 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        label: { fontWeight: 'bold' }, // 👈 para negrita en etiquetas
        alignRight: { textAlign: 'right' },
        alignCenter: { textAlign: 'center' },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          padding: '40px 24px 120px 24px',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },
        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        },
        table: {
          display: 'flex',
          width: 'auto',
        },
        tableRow: {
          padding: '8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        tableCell_1: { width: '5%' },
        tableCell_3: { width: '35%' },
        tableCell_4: { width: '15%' },
      }),
    []
  );

// ----------------------------------------------------------------------

type NotePDFProps = {
  note: INoteByID;
  logo?: string | null;
  businessName?: string | null;
  businessPhone?: string | null;
  currencySymbol?: string | null;
};

// ----------------------------------------------------------------------

export default function NotePDF({
  note,
  logo,
  businessName,
  businessPhone,
  currencySymbol,
}: NotePDFProps) {
  const styles = useStyles();

  const {
    folio,
    deliveryDate,
    client,
    requiresInvoice,
    noteDetails,
    subtotal,
    discount,
    total,
  } = note;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image src={logo ? logo : LOGO_PLACEHOLDER_PATH} style={{ width: 48, height: 48 }} />
          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>{folio}</Text>
            <Text>{dayjs().locale('es').format('dddd, D [de] MMMM [de] YYYY [-] HH:mm')}</Text>
          </View>
        </View>

        {/* Sección cliente + fiscal */}
        <View style={[styles.gridContainer, styles.mb16]}>
          {/* Columna izquierda: Datos del cliente */}
          <View style={styles.col6}>
            <Text style={[styles.subtitle1, styles.mb4]}>Datos del Cliente</Text>
            <Text style={styles.body2}>
              <Text style={styles.label}>Nombre: </Text>
              {client.displayName}
            </Text>
            <Text style={styles.body2}>
              <Text style={styles.label}>Teléfono: </Text>
              {client.phone}
            </Text>

            {deliveryDate && (
              <>
                <Text style={[styles.subtitle2, styles.mb4, { marginTop: 8 }]}>
                  Fecha de Entrega
                </Text>
                <Text style={styles.body2}>{formatDate(deliveryDate)}</Text>
              </>
            )}
          </View>

          {/* Columna derecha: Datos fiscales */}
          {requiresInvoice && client.taxInfo && (
            <View style={styles.col6}>
              <Text style={[styles.subtitle1, styles.mb4]}>Información Fiscal</Text>
              {client.taxInfo.rfc && (
                <Text style={styles.body2}>
                  <Text style={styles.label}>RFC: </Text>
                  {client.taxInfo.rfc}
                </Text>
              )}
              {client.taxInfo.businessName && (
                <Text style={styles.body2}>
                  <Text style={styles.label}>Razón Social: </Text>
                  {client.taxInfo.businessName}
                </Text>
              )}
              {client.taxInfo.postalCode && (
                <Text style={styles.body2}>
                  <Text style={styles.label}>C.P.: </Text>
                  {client.taxInfo.postalCode}
                </Text>
              )}
              {client.taxInfo.taxRegime && (
                <Text style={styles.body2}>
                  <Text style={styles.label}>Régimen: </Text>
                  {client.taxInfo.taxRegime}
                </Text>
              )}
              {client.taxInfo.cfdiUse && (
                <Text style={styles.body2}>
                  <Text style={styles.label}>Uso CFDI: </Text>
                  {client.taxInfo.cfdiUse}
                </Text>
              )}
              {client.taxInfo.paymentMethod && (
                <Text style={styles.body2}>
                  <Text style={styles.label}>Método Pago: </Text>
                  {client.taxInfo.paymentMethod}
                </Text>
              )}
              {client.taxInfo.paymentForm && (
                <Text style={styles.body2}>
                  <Text style={styles.label}>Forma Pago: </Text>
                  {client.taxInfo.paymentForm}
                </Text>
              )}
              {client.taxInfo.billingEmail && (
                <Text style={styles.body2}>
                  <Text style={styles.label}>Correo Facturación: </Text>
                  {client.taxInfo.billingEmail}
                </Text>
              )}
              {client.taxInfo.address && (
                <Text style={styles.body2}>
                  <Text style={styles.label}>Dirección: </Text>
                  {client.taxInfo.address}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Tabla de productos / servicios */}
        <Text style={[styles.subtitle1, styles.mb8]}>Detalles</Text>

        <View style={styles.table}>
          {/* Cabecera */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell_1}>
              <Text style={styles.subtitle2}>#</Text>
            </View>
            <View style={styles.tableCell_3}>
              <Text style={styles.subtitle2}>Descripción</Text>
            </View>
            <View style={styles.tableCell_4}>
              <Text style={styles.subtitle2}>P. Unit.</Text>
            </View>
            <View style={styles.tableCell_4}>
              <Text style={styles.subtitle2}>Cant.</Text>
            </View>
            <View style={styles.tableCell_4}>
              <Text style={styles.subtitle2}>Desc.%</Text>
            </View>
            <View style={styles.tableCell_4}>
              <Text style={styles.subtitle2}>Importe</Text>
            </View>
          </View>

          {/* Filas */}
          {noteDetails.map((item, index) => (
            <View style={styles.tableRow} key={`${item.noteId}-${index}`}>
              <View style={styles.tableCell_1}>
                <Text>{index + 1}</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text>{item.description}</Text>
              </View>
              <View style={styles.tableCell_4}>
                <Text>
                  {currencySymbol} {item.unitPrice}
                </Text>
              </View>
              <View style={styles.tableCell_4}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={styles.tableCell_4}>
                <Text>{item.discountPct}%</Text>
              </View>
              <View style={styles.tableCell_4}>
                <Text>
                  {currencySymbol} {item.amount}
                </Text>
              </View>
            </View>
          ))}

          {/* Totales */}
          <View style={[styles.tableRow, styles.noBorder]}>
            <View style={styles.tableCell_1} />
            <View style={styles.tableCell_3} />
            <View style={styles.tableCell_4} />
            <View style={styles.tableCell_4}>
              <Text style={styles.subtitle2}>Subtotal</Text>
            </View>
            <View style={styles.tableCell_4}>
              <Text>
                {currencySymbol} {subtotal}
              </Text>
            </View>
          </View>

          <View style={[styles.tableRow, styles.noBorder]}>
            <View style={styles.tableCell_1} />
            <View style={styles.tableCell_3} />
            <View style={styles.tableCell_4} />
            <View style={styles.tableCell_4}>
              <Text style={styles.subtitle2}>Descuento</Text>
            </View>
            <View style={styles.tableCell_4}>
              <Text>
                {currencySymbol} {discount}
              </Text>
            </View>
          </View>

          <View style={[styles.tableRow, styles.noBorder]}>
            <View style={styles.tableCell_1} />
            <View style={styles.tableCell_3} />
            <View style={styles.tableCell_4} />
            <View style={styles.tableCell_4}>
              <Text style={styles.h4}>Total</Text>
            </View>
            <View style={styles.tableCell_4}>
              <Text style={styles.h4}>
                {currencySymbol} {total}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.gridContainer, styles.footer]} fixed>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>DOCUMENTO PÚBLICO</Text>
            <Text>
              En compromiso con nuestros valores de transparencia radical, los datos de este reporte
              pueden ser libremente consultados, descargados y compartidos.
            </Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>{businessName}</Text>
            <Text>{businessPhone}</Text>
            <Text style={{ marginTop: 2, fontSize: 7 }}>
              Licencia Creative Commons CC-BY 4.0
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
