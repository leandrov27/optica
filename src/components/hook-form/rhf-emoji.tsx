import React, { useState } from 'react';

// MUI components
import { GlobalStyles } from '@mui/material';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// packages
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

interface EmojiPickerProps {
  value: string | null | undefined;
  onChange: (emoji: string) => void;
  onSubmitting: boolean;
}

// ----------------------------------------------------------------------

export default function RHFEmojiField({ value, onChange, onSubmitting }: EmojiPickerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    onChange(emojiObject.emoji);
    setIsPickerOpen(false);
  };

  const handleRemoveEmoji = () => {
    onChange(''); // Clear the emoji
  };

  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          '.epr-main': {
            '& .epr-header': {
              '[aria-controls="epr-search-id"]': {
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.action.disabledBackground,
              },
            },
          },
          '.epr-emoji-category': {
            '& .epr-emoji-category-label': {
              backgroundColor: theme.palette.background.paper,
              borderBottom: `2px solid ${theme.palette.action.disabledBackground}`,
              color: theme.palette.text.secondary,
            },
          },
        })}
      />
      <Box sx={{ position: 'relative' }}>
        <TextField placeholder='Seleccionar emoji ====>' value={value ?? ''} disabled fullWidth />
        <Dialog
          open={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              maxWidth: { xs: '90vw', sm: 444 },
            },
          }}
          aria-describedby="emoji_selector_dialog"
        >
          <DialogTitle>Selecciona un Emoji</DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            <Box id="emoji_selector_dialog" sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width="100%"
                height={400}
                emojiStyle={EmojiStyle.APPLE}
                searchPlaceHolder="Buscar emoji..."
                style={{
                  background: 'transparent',
                  border: 'none',
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button disabled={onSubmitting} variant="outlined" onClick={() => setIsPickerOpen(false)}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
        <IconButton
          onClick={() => setIsPickerOpen(true)}
          disabled={onSubmitting}
          sx={{
            fontSize: 20,
            position: 'absolute',
            right: value ? 35 : 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          aria-controls="emoji_selector_dialog"
        >
          <Iconify icon="ic:round-search" width={28} />
        </IconButton>

        {value && (
          <IconButton
            onClick={handleRemoveEmoji}
            disabled={!value || onSubmitting}
            sx={{
              fontSize: 17,
              position: 'absolute',
              right: 2,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            aria-label="remove emoji"
          >
            <Iconify icon="maki:cross" width={23} />
          </IconButton>
        )}
      </Box>
    </>
  );
}
