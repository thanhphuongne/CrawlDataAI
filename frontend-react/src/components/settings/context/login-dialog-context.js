'use client';

import PropTypes from 'prop-types';
import {
  useMemo,
  useState,
  useCallback,
  createContext,
} from 'react';

export const LoginDialogContext = createContext();

export const LoginDialogProvider = ({ children }) => {
  const [dialogOpen, setLoginDialogOpen] = useState(false);

  // mở popup login
  const handleOpenLoginDialog = useCallback(() => {
    setLoginDialogOpen(true);
  }, []);

  // đóng popup login
  const handleCloseLoginDialog = useCallback(() => {
    setLoginDialogOpen(false);
  }, []);

  const loginContextValue = useMemo(() => ({
    dialogOpen,
    handleOpenLoginDialog,
    handleCloseLoginDialog
  }), [dialogOpen, handleOpenLoginDialog, handleCloseLoginDialog]);


  return (
    <LoginDialogContext.Provider value={loginContextValue}>
      {children}
    </LoginDialogContext.Provider>
  );
};

LoginDialogProvider.propTypes = {
  children: PropTypes.any,
};
