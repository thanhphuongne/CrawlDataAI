import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
// import Button from '@mui/material/Button';
// import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';

import { JwtLoginView } from '.';

const LoginDialog = ({ open, handleClose, title, content, actions }) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    sx={{
      zIndex: 999,
    }}
  >
    {/* <DialogTitle id="dialog-title"></DialogTitle> */}
    <DialogContent
      sx={{
        mt: 3,
        mx: 1,
      }}
    >
      {/* <DialogContentText id="dialog-description">{content}</DialogContentText> */}
      <JwtLoginView />
    </DialogContent>
    <DialogActions sx={{ my: 0, py: 1.5 }}>
      {actions}
      {/* {actions || (
        <Button onClick={handleClose} color="warning" variant="soft">
          Close
        </Button>
      )} */}
    </DialogActions>
  </Dialog>
);

export default LoginDialog;

LoginDialog.propTypes = {
  open: PropTypes.any,
  handleClose: PropTypes.any,
  title: PropTypes.any,
  content: PropTypes.any,
  actions: PropTypes.any,
};
