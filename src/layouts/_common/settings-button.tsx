import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function SettingsButton() {
  const router = useRouter();

  const goToSettingsPage = () => {
    router.push(paths.admin.settings);
  }

  return (
    <Box
      component={m.div}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 12,
        ease: 'linear',
        repeat: Infinity,
      }}
    >
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        aria-label="settings"
        onClick={goToSettingsPage}
        sx={{
          width: 40,
          height: 40,
        }}
      >
        <Iconify icon="solar:settings-bold-duotone" width={24} />
      </IconButton>
    </Box>
  );
}
