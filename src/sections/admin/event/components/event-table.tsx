'use client';

// @mui
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
// components
import Scrollbar from 'src/components/scrollbar';
import Paginator from 'src/components/paginator';
import SearchBar from 'src/components/search-bar';
import NoResultsCard from 'src/components/no-results-card';
import { TableHeadCustom, TableNoData } from 'src/components/table';
// schemas
import { type IMessageEventData } from 'src/core/schemas';
//
import EventTableRow from './event-table-row';

// ----------------------------------------------------------------------

interface EventTableProps {
  events: IMessageEventData[];
  searchTerm?: string;
  //
  currentPage: number;
  totalPages: number;
  //
  totalItems: number;
  from: number;
  to: number;
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', align: 'center', width: 20 },
  { id: 'name', label: 'Nombre', align: 'center' },
  { id: 'eventDate', label: 'Fecha de Ejecución', align: 'center' },
  { id: 'template', label: 'Plantilla', align: 'center' },
  { id: 'type', label: 'Tipo', align: 'center' },
  { id: 'isActive', label: 'Estado', align: 'center' },
  { id: 'variablesCount', label: 'Cant. Variables', align: 'center' },
  { id: 'actions', label: 'Operaciones', align: 'center', width: 20 },
];

// ----------------------------------------------------------------------

export default function EventTable({
  events,
  searchTerm = '',
  //
  currentPage,
  totalPages,
  //
  totalItems,
  from,
  to,
}: EventTableProps) {
  const shouldShowNoResults = events.length === 0;

  return (
    <Card>
      <SearchBar placeholder="Buscar evento por nombre..." />

      <Divider />

      {!shouldShowNoResults ? (
        <>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="small">
                <TableHeadCustom headLabel={TABLE_HEAD} />

                <TableBody>
                  {events.map((event) => (
                    <EventTableRow key={event.id} row={event} itemsInPage={events.length} />
                  ))}

                  <TableNoData notFound={events.length === 0} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <Divider />
        </>
      ) : (
        <NoResultsCard sx={{ p: 2 }} searchValue={searchTerm} />
      )}

      <Divider />

      <Stack justifyContent="center" alignItems="center" sx={{ py: 2 }} gap={1}>
        <Typography variant="caption">
          {totalItems === 0 ? (
            'No se encontraron productos.'
          ) : (
            <>
              Mostrando del
              <strong> {from} </strong>
              al
              <strong> {to} </strong>
              de un total de
              <strong> {totalItems} </strong>
              registro{totalItems !== 1 ? 's' : ''}.
            </>
          )}
        </Typography>

        <Paginator currentPage={currentPage} totalPages={totalPages} />
      </Stack>
    </Card>
  );
}
