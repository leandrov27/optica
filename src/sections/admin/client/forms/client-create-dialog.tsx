'use client';

// @mui
import Dialog from '@mui/material/Dialog';
import { Container, DialogTitle, Divider, useTheme } from '@mui/material';
import ClientCreateForm from './client-create-form';

// ----------------------------------------------------------------------

interface ClientCreateDialogProps {
    openDialog: boolean;
    onCloseDialog: VoidFunction;
}

// ----------------------------------------------------------------------

export default function ClientCreateDialog({ openDialog, onCloseDialog }: ClientCreateDialogProps) {
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
                    p: 2
                }
            }}
        >
            <DialogTitle textAlign="center" sx={{ py: 1.5 }}>Registrar Cliente</DialogTitle>

            <Divider sx={{ mb: 2 }} />

            <ClientCreateForm onSuccess={handleSuccess} />
        </Dialog>

    )
}
