'use client';

// @mui
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// components
import Scrollbar from 'src/components/scrollbar';
import NoResultsCard from 'src/components/no-results-card';
import { TableHeadCustom, TableNoData } from 'src/components/table';
// schemas
import { type ITemplate } from 'src/core/schemas';
//
import TemplateTableRow from './template-table-row';

// ----------------------------------------------------------------------

interface TemplateListTableProps {
  templatesData: Pick<ITemplate, 'data'>;
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'index', label: 'Número', align: 'left' },
  { id: 'id', label: 'ID', align: 'center' },
  { id: 'name', label: 'Nombre', align: 'center' },
  { id: 'category', label: 'Categoría', align: 'center' },
  { id: 'variables', label: 'Cant. Variables', align: 'center' },
  { id: 'language', label: 'Idioma', align: 'center' },
  { id: 'status', label: 'Estado', align: 'center' },
];

// ----------------------------------------------------------------------

export default function TemplateListTable({ templatesData }: TemplateListTableProps) {
  const shouldShowNoResults = templatesData.data.length === 0;
  const templates = templatesData.data;

  return (
    <>
      {!shouldShowNoResults ? (
        <TableContainer component={Paper}>
          <Scrollbar>
            <Table size="small">
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBody>
                {templates.map((template, index) => (
                  <TemplateTableRow key={template.id ?? index} row={template} index={index} />
                ))}

                <TableNoData notFound={templates.length === 0} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      ) : (
        <NoResultsCard description="Aún no se ha agregado ningún producto a la nota." />
      )}
    </>
  );
}
