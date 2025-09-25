'use client';

import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  xofferPackages: [],
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
      xofferPackages: action.payload.xofferPackages
    };
  }
  if (action.type === 'UPDATE') {
    return {
      loading: false,
      user: action.payload.user,
      xofferPackages: state.xofferPackages
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
      xofferPackages: action.payload.xofferPackages
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
      xofferPackages: null
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

function setDisplayName(user) {
  user.displayName = user.accountName;
}
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);
      const userData = window.localStorage.getItem('user');

      // console.log('AuthProvider userData: ', JSON.parse(userData).role)
      if (userData && accessToken && isValidToken(accessToken)) {
        setSession(accessToken, JSON.parse(userData).role);
        // + '/' + JSON.parse(userData)?.id)
        const response = await axios.get(endpoints.auth.me );
        const user = response.data;
        // const responsePoint = await axios.get(user.id + '/points');
        // const userPoint = responsePoint.data;
        // const responsePackages = await axios.get(endpoints.user.packages);
        // const xofferPackages = responsePackages.data;
        setDisplayName(user);

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              // ...userPoint,
              accessToken,
            },
            // xofferPackages: xofferPackages
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (accountName, password) => {
    const dataLogin = {
      accountName,
      password
    };

    const response = await axios.post(endpoints.auth.login, dataLogin);

    const dataRes = response.data;

    const userInfo = dataRes;
    const {accessToken} = dataRes;
    setDisplayName(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setSession(accessToken, '3', userInfo.user.role || 'USER');
    // const responsePoint = await axios.get(userInfo.id + '/points');
    // const userPoint = responsePoint.data;
    // const responsePackages = await axios.get(endpoints.user.packages);
    // const xofferPackages = responsePackages.data;
    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...userInfo,
          // ...userPoint,
          accessToken,
        },
        // xofferPackages: xofferPackages
      },
    });
  }, []);

  // LOGIN TELEGRAM
  const loginTelegram = useCallback(async (dataLogin) => {

    const response = await axios.post(endpoints.auth.loginTelegram, dataLogin);
    const dataRes = response.data;

    const userInfo = dataRes.data;
    const accessToken = dataRes.token;
    setDisplayName(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setSession(accessToken, '3', userInfo?.agents[0].vendor_id || '');
    const responsePoint = await axios.get(userInfo.id + '/points');
    const userPoint = responsePoint.data;
    const responsePackages = await axios.get(endpoints.user.packages);
    const xofferPackages = responsePackages.data;
    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...userInfo,
          ...userPoint,
          accessToken,
        },
        xofferPackages: xofferPackages
      },
    });
  }, []);

  const metamaskLogin = useCallback(async (public_address, signature, ref_code) => {
    const dataLogin = {
      public_address,
      signature,
      ref_code,
    };

    // const response = await axios.post(dataLogin);

    const response = await axios.post(endpoints.auth.loginMetaMask, dataLogin);
    const dataRes = response.data;

    // console.log('metamaskLogin: ', dataRes);
    const userInfo = dataRes.data;
    const accessToken = dataRes.token;
    // console.log('userInfo: ', userInfo);
    setDisplayName(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setSession(accessToken, '3', userInfo?.agents[0].vendor_id || '');

    const responsePoint = await axios.get(userInfo.id + '/points');
    const userPoint = responsePoint.data;
    const responsePackages = await axios.get(endpoints.user.packages);
    const xofferPackages = responsePackages.data;
    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...userInfo,
          ...userPoint,
          accessToken,
        },
        xofferPackages: xofferPackages
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (
      accountName,
      password,
    ) => {
      const data = {
        accountName,
        password,
      };

      const response = await axios.post(endpoints.auth.register, data);
      const userInfo = response.data;
      const { accessToken, user } = response.data;

      // localStorage.setItem(STORAGE_KEY, accessToken);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setSession(accessToken, '3', userInfo.user.role || 'USER');

      dispatch({
        type: 'REGISTER',
        payload: {
          user: {
           ...response?.data,
            accessToken,
          },
        },
      });
      return response;
    },
    []
  );
  // REGISTER
  const verify = useCallback(async (email, verify_code, lang, id) => {
    const data = {
      email,
      verify_code,
      lang,
    };

    const response = await axios.post(endpoints.auth.verify + '/' + id, data);
    // console.log("response====",response);
    return response;
  }, []);

  const send_mail = useCallback(async (email, lang, id) => {
    const data = {
      email,
      lang,
    };

    const response = await axios.post(endpoints.auth.sendMail + '/' + id, data);
    // console.log("response====",response);
    return response;
  }, []);

  const getAff = useCallback(async (ref_code) => {
    const response = await axios.get(endpoints.auth.getRef + '/' + ref_code);
    // console.log("response====",response);
    return response;
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // update dispath
  const updateDispath = async () => {
    if (state.user) {
      const response = await axios.get(endpoints.auth.me + '/' + state.user?.id);
      if (response.data) {
        // const responsePoint = await axios.get(response.data.id + '/points');
        // const userPoint = responsePoint.data;
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch({
          type: 'UPDATE',
          payload: {
            user: {
              ...response.data,
              // ...userPoint
            }
          },
        });
      }
    }
  };

  const updateUserDispath = async (userData) => {
    // console.log('updateUserDispath: ', userData)
    const userInfo = userData.data
    const accessToken = userData.token

    userInfo.displayName = userInfo.full_name

    setSession(accessToken, '3', userInfo?.agents[0].vendor_id || '');
    const responsePoint = await axios.get(userInfo.id + '/points')
    const userPoint = responsePoint.data;
    // const responsePackages = await axios.get(endpoints.user.packages);
    // const xofferPackages = responsePackages.data;
    dispatch({
      type: 'INITIAL',
      payload: {
        user: {
          ...userInfo,
          ...userPoint,
          accessToken,
        },
        // xofferPackages: xofferPackages
      },
    });
  };

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      xofferPackages: state.xofferPackages,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      updateDispath,
      metamaskLogin,
      loginTelegram,
      updateUserDispath,
      register,
      verify,
      logout,
      send_mail,
      getAff,
    }),
    [
      login,
      metamaskLogin,
      loginTelegram,
      verify,
      send_mail,
      getAff,
      logout,
      register,
      state.user,
      // state.xofferPackages,
      status,
      updateDispath,
      updateUserDispath
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
