import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Q-Scoring',
    children: [
      { name: 'About us', href: paths.about },
      { name: 'Contact us', href: paths.contact },
      { name: 'FAQs', href: paths.faqs },
    ],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and Condition', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  },
  {
    headline: 'Contact',
    children: [{ name: 'tienpm3@qai.solutions', href: '#' }],
  },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const handleClick = (url) => {
    window.open(url, '_blank');
  };

  const pathname = usePathname();

  // const homePage = pathname === '/';

  // console.log('pathname: ', pathname)

  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        mt: 3,
        py: 3,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Logo sx={{ mb: 1, mx: 'auto' }} />

        <Typography variant="caption" component="div">
          © All rights reserved
        </Typography>
      </Container>
    </Box>
  );

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
        mt: 8,
      }}
    >
      {/* <Divider /> */}

      <Container
        sx={{
          py: { xs: 3, md: 5 },
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        {/* <Logo sx={{ mb: 3 }} /> */}

        <Grid
          container
          alignItems="center"
          justifyContent={{
            xs: 'center',
            md: 'space-between',
          }}
        >
          {/* <Grid xs={8} md={3} mb={{ xs: 2, md: 0 }}>
            <Logo sx={{ width: 100 }} />
          </Grid> */}
          {/* <Grid xs={8} md={3} mb={{ xs: 1.5, md: 0 }}>
            <Typography variant="body2">
              © {new Date().getFullYear()}. All rights reserved
            </Typography>
          </Grid> */}
          {/* <Grid xs={8} md={3}> */}
            {/* <Typography
              variant="body2"
              sx={{
                maxWidth: 270,
                mx: { xs: 'auto', md: 'unset' },
              }}
            >
              The starting point for your journey to earn online and passively through affiliate marketing campaigns.
            </Typography> */}

            {/* <Stack direction="row-reverse" justifyContent={{ xs: 'center', md: 'flex-start' }}>
              {_socials.slice(0, 5).map((social) => (
                <IconButton
                  key={social.name}
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(social.color, 0.08),
                    },
                  }}
                  onClick={() => handleClick(social.path)}
                >
                  <Iconify color="#404040" width={25} icon={social.icon} />
                </IconButton>
              ))}
            </Stack> */}
          {/* </Grid> */}

          {/* <Grid xs={12} md={6}>
            <Stack spacing={5} direction={{ xs: 'column', md: 'row' }}>
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                  sx={{ width: 1 }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid> */}
        </Grid>

        {/* <Typography variant="body2" sx={{ mt: 10 }}>
          © {new Date().getFullYear()}. All rights reserved
        </Typography> */}
      </Container>
    </Box>
  );

  if (pathname === '/') {
    return mainFooter; // simpleFooter;
  }
  if (pathname.includes('user/')) {
    // return null;
  }
  return mainFooter;

  // return homePage ? simpleFooter : mainFooter;
  // return simpleFooter
}
