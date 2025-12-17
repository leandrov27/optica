'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
//
import ClientCreatePaymentForm from './client-create-payment-form';

// ----------------------------------------------------------------------

interface ClientCreatePaymentDialogProps {
    noteId: number;
    maxAmount: number;
    openDialog: boolean;
    onCloseDialog: VoidFunction;
}

// ----------------------------------------------------------------------

export default function ClientCreatePaymentDialog({ noteId, maxAmount, openDialog, onCloseDialog }: ClientCreatePaymentDialogProps) {
    const theme = useTheme();

    const handleSuccess = () => {
        onCloseDialog();
    }

    return (
        <Dialog
            maxWidth="lg"
            open={openDialog}
            onClose={onCloseDialog}
            transitionDuration={{
                enter: theme.transitions.duration.shortest,
                exit: theme.transitions.duration.shortest - 80,
            }}
            PaperProps={{
                sx: {
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    px: 2
                }
            }}
        >
            <DialogTitle textAlign="left" sx={{ mt: 0.1 }}>Registrar Pago</DialogTitle>

            <IconButton
                aria-label="close"
                onClick={onCloseDialog}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 15,
                    color: theme.palette.grey[500],
                })}
            >
                <Iconify icon="ic:round-close" width={26} />
            </IconButton>

            <Divider sx={{ mb: 2 }} />

            <ClientCreatePaymentForm
                noteId={noteId}
                maxAmount={maxAmount}
                onSuccess={handleSuccess}
            />
        </Dialog>
    )
}
