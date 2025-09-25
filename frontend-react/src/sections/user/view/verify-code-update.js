import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

// import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';
import { EmailInboxIcon } from 'src/assets/icons';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFCode } from 'src/components/hook-form';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const BannerItem = ({ title, number, color }) => {
  const theme = useTheme();
  return (
    <Grid xs={6}>
      <Stack
        alignItems="center"
        sx={{
          ...bgGradient({
            direction: '135deg',
            startColor: alpha(theme.palette[color].light, 0.2),
            endColor: alpha(theme.palette[color].main, 0.2),
          }),
          p: 1,
          borderRadius: 2,
          textAlign: 'center',
          color: `${color}.darker`,
          backgroundColor: 'common.white',
        }}
      >
        {/* <Box sx={{ width: 40, height: 40 }}>
          <img alt="icon" src={imgSrc} />
        </Box> */}

        <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
          {title}
        </Typography>

        <Typography variant="h3">{number}</Typography>
      </Stack>
    </Grid>
  );
};

export default function VerifyCodeUpdate({ verifyInfo, onClose }) {
  const router = useRouter();
  const { verify, send_mail } = useAuthContext();
  const [disbutton, setDisbutton] = useState(false);
  // const [isLoading,setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const VerifySchema = Yup.object().shape({
    code: Yup.string().min(6, 'Code must be at least 6 characters').required('Code is required'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });
  // useEffect(() => {
  //   setLoading(false);
  // }, [loading]);
  const defaultValues = {
    code: '',
    email: verifyInfo.email,
    lang: 'en',
  };

  const methods_ = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods_;

  const onSubmitVerify = handleSubmit(async (data,event) => {
    event.preventDefault();
    // console.log("VerifySchema",VerifySchema);
    try {
      // setLoading(true);
      const res = await verify?.(data.email, data.code, data.lang, verifyInfo.id);

      if (res.status === 200) {
        enqueueSnackbar('Vefify success.');
        onClose();
      } else {
        enqueueSnackbar('The code has incorrect. \n Please try again.', { variant: 'error' });
      }
      // setLoading(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Verify Error. \n Please try again.', { variant: 'error' });
      // setLoading(false);
    }

  });

  const genVerifyCode = async () => {
    setDisbutton(true)
    const res_mail = await send_mail?.(verifyInfo.email, 'en', verifyInfo.id);
    if (res_mail.status === 200) {
      enqueueSnackbar('Verify code is sent to email. \n Please check your email!');
    }
    setDisbutton(false)
  };

  const renderHead = (email_) => (
    <>
      <EmailInboxIcon sx={{ height: 60 }} />

      <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 1, mb: 3 }}>
        <Typography variant="h4">Please check your email!</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          We have emailed a 6-digit confirmation code to <strong>{email_}</strong>, please enter the
          code in below box to verify your email.
        </Typography>
      </Stack>
    </>
  );
  const renderForm = (
    <Stack name="Verify" spacing={2} alignItems="center">
      <RHFCode name="code" disabled={disbutton} />

      <LoadingButton
      disabled={disbutton}
        name="verify"
        fullWidth
        size="large"
        variant="contained"
        loading={isSubmitting}
        type="submit"
        // onClick={handleSubmit}
      >
        Verify
      </LoadingButton>

      <Typography sx={{ mb: 2.5 }} variant="body2">
        {`Don’t have a code? `}
        <Link
          onClick={genVerifyCode}
          variant="subtitle2"
          sx={{
            cursor: 'pointer',
          }}
        >
          Resend code
        </Link>
      </Typography>
    </Stack>
  );
  // const [airdropTableData, setAirdropTableData] = useState([]);

  // console.log("CampaignRewardPolicy: ", rewardPolicy)
  // const {
  //   level,
  //   // discount,
  //   airTokenName,
  //   totalDepositAff,
  //   your_budget,
  //   airdrop_prizes,
  //   dataTopReward,
  //   affiliates_level
  // } = rewardPolicy

  useEffect(() => {}, []);

  return (
    <Stack sx={{ maxWidth: 400 }}>
      <FormProvider keepDirtyOnReinitialize methods={methods_} onSubmit={onSubmitVerify}>
        {renderHead(verifyInfo.email)}
        {renderForm}
      </FormProvider>
    </Stack>
  );
}

VerifyCodeUpdate.propTypes = {
  verifyInfo: PropTypes.object,
  onClose: PropTypes.func,
};

BannerItem.propTypes = {
  title: PropTypes.string,
  number: PropTypes.string,
  // imgSrc: PropTypes.string,
  color: PropTypes.string,
};
