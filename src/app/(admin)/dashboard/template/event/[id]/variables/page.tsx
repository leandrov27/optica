// components
import ErrorCard from 'src/components/error-card';
// libs
import db from 'src/libs/prisma';
import { EventVariableEditView } from 'src/sections/admin/event/views';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Modificar Nota',
};

// ----------------------------------------------------------------------

async function getEventWithTemplate(id: string) {
  const event = await db.messageEvent.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      eventDate: true,
      headerImageUrl: true,
      template: {
        select: {
          id: true,
          name: true,
          componentsJson: true,
          variablesCount: true,
        },
      },
    },
  });

  if (!event) {
    throw new Error('Evento no encontrado.');
  }

  return event;
}

async function getEventVariables(id: string) {
  return db.messageVariable.findMany({
    where: { eventId: Number(id) },
    orderBy: { position: 'asc' },
  });
}

// ----------------------------------------------------------------------

export default async function EventVariableEditPage({ params }: { params: { id: string } }) {
  try {
    const [event, eventVariables] = await Promise.all([
      getEventWithTemplate(params.id),
      getEventVariables(params.id),
    ]);

    return <EventVariableEditView event={event} eventVariables={eventVariables} />;
  } catch (error) {
    return (
      <ErrorCard
        message={error instanceof Error ? error.message : 'Error desconocido al cargar cliente'}
      />
    );
  }
}
