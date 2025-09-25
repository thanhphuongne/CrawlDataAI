
import axios, { endpoints } from 'src/utils/axios';

// export const connectSocial = (type, path) => {
//   const url = `${type}/${endpoints.social.link}?path=${path}`;
//   const { data, error } = useSWR(url, fetcher);
//   const memoizedValue = useMemo(
//     () => ({
//       data: data?.data,
//       loading: !data && !error,
//     }),
//     [data, error]
//   );

//   return memoizedValue;
// };

export async function connectSocial(user, type, path, data) {
  try {
    let pathEncode = path;
    if (path) {
      path = path.replace('?status=402', '');
      pathEncode = encodeURIComponent(path);
    }
    if (type === 'telegram') {
      const res = await axios.post(`${type}${endpoints.social.link}`, data, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
          "Role-Id": 3,
          "Vendor-Id": user?.agents[0].vendor_id
        }
      })
      return res;

    } else {
      const res = await axios.get(`${type}${endpoints.social.link}?path=${pathEncode}`);
      return res;

    }

  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function checkAndConnectSocial(user, type, data) {
  try {
    const res = await axios.post(`${type}${endpoints.social.check}`, data, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        "Content-Type": "application/json",
        "Role-Id": 3,
        "Vendor-Id": user?.agents[0].vendor_id
      }
    });
    return res.data;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function disconnectSocial(user, type) {
  try {
    await axios.get(`${endpoints.social.disconnect}/${type}`,)

  } catch (error) {
    console.log(error);
    throw error;
  }
}