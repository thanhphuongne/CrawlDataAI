import { useState, useEffect } from 'react';
import {
  RedditShareButton,
  TwitterShareButton,
  FacebookShareButton,
  TelegramShareButton,
  LinkedinShareButton,
} from 'next-share'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { INVITE_LINK } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import { network, getTotalPoint } from 'src/api/user';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
// import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

import SortingSelectingTable from '../user/sorting-selecting-table';

// ----------------------------------------------------------------------
export default function InviteFriend() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  // const inviteLink = `${ASSETS_API}/register?xoffer=${user?.code}`;
  const inviteLink = INVITE_LINK(user?.code)

  const [totalReward, setTotalReward] = useState(0);
  const [totalInvited, setTotalInvited] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [arrData, setArrData] = useState([]);

  // const { connectTon, disconnect, loadingConnectTon } = addWalletLink();
  const { copy } = useCopyToClipboard();

  // const { linkMetaMask, loadingConnect } = useMetaMaskLogin();
  // const connectWalletLink = (type) => {
  //   if (type === 'evm') {
  //     linkMetaMask();
  //   } else {
  //     connectTon();
  //   }
  // };

  // const formatAddress = (add) =>
  //   add?.substring(0, 7) + '...' + add?.substring(add.length - 10, add.length);
  // const ForgotPasswordSchema = Yup.object().shape({
  //   email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  // });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTotalPoint(user?.id);
      // console.log('data==', data);
      if (data !== null) {
        setTotalReward(data.earned);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await network(user?.id, 0, 50);
      if (data !== null) {
        // setTotalReward(data.earned);
        setTotalInvited(data.count)
        const count = data.data.filter(item => item.reward_points > 500).length;
        setTotalCompleted(count);
        setArrData(data.data);
      }
    };
    fetchData();
  }, [user]);


  const onCopy = () => {
    if (inviteLink) {
      copy(inviteLink);
      enqueueSnackbar('Copied!');
    } else {
      enqueueSnackbar('Link is not work!');
    }
  };

  const socialList = [
    { component: FacebookShareButton, icon: 'icon-park-solid:facebook' },
    { component: TwitterShareButton, icon: 'hugeicons:new-twitter-ellipse' },
    { component: TelegramShareButton, icon: 'mingcute:telegram-fill' },
    { component: RedditShareButton, icon: 'tabler:brand-reddit' },
    { component: LinkedinShareButton, icon: 'ri:linkedin-fill' }
  ]

  const slogan = "💸 Start Earning Money Online Today with me and AICrawlData! 💸"

  const SocialShareButtons = () => (
    <>
      {socialList.map((social, index) => {
        // Extract component and icon from the social object
        const ShareComponent = social.component;
        const { icon } = social;

        return (
          <ShareComponent
            key={index}
            url={inviteLink}
            quote={slogan}
            hashtag="#xoffer"
            title={slogan}
          >
            <IconButton
              size="small"
              color="secondary"
              sx={{
                borderRadius: 1,
                p: 1.5,
                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.16),
                },
              }}
            >
              <Iconify width={32} icon={icon} />
            </IconButton>
          </ShareComponent>
        );
      })}
    </>
  );


  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={12}>
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
            <Stack alignItems="center" justifyContent="center">
              <Image
                sx={{
                  width: '75%',
                }}
                alt="gallery"
                // ratio="1/1"
                src="/assets/images/campaigns/invite_friend.webp"
              />
            </Stack>
            <Stack sx={{ my: { md: 3 } }} spacing={1}>
              <Typography variant="subtitle2">Copy and share your referral link</Typography>

              {/* <FormProvider methods={methods} onSubmit={onSubmit}> */}
              <Stack spacing={2} alignItems="center">

                <TextField disabled fullWidth value={inviteLink} name="invite-link" />

                <LoadingButton fullWidth color="primary" size="large" variant="soft" onClick={onCopy}>
                  Copy link
                </LoadingButton>

              </Stack>

              <Typography sx={{ my: 1 }} variant="subtitle2">
                Use our templates to share your link
              </Typography>

              <Stack spacing={1} alignItems="left" justifyContent="space-between" direction="row">
                <SocialShareButtons />
              </Stack>

            </Stack>
          </Box>
        </Card>
      </Grid>

      {/* <Grid xs={12} md={12}>
        <Card
          sx={{
            p: 3,
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.8),
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
          }}
        >
          <Stack
            sx={{ my: 3 }}
            spacing={1}
            rowGap={10}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: '70% 30%',
              sm: '70% 30%',
            }}
          >
            <Typography variant="title1" sx={{ color: '#fff', fontSize: '25px' }}>
              Get Social, Get Rewarded - Invite Your Friends and Earn 250 xPoints Per Referral!
            </Typography>
            <Stack xs={12} md={12} alignSelf="center">
              <Button
                // component={RouterLink}
                // href={paths.dashboard.user.new}

                alignItems="center"
                justifyContent="left"
                sx={{
                  // backgroundColor: '#fff',
                  width: '50%',
                  borderRadius: '20px',
                }}
                variant="contained"
                // startIcon={<Iconify icon="mingcute:add-line" />}
              >
                See more details
              </Button>
            </Stack>
          </Stack>
        </Card>
        <Card sx={{ p: 3, borderTopLeftRadius: '0', borderTopRightRadius: '0' }}>
          <Box
            rowGap={10}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Stack sx={{ my: 3 }} spacing={1}>
              <Typography variant="title2">My Performance</Typography>
            </Stack>
            
          </Box>
        </Card>
      </Grid> */}

      <Grid xs={12} md={12}>

        <Stack spacing={1} sx={{ p: 3 }}>
          <Typography variant="h6">My Performance</Typography>
        </Stack>

        <Stack
          rowGap={10}
          columnGap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
          }}
        >
          <Card
            sx={{ p: 3, textAlign: 'center', alignContent: 'center', backgroundColor: '#f1f5f9' }}
          >
            <Typography variant="h6">Friends Invited</Typography>
            <Typography variant="body2" sx={{ fontSize: '30px', fontWeight: '2px' }}>
              {totalInvited}
            </Typography>
          </Card>

          <Card
            sx={{ p: 3, textAlign: 'center', alignContent: 'center', backgroundColor: '#f1f5f9' }}
          >
            <Typography variant="h6">Friends Completed</Typography>
            <Typography variant="body2" sx={{ fontSize: '30px', fontWeight: '2px' }}>
              {totalCompleted}
            </Typography>
          </Card>

          <Card
            sx={{ p: 3, textAlign: 'center', alignContent: 'center', backgroundColor: '#f1f5f9' }}
          >
            <Typography variant="h6">Total xPoint</Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: '30px', fontWeight: '2px', color: '#762de6' }}
            >
              <Iconify
                spacing={5}
                width="30px"
                sx={{ color: '#ffd700' }}
                icon="ant-design:thunderbolt-filled"
              />

              {totalReward}
            </Typography>
          </Card>
        </Stack>

        <Card sx={{ width: 1, my: 5 }}>
          <SortingSelectingTable data={arrData} />
        </Card>

      </Grid>
    </Grid >
  );
}
