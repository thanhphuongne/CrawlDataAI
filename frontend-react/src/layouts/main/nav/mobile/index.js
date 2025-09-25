import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useState, useEffect, useContext, useCallback } from 'react';

import { Box } from '@mui/material';
// import { LoadingButton } from '@mui/lab';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { usePathname } from 'src/routes/hooks';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

// import { ASSETS_API } from 'src/config-global';
import { INVITE_LINK } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';

import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
// import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LoginDialogContext } from 'src/components/settings';

import NavList from './nav-list';
// import LoginButton from 'src/layouts/common/login-button';
// import { LoginDialogProvider } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function NavMobile({ data }) {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { copy } = useCopyToClipboard();
  const { enqueueSnackbar } = useSnackbar();

  const { handleOpenLoginDialog } = useContext(LoginDialogContext);

  const [openMenu, setOpenMenu] = useState(false);
  // const inviteLink = `${ASSETS_API}/register?xoffer=${user?.code}`;
  const inviteLink = INVITE_LINK(user?.code)

  useEffect(() => {
    if (openMenu) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const onCopy = () => {
    if (inviteLink) {
      copy(inviteLink);
      enqueueSnackbar('Copied!');
    } else {
      enqueueSnackbar('Link is not work!');
    }
  };

  const onLogin = () => {
    handleCloseMenu()
    handleOpenLoginDialog()
  };

  return (
    <>
      <IconButton onClick={handleOpenMenu} sx={{}}>
        <SvgColor
          sx={{
            width: 32,
            height: 32,
          }}
          src="/assets/icons/navbar/ic_menu_item.svg"
        />
      </IconButton>

      <Drawer
        open={openMenu}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            pb: 5,
            width: 260,
          },
        }}
      >
        <Scrollbar>
          <Logo sx={{ mx: 2.5, my: 3 }} />

          {data.map((list) => (
            <NavList key={list.title} data={list} />
          ))}
        </Scrollbar>
        <Box
          component="img"
          src="/assets/images/refer.webp"
          sx={{ mx: 2, my: 1.5, borderRadius: 1 }}
        />

        {
          user ? <>
            <TextField
              label="Your referral link"
              disabled
              value={inviteLink}
              name="invite-link"
              size='small'
              sx={{ mx: 2, my: 1 }}
            />
            <Button
              color="primary"
              // size="small"
              variant="contained"
              onClick={onCopy}
              sx={{ mx: 2, borderRadius: 1 }}
            >
              Copy link
            </Button>
          </> :
            <Button
              variant="contained"
              color="primary"
              onClick={onLogin}
              sx={{ mx: 2 }}
            >
              Login
            </Button>
        }

      </Drawer>
    </>
  );
}

NavMobile.propTypes = {
  data: PropTypes.array,
};
