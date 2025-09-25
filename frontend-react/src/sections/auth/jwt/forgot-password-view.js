'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { PasswordIcon } from 'src/assets/icons';
import { RequestResetPass } from 'src/api/user';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// ----------------------------------------------------------------------

export default function ForgotPasswordView() {
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
    lang: 'en',
    type: 'next',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.info('DATA', data);
      const res = await RequestResetPass(data);
      console.log('Response:', res); // Log để kiểm tra
      if (!res) {
        enqueueSnackbar("The server response is invalid.", { variant: "error" });
        return;
      }
      if (res.flag === 0) {
        setIsCodeVisible(true);
        enqueueSnackbar("The verification code has been sent to your email.", { variant: "success" });
      } else if (res.flag === 1) {
        enqueueSnackbar(res.message || (
          <>
            Your password has been sent to your email.<br />Please check your email and log in again!
          </>
        ), { variant: "success" });
        const returnToo = '/login';
        setTimeout(() => {
          router.push(returnToo);
        }, 500);
      } else if (res.isSuccess === false) {
        enqueueSnackbar(res.data || "An unknown error has occurred.", { variant: "error" });
      } else {
        enqueueSnackbar("Unexpected response from the server.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Error: ${error.message || error}`, { variant: "error" });
      console.error(error);
    }
  });
  // useEffect(() => { renderForm }, [isCodeVisible]);

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="email"
        label="Email address"
        disabled={isCodeVisible} // Khóa ô Email sau khi gửi lần 1
      />
      {isCodeVisible && (
        <RHFTextField
          name="verifyCode"
          label="Verify Code"
        />
      )}
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ backgroundColor: '#d2b36d' }}
      >
        {isCodeVisible ? 'Verify Code' : 'Send Request'}
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the email address associated with your account and We will email you a link
          to reset your password.
        </Typography>
      </Stack>
    </>
  );

  return (
    <Stack sx={{ padding: '20px', backgroundColor: 'rgba(27, 43, 53, 0.9)', borderRadius: '18px' }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderHead}

        {renderForm}
      </FormProvider>
    </Stack>
  );
}
