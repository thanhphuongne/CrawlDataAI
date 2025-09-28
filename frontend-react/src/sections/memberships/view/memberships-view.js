'use client';

import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { Paper, Button, Tooltip } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { approveTokenLock, useUnlockPackage, useUpdatePackage, checkStatusApproveToken } from 'src/hooks/use-claim-reward';

import { useAuthContext } from 'src/auth/hooks';
import { useMetaMaskLogin } from 'src/nvm-wallet-connect/metamask-connect';
import { subscriptionUnlockLevel, subscriptionUpgradeLevel } from 'src/api/user';

import Iconify from 'src/components/iconify';
import { useTable } from 'src/components/table';
import { MotionViewport } from 'src/components/animate';
import { LoadingScreen } from 'src/components/loading-screen';
import { ConfirmDialogCustom } from 'src/components/custom-dialog/confirm-dialog';

import PricingMemberShipView from '../pricing/view';


const defaultFilters = {
  name: '',
  date: null,
  status: 'dashboard',
};

// ----------------------------------------------------------------------

export default function MembershipsView() {
  const theme = useTheme();
  const { user, xofferPackages } = useAuthContext();
  const [filters, setFilters] = useState(defaultFilters);
  const table = useTable({ defaultOrderBy: 'createDate' });
  const TABS = [
    { value: 'dashboard', label: 'Dashboard', color: 'default', icon: <Iconify icon="material-symbols-light:empty-dashboard-outline-rounded" width={24} /> },
    { value: 'memberships_plans', label: 'Memberships Plans', color: 'default', icon: <Iconify icon="tdesign:user-vip" width={24} /> },
  ];
  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const view = () => (
    filters.status === 'dashboard' ?
      <DashboardView packageData={xofferPackages} pointsReceived={user} user={user} /> : <PricingMemberShipView packageData={xofferPackages} user={user} />
  );

  return (
    <Container component={MotionViewport}>
      <Box>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            // px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              icon={tab.icon}
              key={tab.value}
              value={tab.value}
              label={tab.label}
            // iconPosition="end"

            />
          ))}
        </Tabs>
        {xofferPackages ? view() : <LoadingScreen sx={{ py: 20 }} />}
      </Box>
    </Container >
  );
}


