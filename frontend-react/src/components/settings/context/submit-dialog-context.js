'use client';

import PropTypes from 'prop-types';
import {
  useMemo,
  useState,
  useCallback,
  createContext,
} from 'react';

export const SubmitDialogContext = createContext();

export const SubmitDialogProvider = ({ children }) => {
  const [dialogOpen, setSubmitDialogOpen] = useState(false);

  // mở popup login
  const handleOpenSubmitDialog = useCallback(() => {
    setSubmitDialogOpen(true);
  }, []);

  // đóng popup login
  const handleCloseSubmitDialog = useCallback(() => {
    setSubmitDialogOpen(false);
  }, []);

  const submitContextValue = useMemo(() => ({
    dialogOpen,
    handleOpenSubmitDialog,
    handleCloseSubmitDialog
  }), [dialogOpen, handleOpenSubmitDialog, handleCloseSubmitDialog]);


  return (
    <SubmitDialogContext.Provider value={submitContextValue}>
      {children}
    </SubmitDialogContext.Provider>
  );
};

SubmitDialogProvider.propTypes = {
  children: PropTypes.any,
};
