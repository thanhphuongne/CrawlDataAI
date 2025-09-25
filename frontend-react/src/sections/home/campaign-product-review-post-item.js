import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Link, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fShortenWalletAddress } from 'src/utils/format-number';

import Scrollbar from 'src/components/scrollbar';
import TextMaxLine from 'src/components/text-max-line';
import VideoEmbed from 'src/components/embed/video-embed';

import CampaignProductReviewSocials from './campaign-product-review-socials';

export default function CampaignProductReviewPostItem({ post }) {
  // const { coverUrl, title, totalViews, totalComments, totalShares, author, createdAt } = post;
  const json_convert = (variable) => {
    try {
      JSON.parse(variable);
      return JSON.parse(variable);
    } catch (e) {
      return variable;
    }
  };

  // console.log('post,', post);

  let nameTemp;

  if (post.first_name !== null && post.last_name !== null) {
    nameTemp = post.first_name + ' ' + post.last_name;
  } else if (post.public_address !== null) {
    nameTemp = fShortenWalletAddress(post.public_address);
  } else {
    nameTemp = '';
  }

  const attributes = json_convert(post.attributes);
  const name = nameTemp;
  const avatarUrl = post.avatar;
  const createdAt = post.created_at;
  const quest_name = post.name;

  return (
    <Card>
      <Stack
        sx={{ mt: 2, mb: 1.5, mx: 3 }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar alt={name} src={avatarUrl} sx={{ height: 40, width: 40 }} />
        </Box>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={0}>
          <TextMaxLine variant="subtitle2" line={1} persistent>
            {name}
          </TextMaxLine>
          <Typography
            variant="caption"
            component="div"
            sx={{
              color: 'text.disabled',
            }}
          >
            {fDate(createdAt)}
          </Typography>
        </Stack>
        <CampaignProductReviewSocials social_link={[{ name: quest_name }]} width={30} />
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Box sx={{ p: 3, pt: 2, pb: 0, height: { md: 250 } }}>
        <Stack direction="row" alignItems="center" justifyItems="center" sx={{ pb: 2 }}>
          {quest_name === 'Youtube' || quest_name === 'Tiktok' ? (
            <VideoEmbed platform={quest_name} videoIdOrUrl={attributes?.link_post} />
          ) : (
            <Link href={attributes?.link_post} underline="none">
              {quest_name}
              {' post'}
            </Link>
          )}
        </Stack>
        <Scrollbar sx={{ height: 170 }} variant="body2">
          <Typography variant="body2">{attributes.content}</Typography>
        </Scrollbar>
      </Box>
    </Card>
  );
}

CampaignProductReviewPostItem.propTypes = {
  post: PropTypes.object,
};
