import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

export default function Popup() {

  const dialog = useBoolean(false);
  const [fullWidth, setFullWidth] = useState(false);

  const [maxWidth, setMaxWidth] = useState('sm');

  useEffect(() => {
    const isClosed = localStorage.getItem('popupClosed');
    if (!isClosed) {
      const timer = setTimeout(() => {
        dialog.onTrue();
      }, 5000);
      return () => clearTimeout(timer);
    } else dialog.onFalse();
  }, []);

  const handleClose = () => {
    dialog.onFalse();
    localStorage.setItem('popupClosed', 'true');
  };


  return (
    <Dialog
        open={dialog.value}
        maxWidth={maxWidth}
        // onClose={dialog.onFalse}
        fullWidth={fullWidth}
      >

        <Box sx={{ position: 'relative', opacity: 10 }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              zIndex: 1,
            }}
          >
            <Iconify
              width={24}
              icon="mdi:close"
              color="#ffffff"
            />
          </IconButton>
        </Box>

        <Link href="https://telegram.me/xOfferRef_bot?start=457700271" target="_blank">
          <Image
            alt="our office 1"
            src="/assets/images/about/banner_referral.png"
            sx={{ width: '100%', padding: '0px', margin: '0px' }}
          />
        </Link>
      </Dialog>
  );
}











