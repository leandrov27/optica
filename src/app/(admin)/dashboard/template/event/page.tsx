// sections
import { EventListView } from 'src/sections/admin/event/views';
// components
import ErrorCard from 'src/components/error-card';
// libs
import db from 'src/libs/prisma';
// schemas
import { type IMessageEventData } from 'src/core/schemas';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Lista de Eventos',
};

// ----------------------------------------------------------------------

interface EventListPageProps {
  searchParams?: {
    search?: string;
    page?: string;
  };
}

interface EventPaginated {
  events: IMessageEventData[];
  totalCount: number;
}

// ----------------------------------------------------------------------

const getEventsPaginated = async (
  itemsPerPage: number,
  search: string,
  page: number
): Promise<EventPaginated> => {
  const skip = (page - 1) * itemsPerPage;

  const where = {
    OR: [{ name: { contains: search } }],
  };

  const totalCount = await db.messageEvent.count({ where });

  if (totalCount === 0 || skip >= totalCount) {
    return { events: [], totalCount };
  }

  const rawMessageEvent = await db.messageEvent.findMany({
    where,
    skip,
    select: {
      id: true,
      name: true,
      type: true,
      eventDate: true,
      headerImageUrl: true,
      isActive: true,
      template: {
        select: {
          id: true,
          name: true,
          variablesCount: true,
        },
      },
    },
    take: itemsPerPage,
    orderBy: { id: 'asc' },
  });

  return { events: rawMessageEvent, totalCount };
};

// ----------------------------------------------------------------------

export default async function EventListPage({ searchParams }: EventListPageProps) {
  try {
    // Parsear parámetros de búsqueda
    const itemsPerPage = 3;
    const search = searchParams?.search || '';
    const page = Number(searchParams?.page) || 1;

    // Obtener datos paginados
    const { events, totalCount } = await getEventsPaginated(itemsPerPage, search, page);

    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const from = totalCount ? (page - 1) * itemsPerPage + 1 : 0;
    const to = Math.min(page * itemsPerPage, totalCount);

    return (
      <EventListView
        events={events}
        //
        searchTerm={search}
        //
        currentPage={page}
        totalPages={totalPages}
        //
        totalItems={totalCount}
        from={from}
        to={to}
      />
    );
  } catch (error: any) {
    return <ErrorCard message={error.message} />;
  }
}
