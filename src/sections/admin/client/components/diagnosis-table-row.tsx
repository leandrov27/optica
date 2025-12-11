'use client';

// @mui
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// utils
import { PEN_ICON, TRASH_ICON } from 'src/utils/constants';
// schemas
import { type IDiagnosisData } from 'src/core/schemas';

// ----------------------------------------------------------------------

interface DiagnosisTableRowProps {
    row: IDiagnosisData;
    onRemove: VoidFunction;
    onEdit: VoidFunction;
}

// ----------------------------------------------------------------------

export default function DiagnosisTableRow({ row, onRemove, onEdit }: DiagnosisTableRowProps) {
    const {
        date,
        //
        leftSphere,
        leftCylinder,
        leftAxis,
        di,
        //
        rightSphere,
        rightCylinder,
        rightAxis,
        //
        addition,
        add,
        notes
    } = row;

    return (
        <TableRow hover>
            <TableCell align="left">
                <Label color="primary">
                    {date || '-'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="success">
                    {leftSphere || '-'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="success">
                    {leftCylinder || '-'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="success">
                    {leftAxis || '-'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="success">
                    {di || '-'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="info">
                    {rightSphere || '-'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="info">
                    {rightCylinder || '-'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="info">
                    {rightAxis || '-'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="secondary">
                    {add || '-'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="secondary">
                    {addition || '-'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="secondary">
                    {notes || '-'}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Stack direction="row" gap={1} sx={{ ml: 1 }}>
                    <IconButton
                        color="primary"
                        size="small"
                        sx={{ border: '1px solid' }}
                        onClick={onEdit}
                    >
                        <Iconify icon={PEN_ICON} />
                    </IconButton>

                    <IconButton
                        color="error"
                        size="small"
                        sx={{ border: '1px solid' }}
                        onClick={onRemove}
                    >
                        <Iconify icon={TRASH_ICON} />
                    </IconButton>
                </Stack>
            </TableCell>
        </TableRow>
    )
}
