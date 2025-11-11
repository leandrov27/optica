'use client';

// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
// utils
import { TRASH_ICON } from 'src/utils/constants';
// stores
import { useSettingsStore } from 'src/core/stores';

// ----------------------------------------------------------------------

interface NoteTableRowProps {
  row: {
    description: string;
    productId: number;
    quantity: number;
    unitPrice: string | number;
    amount: string | number;
    noteId?: number | undefined;
    discountPct?: string | number | undefined;
  };
  index: number;
  onRemove: VoidFunction;
  onDetailChange: (index: number, field: 'quantity' | 'discountPct', value: string) => void;
  onSubmitting: boolean;
}

// ----------------------------------------------------------------------

export default function NoteTableRow({ row, index, onRemove, onDetailChange, onSubmitting }: NoteTableRowProps) {
  const settings = useSettingsStore((state) => state.settings);

  const {
    description,
    unitPrice,
    amount,
  } = row;

  return (
    <>
      <TableRow hover>
        <TableCell align="center">
          <Label color="default">
            {index + 1}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label color="primary">
            {description ?? '-'}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label color="secondary">
            {settings?.currencySymbol} {unitPrice ?? '-'}
          </Label>
        </TableCell>

        <TableCell align="center">
          <RHFTextField
            sx={{ width: 80 }}
            name={`noteDetails.${index}.quantity`}
            type="number"
            disabled={onSubmitting}
            onChange={(e) =>
              onDetailChange(index, 'quantity', e.target.value)
            }
            inputProps={{ min: 1 }}
          />
        </TableCell>

        <TableCell align="center">
          <RHFTextField
            sx={{ width: 80 }}
            name={`noteDetails.${index}.discountPct`}
            type="number"
            disabled={onSubmitting}
            onChange={(e) =>
              onDetailChange(index, 'discountPct', e.target.value)
            }
            inputProps={{
              min: 0,
              max: 100,
              step: 0.1
            }}
          />
        </TableCell>

        <TableCell align="center">
          <Label color="success">
            {settings?.currencySymbol} {amount ?? '-'}
          </Label>
        </TableCell>

        <TableCell align="center">
          <IconButton
            color="error"
            size="small"
            sx={{ border: '1px solid' }}
            onClick={onRemove}
          >
            <Iconify icon={TRASH_ICON} />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  )
}
