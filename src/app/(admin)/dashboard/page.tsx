// sections
import { DashboardView } from 'src/sections/admin/dashboard/views';
// components
import ErrorCard from 'src/components/error-card';
// libs
import db from 'src/libs/prisma';
// schemas
import { PAYMENT_FORM_OPTIONS } from 'src/core/schemas';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Panel de Control',
};

// ----------------------------------------------------------------------

async function getSalesByPaymentMethod(params?: { dateFrom?: Date; dateTo?: Date; paymentMethod?: string; }) {
  try {
    const { dateFrom, dateTo, paymentMethod } = params || {};

    const sales = await db.saleNote.groupBy({
      by: ['paymentForm'],
      _sum: {
        total: true,
      },
      where: {
        date: {
          ...(dateFrom && { gte: dateFrom }),
          ...(dateTo && { lte: dateTo }),
        },
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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  try {
    // Parsear parámetros de la URL
    const dateFrom = searchParams?.dateFrom
      ? new Date(searchParams.dateFrom as string)
      : undefined;
    const dateTo = searchParams?.dateTo
      ? new Date(searchParams.dateTo as string)
      : undefined;
    const paymentMethod = searchParams?.paymentMethod as string | undefined;

    const data = await getSalesByPaymentMethod({
      dateFrom,
      dateTo,
      paymentMethod
    });

    return <DashboardView
      salesByPaymentMethod={data}
      initialFilters={{ dateFrom, dateTo, paymentMethod }}
    />;
  } catch (error) {
    console.error('Error capturado:', error);
    return <ErrorCard message={error.message} />;
  }
}
