import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import { Skeleton, Typography } from '@mui/material';

import { PostItemSkeleton } from '../blog/post-skeleton';
import CampaignProductReviewPostItem from './campaign-product-review-post-item';

export default function CampaignProductReviewPostList({ posts, loading, disabledIndex }) {
  // console.log('posts:', posts);
  const renderSkeleton = (
    <>
      <Skeleton sx={{ width: '25%', height: 25, mb: 3 }} />
      <Grid container spacing={3}>
        {[...Array(4)].map((_, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <PostItemSkeleton />
          </Grid>
        ))}
      </Grid>
    </>
  );

  const renderList = (
    <>
      <Typography variant="h4" sx={{ mb: 3, mt: 1 }}>
        Reviews List
      </Typography>
      <Grid container spacing={3}>
        {posts.map((post, index) => (
          <Grid key={index} xs={12} sm={6} md={!disabledIndex && index === 0 ? 6 : 3}>
            <CampaignProductReviewPostItem post={post} />
          </Grid>
        ))}
      </Grid>
    </>
  );

  return (
    <>
      {loading ? renderSkeleton : posts?.length > 0 && renderList}
      {/* {posts.length > 8 && (
        <Stack
          alignItems="center"
          sx={{
            mt: 8,
            mb: { xs: 10, md: 15 },
          }}
        >
          <Button
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="svg-spinners:12-dots-scale-rotate" width={24} />}
          >
            Load More
          </Button>
        </Stack>
      )} */}
    </>
  );
}

CampaignProductReviewPostList.propTypes = {
  disabledIndex: PropTypes.bool,
  loading: PropTypes.bool,
  posts: PropTypes.array,
};
