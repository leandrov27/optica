'use client';

// @mui
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// schemas
import { type IClientCreditNoteData } from 'src/core/schemas';
// utils
import { formatDate } from 'src/utils/format-date';
// stores
import { useSettingsStore } from 'src/core/stores';
//
import ClientCreatePaymentDialog from '../forms/client-create-payment-dialog';

// ----------------------------------------------------------------------

interface NoteListTableRowProps {
    row: IClientCreditNoteData;
}

// ----------------------------------------------------------------------

const CREDIT_STATUS_UI = {
    PENDING: { label: "Pendiente", color: "warning" },
    PARTIAL: { label: "Parcial", color: "info" },
    PAID: { label: "Pagado", color: "success" },
    OVERDUE: { label: "Vencido", color: "error" },
} as const;

// ----------------------------------------------------------------------

export default function ClientNoteListTableRow({ row }: NoteListTableRowProps) {
    const paymentDialog = useBoolean();

    const { id, client, folio, date, subtotal, total, pendingBalance, totalPayments, creditStatus } = row;

    const ui = CREDIT_STATUS_UI[creditStatus];

    const settings = useSettingsStore((state) => state.settings);

    // Calcular si el saldo está pagado
    const isPaid = pendingBalance <= 0;

    // Verificar si el status es "PAID"
    const isFullyPaid = creditStatus === 'PAID';

    // Determinar si debe estar deshabilitado (cuando no hay saldo pendiente)
    const shouldDisableButton = isPaid || isFullyPaid;

    // Tooltip text según el estado
    const getTooltipText = () => {
        if (isPaid) {
            return "Esta nota ya está completamente pagada";
        }
        if (creditStatus === 'OVERDUE') {
            return "Nota vencida - Registrar abono";
        }
        return "Registrar un nuevo abono";
    };

    const handleOpenModal = () => {
        if (!shouldDisableButton) {
            paymentDialog.onTrue();
        }
    };

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
                    {folio}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="secondary">
                    <Iconify icon={'heroicons-solid:hashtag'} width={14} />
                    {client.id} · {client.displayName}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="success" variant='soft'>
                    {settings?.currencySymbol} {Number(subtotal).toFixed(2)}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="success" variant='soft'>
                    {settings?.currencySymbol} {Number(total).toFixed(2)}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="secondary" variant='soft'>
                    {settings?.currencySymbol} {Number(totalPayments).toFixed(2)}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label
                    color={pendingBalance > 0 ? "warning" : "success"}
                    variant='soft'
                >
                    {settings?.currencySymbol} {Number(pendingBalance).toFixed(2)}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label color="default" variant='soft'>
                    {formatDate(date)}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Label variant="soft" color={ui.color}>
                    {ui.label}
                </Label>
            </TableCell>

            <TableCell align="center">
                <Tooltip title={getTooltipText()} arrow>
                    <span>
                        <Button
                            size="small"
                            variant={shouldDisableButton ? "outlined" : "contained"}
                            sx={{
                                height: '22px',
                                borderRadius: 0.7,
                                opacity: shouldDisableButton ? 0.7 : 1
                            }}
                            disabled={shouldDisableButton}
                            onClick={handleOpenModal}
                        >
                            <Iconify
                                icon={shouldDisableButton ? 'mdi:check-circle' : 'solar:hand-money-bold-duotone'}
                                width={18}
                                sx={{ mr: 0.5 }}
                            />
                            {shouldDisableButton ? 'Pagado' : 'Abonar'}
                        </Button>
                    </span>
                </Tooltip>
            </TableCell>
        </TableRow>
    );

    return (
        <>
            {renderPrimary}

            <ClientCreatePaymentDialog
                noteId={id}
                maxAmount={pendingBalance}
                openDialog={paymentDialog.value}
                onCloseDialog={paymentDialog.onFalse}
            />
        </>
    );
}
