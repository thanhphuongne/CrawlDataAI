import axios, { endpoints } from 'src/utils/axios';

export async function submitJoin(user, step_info_general, vendor_id, id, ref_id) {
  const rule = {
    Basic: 1,
    Plus: 2,
    Premium: 3,
    Platinum: 4,
  };
  let level = user ? user.user_level : "";
  if (!level || level === 4) {
    level = 1;
  } else {
    level = user?.user_level?.package_id + 1;
  }
  const minimumLevel = step_info_general ? step_info_general.minimum_level.toString() : ''; // Chuyển đổi minimum_level thành chuỗi
  let join = false;
  if (
    level >= rule[minimumLevel] &&
    user && user.reward_points >= step_info_general.minimum_requirement
  ) {
    join = true;
  }
  const data = {
    campaign_id: id,
    user_id: user?.id,
    vendor_id: vendor_id,
    ref_id: ref_id,
    is_joined: 1
  };

  if (join) {
    try {
      await axios.post(endpoints.auth.submitJoin, data, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  } else {
    return false;
  }
};

export async function submitQuest(quest, user, attributes, status) {
  const data_user_joins = {
    quest_id: quest.id,
    user_joins_id: user?.id,
    status: status,
    type: quest.submission_type,
    attributes: attributes
  };
  try {
    await axios.post(endpoints.auth.submitQuest, data_user_joins, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.log(error);
  }
};

// Quest submit file
export async function uploadFile(user, formData, type) {
  try {
    const res = await axios.post(endpoints.upload.file, formData, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        "Content-Type": type,
      }
    })
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Quest submit file
export async function checkCompletedQuest(id) {
  const data = {
    campaignId: id
  }
  try {
    await axios.put(endpoints.campaign.checkCompletedQuest, data, {})
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getLeaderboard(id, type_id, limit) {
  const url = endpoints.campaign.leaderboard;
  try {
    const response = await axios.get(url, {
      params: {
        campaign_id: id,
        sort: 'desc',
        limit: limit === 0 ? null : limit,
        type_id: type_id,
        skip: limit === 0 ? null : 0,
        type: 'condition',
        status: 1,
      },
    });
    // console.log("leaderboard: ", response.data.data)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function getSupervisorList(page, size, filter) {
  let url = endpoints.submitRequest.supervisorList + '?pagenumber=' + page + '&pagesize=' + size;
  // const url = url_.replace('{id}', id);
  if (filter.status.length > 0) {
    url += "&status=" + filter.status
  }
  try {
    const response = await axios.get(url, {});
    // console.log("affiliates: ", response)
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function getApproverList(page, size, filters) {
  // console.log("=filterzzzzzzzzzzzzzs==",filters)


  let url = endpoints.submitRequest.supervisorList + '?pagenumber=' + page + '&pagesize=' + size;
  if (filters.status.length > 0) {
    url += "&status=" + filters.status
  }
  if (filters.startDate != null && filters.endDate != null && filters.startDate < filters.endDate) {
    const _startDate = new Date(filters.startDate).toISOString().split('T')[0];
    const _endDate = new Date(filters.endDate).toISOString().split('T')[0];
    url += "&startdate=" + _startDate + "&enddate=" + _endDate
  }
  if (filters.textSearch != null && filters.textSearch.length > 0) {
    url += "&textSearch=" + filters.textSearch
  }
  if(filters.sortField && filters.sortDirection){
    url += "&sortField=" + filters.sortField
    url += "&sortDirection=" + filters.sortDirection
  }
  // const url = url_.replace('{id}', id);
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function getAdminList(page, size, filters) {
  let url = endpoints.submitRequest.AdminList + '?pagenumber=' + page + '&pagesize=' + size ;
  // const url = url_.replace('{id}', id);
  // console.log("filters===: ", filters)
  if (filters.status.length > 0) {
    url += "&status=" + filters.status
  }
  if (filters.startDate != null && filters.endDate != null && filters.startDate <= filters.endDate) {
    const _startDate = new Date(filters.startDate).toISOString().split('T')[0];
    const _endDate = new Date(filters.endDate).toISOString().split('T')[0];
    url += "&startdate=" + _startDate + "&enddate=" + _endDate
  }
  // console.log("====filters===",filters);
  if (filters.textSearch != null && filters.textSearch.length > 0) {
    url += "&textSearch=" + filters.textSearch
  }
  if(filters.sortField && filters.sortDirection){
    url += "&sortField=" + filters.sortField
    url += "&sortDirection=" + filters.sortDirection
  }
  try {
    const response = await axios.get(url, {});
    // console.log("affiliates: ", response)
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
