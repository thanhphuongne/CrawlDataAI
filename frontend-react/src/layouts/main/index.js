import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';

import { usePathname } from 'src/routes/hooks';

import Header from './header';
// import Popup from '../../sections/popup/popup';

// ----------------------------------------------------------------------

export default function MainLayout({ children }) {
  const pathname = usePathname();

  const homePage = pathname === '/';

  return (
    <>
      {/* <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}> */}
      {/* <Popup /> */}
      <Header />
      <Stack direction="column" minHeight="100vh" width="full">
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // mt: 4,
            ...(!homePage && {
              pt: { xs: 8, md: 10 },
            }),
          }}
        >
          {children}
        </Box>

        {/* <Footer /> */}
      </Stack>
      {/* </Box> */}
    </>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
};
