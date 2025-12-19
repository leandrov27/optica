// sections
import { DashboardView } from 'src/sections/admin/dashboard/views';
// components
import ErrorCard from 'src/components/error-card';
// libs
import db from 'src/libs/prisma';
import { dayjs } from 'src/libs/dayjs';
// schemas
import { PAYMENT_FORM_OPTIONS } from 'src/core/schemas';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Tablero de Ventas',
};

// ----------------------------------------------------------------------

async function getSalesByPaymentMethod(params?: { 
  dateFrom?: Date; 
  dateTo?: Date; 
  paymentMethod?: string; 
}) {
  try {
    const { dateFrom, dateTo, paymentMethod } = params || {};

    const sales = await db.saleNote.groupBy({
      by: ['paymentForm'],
      _sum: {
        total: true,
      },
      where: {
        // Solo aplicar filtro de fecha si se proporciona
        ...(dateFrom && dateTo ? {
          date: {
            gte: dateFrom,
            lte: dateTo,
          }
        } : {}),
        // Siempre aplicar filtro de paymentMethod si se proporciona
        ...(paymentMethod && { paymentForm: paymentMethod }),
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
    });

    const series = PAYMENT_FORM_OPTIONS.map((opt) => {
      const found = sales.find((s) => s.paymentForm === opt.key);

      return {
        label: opt.label,
        value: Number(found?._sum.total ?? 0),
      };
    }).filter((item) => item.value > 0);

    return { series };
  } catch (error) {
    console.error('[getSalesByPaymentMethod]', error);
    throw new Error('Error al obtener ventas por método de pago');
  }
}

async function getSalesDetails(params?: {
  dateFrom?: Date;
  dateTo?: Date;
  paymentMethod?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    const { dateFrom, dateTo, paymentMethod, page = 1, pageSize = 5 } = params || {};
    const skip = (page - 1) * pageSize;

    // Por defecto: buscar ventas de hoy si no hay fechas específicas
    const defaultDateFrom = dayjs().startOf('day').toDate();
    const defaultDateTo = dayjs().endOf('day').toDate();

    const filterDateFrom = dateFrom || defaultDateFrom;
    const filterDateTo = dateTo || defaultDateTo;

    // Obtener ventas con paginación
    const sales = await db.saleNote.findMany({
      where: {
        date: {
          gte: filterDateFrom,
          lte: filterDateTo,
        },
        ...(paymentMethod && { paymentForm: paymentMethod }),
      },
      select: {
        id: true,
        date: true,
        paymentForm: true,
        total: true,
        client: {
          select: {
            displayName: true,
          }
        },
      },
      orderBy: {
        date: 'desc',
      },
      skip,
      take: pageSize,
    });

    // Obtener total de ventas para paginación
    const totalSales = await db.saleNote.count({
      where: {
        date: {
          gte: filterDateFrom,
          lte: filterDateTo,
        },
        ...(paymentMethod && { paymentForm: paymentMethod }),
      },
    });

    // Obtener totales por método de pago (para el resumen)
    const totalsByPayment = await db.saleNote.groupBy({
      by: ['paymentForm'],
      _sum: {
        total: true,
      },
      where: {
        date: {
          gte: filterDateFrom,
          lte: filterDateTo,
        },
        ...(paymentMethod && { paymentForm: paymentMethod }),
      },
    });

    // Calcular total general
    const totalAmount = totalsByPayment.reduce((sum, item) => sum + Number(item._sum.total || 0), 0);

    return {
      sales: sales.map(sale => ({
        ...sale,
        total: Number(sale.total),
        customer: sale.client ? { name: sale.client.displayName } : undefined
      })),
      totalsByPayment: totalsByPayment.map(item => ({
        paymentMethod: item.paymentForm,
        total: Number(item._sum.total || 0)
      })),
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalSales,
        totalPages: Math.ceil(totalSales / pageSize),
      },
      totalAmount,
    };
  } catch (error) {
    console.error('[getSalesDetails]', error);
    throw new Error('Error al obtener detalles de ventas');
  }
}

// ----------------------------------------------------------------------

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  try {
    // Parsear parámetros de la URL
    const page = searchParams?.page ? parseInt(searchParams.page as string) : 1;
    
    // Obtener fechas de los parámetros (si existen)
    const dateFrom = searchParams?.dateFrom
      ? dayjs(searchParams.dateFrom as string).startOf('day').toDate()
      : undefined;
    
    const dateTo = searchParams?.dateTo
      ? dayjs(searchParams.dateTo as string).endOf('day').toDate()
      : undefined;
    
    const paymentMethod = searchParams?.paymentMethod as string | undefined;
    
    // Determinar qué filtros están activos
    const hasDateFilter = searchParams?.dateFrom || searchParams?.dateTo;
    const hasPaymentFilter = paymentMethod && paymentMethod !== 'all';
    const hasAnyFilter = hasDateFilter || hasPaymentFilter;

    // Para los charts: Solo pasar filtros si el usuario los aplicó
    const chartData = await getSalesByPaymentMethod({
      dateFrom: hasDateFilter ? dateFrom : undefined,
      dateTo: hasDateFilter ? dateTo : undefined,
      paymentMethod: hasPaymentFilter ? paymentMethod : undefined
    });

    // Para la tabla: Siempre usar fechas (por defecto hoy si no hay filtros)
    const salesData = await getSalesDetails({
      dateFrom,
      dateTo,
      paymentMethod: paymentMethod === 'all' ? undefined : paymentMethod,
      page,
      pageSize: 5
    });

    return (
      <DashboardView
        salesByPaymentMethod={chartData}
        salesDetails={salesData}
        initialFilters={{ 
          dateFrom: dateFrom || dayjs().startOf('day').toDate(),
          dateTo: dateTo || dayjs().endOf('day').toDate(),
          paymentMethod: paymentMethod || 'all',
          page 
        }}
        // defaultDateRange depende de si el usuario aplicó filtros de fecha
        defaultDateRange={!hasDateFilter ? 'today' : 'custom'}
      />
    );
  } catch (error) {
    console.error('Error capturado:', error);
    return <ErrorCard message={error.message} />;
  }
}