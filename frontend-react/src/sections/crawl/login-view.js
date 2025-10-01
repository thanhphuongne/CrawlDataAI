'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { loginCrawl } from 'src/api/crawl-api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function CrawlLoginView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      await loginCrawl(data);
      setLoading(false);
      const returnPath = returnTo || '/crawl/chat';
      router.push(returnPath);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.message || 'Login failed', { variant: 'error' });
    }
  });

  const renderForm = (
    <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <RHFTextField
        name="email"
        size="small"
        label="Email"
        disabled={loading}
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
        disabled={loading}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          '&:hover': {
            cursor: loading ? 'not-allowed' : 'pointer',
          },
          backgroundColor: '#d2b36d',
          color: 'white',
        }}
        disabled={loading}
      >
        Login to AI Crawl
      </LoadingButton>
    </Stack>
  );

  return (
    <Stack sx={{ pt: 5, pb: 7 }}>
      <Stack spacing={1} sx={{ mb: 2, alignContent: 'center' }}>
        <Typography variant="h4">AI Crawl Data</Typography>
        <Typography variant="caption" sx={{ color: 'grey' }}>
          Sign-in to access AI-powered data crawling
        </Typography>
      </Stack>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </Stack>
  );
}