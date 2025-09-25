// import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
// import Container from '@mui/material/Container';

// import { paths } from 'src/routes/paths';

import { Box } from '@mui/material';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';

import Logo from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';
import { LoginDialogProvider,SubmitDialogProvider } from 'src/components/settings';

import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { NAV, HEADER } from '../config-layout';
import { navConfig } from './config-navigation';
import LoginButton from '../common/login-button';
import SubmitButton from '../common/submit-button';
import HeaderShadow from '../common/header-shadow';
import AccountPopover from '../common/account-popover';

// ----------------------------------------------------------------------
export default function Header() {
  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');
  const mdUp = useResponsive('up', 'md');

  const { user } = useAuthContext();
  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const isNavMini = settings.themeLayout === 'mini';

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  let navItem = navConfig;

  // console.log('user info: ', user);
  // nếu chưa đăng nhập thì chỉ lấy những item có isAuth = false (chưa đăng nhập)
  if (!user) {
    navItem = navConfig.filter((item) => item.isAuth === false);
  }

  return (
    <AppBar
      sx={{
        // height: HEADER.H_MOBILE,
        height: HEADER.H_DESKTOP,
        zIndex: 999,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        backgroundColor:'transparent',
        // transition: theme.transitions.create(['height'], {
        //   duration: theme.transitions.duration.shorter,
        // }),
        transition: theme.transitions.create(['height'], {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            // bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <LoginDialogProvider>
        <Toolbar
          sx={{
            height: 1,
            px: { lg: 10 },
          }}
          // disableGutters
          // sx={{
          //   height: {
          //     xs: HEADER.H_MOBILE,
          //     md: HEADER.H_DESKTOP,
          //   },
          //   transition: theme.transitions.create(['height'], {
          //     easing: theme.transitions.easing.easeInOut,
          //     duration: theme.transitions.duration.shorter,
          //   }),
          //   ...(offsetTop && {
          //     ...bgBlur({
          //       color: theme.palette.background.default,
          //     }),
          //     height: {
          //       md: HEADER.H_DESKTOP_OFFSET,
          //     },
          //   }),
          // }}
        >
          {/* <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}> */}
          {!mdUp && <NavMobile data={navItem} />}
          <Logo />

          <Stack
            flexGrow={1}
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            spacing={{ xs: 0.5, sm: 1 }}
            sx={{ ml: 8 }}
          >
            {mdUp && <NavDesktop data={navItem} />}
          </Stack>

          {/* {mdUp && <NavDesktop data={navConfig} />} */}

          <Stack spacing={2} alignItems="center" direction="row">
            {/* direction={{ xs: 'row', md: 'row-reverse' }} */}
            {/* <Button component={RouterLink} variant="contained" rel="noopener" href={paths.auth.jwt.register}>
              Register
            </Button> */}

            {/* <LanguagePopover /> */}

            {user ? (
              <Box sx={{ display: 'flex', gap: 2 }}>

                <AccountPopover sx={{ ml: 5 }} />
                <SubmitDialogProvider>
                <SubmitButton />
                </SubmitDialogProvider>
              </Box>
            ) : (
              <LoginButton />
            )}
          </Stack>

          {/* </Container> */}
        </Toolbar>
      </LoginDialogProvider>
      {/* {offsetTop && <HeaderShadow />} */}
      <HeaderShadow />
    </AppBar>
  );
}
