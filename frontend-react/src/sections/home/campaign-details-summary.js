import PropTypes from 'prop-types';
import { useState, useEffect, forwardRef, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ListItemButton from '@mui/material/ListItemButton';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { fNumber } from 'src/utils/format-number';

import { useAuthContext } from 'src/auth/hooks';
import { submitJoin, getLeaderboard } from 'src/api/campaign-detail';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import { LoginDialogContext } from 'src/components/settings';
import formatTokenName from 'src/components/pipe/format-token-name';

import CampaignLeaderboard from './campaign-learderboard';
import CampaignRewardPolicy from './campaign-reward-policy';
// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function CampaignDetailsSummary({
  checkJoin,
  setcheckJoined,
  campaign,
  showReward,
  showInfo,
  showLeaderboard,
  showOrderInfo,
  ...other
}) {
  const { user } = useAuthContext();

  const { handleOpenLoginDialog, handleCloseLoginDialog } = useContext(LoginDialogContext);

  const mdUp = useResponsive('up', 'md');
  const dialog = useBoolean();
  const [loading, setLoading] = useState(1);
  // const [checkJoin, setcheckJoined] = useState(false);
  const [loadingButton, setLoadingButton] = useState(1);
  const [dialogContent, setDialogContent] = useState({ title: null, content: null });

  const {
    id,
    name,
    logo_image,
    type,
    type_id,
    step_reward_policy,
    step_info_general,
    step_campaign_details,
    user_completed,
    vendor_id,
    ref_id,
    count_user,
  } = campaign;
  // list những link social
  const socialArr = [
    { icon: 'mdi:youtube', value: campaign.youtube },
    { icon: 'mdi:web', value: campaign.website },
    { icon: 'hugeicons:new-twitter-ellipse', value: campaign.twitter },
    { icon: 'mingcute:telegram-fill', value: campaign.telegram },
    { icon: 'tabler:brand-reddit', value: campaign.reddit },
    { icon: 'streamline:linkedin-solid', value: campaign.linkedIn },
    { icon: 'icon-park-solid:facebook', value: campaign.facebook },
    { icon: 'flowbite:discord-solid', value: campaign.discord },
  ];

  // list những hướng dẫn có trong chiến dịch
  const guideList = [
    {
      // key: 'guide_instructions_check',
      key: 'guide_instructions',
      name: 'Guide',
      icon: 'ep:guide',
      color: 'primary',
      content: 'guide_instructions',
    },
    {
      // key: 'intrusion_conditions_check',
      key: 'intrusion_conditions',
      name: 'Acceptance conditions',
      icon: 'mdi:check-circle',
      color: 'green',
      content: 'intrusion_conditions',
    },
    {
      // key: 'refusal_conditions_check',
      key: 'refusal_conditions',
      name: 'Refusal conditions',
      icon: 'mdi:close-circle',
      color: 'red',
      content: 'refusal_conditions',
    },
  ];

  const [learderboard, setLearderboard] = useState();
  // const { checkJoin, checkLoading } = useCheckJoined(id, user);
  // const { checkJoin } =useCheckJoined(id, user);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (user) {
  //       const isJoined = await useCheckJoined(id, user);
  //       setcheckJoined(isJoined);
  //     }
  //   };
  //   fetchData();
  // }, [id]);
  // cái này sau này sẽ đổi lại api ở backend, lấy quest đồng thời với thông tin chiến dịch luôn
  useEffect(() => {
    const fetchData = async () => {
      // lấy data learderboard
      setLoading(true);
      if (type_id !== 73) {
        const dataLeaderboard = await getLeaderboard(id, type_id, 10);
        setLearderboard(dataLeaderboard);
      }
      setLoadingButton(false);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  // mở mấy cái mạng xã hội của chiến dịch
  const handleOpenLinkClick = (url) => {
    window.open(url, '_blank');
  };

  // Check level và điểm của user đủ điều kiện để join campaign
  const submitJoinCampaign = async () => {
    setLoadingButton(1);
    if (!user) {
      setLoadingButton(0);
      handleOpenLoginDialog();
      return;
    }
    let ref_id_ = ref_id;
    if (user.id === ref_id) {
      ref_id_ = null;
    }
    const res = await submitJoin(user, step_info_general, vendor_id, id, ref_id_);
    if (res) {
      setcheckJoined(true);
    }
    setLoadingButton(0);
  };
  useEffect(() => {
    if (user) {
      // This effect runs when user state changes
      // submitJoinCampaign();
      handleCloseLoginDialog();
    }
  }, [user]);

  const renderInfo = (
    <Stack component={Card} direction="row" spacing={2} sx={{ p: 3 }}>
      <Avatar alt={name} src={logo_image} sx={{ width: 60, height: 60 }} />

      <Stack spacing={1}>
        <ListItemText
          primary={type}
          primaryTypographyProps={{
            typography: 'h6',
          }}
        />

        <Stack spacing={1} direction="row">
          {socialArr.map(
            (item, index) =>
              item.value && (
                <Tooltip key={index} title={item.value}>
                  <IconButton
                    key={index}
                    size="small"
                    color="secondary"
                    sx={{
                      borderRadius: 1,
                      bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.16),
                      },
                    }}
                    onClick={() => handleOpenLinkClick(item.value)}
                  >
                    <Iconify width={20} icon={item.icon} />
                  </IconButton>
                </Tooltip>
              )
          )}
        </Stack>
      </Stack>
    </Stack>
  );

  const renderOtherInfo = (
    <Stack component={Card}>
      <List component="nav">
        <ListItemButton onClick={() => handleRewardListClick()}>
          <ListItemIcon>
            <Iconify icon="mdi:trophy" width={30} color="orange" />
          </ListItemIcon>
          <ListItemText primary="Reward Policy" />
        </ListItemButton>

        {guideList.map(
          (item, index) =>
            step_campaign_details &&
            step_campaign_details[item.key] && (
              <>
                <Divider key={`div-${item.name}`} sx={{ borderStyle: 'dashed' }} />

                <ListItemButton key={index} onClick={() => handleListItemClick(item)}>
                  <ListItemIcon>
                    <Iconify icon={item.icon} width={30} color={item.color} />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </>
            )

        )}
      </List>
    </Stack>
  );

  // sự kiện khi bấm vào mấy cái guide
  const handleListItemClick = useCallback(
    (item) => {
      // console.log(item, step_campaign_details[item.content])
      setDialogContent({
        title: item.name,
        content: <Markdown children={step_campaign_details[item.content]} />,
      });
      dialog.onTrue();
    },
    [step_campaign_details, dialog]
  );

  // render Reward Policy dialog
  const handleRewardListClick = () => {
    setDialogContent({
      title: 'Reward Policy',
      content: <CampaignRewardPolicy rewardPolicy={step_reward_policy} />,
    });
    dialog.onTrue();
  };

  // const handleJoinNow = () => {
  //   alert("Join Now")
  // };

  const renderDialog = (
    <Dialog
      fullScreen={!mdUp}
      fullWidth
      keepMounted
      open={dialog.value}
      TransitionComponent={Transition}
      onClose={dialog.onFalse}
    >
      {dialogContent.title && (
        <>
          <DialogTitle
            sx={{ py: 2, mb: 2, backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.16) }}
          >
            {dialogContent.title}
          </DialogTitle>

          {/* <Iconify width={25} icon="solar:users-group-rounded-bold"
            onClick={dialog.onFalse}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          /> */}
        </>
      )}

      {dialogContent.content && (
        <DialogContent sx={{ color: 'text.secondary' }}>{dialogContent.content}</DialogContent>
      )}

      <DialogActions sx={{ pt: 1 }}>
        <Button variant="contained" onClick={dialog.onFalse} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
  const getMessage = (_campaign, _checkJoin) => {
    if (campaign?.status_id === 3) {
      return 'The campaign has ended';
    } else if (checkJoin) {
      return 'Joined';
    } else {
      return 'Join now';
    }
  }
  const getButtonLabel = () => {
    if (loadingButton) {
      return <CircularProgress size={24} color="inherit" />;
    } else if (checkJoin) {
      return 'Joined';
    } else {
      return 'Join now';
    }
  };

  const renderReward = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      <Typography variant="h4">Rewards</Typography>

      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{}}>
        <Box sx={{ textAlign: 'center', px: 1 }}>
          <Image src="/assets/logo_xoffer@2x.png" style={{ width: 48, height: 48 }} />

          <Typography variant="h5" sx={{ mt: 1 }} color="primary.main">
            {step_reward_policy?.discount
              ? fNumber(step_reward_policy?.discount)
              : fNumber(step_reward_policy.your_budget)}
            {formatTokenName(step_reward_policy.airTokenName)}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', px: 1 }}>
          <Image src="/assets/icons/components/gamma.svg" style={{ width: 48, height: 48 }} />

          <Typography variant="h5" sx={{ mt: 1 }} color="orange">
            1.000 xPoint
          </Typography>
        </Box>
      </Box>

      {/* <Button
        disabled={checkJoin}
        size="large"
        fullWidth
        variant="contained"
        color="primary"
        onClick={submitJoinCampaign}
      >
        {getButtonLabel()}
      </Button> */}

      <LoadingButton
        disabled={checkJoin || campaign?.status_id === 3}
        size="large"
        fullWidth
        variant="contained"
        color="primary"
        onClick={submitJoinCampaign}
        loading={loadingButton}
      >
        {getMessage(campaign, checkJoin)}
      </LoadingButton>

      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >

        <Stack
          spacing={0.5}
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ color: 'success.main', typography: 'h6' }}
        >
          <Iconify width={25} icon="solar:users-group-rounded-bold" />
          {count_user}
        </Stack>

        <Stack
          spacing={0.5}
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ color: 'success.main', typography: 'h6' }}
        >
          <Iconify width={25} icon="mdi:user-check" />
          {type === 'Airdrop'
            ? user_completed
            : `${user_completed}/${step_reward_policy?.airdrop_prizes}`}
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Stack spacing={2} sx={{}} {...other}>
      {showInfo && renderInfo}

      {showReward && renderReward}

      {loading && (
        <Box sx={{ width: '100%', py: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {showLeaderboard && learderboard && learderboard.length > 0 && (
        <CampaignLeaderboard
          campaignId={id}
          title="Learderboard"
          tableData={learderboard}
          tableLabels={[
            { label: 'Rank', align: 'center' },
            { label: 'User Name' },
            { label: 'Points', align: 'right' },
          ]}
        />
      )}
      {/* {checkJoin && (<CampaignQuestItem checkJoin={checkJoin} style={{ display: 'none'}}/>)} */}
      {showOrderInfo && renderOtherInfo}

      {renderDialog}
    </Stack>
  );
}

CampaignDetailsSummary.propTypes = {
  // items: PropTypes.array,
  campaign: PropTypes.object,
  checkJoin: PropTypes.string,
  setcheckJoined: PropTypes.object,
  showReward: PropTypes.object,
  showInfo: PropTypes.object,
  showOrderInfo: PropTypes.object,
  showLeaderboard: PropTypes.object,
};
