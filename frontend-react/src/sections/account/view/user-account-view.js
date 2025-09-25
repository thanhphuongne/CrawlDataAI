'use client';

import { useTheme } from '@emotion/react';
import { useState, useEffect, useCallback } from 'react';

import { alpha } from '@mui/system';
import { Box, Grid, Avatar, Tooltip, Container, Typography } from '@mui/material';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import AccountGeneral from '../account-general';

// import AccountChangePassword from '../account-change-password';

// ----------------------------------------------------------------------

// const TABS = [
// {
//   value: 'general',
//   label: 'General',
//   icon: <Iconify icon="solar:user-id-bold" width={24} />,
// },
// {
//   value: 'billing',
//   label: 'Billing',
//   icon: <Iconify icon="solar:bill-list-bold" width={24} />,
// },
// {
//   value: 'notifications',
//   label: 'Notifications',
//   icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
// },
// {
//   value: 'social',
//   label: 'Social links',
//   icon: <Iconify icon="solar:share-bold" width={24} />,
// },
// {
//   value: 'wallet',
//   label: 'Wallet',
//   icon: <Iconify icon="carbon:wallet" width={24} />,
// },
// {
//   value: 'invite-friend',
//   label: 'Invite-friend',
//   icon: <Iconify icon="mdi:invite" width={24} />,
// },

// {
//   value: 'security',
//   label: 'Security',
//   icon: <Iconify icon="ic:round-vpn-key" width={24} />,
// },
// ];

// ----------------------------------------------------------------------

export default function AccountView() {
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState('general');
  const [page, setPage] = useState('xofferID');
  const router = useRouter();
  const theme = useTheme();
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  const currentPath = window.location.href;

  useEffect(() => {
    if (currentPath.includes('user/account?id')) setCurrentTab('genaral');
    // console.log('currnet path,', currentPath)
  }, [currentPath]);
  // useEffect(() => {
  //   if (searchParams.get('xofferid') === 'wallet') {
  //     setPage('xofferID');
  //     setCurrentTab('wallet');
  //   }
  //   // console.log('currnet path,', searchParams.get('xofferid'))
  // }, [searchParams]);

  // Page hiện tại
  // const handleListItemClick = (value) => {
  //   setPage(value);
  //   if (searchParams.get('xofferid') === 'wallet') {
  //     router.push('/user/account');
  //   }
  // };

  // Menu dọc bên trái
  // const VerticalMenu = (
  // <Stack spacing={2}>
  //   {NAV_ITEMS.map((item, index) => (
  //     <ListItemButton
  //       key={index}
  //       selected={page === item.value}
  //       onClick={() => handleListItemClick(item.value)}
  //     >
  //       <ListItemIcon>{item.icon}</ListItemIcon>
  //       <ListItemText primary={item.title} />
  //     </ListItemButton>
  //   ))}
  // </Stack>
  // );

  // Level của user
  const levelUser = (level) => {
    if (!level || level === 4) return 'Basic';
    else if (level === 1) return 'Plus';
    else if (level === 2) return 'Premium';
    else return 'Platinum';
  };

  // Hiện thị avatar ở trên
  const avatar = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 3 }}>
      <Avatar src={user?.avatar} alt={user?.full_name} sx={{ width: 100, height: 100, mb: 1 }} />
      <Tooltip title="Your current xPoint!">
        <Label
          sx={{
            py: 1.5,
            px: 1,
            fontSize: '11px',
            mt: -2.5,
            zIndex: 1,
            color: 'white',
            borderRadius: 10,
            backgroundColor: alpha(theme.palette.primary.main, 1),
          }}
        >
          <Iconify width="15px" sx={{ color: '#ffd700' }} icon="ant-design:thunderbolt-filled" />
          {user?.reward_points}
        </Label>
      </Tooltip>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6">{user?.full_name}</Typography>
        {/* {user && user?.is_verify === 2 ? ( */}
        <Iconify
          icon="bitcoin-icons:verify-filled"
          sx={{ color: '#00AB55', width: 30, height: 30 }}
        />
        {/* ) : ( */}
        {/* <Tooltip title="Please verify your email" arrow placement="right" color="red">
            <Iconify
              icon="ph:seal-warning-fill"
              color="#ff3d12"
              sx={{ width: 20, height: 20, ml: 0.5 }}
            />
          </Tooltip>
        )} */}
      </Box>
      {/* <Typography variant="body2" color="textSecondary">
        Level:
        <Typography component="span" color="primary.main" sx={{ px: 0.5 }}>
          {levelUser(user?.user_level?.package_id)}
        </Typography>
      </Typography> */}
      {/* {user?.is_verify !== 2 && (
        <Typography
          variant="subtitle2"
          color="#ff3d12"
          // sx={{ display: { xs: 'block', md: 'block' } }}
        >
          Please verify your email
        </Typography>
      )} */}
    </Box>
  );

  // page xOfferID
  const xOferID = (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 5 }}>
      <Box>
        {/* <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: 3,
            // px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs> */}

        <AccountGeneral />

        {/* {currentTab === 'general' && <AccountGeneral />} */}
        {/* {currentTab === 'billing' && (
          <AccountBilling
            plans={_userPlans}
            cards={_userPayment}
            invoices={_userInvoices}
            addressBook={_userAddressBook}
          />
        )} */}
        {/* {currentTab === 'wallet' && <AccountWallet />}
        {currentTab === 'notifications' && <AccountNotifications />}
        {currentTab === 'social' && <AccountSocialLinks socialLinks={_userAbout.socialLinks} />} */}

        {/* {currentTab === 'security' && <AccountChangePassword />} */}
      </Box>
    </Container>
  );

  return (
    <Container sx={{ mt: 6 }} maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <Typography variant="h4" sx={{ mb: 2 }}>
      Account Settings
    </Typography> */}

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Box component="form" sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
            {avatar}
            {/* {VerticalMenu} */}
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          {page === 'xofferID' && xOferID}
          {/* {page === 'membership' && <MembershipsView />}
          {page === 'reward' && <AccountRewardsView />}
          {page === 'invite' && <InviteFriend />} */}
        </Grid>
      </Grid>
    </Container>
  );
}

// List item trong menu
const NAV_ITEMS = [
  {
    title: 'xOfferID',
    value: 'xofferID',
    path: '#',
    icon: <Iconify icon="mdi:account-circle-outline" width={30} height={30} />,
    roles: ['admin'],
    caption: '',
  },
  // {
  //   title: 'Memberships',
  //   value: 'membership',
  //   path: '#',
  //   icon: <Iconify icon="tdesign:user-vip" width={30} height={30} />,
  //   roles: ['admin', 'user'],
  // },
  // {
  //   title: 'xPoint & Rewards',
  //   value: 'reward',
  //   path: '#',
  //   icon: <Iconify icon="mingcute:trophy-line" width={30} height={30} />,
  //   // info: <Label color="error"></Label>,
  // },
  // {
  //   title: 'Invite Friends',
  //   value: 'invite',
  //   path: '#',
  //   icon: <Iconify icon="hugeicons:add-team" width={30} height={30} />,
  // },
  // {
  //   title: 'Terms & Conditions',
  //   value: 'term',
  //   path: '#',
  //   icon: <Iconify icon="ion:book-outline" width={30} height={30}/>,
  //   // children: [
  //   //   { title: 'Blog Posts', path: '#' },
  //   //   { title: 'Blog Post', path: '#' },
  //   // ],
  // },
];
