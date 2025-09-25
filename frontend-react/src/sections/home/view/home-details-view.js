'use client';

import PropTypes from 'prop-types';
import { useQRCode } from 'next-qrcode';
import { useState, useEffect, useContext, useCallback } from 'react';

// import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
// import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
// import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fNumber } from 'src/utils/format-number';

import { HOST_DOMAIN } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import { getShareById, countVisitCampaigns } from 'src/api/shares';
import { useBookmark, useCheckJoined, useGetCampaign, useCheckBookmark } from 'src/api/campaign';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { usePopover } from 'src/components/custom-popover';
import { SplashScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import formatTokenName from 'src/components/pipe/format-token-name';
import { useSettingsContext, LoginDialogContext } from 'src/components/settings';

import LoginDialog from 'src/sections/auth/jwt/login-dialog';

import CampaignQuestList from '../campaign-quest-list';
import CampaignSimilarHome from '../campaign-similar-home';
// import { CampaignDetailsSkeleton } from '../campaign-skeleton';
import CampaignDetailsSummary from '../campaign-details-summary';
import CampaignProductReviewSocials from '../campaign-product-review-socials';
import CampaignProductReviewPostHome from '../campaign-product-review-post-home';

// ----------------------------------------------------------------------

export default function CampaignDetailsView({ id }) {
  const { Canvas } = useQRCode();
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [isBookmask, setIsBookmark] = useState(0);
  const { dialogOpen, handleOpenLoginDialog, handleCloseLoginDialog } =
    useContext(LoginDialogContext);

  const { copy } = useCopyToClipboard();
  const { user } = useAuthContext();
  const { campaign, campaignLoading, campaignError } = useGetCampaign(id);
  const [short_link, setShortLink] = useState();
  const [checkJoin, setcheckJoined] = useState(false);
  const clickPopover = usePopover();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.up('xs'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  let load = true;
  // console.log('CampaignDetailsView: ', campaign);
  // console.log("res=====",campaign?.share?.id)
  // const renderSkeleton = <CampaignDetailsSkeleton />;

  useEffect(() => {
    const countVisitCampaign = async () => {
      try {
        if (load) {
          const link = HOST_DOMAIN + 'campaign/' + id;
          const res = countVisitCampaigns(user, campaign?.ref_id, link, campaign?.id);
        }
      } catch (error) {
        console.error('Error fetching getShareById data:', error);
      }
    };
    countVisitCampaign();
    return () => {
      load = false;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user && campaign) {
        setIsBookmark(2);
        try {
          const res = await getShareById(campaign?.share.id);
          if (res != null && res?.status === 200) {
            // Handle successful response

            // if () {
            setShortLink(HOST_DOMAIN + 'campaign/' + res.data.short_link.code);
            // } else {

            // }
          }
        } catch (error) {
          console.error('Error fetching getShareById data:', error);
        }
        try {
          const res = await useCheckBookmark(user, id);
          setIsBookmark(res?.bookmark ? 1 : 0);
        } catch (error) {
          console.error('Error fetching useCheckBookmark data:', error);
          setIsBookmark(0);
        }
      } else {
        const url = window.location.href;
        setShortLink(url);
      }
    };
    const checkIsJoined = async () => {
      if (user) {
        const isJoined = await useCheckJoined(id, user);
        setcheckJoined(isJoined);
      }
    };
    checkIsJoined();
    fetchData();
  }, [campaign, user]);
  const onCopy = useCallback(
    (text) => {
      if (text) {
        // if (user) {
        copy(text);
        // } else {
        //   const url = window.location.href;
        //   copy(url);
        // }
        enqueueSnackbar('Copied!');
      }
    },
    [copy, enqueueSnackbar]
  );

  const handleBookmark = async () => {
    if (!user) {
      handleOpenLoginDialog();
    } else {
      const oldBookmark = isBookmask;
      try {
        setIsBookmark(2);
        const response = await useBookmark(user, id);
        setIsBookmark(response?.bookmark ? 1 : 0);
      } catch (error) {
        console.error('Error fetching setIsBookmark data:', error);
        setIsBookmark(oldBookmark);
      }
    }
  };

  const renderError = (
    <EmptyContent
      filled
      title={`${campaignError?.message}`}
      action={
        <Button
          component={RouterLink}
          // href={paths.campaign.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderCampaign = campaign && (
    <>
      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          {
            name: 'Campaigns',
            href: paths.campaign.root,
          },
          { name: campaign?.name },
        ]}
        sx={{ mb: { xs: 2, md: 4 }, mt: { xs: 3 } }}
      />

      <Grid container spacing={{ xs: 2, md: 2, lg: 4 }}>
        <Grid xs={12} md={8} lg={8}>
          <Card
            sx={{
              mb: 3,
            }}
          >
            <Image src={campaign.banner_small_image} sx={{ borderRadius: 1, width: 1 }} />
          </Card>

          {isMd ? (
            <></>
          ) : (
            <Grid xs={12} md={4} lg={4}>
              <CampaignDetailsSummary
                checkJoin={checkJoin}
                setcheckJoined={setcheckJoined}
                campaign={campaign}
                showReward
                showInfo
                showOrderInfo
                sx={{ mb: 2 }}
              />
            </Grid>
          )}

          <Card
            sx={{
              mb: 3,
            }}
          >
            <Stack spacing={1} sx={{ pb: 2 }}>
              <Stack spacing={2} sx={{ p: 3, pb: 2 }}>
                <Typography variant="h4">{campaign.name}</Typography>

                <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={2}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        variant="outlined"
                        label={`${fNumber(
                          campaign?.step_reward_policy.your_budget
                        )}${formatTokenName(campaign?.step_reward_policy.airTokenName)}`}
                        color="success"
                      />
                      {campaign?.step_reward_policy.chain && (
                        <Chip
                          sx={{ mx: 1 }}
                          variant="outlined"
                          label={campaign?.step_reward_policy.chain}
                          avatar={
                            <Box
                              component="img"
                              alt="auth"
                              src="/assets/icons/chains/Polygon.webp"
                              sx={{
                                borderRadius: '100%',
                              }}
                            />
                          }
                          color="primary"
                        />
                      )}
                    </Stack>
                  </Box>
                  {campaign?.type_id === 73 && (
                    <CampaignProductReviewSocials
                      social_link={campaign?.social_link}
                      width={30}
                      spacing={2}
                    />
                  )}
                  <Box>
                    <Stack direction={{ xs: 'row', md: 'row' }} spacing={2}>
                      <Button
                        disabled={isBookmask === 2}
                        size="medium"
                        color="warning"
                        variant="soft"
                        startIcon={
                          isBookmask === 1 ? (
                            <Iconify icon="mdi:bookmark-tick" width={20} />
                          ) : (
                            <Iconify icon="mingcute:bookmark-fill" width={20} />
                          )
                        }
                        sx={{ whiteSpace: 'nowrap' }}
                        onClick={handleBookmark}
                      >
                        {isBookmask === 1 ? 'Bookmarked' : 'Bookmark'}
                      </Button>
                      <Button
                        variant="soft"
                        color="success"
                        onClick={clickPopover.onOpen}
                        startIcon={<Iconify icon="solar:share-bold" width={20} />}
                      >
                        Share
                      </Button>
                      <Popover
                        open={Boolean(clickPopover.open)}
                        anchorEl={clickPopover.open}
                        onClose={clickPopover.onClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                      >
                        <Box sx={{ maxWidth: 220 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ pl: 2, pr: 2, pt: 1, cursor: 'pointer' }}
                            onClick={() => onCopy(short_link)}
                            gutterBottom
                          >
                            <IconButton>
                              <Iconify icon="eva:copy-fill" width={24} />
                            </IconButton>
                            Copy link to share
                          </Typography>
                          <Divider />
                          <Typography
                            variant="subtitle1"
                            sx={{ pl: 1, pr: 1, color: 'text.secondary' }}
                          >
                            <Canvas
                              text={short_link}
                              options={{
                                errorCorrectionLevel: 'M',
                                margin: 2,
                                scale: 4,
                                width: 200,
                                color: {
                                  dark: '#202020',
                                  light: '#fff',
                                },
                              }}
                              s
                            />
                          </Typography>
                        </Box>
                      </Popover>
                    </Stack>
                  </Box>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />
                {campaign?.step_campaign_details?.introduce && (
                  <Markdown children={campaign.step_campaign_details.introduce} />
                )}

                {campaign?.step_info_general?.campaign_detail && (
                  <Markdown children={campaign.step_info_general.campaign_detail} />
                )}
              </Stack>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <CampaignQuestList
                checkJoin={checkJoin}
                setcheckJoined={setcheckJoined}
                campaign={campaign}
                id={campaign?.id}
              />

              {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}
            </Stack>
          </Card>

          {/* <CampaignDetailsCarousel campaign={campaign} /> */}
        </Grid>
        {isMd ? (
          <Grid xs={12} md={4} lg={4}>
            <CampaignDetailsSummary
              checkJoin={checkJoin}
              setcheckJoined={setcheckJoined}
              campaign={campaign}
              showLeaderboard
              showReward
              showInfo
              showOrderInfo
            />
          </Grid>
        ) : (
          <Grid xs={12} md={4} lg={4}>
            <CampaignDetailsSummary
              checkJoin={checkJoin}
              setcheckJoined={setcheckJoined}
              campaign={campaign}
              showLeaderboard
            />
          </Grid>
        )}
      </Grid>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {campaignLoading && <SplashScreen />}

      {campaignError && renderError}

      {campaign && renderCampaign}

      {campaign?.type_id === 73 && <CampaignProductReviewPostHome id={campaign?.id} />}

      {campaign?.type_id && (
        <CampaignSimilarHome campaign_id={campaign?.id} type_id={campaign?.type_id} />
      )}

      <LoginDialog open={dialogOpen} handleClose={handleCloseLoginDialog} />
    </Container>
  );
}

CampaignDetailsView.propTypes = {
  id: PropTypes.string,
};
