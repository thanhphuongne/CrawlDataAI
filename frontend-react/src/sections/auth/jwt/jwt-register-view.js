'use client';

import * as Yup from 'yup';
import Bowser from 'bowser';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, forwardRef } from 'react';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import { Divider } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useAuthContext } from 'src/auth/hooks';
import { connectTonWallet } from 'src/ton-connect/ton-connect';
import { useMetaMaskLogin } from 'src/nvm-wallet-connect/metamask-connect';
import { PATH_PRIVACY_POLICY, PATH_TERMS_OF_SERVICE } from 'src/config-global';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';


// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function JwtRegisterView() {
  const { metamaskLogin } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { register, send_mail, getAff } = useAuthContext();
  const dialog = useBoolean();
  const [dialogContent, setDialogContent] = useState({ title: null, content: null });
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  // const returnTo = searchParams.get('returnTo');

  const password = useBoolean();
  const confirmPassWord = useBoolean();
  const RegisterSchema = Yup.object().shape({
    accountName: Yup.string().required('AccountName is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'password be at least 8 characters'),
    confirmPassWord: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    // ref_code: Yup.string().max(6, 'Referral code must have 6 characters'),
  });
  const mdUp = useResponsive('up', 'md');

  const defaultValues = {
    accountName: '',
    password: '',
    confirmPassWord: '',
  };
  // const ref_code_ = searchParams.get('xoffer');
  // useEffect(() => {
  //   // const searchParams = new URLSearchParams(window.location.search);
  //   const xoffer = searchParams.get('xoffer');
  //   if (xoffer) {
  //     setRefCode(xoffer);
  //   }
  // }, [searchParams]);

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });
  // const handleRefCodeChange = (e) => {
  //   if (e.target.value.length > 6) {
  //     if (referral) {
  //       setErrorMsg(null);
  //     } else {
  //       setErrorMsg('Referral code must have 6 characters');
  //     }
  //   } else if (e.target.value.length === 0) {
  //     setRefCode('');
  //     setErrorMsg(null);
  //   } else setRefCode(e.target.value);
  // };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (getAff) {
  //       try {
  //         if (ref_code) {
  //           const res = await getAff(ref_code);
  //           if (res.status === 200) {
  //             // Handle successful response

  //             if (res.data?.full_name !== undefined && res.data?.full_name) {
  //               // setReferral(res.data?.full_name);
  //               setErrorMsg(null);
  //             } else {
  //               // setRefCode('');
  //               setReferral('');
  //               setErrorMsg('Referral code not found');
  //             }
  //           }
  //         }
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [ref_code, getAff]);
  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods;
  const { connect: connectTon, loadingConnect: loadingTonConnect } = connectTonWallet();
  const { loadingConnect: loadingMetaMaskConnect, connectMetaMask } = useMetaMaskLogin();
  const setLoadingG = (newValue) => {
    setLoading(newValue);
  };
  const onSubmit = handleSubmit(async (data, event) => {
    // event.preventDefault();
    try {

      const res = await register?.(
        data.accountName,
        data.password,
        confirmPassWord
      );
      // if (res.status === 200) {
        // call api gen code
        // const res_mail = await send_mail?.(data.email, data.lang, res?.data.data.id);

        // dialog.onTrue();
        // const dataVerify = {
        //   email: res?.data.data.email,
        //   id: res?.data.data.id,
        // };
        // setDialogContent({
        //   title: 'Verify your email',
        //   content: <VerifyCodeRegister verifyInfo={dataVerify} />,
        // });

        // console.log("res_mail===",res_mail);
      // } else {
      //   enqueueSnackbar('Register Error. \n Please try again.', { variant: 'error' });
      // }

      // router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      // console.error(error);
      // reset();
      // setErrorMsg(typeof error === 'string' ? error : error.message);
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
    }
  });
  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      dialog.onFalse();
    }
  };

  const [browserInfo, setBrowserInfo] = useState(null);
  const [isMetaMaskBrowser, setIsMetaMaskBrowser] = useState(false);

  // kiểm tra trình duyệt của user đăng nhập
  useEffect(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const info = browser.getBrowser();
    setBrowserInfo(info);

    // kiểm tra user có sử dụng trình duyệt MetaMask không
    const {userAgent} = window.navigator;
    if (userAgent.includes('MetaMask')) {
      setIsMetaMaskBrowser(true);
    }
  }, []);

  const renderDialog = (
    <Dialog
      fullScreen={!mdUp}
      disableEnforceFocus
      // fullWidth
      open={dialog.value}
      TransitionComponent={Transition}
      onClose={handleClose}
    >
      {dialogContent.title && (
        <>
          <DialogTitle
            sx={{ py: 2, mb: 2, backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.16) }}
          >
            {dialogContent.title}
          </DialogTitle>

          {/* <Iconify width={25} icon="solar:users-group-rounded-bold"
            onClick={dialog.onFalse}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          /> */}
        </>
      )}

      {dialogContent.content && (
        <DialogContent sx={{ color: 'text.secondary' }}>{dialogContent.content}</DialogContent>
      )}

      {/* <DialogActions sx={{ pt: 1 }}>
        <Button variant="contained" onClick={dialog.onFalse} autoFocus>
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  );

  const renderHead = (
    <>
      <Stack
        spacing={2}
        sx={{ paddingTop: isMetaMaskBrowser ? 40 : { xs: 25, md: 3 }, mb: 2, position: 'relative' }}
      >
        <Typography variant="h4">Get started</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>

          <Link href={paths.login} component={RouterLink} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack>
      {/* <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Get started</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>

          <Link href={paths.login} component={RouterLink} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack> */}
    </>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        mb: 2,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'By signing up, I agree to '}
      <Link
        href={PATH_TERMS_OF_SERVICE}
        underline="always"
        color="text.primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms of Service
      </Link>
      {' and '}
      <Link
        href={PATH_PRIVACY_POLICY}
        underline="always"
        color="text.primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <Stack spacing={2.5}>
        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField
            disabled={isSubmitting || loadingMetaMaskConnect || loadingTonConnect || loading}
            name="firstName"
            label="First name"
          />
          <RHFTextField
            disabled={isSubmitting || loadingMetaMaskConnect || loadingTonConnect || loading}
            name="lastName"
            label="Last name"
          />
        </Stack> */}

        <RHFTextField
          disabled={isSubmitting || loadingMetaMaskConnect || loadingTonConnect || loading}
          name="accountName"
          label="Account Name"
        />

        <RHFTextField
          disabled={isSubmitting || loadingMetaMaskConnect || loadingTonConnect || loading}
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
        />
        <RHFTextField
          disabled={isSubmitting || loadingMetaMaskConnect || loadingTonConnect || loading}
          name="confirmPassWord"
          label="Confirm password"
          type={confirmPassWord.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={confirmPassWord.onToggle} edge="end">
                  <Iconify
                    icon={confirmPassWord.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton
          disabled={!isValid || loadingMetaMaskConnect || loadingTonConnect || loading}
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Create account
        </LoadingButton>
      </Stack>
  );

  // connect Metamask
  // const onMetamaskSubmit = async () => {
  //   setLoading(true);
  //   const refCode = searchParams.get('xoffer');
  //   try {
  //     const res = await connectMetaMaskTest(refCode);

  //     // console.log('onMetamaskSubmit: ', res);
  //     await metamaskLogin(res.public_address, res.signature, refCode);
  //     // console.log('onMetamaskSubmit: ', res);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.error('Error fetching data:', error);
  //   }
  // };
  // button register social
  // const socialRegister = (
  //   <Stack spacing={2}>
  //     <LoadingButton
  //       disabled={isSubmitting || loadingMetaMaskConnect || loadingTonConnect || loading}
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
  //           cursor: loadingMetaMaskConnect ? 'not-allowed' : 'pointer',
  //         },
  //       }}
  //       onClick={onMetamaskSubmit}
  //     >
  //       Continue with MetaMask
  //     </LoadingButton>

  //     <LoadingButton
  //       disabled={isSubmitting || loadingMetaMaskConnect || loadingTonConnect || loading}
  //       fullWidth
  //       color="secondary"
  //       sx={{
  //         ...bgGradient({
  //           direction: 'to right',
  //           startColor: `#0061ff 0%`,
  //           endColor: `#60efff 100%`,
  //         }),
  //         '&:hover': {
  //           cursor: loadingTonConnect ? 'not-allowed' : 'pointer',
  //         },
  //       }}
  //       type="submit"
  //       variant="contained"
  //       startIcon={<img alt="icon" src="/assets/tokens/ton.png" width={24} />}
  //       loading={loadingTonConnect}
  //       onClick={connectTon}
  //     >
  //       {!loadingTonConnect ? 'Continue with TON Wallet' : 'Connecting ...'}
  //     </LoadingButton>

  //     <GoogleSignIn
  //       onValueChange={setLoadingG}
  //       disabled={isSubmitting || loadingMetaMaskConnect || loadingTonConnect || loading}
  //     />
  //   </Stack>
  // );
  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ m: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
      <Divider sx={{ borderStyle: 'dashed', my: 1 }}>
        {/* <Typography variant="caption" sx={{ color: 'grey' }}>
          Or
        </Typography> */}
      </Divider>
      {/* {socialRegister} */}
      {renderDialog}
      {/* {renderTerms} */}
    </>
  );
}
