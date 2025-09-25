import useSWR from 'swr';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState, useEffect } from 'react';

// import { fetcher, endpoints,axios } from 'src/utils/axios';
import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetCampaigns() {
  // const URL = endpoints.campaign.list;

  // const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  // const memoizedValue = useMemo(
  //   () => ({
  //     campaigns: data?.campaigns || [],
  //     campaignsLoading: isLoading,
  //     campaignsError: error,
  //     campaignsValidating: isValidating,
  //     campaignsEmpty: !isLoading && !data?.campaigns.length,
  //   }),
  //   [data?.campaigns, error, isLoading, isValidating]
  // );
  const memoizedValue = useMemo();
  return memoizedValue;
}

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

// ----------------------------------------------------------------------

export function formatCampaignData(campaign) {
  try {
    [
      'step_campaign_details',
      'step_info_general',
      'step_reward_policy',
      'step_marketing_infor',
    ].forEach((key) => {
      if (isString(campaign[key])) campaign[key] = JSON.parse(campaign[key]);
    });

    // số người tham gia tối đa
    campaign.maximumNumberOfParticipants = campaign.step_reward_policy.airdrop_prizes
      ? campaign.step_reward_policy.airdrop_prizes
      : campaign.step_reward_policy.totalUser;

    // phần thưởng cho mỗi người
    campaign.rewardsPerUser = Math.round(
      campaign.step_reward_policy.your_budget / campaign.maximumNumberOfParticipants
    );

    // const typeObj = .find((type) => type.value === campaign.type_id);
    // campaign.type = typeObj.label;
  } catch (error) {
    console.error(error);
  }

  return campaign;
}

// ----------------------------------------------------------------------

