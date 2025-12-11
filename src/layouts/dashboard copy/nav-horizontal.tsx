import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// theme
import { bgBlur } from 'src/theme/css';
// components
import { NavSectionHorizontal } from 'src/components/nav-section';
//
import { HEADER } from '../config-layout';
import { useNavData } from './config-navigation';
import { HeaderShadow } from '../_common';
import Scrollbar from 'src/components/scrollbar';
import { useAuthContext } from 'src/core/auth/hooks';

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const { user } = useAuthContext();

  const navData = useNavData();

  return (
    <AppBar
      component="nav"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <Scrollbar
          forceVisible="x"
          autoHide={false}
          sx={{
            pb: 2
          }}
        >
          <NavSectionHorizontal
            data={navData}
            config={{
              currentRole: user?.role || 'admin',
            }}
          />
        </Scrollbar>
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
