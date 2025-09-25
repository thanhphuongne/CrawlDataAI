import { t } from 'i18next';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
// import Divider from '@mui/material/Divider';
// import MenuItem from '@mui/material/MenuItem';
// import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import ListItemText from '@mui/material/ListItemText';

import { useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fNumber } from 'src/utils/format-number';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import formatTokenName from 'src/components/pipe/format-token-name';

import CampaignProductReviewSocials from './campaign-product-review-socials';

// import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function CampaignItem({
  campaign,
  showHomeView,
  // onView, onEdit, onDelete
}) {
  const router = useRouter();
  // const popover = usePopover();
  // console.log('Campaign: ', campaign);
  const json_convert = (variable) => {
    try {
      JSON.parse(variable);
      return JSON.parse(variable);
    } catch (e) {
      return variable;
    }
  };
  // Kiểm tra điều kiện showHomeView và lấy dữ liệu
  const id = showHomeView ? campaign.model_id : campaign.id;
  const name = showHomeView ? campaign.title : campaign.name;
  const { user_completed, name_type, social_link, count_user } = campaign;
  const { banner_small_image, logo_image, type_id, step_info_general, step_reward_policy } =
    showHomeView ? campaign.campaign : campaign;
  const step_info_general_json = json_convert(step_info_general);
  const step_reward_policy_json = json_convert(step_reward_policy);
  const maximumNumberOfParticipants = step_reward_policy_json?.airdrop_prizes
    ? step_reward_policy_json?.airdrop_prizes
    : '+∞';
  // : campaign.maximumNumberOfParticipants;
  const rewardsPerUser = showHomeView
    ? step_reward_policy_json.your_budget
    : campaign.rewardsPerUser;

  // console.log('step_reward_policy_json.affTokenName', step_reward_policy_json.affTokenName);

  // const {
  //   id, logo_image, name,
  //   step_info_general,
  //   step_reward_policy,
  //   user_completed,
  //   maximumNumberOfParticipants,
  //   type_id,
  //   rewardsPerUser,
  //   banner_small_image,
  //   // createdAt, candidates, experience, employmentTypes, salary, role
  // } = campaign;
  const handleView = useCallback(() => {
    router.push(paths.campaign.details(id));
  }, [id, router]);
  return (
    <>
      <Card
        sx={{
          ':hover': { bgcolor: 'background.neutral' },
          cursor: 'pointer',
          // boxShadow: theme => theme.customShadows.z15,
          boxShadow: (theme) => `4px 4px 10px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
          // border: 1
        }}
        onClick={() => {
          handleView();
        }}
      >
        <Stack
          sx={{
            p: (theme) => theme.spacing(1, 1, 0, 1),
            pb: 1,
          }}
        >
          <Stack flexGrow={1} sx={{ position: 'relative' }}>
            <Image src={banner_small_image} sx={{ borderRadius: 1, height: 164, width: 1 }} />
          </Stack>
        </Stack>

        <Grid
          container
          alignItems="center"
          sx={{
            px: 2,
            pt: 0.5,
            pb: 2,
          }}
        >
          <Grid
            xs={name_type === 'Product Review' || type_id === 73 ? 12 - social_link.length : 12}
          >
            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
              <Avatar
                // alt={company.name}
                src={logo_image}
                variant="rounded"
                sx={{ width: 48, height: 48 }}
              />
              <Typography variant="subtitle2">{name}</Typography>
            </Stack>
          </Grid>
          <Grid xs={name_type === 'Product Review' || type_id === 73 ? social_link.length : 0}>
            {(name_type === 'Product Review' || type_id === 73) && (
              <CampaignProductReviewSocials social_link={social_link} spacing={0.5} />
            )}
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="space-between" sx={{ px: 2, pb: 2 }}>
          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'primary.main', typography: 'caption' }}
          >
            <Iconify width={16} icon="material-symbols:trophy" />
            {fNumber(rewardsPerUser || step_reward_policy_json?.your_budget)}
            {formatTokenName(
              step_reward_policy_json?.affTokenName || step_reward_policy_json?.monney_reward_air
            )}
          </Stack>

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
              sx={{ color: 'primary.main', typography: 'caption' }}
            >
              <Iconify width={16} icon="solar:users-group-rounded-bold" />

              {count_user}
            </Stack>


            <Stack
              spacing={0.5}
              direction="row"
              alignItems="center"
              sx={{ color: 'primary.main', typography: 'caption' }}
            >
              <Iconify width={16} icon="mdi:user-check" />

              {/* neu campaing airdrop thi chi hien thi so nguoi hoan thanh, loai khac thi hoan thanh/budget */}
              {type_id === 62 ? user_completed : `${user_completed}/${maximumNumberOfParticipants}`}
              {/* {user_completed}/{maximumNumberOfParticipants || step_reward_policy_json.airdrop_prizes}{' '} */}
              {/* Participants */}
            </Stack>
          </Stack>
        </Stack>

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

        <Box
          rowGap={1.5}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          sx={{
            p: 2,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          }}
        >
          {[
            {
              label: showHomeView ? t(`${name_type}`) : t(`type_id_${type_id}`),
              icon: <Iconify width={16} icon="mdi:hexagon-multiple" sx={{ flexShrink: 0 }} />,
            },
            {
              label: `${step_info_general_json?.category}, ${step_info_general_json?.subcategory}`,
              icon: <Iconify width={16} icon="tdesign:app" sx={{ flexShrink: 0 }} />,
            },
          ].map((item, index) => (
            <Stack
              key={item.label}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              justifyContent={index > 0 ? 'end' : 'start'}
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {index > 0 && item.icon}
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
                noWrap
              >
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Card>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover> */}
    </>
  );
}

CampaignItem.propTypes = {
  campaign: PropTypes.object,
  showHomeView: PropTypes.bool,
  // onDelete: PropTypes.func,
  // onEdit: PropTypes.func,
  // onView: PropTypes.func,
};
