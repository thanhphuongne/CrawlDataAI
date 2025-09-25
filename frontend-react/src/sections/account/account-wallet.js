import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
// import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { fShortenWalletAddress } from 'src/utils/format-number';

import { useAuthContext } from 'src/auth/hooks';
import { addWalletLink } from 'src/ton-connect/ton-connect';
import { useMetaMaskLogin } from 'src/nvm-wallet-connect/metamask-connect';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
export default function AccountWallet() {
  const { user } = useAuthContext();
  const { connectTon, disconnect, loadingConnectTon } = addWalletLink();
  const { linkMetaMask, loadingConnect } = useMetaMaskLogin();
  const connectWalletLink = (type) => {
    if (type === 'evm') {
      linkMetaMask();
    } else {
      connectTon();
    }
  };

  // const formatAddress = (add) => add?.substring(0, 7) + '...' + add?.substring(add.length - 10, add.length);

  const renderWallet = useCallback(() => {
    const walletLinks = [{ type: 'evm' }, { type: 'tvm' }];
    user?.wallet_links?.forEach((data) => {
      if (data.type === 'evm') {
        walletLinks[0] = { ...data };
      } else if (data.type === 'tvm') {
        walletLinks[1] = { ...data };
      }
    });

    return walletLinks.map((data, index) => (
      <Grid xs={12} md={6}>
        <Card
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
          }}
        >
          <Box>
            <Box sx={{ mx: 2, my: 1, typography: 'subtitle2' }}>
              Connect {data.type.toUpperCase()} Wallets
            </Box>
            <Box sx={{}}>
              <Button
                size="large"
                fullWidth
                variant="soft"
                color={data.type === 'evm' ? 'warning' : 'info'}
                onClick={
                  data?.wallet_address
                    ? () => disconnect(data.id, data.wallet_address)
                    : () => connectWalletLink(data.type)
                }
                disabled={loadingConnectTon || loadingConnect}
              >
                {/* {data.type === 'evm' ? <Iconify icon="logos:metamask-icon" width={24} /> : <Iconify icon="simple-icons:ton" width={24} color="#0098ea" style={{ background: "#fff", borderRadius: '50%', padding: '0.5px' }} />} */}
                <Typography variant="p">
                  {data?.wallet_address
                    ? fShortenWalletAddress(data?.wallet_address)
                    : 'Connect now'}
                </Typography>
                {data?.wallet_address && (
                  <Iconify
                    icon="solar:trash-bin-trash-bold"
                    width={24}
                    color="red"
                    sx={{ ml: 1 }}
                  />
                )}
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              width: 80,
              height: 80,
              lineHeight: 0,
              alignItems: 'center',
            }}
          >
            {data.type === 'evm' ? (
              <Iconify icon="logos:metamask-icon" width="100%" />
            ) : (
              <Iconify icon="simple-icons:ton" width="100%" color="#0098ea" />
            )}
          </Box>
        </Card>
      </Grid>

      // <Stack spacing={1} key={index}>
      //   <Typography variant="p" >Connect {data.type.toUpperCase()} Wallets</Typography>
      //   <Button
      //     size="large"
      //     fullWidth
      //     variant="contained"
      //     color="primary"
      //     onClick={data?.wallet_address ? () => disconnect(data.id) : () => connectWalletLink(data.type)}
      //     disabled={loadingConnectTon || loadingConnect}
      //   >
      //     {data.type === 'evm' ? <Iconify icon="logos:metamask-icon" width={24} /> : <Iconify icon="simple-icons:ton" width={24} color="#0098ea" style={{ background: "#fff", borderRadius: '50%', padding: '0.5px' }} />}
      //     <Typography variant="p" width="90%">{data?.wallet_address ? formatAddress(data?.wallet_address) : 'Connect Wallet'}</Typography>
      //     {data?.wallet_address && <Iconify icon="solar:trash-bin-trash-bold" width={24} color='red' />}
      //   </Button>
      // </Stack>
    ));
  }, [user, loadingConnectTon, loadingConnect]);

  return (
    <Grid container spacing={3}>
      {renderWallet()}

      {/* <Grid xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={10}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            {renderWallet()}
          </Box>
        </Card>
      </Grid> */}
    </Grid>
  );
}
