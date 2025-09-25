import { useState } from 'react';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { approveTokenLock, useUnlockPackage, useUpdatePackage, checkStatusApproveToken } from 'src/hooks/use-claim-reward';

import { useAuthContext } from 'src/auth/hooks';
import { useMetaMaskLogin } from 'src/nvm-wallet-connect/metamask-connect';
import { subscriptionUnlockLevel, subscriptionUpgradeLevel } from 'src/api/user';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialogCustom } from 'src/components/custom-dialog/confirm-dialog';
// ----------------------------------------------------------------------

export default function PricingMemberShipCard({ packageData, user, card, sx, ...other }) {
  const { subscription, price, lists } = card;
  const theme = useTheme();
  const basic = subscription === 'basic';
  const plus = subscription === 'plus';
  const premium = subscription === 'premium';
  const platinum = subscription === 'platinum';

  const { updateDispath } = useAuthContext();
  const [openDialogWallet, setOpenDialogWallet] = useState(false);
  const [messageCheckWallet, setMessageCheckWallet] = useState('');
  const [typeErrorCheck, setTypeErrorCheck] = useState('');
  const [typeClaim, setTypeClaim] = useState('');
  const [openDialogClaim, setOpenDialogClaim] = useState(false);
  const { getAccount, reconnectMetaMask } = useMetaMaskLogin();
  const [loading, setLoading] = useState(false);
  const [idPackage, setIdPackage] = useState(0);
  const router = useRouter();
  const unlockTokenPK = () => {
    setLoading(true);
    useUnlockPackage().then(tx => {
      if (!tx.status) {
        enqueueSnackbar(tx.message, { variant: 'error' });
      } else {
        subscriptionUnlockLevel(tx).then(res => {
          if (res.status) {
            updateDispath();
            enqueueSnackbar('Unlock success');
          } else {
            enqueueSnackbar(res.data.message, { variant: 'error' });
          }
        }).catch(error => {
          enqueueSnackbar(error.message, { variant: 'error' });
          setLoading(false);
        });
        setOpenDialogClaim(false)
      }
      setLoading(false);
    })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
        setLoading(false);
      })
  }

  const updatePackage = () => {
    setLoading(true);
    useUpdatePackage(idPackage)
      .then(tx => {
        if (!tx.status) {
          enqueueSnackbar(tx.message, { variant: 'error' });
        } else {
          subscriptionUpgradeLevel(tx).then(res => {
            if (res.status) {
              updateDispath();
              enqueueSnackbar('Upgrade success');
            } else {
              enqueueSnackbar(res.data.message, { variant: 'error' });
            }
          }).catch(error => {
            enqueueSnackbar(error.message, { variant: 'error' });
            setLoading(false);
          });
          setOpenDialogClaim(false)
        }
        setLoading(false);
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
        setLoading(false);
      })
  }

  const checkApproveToken = () => {
    setLoading(true);
    checkStatusApproveToken().then(res => {
      if (res) {
        updatePackage();
      } else {
        approveTokenLock().then(response => {
          if (response.status) {
            updatePackage();
          } else {
            enqueueSnackbar(response.message, { variant: 'error' });
            setLoading(false);
          }
        }).catch(err => {
          enqueueSnackbar(err, { variant: 'error' });
          setLoading(false);
        })
      }
    }).catch(err => {
      enqueueSnackbar(err.message, { variant: 'error' });
      setLoading(false);
    })
  }

  const checkWallet = (id_package) => {
    setIdPackage(id_package)
    setTypeClaim(id_package === user?.user_level?.package_id ? 'Unlock Package' : 'Update package');
    const publicAddress = user?.wallet_links.filter(data => data.type === "evm");
    if (publicAddress[0]) {
      getAccount().then(res => {
        if (!res) {
          return false;
        } else if (!res[0]) {
          setMessageCheckWallet("Please connect your wallet to receive rewards")
          setOpenDialogWallet(true);
          setTypeErrorCheck('connect');
          return false;
        } else if (publicAddress[0].wallet_address?.toLowerCase() !== res[0]?.toLowerCase()) {
          setMessageCheckWallet("Please connect wallet: " + publicAddress[0].wallet_address)
          setOpenDialogWallet(true);
          setTypeErrorCheck('connect');
        } else {
          setOpenDialogClaim(true)
        }
      });
    } else {
      setMessageCheckWallet("Please add your Amoy wallet to receive rewards")
      setOpenDialogWallet(true);
      setTypeErrorCheck('add')
    }
  }
  const connectWallet = () => {
    if (typeErrorCheck === 'add') {
      router.push('/user/account?xofferid=wallet');
      setOpenDialogWallet(false);
    } else {
      reconnectMetaMask().then(res => {
        if (res) {
          setOpenDialogWallet(false);
        }
      });

    }
  }

  const renderIcon = (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Box sx={{ width: 48, height: 48 }}>
        {basic && <img width={50} style={{ margin: 'auto' }} src='/assets/images/memberships/basic.webp' alt="" />}
        {plus && <img width={50} style={{ margin: 'auto' }} src='/assets/images/memberships/plus.webp' alt="" />}
        {premium && <img width={50} style={{ margin: 'auto' }} src='/assets/images/memberships/premium.webp' alt="" />}
        {platinum && <img width={50} style={{ margin: 'auto' }} src='/assets/images/memberships/platinum.webp' alt="" />}
      </Box>

      {card.id === user?.user_level?.package_id && <Label color="info">Active</Label>}
    </Stack>
  );

  const renderSubscription = (
    <Stack spacing={1}>
      <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
        {subscription}
      </Typography>
      {/* <Typography variant="subtitle2">{caption}</Typography> */}
    </Stack>
  );

  const renderPrice = basic ? (
    <Typography variant="h3">Free</Typography>
  ) : (
    <Stack direction="row">
      <Typography variant="h6">$XO</Typography>

      <Typography variant="h3">{price}</Typography>
    </Stack>
  );

  const renderList = (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box component="span" sx={{ typography: 'overline' }}>
          Features
        </Box>
        {/* <Link variant="body2" color="inherit" underline="always">
          All
        </Link> */}
      </Stack>

      {lists.map((item) => (
        <Stack
          key={item}
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            typography: 'body2',
            fontSize: '13px'
          }}
        >
          <Iconify icon="eva:checkmark-fill" width={16} />
          {item}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <ConfirmDialogCustom
        open={openDialogWallet}
        onClose={() => setOpenDialogWallet(false)}
        title="Check Wallet"
        content={messageCheckWallet}
        btnDisable={loading}
        action={
          <Button variant="contained" color="primary" onClick={() => connectWallet()}>
            {typeErrorCheck === 'add' ? 'Add Wallet' : 'Connect Wallet'}
          </Button>
        }
      />
      <ConfirmDialogCustom
        open={openDialogClaim}
        onClose={() => setOpenDialogClaim(false)}
        title={typeClaim}
        content={'Please confirm, if you want ' + typeClaim}
        btnDisable={loading}
        action={
          <Button variant="contained" color='primary' disabled={loading} onClick={typeClaim === 'Unlock Package' ? unlockTokenPK : checkApproveToken}>
            Confirm
          </Button>
        }
      />
      <Stack
        spacing={3}
        sx={{
          p: 2.5,
          borderRadius: 2,
          background: card.id === user?.user_level?.package_id || (card.id === 4 && !user?.user_level) ? alpha(theme.palette.primary.main, 0.13) : '',
          ...((basic || plus || premium) && {
            borderTopRightRadius: { md: 0 },
            borderBottomRightRadius: { md: 0 },
          }),
          boxShadow: (themes) => ({
            xs: themes.customShadows.card,
            md: `-50px 40px 80px 10px ${alpha(
              themes.palette.mode === 'light' ? themes.palette.grey[500] : themes.palette.common.black,
              0.16
            )}`,
          }),
          ...sx,
        }}
        {...other}
      >
        {renderIcon}

        {renderSubscription}

        {renderPrice}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderList}

        <Button
          fullWidth
          size="large"
          variant="contained"
          disabled={basic}
          onClick={() => checkWallet(card.id)}
          color='primary'
        >
          {card.id === user?.user_level?.package_id && card.id !== 4 ? 'Unlock token' : card.labelAction}
        </Button>
      </Stack>
    </>
  );
}

PricingMemberShipCard.propTypes = {
  packageData: PropTypes.any,
  user: PropTypes.object,
  card: PropTypes.object,
  sx: PropTypes.object,
};