export function DashboardView({ packageData, pointsReceived, user }) {
  const theme = useTheme();
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
    setTypeClaim(user?.user_level?.package_id === id_package ? 'Unlock Package' : 'Update package');
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
      <Stack spacing={3} sx={{ py: 3 }}>
        <Box display="grid" gap={3} gridTemplateColumns='repeat(1, 1fr)'>
          <Paper variant="outlined" sx={{ py: 2.5, px: 1, textAlign: 'center', background: alpha(theme.palette.primary.main, 0.13), border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Typography variant="p" sx={{ mt: 0.5 }}>
                Welcome to Your AICrawlData Dashboard! Here, you can effortlessly monitor your membership status, track your rewards, and view your AICrawlData performance. Stay updated and make the most out of your AICrawlData experience!
              </Typography>
            </Stack>
          </Paper>
        </Box>

        {/* list package */}
        <Box display="grid" gap={3} gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }}>
          {
            packageData.length > 0 && packageData.map((data, index) => (
              <Paper variant="outlined" key={index} sx={{ py: 2.5, textAlign: 'center', background: data.id === user?.user_level?.package_id || (data.id === 4 && !user?.user_level) ? alpha(theme.palette.primary.main, 0.13) : '', border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
                <Stack
                  display='grid'
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  <img
                    width={50}
                    style={{ margin: 'auto' }}
                    src={`/assets/images/memberships/${data.name?.toLowerCase()}.webp`}
                    alt=""
                  />
                  <Typography variant="h6" >
                    {data.name}
                  </Typography>
                  {data.lock_required === 0 ? <Typography variant="p">
                    Free
                  </Typography> : <Typography variant="p">
                    Lock  {data.lock_required} $XO
                  </Typography>}
                  {data.lock_required > 0 && <Button variant="contained" onClick={() => checkWallet(data.id)} color="primary" sx={{ width: '115px' }}>
                    {data.id === user?.user_level?.package_id ? 'Unlock token' : 'Get ' + data.name}
                  </Button>}
                </Stack>
              </Paper>
            ))
          }


        </Box>

        {/* thong tin coin */}
        <Box display="grid" gap={3} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}>
          <Box display="grid" gap={3} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} sx={{ borderRadius: 1, p: 3, boxShadow: `rgba(17, 17, 26, 0.1) 0px 0px 16px` }}>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
              <Stack
                display='flex'
                direction="row"
                justifyContent='space-between'
                spacing={2}
                sx={{ minHeight: '30px' }}
              >
                <Typography variant="p" fontWeight={600} fontSize={13} textAlign='left'>
                  XO Daily Rewards
                </Typography>
                <Tooltip sx={{ backgroundColor: 'unset', mt: '2px' }} title='View daily XO Daily rewards and premium membership bonuses (Coming Soon).'>
                  <Iconify icon="memory:tooltip-above-alert" />
                </Tooltip>
              </Stack>
              <Stack
                display='flex'
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{ mt: 2 }}
              >
                <Typography variant="h6" display='flex' alignItems='center' gap={1} color={alpha(theme.palette.primary.main, 1)}>
                  <img
                    width={20}
                    style={{ margin: 'auto' }}
                    src='/assets/logo_qai.png'
                    alt=""
                  /> 0.000 XO
                </Typography>
              </Stack>
            </Paper>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
              <Stack
                display='flex'
                direction="row"
                justifyContent='space-between'
                spacing={2}
                sx={{ minHeight: '30px' }}
              >
                <Typography variant="p" fontWeight={600} fontSize={13} textAlign='left'>
                  xPoint Multipliers
                </Typography>
                <Tooltip sx={{ backgroundColor: 'unset', mt: '2px' }} title='Track daily xPoint accumulation, including premium member bonuses.'>
                  <Iconify icon="memory:tooltip-above-alert" />
                </Tooltip>

              </Stack>
              <Stack
                display='flex'
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{ mt: 2 }}
              >
                <Typography variant="h6" display='flex' alignItems='center' gap={1} color={alpha(theme.palette.primary.main, 1)}>
                  <img
                    width={20}
                    style={{ margin: 'auto' }}
                    src='/assets/icons/components/gamma.svg'
                    alt=""
                  /> {pointsReceived?.total_points_received}
                  <Typography variant="p" fontSize={15} display='flex' alignItems='center' sx={{ background: alpha(theme.palette.primary.main, 0.5), borderRadius: 5, px: 1 }}>
                    <img
                      width={15}
                      style={{ margin: 'auto' }}
                      src='/assets/icons/components/gamma.svg'
                      alt=""
                    /> +{pointsReceived?.total_points_bonus}
                  </Typography>
                </Typography>
              </Stack>
            </Paper>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
              <Stack
                display='flex'
                direction="row"
                justifyContent='space-between'
                spacing={2}
                sx={{ minHeight: '30px' }}
              >
                <Typography variant="p" fontWeight={600} fontSize={13} textAlign='left'>
                  Offers Reward
                </Typography>
                <Tooltip sx={{ backgroundColor: 'unset', mt: '2px' }} title='View Hot Offer Rewards accumulation, with added bonuses for premium members (Coming Soon).'>
                  <Iconify icon="memory:tooltip-above-alert" />
                </Tooltip>

              </Stack>
              <Stack
                display='flex'
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{ mt: 2 }}
              >
                <Typography variant="h6" display='flex' alignItems='center' gap={1} color={alpha(theme.palette.primary.main, 1)}>
                  <img
                    width={20}
                    style={{ margin: 'auto' }}
                    src='/assets/logo_qai.png'
                    alt=""
                  /> 0.000 XO
                </Typography>
              </Stack>
            </Paper>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
              <Stack
                display='flex'
                direction="row"
                justifyContent='space-between'
                spacing={2}
                sx={{ minHeight: '30px' }}
              >
                <Typography variant="p" fontWeight={600} fontSize={13} textAlign='left'>
                  Fixed Memberships Rewards
                </Typography>
                <Tooltip sx={{ backgroundColor: 'unset' }} title='Monitor your balance for the $XO APR earnings from locked tokens, distributed and updated once a week (Coming Soon).'>
                  <Iconify icon="memory:tooltip-above-alert" />
                </Tooltip>

              </Stack>
              <Stack
                display='flex'
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{ mt: 2 }}
              >
                <Typography variant="h6" display='flex' alignItems='center' gap={1} color={alpha(theme.palette.primary.main, 1)}>
                  <img
                    width={20}
                    style={{ margin: 'auto' }}
                    src='/assets/logo_qai.png'
                    alt=""
                  /> 0.000 XO
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </Box>

        <Box display="grid" gap={3} gridTemplateColumns='repeat(1, 1fr)' sx={{ borderRadius: 1, p: 3, boxShadow: `rgba(17, 17, 26, 0.1) 0px 0px 16px` }}>
          <Typography variant="h5" fontWeight={600} textAlign='left'>
            My XO
          </Typography>
          <Box display="grid" gap={3} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
            <Paper variant="outlined" sx={{ py: 2, px: 2, textAlign: 'center', border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
              <Stack
                display='flex'
                direction="row"
                justifyContent='space-between'
                spacing={2}
              >
                <Typography variant="p" fontWeight={600} fontSize={13} textAlign='left'>
                  AICrawlData
                </Typography>
                <Tooltip sx={{ backgroundColor: 'unset', mt: '2px' }} title='This number represents the quantity of XO in your xOfferID, not the XO balance in your wallet.'>
                  <Iconify icon="memory:tooltip-above-alert" />
                </Tooltip>
              </Stack>
              <Stack
                display='gird'
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{ mt: 2 }}
              >
                <img
                  width={40}
                  style={{ margin: 'auto' }}
                  src='/assets/logo_qai.png'
                  alt=""
                />
                <Typography variant="h6" display='flex' alignItems='center' gap={1} color={alpha(theme.palette.primary.main, 1)}>
                  0.000
                </Typography>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ py: 2, px: 2, textAlign: 'center', border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
              <Stack
                display='flex'
                direction="row"
                justifyContent='space-between'
                spacing={2}
              >
                <Typography variant="p" fontWeight={600} fontSize={13} textAlign='left'>
                  XO Locked
                </Typography>
              </Stack>
              <Stack
                display='gird'
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{ mt: 2 }}
              >
                <img
                  width={40}
                  style={{ margin: 'auto' }}
                  src='/assets/logo_qai.png'
                  alt=""
                />
                <Typography variant="h6" display='flex' alignItems='center' gap={1} color={alpha(theme.palette.primary.main, 1)}>
                  0.000
                </Typography>
              </Stack>
            </Paper>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Button
              fullWidth
              variant="contained"
              disabled
              color="success"
              size="large"
              startIcon={<Iconify icon="tabler:refresh" width={24} />}
            >
              Refresh Balance
            </Button>

            <Button
              fullWidth
              variant="contained"
              disabled
              size="large"
              color="success"
              startIcon={<Iconify icon="ph:hand-deposit-bold" width={24} />}
            >
              Deposit
            </Button>
          </Stack>

        </Box>
      </Stack>

    </>
  );
}

DashboardView.propTypes = {
  packageData: PropTypes.any,
  pointsReceived: PropTypes.object,
  user: PropTypes.object,
};