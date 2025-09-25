/* global google */

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import LoadingButton from '@mui/lab/LoadingButton';

import { useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { loginByGoogle } from 'src/api/login-api';
import { GOOGLE_CLIENT_ID } from 'src/config-global';

// function decodeJwtResponse(token) {
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split('')
//       .map(function (c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join('')
//   );
//   return JSON.parse(jsonPayload);
// }

function GoogleSignInButton({ disabled, onValueChange }) {
  const [loadingConnect, setLoadingConnect] = useState(false);
  const searchParams = useSearchParams();

  const { updateUserDispath } = useAuthContext();

  // const setSession = (token) => {
  //   if (token) {
  //     sessionStorage.setItem('accessToken', token);
  //     // Set any other session data here
  //   } else {
  //     sessionStorage.removeItem('accessToken');
  //     // Remove any other session data here
  //   }
  // };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoadingConnect(true);
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const userInfo = await response.json();
        const data = {
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          name: userInfo.name,
          avatar: userInfo.picture,
          device_token: tokenResponse.access_token,
          token: tokenResponse.access_token,
        };

        const refCode = searchParams.get('xoffer');
        if (refCode) {
          data.ref_code = refCode;
        }
        // console.log("data auth ===",data)
        const loginResponse = await loginByGoogle(data);

        if (loginResponse) {
          updateUserDispath(loginResponse);

        } else {
          handleChange(false);
          alert('Google login failed');
        }
      } catch (error) {
        handleChange(false);
        console.error('Google login error:', error);
        // alert('Google login was not successful');
      } finally {
        setLoadingConnect(false);
        // handleChange(false);
      }
    },
    onError: (error) => {
      handleChange(false);
      console.error('Login Failed:', error);
      alert('Google Sign-In was not successful. Please check your browser settings.');
    },
    onNonOAuthError: () => {
      console.error('Login closed');
      handleChange(false);
    },
  });
  const handleChange = (e) => {
    onValueChange(e);
  };
  useEffect(() => {
    // Wait for the Google API script to be available
    const initializeGoogleSignIn = () => {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: login,
      });
    };

    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    }
  }, [login]);
  const handleLogin = () => {
    handleChange(true);
    login();

  }
  return (
    <div id="google-signin-button">
      <LoadingButton
        fullWidth
        color="secondary"
        sx={{
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #dcdee2',
          '&:hover': {
            backgroundColor: '#f1f1f1',
          },
          '& .MuiButton-startIcon': {
            marginRight: '10px',
          },
          '& .MuiLoadingButton-loadingIndicator': {
            color: 'black',
          },
        }}
        type="button"
        variant="contained"
        startIcon={
          <img
            alt="Google logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
            width={24}
          />
        }
        onClick={handleLogin}
        loading={loadingConnect}
        disabled={disabled}
      >
        Continue with Google
      </LoadingButton>
    </div>
  );
}

export default function GoogleSignIn({ onValueChange, disabled }) {

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleSignInButton onValueChange={onValueChange} disabled={disabled} />
    </GoogleOAuthProvider>
  );
}
GoogleSignInButton.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};
GoogleSignIn.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};