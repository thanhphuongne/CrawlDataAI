'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/system/Unstable_Grid/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { Skeleton, Typography } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';

import CampaignItem from './campaign-item';
import { PostItemSkeleton } from '../blog/post-skeleton';

export default function CampaignSimilarHome({ campaign_id, type_id, showHomeView }) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(9);
  const [count, setTotalCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const url = endpoints.public.srcCampaigns;
      try {
        const response = await axios.get(
          url + '?type_id=' + type_id + '&skip=' + skip + '&limit=' + limit
        );
        let tmpCampaigns = response.data.data.campaign.filter((item) => item.id !== campaign_id);
        if (tmpCampaigns.length > 0) {
          if (data) {
            tmpCampaigns = [...data, ...tmpCampaigns];
          }
          setData(tmpCampaigns);

          setTotalCount(response.data.data.count);
        }
        // else {
        //   setSkip(skip + 9);
        //   setLimit(limit);
        // }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);

        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [type_id, skip, limit]);

  const onchangeSkipLimit = () => {
    const _skip = skip + 9;
    setSkip(_skip);
    setLimit(limit);
  };
  const renderSkeleton = (
    <>
      <Skeleton sx={{ width: '25%', height: 25, my: 3 }} />
      <Grid container spacing={3}>
        {[...Array(3)].map((_, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <PostItemSkeleton />
          </Grid>
        ))}
      </Grid>
    </>
  );

  return (
    <>
      {isLoading ? (
        renderSkeleton
      ) : (
        <>
          {data?.length > 0 && (
            <>
              <Typography variant="h4" sx={{ my: 3 }}>
                You might also like
              </Typography>
              {/* <CampaignList
                campaigns={data}
                showHomeView={false}
                skip={skip}
                limit={limit}
                totalCount={count}
                changeSkipAndLimit={changeSkipAndLimit}
              /> */}
              <>
                <Box
                  gap={2.5}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  }}
                >
                  {data.map((campaign, index) => (
                    // Map và truyền từng campaign vào, do api khác định dạng nên truyền thêm biến showHomeView để kiểm tra điều kiện
                    <CampaignItem
                      key={index}
                      campaign={campaign}
                      showHomeView={showHomeView}
                      // onView={() => handleView(campaign.id)}
                      // onEdit={() => handleEdit(campaign.id)}
                      // onDelete={() => handleDelete(campaign.id)}
                    />
                  ))}
                </Box>

                {data.length > 7 && skip + limit < count && (
                  // <Pagination
                  //   count={8}
                  //   sx={{
                  //     mt: 8,
                  //     [`& .${paginationClasses.ul}`]: {
                  //       justifyContent: 'center',
                  //     },
                  //   }}
                  // />
                  <Stack sx={{ pt: 2 }} direction="row" justifyContent="center">
                    <LoadingButton
                      onClick={onchangeSkipLimit}
                      disabled={skip + limit >= count}
                      sx={{
                        py: 0.5,
                        px: 1,
                        fontSize: '15px',
                        mt: 1,
                        width: '150px',
                        color: 'white',
                        borderRadius: 10,
                        backgroundColor: 'primary.main',
                        '&:hover': {
                          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.7),
                        },

                        // backgroundColor: (theme) =>
                        //   skip + limit < totalCount
                        //     ? alpha(theme.palette.primary.main, 1)
                        //     : alpha(theme.palette.grey[800], 0.7),
                      }}
                    >
                      <Iconify
                        spacing={2}
                        width="20px"
                        sx={{ color: 'white' }}
                        icon="ic:baseline-expand-more"
                      />
                      See more
                    </LoadingButton>
                  </Stack>
                )}
              </>
            </>
          )}
        </>
      )}
    </>
  );
}

CampaignSimilarHome.propTypes = {
  campaign_id: PropTypes.string,
  type_id: PropTypes.string,
  showHomeView: PropTypes.bool,
};
