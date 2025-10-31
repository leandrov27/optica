// react
import { forwardRef } from 'react';
// @mui
import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
//
import { useSettingsContext } from '../settings';

// ----------------------------------------------------------------------

export interface DeveloperLogoProps extends BoxProps {
  disabledLink?: boolean;
}

// ----------------------------------------------------------------------

const DeveloperLogo = forwardRef<HTMLDivElement, DeveloperLogoProps>(({ disabledLink = false, sx, ...other }, ref) => {
  const settings = useSettingsContext();
  const themeMode = settings.themeMode;

  const devLogoPath = themeMode === 'dark' ? '/logo/astro_light.png' : '/logo/astro_dark.png';

  const devLogo = (
    <Box
      {...other}
      component="img"
      src={devLogoPath}
      sx={{
        width: 75,
        cursor: disabledLink ? 'default' : 'pointer',
        ...sx,
      }}
    />
  );

  if (disabledLink) {
    return devLogo;
  }

  return (
    <Link component={RouterLink} href={paths.admin.root} sx={{ display: 'contents' }}>
      {devLogo}
    </Link>
  );
}
);

export default DeveloperLogo;
