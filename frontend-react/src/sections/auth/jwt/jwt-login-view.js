'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useRef, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form'; // Đảm bảo đường dẫn đúng

import { connectMetaMaskTest } from 'src/nvm-wallet-connect/metamask-connect';

import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login, loginTelegram, metamaskLogin } = useAuthContext();
  // const { connect: connectTon, loadingConnect: loadingTonConnect } = connectTonWallet();
  // const {
  //   loadingConnect: loadingMetaMaskConnect,
  //   connectMetaMask,
  //   // connectMetaMaskTest,
  // } = useMetaMaskLogin();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [errorMsg, setErrorMsg] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Lấy đường dẫn hiện tại
      const currentPath = window.location.pathname
      // console.log('currentPath: ', currentPath)
      if (currentPath !== '/login') {
        window.localStorage.setItem('returnTo', currentPath)
      }
    }
  }, [])

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  // console.log({returnTo, PATH_AFTER_LOGIN})

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    accountName: Yup.string().required('Account name is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    accountName: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      await login?.(data.accountName, data.password);
      setLoading(false);
      const queryString = window.location.href;
      const path = new URL(queryString).pathname;
      const returnToo = path === '/login' ? PATH_AFTER_LOGIN : path || PATH_AFTER_LOGIN;
      // const returnToo = path || paths.activities;

      router.push(returnToo);
    } catch (error) {
      setLoading(false);
      if(error?.message) {
        enqueueSnackbar( error?.message , { variant: 'error' })
      } else {
        
        enqueueSnackbar( error.errors[0].msg , { variant: 'error' })
      }
      
    }
  });

  const onMetamaskSubmit = async () => {
    setLoading(true);
    const refCode = searchParams.get('xoffer');
    try {
      const res = await connectMetaMaskTest(refCode);

      // console.log('onMetamaskSubmit: ', res);
      await metamaskLogin(res.public_address, res.signature, refCode);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }

    //  const a =  connectMetaMask({ ref_code: searchParams.get('ref_code') }, '/dashboard', (success) => {
    //     console.log('metamask success: ', success);

    //     if (!success) {
    //       setErrorMsg('MetaMask login failed');
    //     }
    //     // metamaskLogin(success.public_address, success.signature, searchParams.get('ref_code'));
    //   });
  };

  const setLoadingG = (newValue) => {
    setLoading(newValue);
  }

  const telegramDivRef = useRef(null);

  // khoi tao button connect telegram
  useEffect(() => {
    const url = window.location.href;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'xoffer_monitor_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', url);
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-radius', '2');
    script.setAttribute('data-userpic', 'false');

    if (telegramDivRef.current) {
      telegramDivRef.current.appendChild(script);
    }

    const { href } = window.location;
    if (href.includes('status=402')) {
      enqueueSnackbar('Connect failed', { variant: 'error' });
    }

    const submutLoginTelegram = async (data) => {
      setLoading(true);
      try {
        await loginTelegram?.(data);
        setLoading(false);
        const queryString = window.location.href;
        const path = new URL(queryString).pathname;
        const returnToo = path === '/login' ? PATH_AFTER_LOGIN : path || PATH_AFTER_LOGIN;
        // const returnToo = path || paths.activities;

        router.push(returnToo);
      } catch (error) {
        setLoading(false);
        console.error(error);
        // reset();
        setErrorMsg(typeof error === 'string' ? error : error.message);
        enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' })
      }
    }

    const queryParameters = new URLSearchParams(window.location.search);
    const username = queryParameters.get("username");
    const first_name = queryParameters.get("first_name");
    const lastName = queryParameters.get("last_name");
    const photo_url = queryParameters.get("photo_url");
    const id = queryParameters.get("id");
    let data;
    if (id && username && first_name && photo_url) {
      data = {
        username: username,
        first_name: first_name,
        lastName: lastName,
        photo_url: photo_url,
        social_id: id
      };
      if (!loading) {
        submutLoginTelegram(data);
      }
    }
  }, []);

  // const socialLogin = (
  //   <Stack spacing={1.5} sx={{}}>
  //     <LoadingButton
  //       fullWidth
  //       color="secondary"
  //       variant="contained"
  //       loading={loadingMetaMaskConnect}
  //       startIcon={<Iconify icon="fluent:wallet-24-filled" width={24} />}
  //       sx={{
  //         ...bgGradient({
  //           direction: 'to right',
  //           startColor: `#ff930f 0%`,
  //           endColor: `#ffd642 100%`,
  //         }),
  //         '&:hover': {
  //           cursor: loading || loadingTonConnect ? 'not-allowed' : 'pointer',
  //         },
  //       }}
  //       onClick={onMetamaskSubmit}
  //       disabled={loading || loadingTonConnect}
  //     // onClick={() =>
  //     //   connectMetaMask({ ref_code: searchParams.get('ref_code') }, '/dashboard', (success) => {
  //     //     console.log('metamask success: ', success);

  //     //     if (!success) {
  //     //       setErrorMsg('MetaMask login failed');
  //     //     }
  //     //     metamaskLogin(success.public_address, success.signature, searchParams.get('ref_code'));
  //     //   })
  //     // }
  //     >
  //       Continue with MetaMask
  //     </LoadingButton>

  //     <LoadingButton
  //       fullWidth
  //       color="secondary"
  //       sx={{
  //         ...bgGradient({
  //           direction: 'to right',
  //           startColor: `#0061ff 0%`,
  //           endColor: `#60efff 100%`,
  //         }),
  //         '&:hover': {
  //           cursor: loading || loadingTonConnect ? 'not-allowed' : 'pointer',
  //         },
  //       }}
  //       type="submit"
  //       variant="contained"
  //       startIcon={<img alt="icon" src="/assets/tokens/ton.png" width={24} />}
  //       loading={loadingTonConnect}
  //       onClick={connectTon}
  //       disabled={loading || loadingTonConnect}
  //     >
  //       {!loadingTonConnect ? 'Continue with TON Wallet' : 'Connecting ...'}
  //     </LoadingButton>

  //     <GoogleSignIn onValueChange={setLoadingG} disabled={loading || loadingTonConnect} />
  //     <Box
  //       id="telegram-login" ref={telegramDivRef}
  //       sx={{
  //         px: 2,
  //         display: 'flex',
  //         opacity: loading ? 0.5 : 1,
  //         pointerEvents: (loading || loadingTonConnect) ? 'none' : 'unset',
  //         background: '#54a9eb', borderRadius: 1,
  //         '&:hover': {
  //           background: '#54a9eb',
  //           cursor: loading ? 'not-allowed' : 'pointer',
  //         },
  //       }}
  //     >
  //     </Box>
  //   </Stack>
  // );

  const renderForm = (
    <Stack spacing={2} sx={{display : 'flex',justifyContent:'center', alignItems:'center'}}>
      <RHFTextField
        name="accountName"
        size="small"
        label="Account Name"
        disabled={loading }
      />

      <RHFTextField
        size="small"
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        disabled={loading }
      />
      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link> */}
      <LoadingButton
        fullWidth
        color="inherit"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          '&:hover': {
            cursor: loading  ? 'not-allowed' : 'pointer',
          },
          backgroundColor: '#d2b36d',
          color: 'white',
        }}
        disabled={loading }
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <><Stack sx={{pt: 5, pb: 7 }}>
      <Stack spacing={1} sx={{ mb: 2 , alignContent : 'center'}}>
        <Typography variant="h4">QAI Scoring</Typography>
        <Typography variant="caption" sx={{ color: 'grey' }}>
          Sign-in to your account and start the adventure
        </Typography>
      </Stack>

      {/* {socialLogin} */}


      {/* <Divider sx={{ borderStyle: 'dashed', my: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'grey' }}>
          Or
        </Typography>
      </Divider> */}

      {/* {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )} */}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>

      <Link sx={{margin : "20px 0px 0px 0px"}} component={RouterLink} href={paths.forgotPassword} variant="subtitle2">
          Forgot your password?
        </Link>

</Stack>
      {/* <Stack
        component="span"
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 1.5 }}
      >
        <Link component={RouterLink} href={paths.register} variant="subtitle2">
          Create an account with your email
        </Link>
      </Stack> */}

      {/* <Stack
        component="span"
        direction="row"
        alignItems="center"
        justifyContent="center"
      > */}
      {/* </Stack> */}
    </>
  );
}
