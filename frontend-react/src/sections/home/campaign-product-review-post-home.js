'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import CampaignProductReviewPostList from './campaign-product-review-post-list';


export default function CampaignProductReviewPostHome({ id }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = endpoints.quest.previewProductPost + id;
        const response = await axios.get(url);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
      <CampaignProductReviewPostList posts={data} loading={loading} disabledIndex />
  );
}

CampaignProductReviewPostHome.propTypes = {
  id: PropTypes.string,
};
