import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import { _socials } from 'src/_mock';

import Iconify from 'src/components/iconify';

export default function CampaignProductReviewSocials({ social_link, width = 30, spacing = 0.5 }) {
  // const { coverUrl, title, totalViews, totalComments, totalShares, author, createdAt } = post;

  return (
    <Stack direction="row-reverse" alignItems="left" justifyItems="center" flexWrap="true" spacing={spacing}>
      {social_link?.map((item) =>
        _socials.map((uiItem) => {
          if (item.name === uiItem.name)
            return <Iconify width={width} icon={uiItem.icon} sx={{ color: uiItem.color }} />;
          return <></>;
        })
      )}
    </Stack>
  );
}

CampaignProductReviewSocials.propTypes = {
  social_link: PropTypes.array,
  width: PropTypes.number,
  spacing: PropTypes.number,
};
