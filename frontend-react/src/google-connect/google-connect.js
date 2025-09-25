import { useState } from 'react';

import { useSearchParams } from 'src/routes/hooks';

// import { setSession } from 'src/utils/jwt';
import { loginByGoogle } from 'src/api/login-api';

function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
}

export function connectGoogle() {
  const [loadingConnect, setLoadingConnect] = useState(false);
  const searchParams = useSearchParams();
  const setSession = (token) => {
    if (token) {
      sessionStorage.setItem('accessToken', token);
      // Set any other session data here
    } else {
      sessionStorage.removeItem('accessToken');
      // Remove any other session data here
    }
  };

  const connect = async (response) => {
    setLoadingConnect(true);
    try {
      const jwtDecoded = decodeJwtResponse(response.credential);
      const data = {
        email: jwtDecoded.email,
        firstName: jwtDecoded.given_name,
        lastName: jwtDecoded.family_name,
        name: jwtDecoded.name,
        avatar: jwtDecoded.picture,
        device_token: jwtDecoded.credential,
        token: jwtDecoded.credential,
      };

      const refCode = searchParams.get('xoffer');
      if (refCode) {
        data.ref_code = refCode;
      }

      const loginResponse = await loginByGoogle(data);
      if (loginResponse) {
        const returnTo = searchParams.get('returnTo') || '/';
        window.localStorage.setItem('user', JSON.stringify(loginResponse.data));
        // setSession(loginResponse.token);
        // setSession(authResponse.token);
        window.location.href = returnTo;
      } else {
        alert('Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login was not successful');
    } finally {
      setLoadingConnect(false);
    }
  };

  return { loadingConnect, connect };
}
