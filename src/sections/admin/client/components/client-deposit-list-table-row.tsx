'use client';

// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// schemas
import { type IClientPaymentData } from 'src/core/schemas';
// utils
import { formatDateWithTime } from 'src/utils/format-date';
// stores
import { useSettingsStore } from 'src/core/stores';

// ----------------------------------------------------------------------

interface ClientDepositListTableRowProps {
    row: IClientPaymentData;
    itemsInPage: number;
}

// ----------------------------------------------------------------------

const CREDIT_STATUS_UI = {
    PENDING: { label: "Pendiente", color: "warning" },
    PARTIAL: { label: "Parcial", color: "info" },
    PAID: { label: "Pagado", color: "success" },
    OVERDUE: { label: "Vencido", color: "error" },
} as const;

// ----------------------------------------------------------------------

export default function ClientDepositListTableRow({ row, itemsInPage }: ClientDepositListTableRowProps) {
    const { id, saleNoteFolio, paymentDate, amount, paymentMethod, reference } = row;

    const settings = useSettingsStore((state) => state.settings);

    const renderPrimary = (
        <TableRow hover>
            <TableCell align="left">
                <Label color="default">
                    <Iconify icon={'foundation:key'} width={14} sx={{ mr: 0.5 }} />
                    {id}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="default">
                    {saleNoteFolio}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="success" variant='soft'>
                    {settings?.currencySymbol} {Number(amount)}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="default" variant='soft' sx={{ textTransform: 'lowercase' }}>
                    {formatDateWithTime(paymentDate)}
                </Label>
            </TableCell>
        </TableRow>
    );

    return (
        <>
            {renderPrimary}
        </>
    );
}
