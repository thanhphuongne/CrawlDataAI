import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function getShareById(id) {
  const url = endpoints.campaign.shares + '/' + id;
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export async function UploadImage(formData, type) {
  try {
    const response = await axios.post(endpoints.user.uploadImage, formData, type);
    if (response.status === 200) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
    //   throw error;
  }
}
export async function UpdateImage(info, userId_) {
  const url_ = endpoints.user.updateImage;
  const url = url_.replace('{id}', userId_);
  try {
    const response = await axios.put(url, info);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error post data:', error);
    return null;
  }
}
export async function sendEmail(info, userId_) {
  const url_ = endpoints.user.verifyEmail;
  const url = url_.replace('{id}', userId_);
  try {
    const response = await axios.post(url, info);
    return response;
  } catch (error) {
    console.error('Error post data:', error);
    return error;
  }
}
export async function UpdateUserInfo(info, userId_) {
  const url_ = endpoints.user.updateInfo;
  const url = url_.replace('{id}', userId_);

  try {
    const response = await axios.put(url, info);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error post data:', error);
    return null;
  }
}
export async function RequestResetPass(body) {
  try {
    if (body.verifyCode) {
      const response = await axios.post(endpoints.user.verifyCode, body, {
        validateStatus: (status) => status < 500, // Cho phép Axios xử lý tất cả mã < 500
      });

      if (response.status === 200) {
        return {
          isSuccess: true,
          flag: 1,
          data: response.data,
        };
      }
      if (response.status === 403) {
        return {
          data: "The verification code is invalid. Please try again!",
          isSuccess: false,
        };
      }
      return {
        isSuccess: false,
        flag: 1,
        data: response.data,
      };
    }

    const response = await axios.post(endpoints.user.forgotPassWord, body, {
      validateStatus: (status) => status < 500, // Chỉ chuyển sang catch nếu lỗi >= 500
    });

    if (response.status === 403) {
      return {
        data: `Email ${body.email} is not registered`,
        isSuccess: false,
      };
    }

    return {
      isSuccess: true,
      flag: 0,
      data: response.data,
    };
  } catch (error) {
    return {
      isSuccess: false,
      data: `Unexpected error: ${error.message}`,
    };
  }
}


export async function ResetPassword(info, token) {
  const url_ = endpoints.user.updatePassWord;
  const url = url_.replace('{token}', token);

  try {
    const response = await axios.put(url, info);
    console.log('response', response.data);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error put data:', error);
    return null;
  }
}

export async function getPackages() {
  const url = endpoints.user.packages;
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export async function getPontReward(id) {
  try {
    const response = await axios.get(id + '/points');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export async function subscriptionUpgradeLevel(data) {
  const url = endpoints.user.upgradeLevel;
  try {
    const response = await axios.post(url, data);
    return { status: true, message: response.message };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { status: false, message: error.message };
  }
}

export async function subscriptionUnlockLevel(data) {
  const url = endpoints.user.resetLevelMemberShip;
  try {
    const response = await axios.post(url, data);
    return { status: true, message: response.message };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { status: false, message: error.message };
  }
}

export async function getTotalPoint(id) {
  const url_ = endpoints.user.rewardEarneds;
  const url = url_.replace('{id}', id);
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
export async function network(id, skip, limit) {
  const url_ = endpoints.user.networkRef;
  const url = url_.replace('{id}', id).replace('{skip}', skip).replace('{limit}', limit);
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export async function rewardHistory(user, { date, filter, limit, skip }) {
  const url_ = endpoints.user.rewardHistory;
  const url = url_.replace('{id}', user?.id);

  try {
    const response = await axios.post(
      url,
      { date, filter, limit, skip }
    );
    // console.log('response', response.data);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error put data:', error);
    return null;
  }
}

export async function rewardSummary(user, { status, limit, skip }) {
  const url_ = endpoints.user.rewardSummary;

  const url = url_
    .replace('{id}', user?.id)
    .replace('{status}', status)
    .replace('{limit}', limit)
    .replace('{skip}', skip);

  try {
    const response = await axios.get(url);
    // console.log('response', response.data);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error put data:', error);
    return null;
  }
}

export async function rewardGuide(user) {
  const url_ = endpoints.user.rewardGuide;

  const url = url_.replace('{id}', user?.id);

  try {
    const response = await axios.get(url);
    // console.log('response', response.data);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error put data:', error);
    return null;
  }
}
