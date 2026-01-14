'use client';

// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// stores
import { type Datum } from 'src/core/schemas';
// utils
import { extractVariablesFromComponents } from 'src/utils/resolveTemplateVariables';

// ----------------------------------------------------------------------

interface TemplateTableRowProps {
  row: Datum;
  index: number;
}

// ----------------------------------------------------------------------

export default function TemplateTableRow({ row, index }: TemplateTableRowProps) {
  const { id, category, language, status, name, components } = row;

  const variableList = extractVariablesFromComponents(components);
  const variableCount = variableList.length;

  return (
    <>
      <TableRow hover>
        <TableCell align="left">
          <Label color="default">{index + 1}</Label>
        </TableCell>

        <TableCell align="center">
          <Label color="default">
            <Iconify icon={'foundation:key'} width={14} sx={{ mr: 0.5 }} />
            {id}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label color="primary" style={{ textTransform: 'none' }}>
            {name}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label color="secondary">{category}</Label>
        </TableCell>

        <TableCell align="center">
          <Label color="success">{variableCount} {variableCount === 1 ? 'Posición' : 'Posiciones'}</Label>
        </TableCell>

        <TableCell align="center">
          <Label color="info" style={{ textTransform: 'none' }}>
            {language}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label color={status === 'PENDING' ? 'warning' : 'success'}>{status}</Label>
        </TableCell>
      </TableRow>
    </>
  );
}
