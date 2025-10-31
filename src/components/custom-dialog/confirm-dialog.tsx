// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
//
import { ConfirmDialogProps } from './types';

// ----------------------------------------------------------------------

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  onProcessing = false,
  ...other
}: ConfirmDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle textAlign="center" sx={{ py: 1.5 }}>
        {title}
      </DialogTitle>

      <Divider />

      {content && <DialogContent sx={{ p: 2 }}>
        <DialogContentText textAlign="center">
          {content}
        </DialogContentText>
      </DialogContent>}

      <Divider />

      <DialogActions sx={{ py: 1.5 }}>
        <Button
          disabled={onProcessing}
          variant="outlined"
          onClick={onClose}
        >
          Cancelar
        </Button>

        {action}
      </DialogActions>
    </Dialog>
  );
}
