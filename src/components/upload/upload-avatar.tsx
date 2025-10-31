import { useDropzone } from 'react-dropzone';
// @mui
import { IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
//
import Iconify from '../iconify';
import Image from '../image';
//
import { UploadProps } from './types';
import RejectionFiles from './errors-rejection-files';

// ----------------------------------------------------------------------

export default function UploadAvatar({
  error,
  file,
  disabled,
  helperText,
  onReset,
  isSubmitting,
  sx,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    disabled,
    accept: {
      'image/*': [],
    },
    ...other,
  });

  const hasFile = !!file;

  const hasError = isDragReject || !!error;

  const imgUrl = typeof file === 'string' ? file : file?.preview;

  const renderPreview = hasFile && (
    <Image
      alt="avatar"
      src={imgUrl}
      sx={{
        width: 1,
        height: 1,
        borderRadius: '50%',
      }}
    />
  );

  const renderPlaceholder = (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1}
      className="upload-placeholder"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        borderRadius: '50%',
        position: 'absolute',
        color: 'text.disabled',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        '&:hover': {
          opacity: 0.72,
        },
        ...(hasError && {
          color: 'error.main',
          bgcolor: 'error.lighter',
        }),
        ...(hasFile && {
          zIndex: 9,
          opacity: 0,
          color: 'common.white',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
        }),
      }}
    >
      <Iconify icon="solar:camera-add-bold" width={32} />

      <Typography variant="caption">{file ? 'Actualizar Foto' : 'Subir Foto'}</Typography>
    </Stack>
  );

  const renderContent = (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      {renderPreview}
      {renderPlaceholder}
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: 250,
          height: 'auto',
          mx: 'auto',
        }}
      >
        {hasFile && (
          <IconButton
            onClick={onReset}
            disabled={isSubmitting}
            sx={{
              border: (theme) => `1px dashed ${isSubmitting ? theme.palette.grey[300] : theme.palette.error.main }`,
              width: 32,
              height: 32,
              position: 'absolute',
              top: -3,
              right: 35,
              zIndex: 10,
            }}
          >
            <Iconify icon={file instanceof File ? 'hugeicons:clean' : 'radix-icons:cross-2'} color={isSubmitting ? 'text.disabled' : 'error.main'} />
          </IconButton>
        )}

        <Box
          {...getRootProps()}
          sx={{
            p: 1,
            m: 'auto',
            width: 144,
            height: 144,
            cursor: 'pointer',
            overflow: 'hidden',
            borderRadius: '50%',
            border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
            ...(isDragActive && {
              opacity: 0.72,
            }),
            ...(disabled && {
              opacity: 0.48,
              pointerEvents: 'none',
            }),
            ...(hasError && {
              borderColor: 'error.light',
            }),
            ...(hasFile && {
              ...(hasError && {
                bgcolor: 'error.lighter',
              }),
              '&:hover .upload-placeholder': {
                opacity: 1,
              },
            }),
            ...sx,
          }}
        >
          <input {...getInputProps()} />

          {renderContent}
        </Box>

        {helperText && helperText}
      </Box>

      {/*@ts-ignore*/}
      <RejectionFiles fileRejections={fileRejections} />
    </>
  );
}