export function useGetCampaign(campaignId) {
  const baseUrl = `${endpoints.campaign.details}${campaignId}/view`;

  const { data, isLoading, error, isValidating } = useSWR(baseUrl, fetcher);

  // console.log('useGetCampaign: ', error)

  const formattedData = data ? formatCampaignData(data) : data;

  const memoizedValue = useMemo(
    () => ({
      campaign: formattedData,
      campaignLoading: isLoading,
      campaignError: error,
      campaignValidating: isValidating,
    }),
    [formattedData, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchCampaigns(query) {
  const URL = query ? [endpoints.campaign.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// export const useCheckJoined = (id, user) => {
//   const inputData = {
//     campaign_id: id,
//     user_id: user ? user.id : '',
//   };

//   const url = `${endpoints.auth.isJoined}?campaign_id=${inputData.campaign_id}&user_id=${inputData.user_id}`;
//   const { data, error } = useSWR(url, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       checkJoin: data?.data,
//       loading: !data && !error,
//     }),
//     [data, error]
//   );

//   return memoizedValue;
// };

export async function useCheckJoined(id, user) {
  const inputData = {
    campaign_id: id,
    user_id: user ? user.id : '',
  };
  const url = `${endpoints.auth.isJoined}?campaign_id=${inputData.campaign_id}&user_id=${inputData.user_id}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response?.data.data;
    }
    return false;
  } catch (error) {
    // console.error('Error fetching data:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

// lay ra nhung capaing da tham gia (old api)
export function useGetCampaignActivities(page, limit, userId) {
  const baseUrl = `${endpoints.campaign.activities}`;
  const [campaignActivities, setCampaignActivities] = useState([]);
  const [countAll, setCountAll] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(baseUrl, { page, user_id: userId, limit: limit });
        setCampaignActivities(response.data.data);
        setCountAll(response.data.count_all);
        setError(null);
      } catch (err) {
        setError(err);
        setCampaignActivities([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [page, userId]);

  return {
    campaignActivities,
    countAll,
    isLoading,
    isError: error,
  };
}

// lay ra nhung capaing da tham gia
export async function getSubmitList(page, size, filters) {
  let baseUrl = endpoints.submitRequest.list + '&pagenumber=' + page + '&pagesize=' + size ;
  if (filters.status.length > 0) {
    baseUrl += "&status=" + filters.status
  }
  if (filters.startDate != null && filters.endDate != null && filters.startDate < filters.endDate) {
    const _startDate = new Date(filters.startDate).toISOString().split('T')[0];
    const _endDate = new Date(filters.endDate).toISOString().split('T')[0];
    baseUrl += "&startdate=" + _startDate + "&enddate=" + _endDate
  }
  if(filters.textSearch !== null && filters.textSearch.length > 0) {
    baseUrl += "&textSearch=" + filters.textSearch ;
  }
  if(filters.sortField && filters.sortDirection){
    baseUrl += "&sortField=" + filters.sortField
    baseUrl += "&sortDirection=" + filters.sortDirection
  }
  try {
    const response = await axios.get(baseUrl);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.error('Error put data:', err);
    return null;
  }
}
export async function getCountWaitingConfirm() {
  let baseUrl = endpoints.submitRequest.countAll; // Đã sửa thành countAll trong endpoints
  try {
    const response = await axios.get(baseUrl);
    if (response.status === 200) {
      return response.data; // Trả về { mySubmitTotal, needConfirmTotal, adminTotal }
    }
    return null;
  } catch (err) {
    console.error('Error fetching count data:', err);
    return null;
  }
}

export async function getComments(id) {
  let baseUrl = endpoints.submitRequest.comment + '?submitId=' + id;
  try {
    const response = await axios.get(baseUrl);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.error('Error put data:', err);
    return null;
  }
}

export async function getSumary() {
  let baseUrl = endpoints.submitRequest.summary;
  try {
    const response = await axios.get(baseUrl);
    if (response.status === 200) {
      return response.data.data;
    }
    return null;
  } catch (err) {
    console.error('Error put data:', err);
    return null;
  }
}

export async function exportData(filters) {
  let baseUrl = endpoints.submitRequest.exportData + '?';

  if (filters.name && filters.name.trim() !== '') {
    baseUrl += `&textSearch=${encodeURIComponent(filters.name.trim())}`;
  }
  if (filters.status.length > 0) {
    baseUrl += "&status=" + filters.status;
  }
  if (filters.startDate && filters.endDate && filters.startDate < filters.endDate) {
    const _startDate = new Date(filters.startDate).toISOString().split('T')[0];
    const _endDate = new Date(filters.endDate).toISOString().split('T')[0];
    baseUrl += "&startdate=" + _startDate + "&enddate=" + _endDate;
  }

  try {
    const response = await axios.get(baseUrl, {
      responseType: 'blob' // <-- Bắt buộc phải có để nhận file dạng binary
    });

    if (response.status === 200) {
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ExportData.xlsx'; // Tên file tùy ý
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }

    return null;
  } catch (err) {
    console.error('Error export data:', err);
    return null;
  }
}

export async function getCampaignStatistic() {
  const baseUrl = `${endpoints.campaign.statisticCampaign}`;
  try {
    const response = await axios.get(baseUrl);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.error('Error put data:', err);
    return null;
  }
}

export async function getCampaignAff(skip, limit) {
  const baseUrl = `${endpoints.campaign.campaignAff}`;
  try {
    const response = await axios.post(baseUrl, { skip: skip, limit: limit });
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.error('Error put data:', err);
    return null;
  }
}

// Bookmark
export async function useCheckBookmark(user, campaign_id) {
  try {
    const response = await axios.post(
      endpoints.campaign.bookmark,
      { campaign_id },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function useBookmark(user, campaign_id) {
  try {
    const response = await axios.post(
      endpoints.campaign.setBookmark,
      { campaign_id },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function useGetBookmarkList(user, filters) {
  try {
    const response = await axios.post(
      endpoints.campaign.getBookmarkList,
      { filters },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// update status claim rut thuong lam nhiem vu
export async function updateClaimQuest(data) {
  const url = endpoints.auth.updateStatusClaimQuest;
  try {
    const response = await axios.post(url, data);
  } catch (error) {
    enqueueSnackbar(error.msg, { variant: 'error' });
  }
}

// update status claim rut thuong tiep thi lien ket
export async function updateClaimReferral(data) {
  const url = endpoints.auth.updateStatusClaimReferal;
  try {
    const response = await axios.post(url, data);
  } catch (error) {
    enqueueSnackbar(error.msg, { variant: 'error' });
  }
}

// Activities Count

export async function activitiesCount(user) {
  try {
    const response = await axios.post(
      endpoints.campaign.activitiesCount,
      // {},
      // {
      //   headers: {
      //     Authorization: `Bearer ${user.accessToken}`,
      //     'Content-Type': 'application/json',
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}