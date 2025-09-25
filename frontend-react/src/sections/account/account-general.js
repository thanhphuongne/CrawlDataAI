import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useAuthContext } from 'src/auth/hooks';
import { sendEmail, UpdateImage, UploadImage, UpdateUserInfo } from 'src/api/user';

import { useSnackbar } from 'src/components/snackbar';

import VerifyCodeUpdate from 'src/sections/user/view/verify-code-update';

import AccountChangePassword from './account-change-password';
// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const dialog = useBoolean();
  const { user, updateDispath } = useAuthContext();
  const [email, setEmail] = useState();
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerify, setIsVerify] = useState(false);

  const [dialogContent, setDialogContent] = useState({ title: null, content: null });
  const [isValid, setIsValid] = useState(true);
  const mdUp = useResponsive('up', 'md');
  const UpdateUserSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required').max(30, 'First name must be at most 30 characters'),
    last_name: Yup.string().required('Last name is required').max(30, 'Last name must be at most 30 characters'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    mobile: Yup.string()
      .matches(/^\d*$/, 'Phone number must contain only digits').max(20, 'Phone number must be at most 20 characters'),
    address: Yup.string().max(200, 'Address must be at most 200 characters'),

    // photoURL: Yup.mixed().nullable().required('Avatar is required'),
    // mobile: Yup.string().required('Phone is required').phone('Phone number must be a valid phone number'),
    // not required
    // isPublic: Yup.boolean(),
  });

  const defaultValues = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: email || '',
    photoURL: user?.avatar || null,
    mobile: user?.mobile || '',
    country: user?.country || '',
    address: user?.address || '',
    mode_google2fa: 0,
    lang: 'en'
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  useEffect(() => {
    if (user) {
      setEmail(user?.email);
      setValue('email', user?.email);

      if (user?.is_verify === 2) {
        setIsVerify(true);
      } else {

        setIsVerify(false);

      }
    }
  }, [user]);
  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await UpdateUserInfo(data, user?.id)
      if (res !== null) {
        updateDispath();
        enqueueSnackbar(res.message);
      }


    } catch (error) {
      console.error(error);
    }
  });

  const handleOnchangeEmail = useCallback((e) => {
    if (e.target.value !== user?.email) {
      setIsChange(true);
      setIsVerify(false);
    } else {
      setIsChange(false);
      setIsVerify(true);
    }
    // console.log("e.target.value",e.target.value);
    setIsValid(validateEmail(e.target.value));
    setEmail(e.target.value);
    setValue('email', e.target.value);
  }, []);

  const handleVerifyDone = () => {
    dialog.onFalse();
    setIsChange(false);
    setIsLoading(false);
    setIsVerify(true);
  }

  const handleCheckMail = async () => {
    setIsLoading(true);
    const body = {
      email: email,
    };
    const res = await sendEmail(body, user?.id);
    if (res?.status && res?.status === 200) {
      enqueueSnackbar(res.data.message);
      const dataVerify = {
        email: email,
        id: user?.id,
      };
      setDialogContent({
        title: 'Verify your email',
        content: <VerifyCodeUpdate verifyInfo={dataVerify} onClose={handleVerifyDone} />,
      });
      dialog.onTrue();
    } else {
      enqueueSnackbar(res.message, { variant: 'error' });
      setIsChange(true);
      setIsLoading(false);
    }
  };
  // const handleMouseDownPassword = useCallback((event) => {
  //   event.preventDefault();
  // }, []);

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setIsLoading(true);
      if (file) {
        const formData = new FormData();
        formData.append('file', file, file.name);

        formData.append('module', 'avatar');
        formData.append('id', 0);
        try {
          const res = await UploadImage(formData, file.type);
          if (res != null) {
            const body = {
              avatar: res.thumbnail,
              media_file_id: res.id,
            };
            const update_im = await UpdateImage(body, user.id);
            if (update_im != null) {
              updateDispath();
              enqueueSnackbar(update_im.message);
            }
          }
          setValue('photoURL', res.thumbnail);
        } catch (error) {
          console.error('Error uploading file:', error);
          // setIsLoading(false);
        } finally {
          // Clean up URL object after usage
          // enqueueSnackbar('Error uploading file');
          setIsLoading(false);
        }
      }
    },
    [setValue]
  );
  const validateEmail = (email_) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email_).toLowerCase());
  };
  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      dialog.onFalse();
    }
  };
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
  return (
    <>
      {/* <FormProvider methods={methods} onSubmit={onSubmit}> */}
        {/* <Grid container spacing={3}> */}
          {/* <Grid xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
              <RHFUploadAvatar
                disabled={isLoading}
                name="photoURL"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                } */}
              {/* /> */}

              {/* <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete User
            </Button> */}
            {/* </Card>
          </Grid> */}

          <Grid xs={12} md={8}>
                <AccountChangePassword sx={12} md={8}/>
          </Grid>
        {/* </Grid> */}
      {/* </FormProvider> */}
      {/* {renderDialog} */}
    </>
  );
}
