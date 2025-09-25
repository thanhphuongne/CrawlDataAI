
import PropTypes from 'prop-types';
import { useContext } from 'react';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { SubmitDialogContext } from 'src/components/settings';

import SubmitDialog from 'src/sections/submit-request/submit-dialog';

// import { PATH_AFTER_LOGIN } from 'src/config-global';

// ----------------------------------------------------------------------

export default function SubmitButton({ sx }) {
  const { dialogOpen, handleOpenSubmitDialog, handleCloseSubmitDialog } =
    useContext(SubmitDialogContext);

  const onpenDialog = async () => {
   
    handleOpenSubmitDialog();
  };

  // useEffect(() => {
  //   const currentPath = window.location.href;
  //   if (!currentPath.includes('/login?id')) {
  //     const queryParameters = new URLSearchParams(window.location.search);
  //     const username = queryParameters.get("username");
  //     const first_name = queryParameters.get("first_name");
  //     const photo_url = queryParameters.get("photo_url");
  //     if (username && first_name && photo_url) {
  //       handleOpenLoginDialog();
  //     }
  //   }
  // }, []);
  const renderButton = (
       <Button
       variant="contained"
       color="primary"
       sx={{ ...sx , backgroundColor: '#d2b36d' }}
       onClick={onpenDialog}
     >
       Log Contribute
     </Button>
  );
  return (
    <Container>
      {renderButton}

      <SubmitDialog open={dialogOpen} handleClose={handleCloseSubmitDialog} />
    </Container>
  );
}

 SubmitButton.propTypes = {
  sx: PropTypes.object,
};
