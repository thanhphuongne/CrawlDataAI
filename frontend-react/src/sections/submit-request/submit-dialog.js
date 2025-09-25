import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';

import { SubmitView } from '.';

const SubmitDialog = ({ open, handleClose, actions }) => (
  <Dialog
    fullWidth
    maxWidth={false}
    open={open}
    onClose={handleClose}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    PaperProps={{
      sx: { maxWidth: 720,
        backgroundColor:'rgba(27, 43, 53, 0.9)'
       },
    }}
    sx={{
      zIndex: 999,
      backgroundColor:'rgba(0, 0, 0, 0.2)'
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
      <SubmitView  onClose = {handleClose} />
    </DialogContent>
    <DialogActions sx={{ my: 0, py: 1.5 }}>
      {/* {actions} */}
      {/* {actions || (
        // <Button onClick={handleClose} color="warning" variant="soft">
        //   Close
        // </Button>
      )} */}
    </DialogActions>
  </Dialog>
);

export default SubmitDialog;

SubmitDialog.propTypes = {
  open: PropTypes.any,
  handleClose: PropTypes.func,
  actions: PropTypes.any,
};
