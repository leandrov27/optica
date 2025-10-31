// react
import { forwardRef } from 'react';
// @mui
import Link from '@mui/material/Link';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
// routes
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
// stores
import { useSettingsStore } from 'src/core/stores';
// utils
import { LOGO_PLACEHOLDER_PATH } from 'src/utils/constants';

// ----------------------------------------------------------------------

export interface LogoProps extends AvatarProps {
  disabledLink?: boolean;
}

// ----------------------------------------------------------------------

const Logo = forwardRef<HTMLDivElement, LogoProps>(({ disabledLink = false, sx, ...other }, ref) => {
  const settings = useSettingsStore((state) => state.settings);

  const logo = (
    <Avatar
      {...other}
      src={settings?.businessLogoUrl || LOGO_PLACEHOLDER_PATH}
      sx={{
        width: 40,
        height: 40,
        border: (theme) => `2px solid ${theme.palette.primary.main}`,
        backgroundColor: 'white',
        cursor: disabledLink ? 'default' : 'pointer',
        ...sx
      }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href={paths.admin.root} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
}
);

export default Logo;
