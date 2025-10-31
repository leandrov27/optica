'use client';

// @mui
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
// components
import Scrollbar from "src/components/scrollbar";
import NoResultsCard from "src/components/no-results-card";
import { TableHeadCustom, TableNoData } from "src/components/table";
//
import NoteTableRow from "./note-table-row";

// ----------------------------------------------------------------------

interface NoteTableProps {
  notes: {
    description: string;
    productId: number;
    quantity: number;
    unitPrice: string | number;
    amount: string | number;
    noteId?: number | undefined;
    discountPct?: string | number | undefined;
  }[];
  onRemove: (index: number) => void;
  onDetailChange: (index: number, field: 'quantity' | 'discountPct', value: string) => void;
  onSubmitting: boolean;
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', align: 'center' },
  //
  { id: 'description', label: 'Descripción', align: 'center' },
  { id: 'price', label: 'Precio', align: 'center' },
  { id: 'qty', label: 'Cantidad', align: 'center' },
  { id: 'discount', label: 'Descuento (%)', align: 'center' },
  { id: 'amount', label: 'Importe', align: 'center' },
  //
  { id: 'actions', label: 'Operaciones', align: 'center', },
];

// ----------------------------------------------------------------------

export default function NoteTable({ notes, onRemove, onDetailChange, onSubmitting }: NoteTableProps) {
  const shouldShowNoResults = notes.length === 0;

  return (
    <>
      {!shouldShowNoResults ? (
        <TableContainer component={Paper}>
          <Scrollbar>
            <Table size='small'>
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBody>
                {notes.map((note, index) => (
                  <NoteTableRow
                    key={note.noteId ?? index}
                    row={note}
                    index={index}
                    onRemove={() => onRemove(index)}
                    onDetailChange={onDetailChange}
                    onSubmitting={onSubmitting}
                  />
                ))}

                <TableNoData notFound={notes.length === 0} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      ) : (
        <NoResultsCard description="Aún no se ha agregado ningún producto a la nota." />
      )}
    </>
  )
}
