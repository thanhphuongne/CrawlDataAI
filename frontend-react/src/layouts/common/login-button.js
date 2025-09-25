import PropTypes from 'prop-types';
import { useEffect, useContext } from 'react';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { LoginDialogContext } from 'src/components/settings';

import LoginDialog from 'src/sections/auth/jwt/login-dialog';

// import { PATH_AFTER_LOGIN } from 'src/config-global';

// ----------------------------------------------------------------------

export default function LoginButton({ sx }) {
  const { dialogOpen, handleOpenLoginDialog, handleCloseLoginDialog } =
    useContext(LoginDialogContext);

  const onpenDialog = async () => {
    handleOpenLoginDialog();
  };

  useEffect(() => {
    const currentPath = window.location.href;
    if (!currentPath.includes('/login?id')) {
      const queryParameters = new URLSearchParams(window.location.search);
      const username = queryParameters.get("username");
      const first_name = queryParameters.get("first_name");
      const photo_url = queryParameters.get("photo_url");
      if (username && first_name && photo_url) {
        handleOpenLoginDialog();
      }
    }
  }, []);
  const renderButton = (
    <Button variant="outlined" sx={{ ...sx }} onClick={onpenDialog}>
      Login
    </Button>
  );
  return (
    <Container>
      {renderButton}

      <LoginDialog open={dialogOpen} handleClose={handleCloseLoginDialog} />
    </Container>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
};
