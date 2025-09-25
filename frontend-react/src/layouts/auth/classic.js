import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';


// ----------------------------------------------------------------------

export default function AuthClassicLayout({ children, image, title }) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'sm');

  const renderLogo = (
    <Link component={RouterLink} href={paths.root}>
      <Box
        component="img"
        src="/assets/logo-qai-light.png"
        sx={{ display: { xs: 'none', sm: 'block' }, width: 120, zIndex: 9, position: 'absolute', m: { xs: 2, md: 5 } }}
      />
    </Link>
  );

  const renderContent = (
    <Stack
      direction="row"
      alignItems="center"
      justifyItems="center"
      sx={{
        // height: '100vh',
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 6 },
      }}
    >
      <Stack flexGrow={1} direction="column" justifyContent="center" alignContent="center">
        <Box sx={{
          // maxHeight: "80vh",
        }}>{children}</Box>
      </Stack>
    </Stack>
  );

  const renderSection = (
    <Stack xs={0}  md={12}
      flexGrow={1}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      sx={{
        height: '100vh',
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0 : 0
          ),
          imgUrl: '/assets/images/banner-login/content.png',
        }),
        position: 'relative',
      }}
    >

      {/* <Box  component="img" alt="auth" src={image || '/assets/images/banner-login/content.png'} /> */}
    </Stack>
  );

  return (
    // <Stack
    //   component="main"
    //   direction="row"
    //   sx={{
    //     height: '100vh',
    //   }}
    // >
    <>
      {renderLogo}

      <Grid
        container
        sx={{
          width: { xs: '100vw', md: 'auto', sm: 'auto' },
        }}
      >
        {/* <Grid xs={0} md={8}>
          {mdUp && renderSection}
        </Grid>
        <Grid xs={12} md={4}>
          {renderContent}
        </Grid> */}
        <Grid xs={12} sm={12} md={12} sx={{ position: 'relative' }}>
          {/* Phần renderSection */}
          {mdUp && renderSection}
          <Box xs={12} sm={12} md={12} sx={{
            position: 'absolute',
            // top: 0,
            right: 0,
            zIndex: 1,
            padding: '10px', // Khoảng cách bên trong
            background: 'rgba(255, 255, 255, 0.1)', // Nền trắng trong suốt
            border: '1px solid #ccc', // Viền màu xám
            borderRadius: '8px', // Bo góc
            backdropFilter: 'blur(1px)', // Hiệu ứng làm mờ nền
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Đổ bóng
            display: 'flex',
            alignItems: 'center', // Căn giữa nội dung theo chiều dọc
            alignSelf: 'anchor-center', // Đẩy renderContent sang bên phải
            [theme.breakpoints.up('sm')]: {
              // Thiết lập cho màn hình lớn
              position: 'absolute',
              // top: '10vh',
              right: '10vh',
              justifyContent: 'flex-end', // Căn phải nội dung
              marginRight: '10vh',
            },
            [theme.breakpoints.down('sm')]: {
              // Thiết lập cho màn hình nhỏ
              position: 'static',
              margin: '0 auto',
              justifyContent: 'center',
              marginTop: 0, // Không margin ở màn hình nhỏ
              marginRight: 0,
              height:"100vh"
            },
            // margin: "0 auto"
          }}>

            {renderContent}

          </Box>

        </Grid>
      </Grid>
    </>
    // </Stack>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};
