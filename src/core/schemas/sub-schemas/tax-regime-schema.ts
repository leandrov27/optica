// libs
import z from 'src/libs/zod';

// ----------------------------------------------------------------------

export const TAX_REGIME_OPTIONS = [
    { key: '601', label: 'General de Ley Personas Morales' },
    { key: '603', label: 'Personas Morales con Fines no Lucrativos' },
    { key: '605', label: 'Sueldos y Salarios e Ingresos Asimilados' },
    { key: '606', label: 'Arrendamiento' },
    { key: '607', label: 'Régimen de Enajenación o Adquisición de Bienes' },
    { key: '608', label: 'Demás Ingresos' },
    { key: '612', label: 'Personas Físicas con Actividades Empresariales' },
    { key: '615', label: 'Régimen de los ingresos por Dividendos' },
    { key: '621', label: 'Incorporación Fiscal' },
    { key: '622', label: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
    { key: '626', label: 'Régimen Simplificado de Confianza(RESICO)' },
] as const;

export const TaxRegimeSchema = z.enum(TAX_REGIME_OPTIONS.map((tro) => tro.key), {
    error: (ctx) => {
        return `Valor ${ctx.input} inválido. No corresponde a un régimen fiscal válido.`;
    },
});