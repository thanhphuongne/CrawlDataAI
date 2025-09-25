'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';

import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form'; // Đảm bảo đường dẫn đúng
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------


import axios, { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';

import RHFAutocompleteAccount from './submit-request-auto-complete';

export default function SubmitView({ onClose }) {
  // const { login, loginTelegram, metamaskLogin } = useAuthContext();
  // const { connect: connectTon, loadingConnect: loadingTonConnect } = connectTonWallet();
  // const {
  //   loadingConnect: loadingMetaMaskConnect,
  //   connectMetaMask,
  //   // connectMetaMaskTest,
  // } = useMetaMaskLogin();
  const { user } = useAuthContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  // const [errorMsg, setErrorMsg] = useState('');

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [approvers, setApprovers] = useState('');
  const [supervisors, setSupervisors] = useState([]);

  const [accountName, setAccountName] = useState([]);

  // Gọi API lấy danh sách Category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(endpoints.category.path); // API của bạn

        const categoryList = response.data.payload.data.map((item) => ({
          label: item.name, // Thay item.name bằng key tương ứng từ API
          code: item.id,
          approver: item.approver,
        }));

        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Gọi API lấy danh sách Supervisor
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await axios.get(endpoints.auth.users); // API của bạn

        const supervisorList = response.data.payload.data.map((item) => ({
          label: item.accountName, // Thay item.fullName bằng key tương ứng từ API
          code: item.id,
        }));
        // console.log("=========supervisorList============", supervisorList)
        setSupervisors(supervisorList);
      } catch (error) {
        console.error('Error fetching supervisors:', error);
      }
    };

    fetchSupervisors();
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Lấy đường dẫn hiện tại
      const currentPath = window.location.pathname;
      // console.log('currentPath: ', currentPath)
      if (currentPath !== '/login') {
        window.localStorage.setItem('returnTo', currentPath);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Lấy đường dẫn hiện tại
      const currentPath = window.location.pathname;
      // console.log('currentPath: ', currentPath)
      if (currentPath !== '/login') {
        window.localStorage.setItem('returnTo', currentPath);
      }
    }
  }, []);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  // console.log({returnTo, PATH_AFTER_LOGIN})
  const handleSearch = async () => {
    try {
      const response = await axios.get(endpoints.auth.users); // API của bạn

      const supervisorList = response.data.payload.data.map((item) => ({
        label: item.accountName, // Thay item.fullName bằng key tương ứng từ API
        code: item.id,
      }));
      // console.log("=========supervisorList============", supervisorList)
      setSupervisors(supervisorList);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  const SubmitSchema = Yup.object().shape({
    accountName: Yup.object()
      .shape({
        label: Yup.string().required(),
        code: Yup.string().required(),
      })
      .nullable()
      .required('Contributer is required')
      .test(
        'not-same-as-supervisor',
        'Account Name cannot be the same as Supervisor',
        (value, { parent }) => {
          const supervisor = parent.supervisor;
          return !value || !supervisor || value.code !== supervisor.code;
        }
      ),
    category: Yup.object()
      .shape({
        label: Yup.string().required(),
        code: Yup.string().required(),
      })
      .nullable()
      .required('Category is required'),
    approver: Yup.string().required('Approver is required'),
    supervisor: Yup.object()
      .shape({
        label: Yup.string().required(),
        code: Yup.string().required(),
      })
      .nullable()
      .required('Supervisor is required'),
      // .test(
      //   'no-match',
      //   'Contributer and Supervisors must not be the same',
      //   (value, { parent }) => !(value !== parent.accountName)
      // ),
    descriptions: Yup.string().required('Description is required'),
    // hasNotifyMail: Yup.boolean(),
  });

  const defaultValues = {
    accountName: user?.user?.accountName ? { label: user.user.accountName, code: user.user.accountName } : null,
    category: null,
    approver: null,
    supervisor: null,
    descriptions: '',
    hasNotifyMail: true,
  };

  const methods = useForm({
    resolver: yupResolver(SubmitSchema),
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
      const data_ = {
        accountName: data.accountName.label,
        category: data.category.code,
        approver: data.approver,
        supervisor: data.supervisor.code,
        descriptions: data.descriptions,
        hasNotifyMail: true,
      };
      // console.log("✅ Form Submitted data_:", data_);
      const response = await axios.post(endpoints.submitRequest.create, data_);
      setLoading(false);
      // window.location.reload();
      if (response.status === 200) {
        enqueueSnackbar('Submit success', { variant: 'success' });
      }

      onClose();
      // router.push(returnToo);
    } catch (error) {
      setLoading(false);
      console.error(error);
      // reset();
      // setErrorMsg(typeof error === 'string' ? error : error.message);
      enqueueSnackbar(error?.errors[0]?.msg, { variant: 'error' });
    }
  });

  // useEffect(() => {

  //     axios.get(`${endpoints.auth.users}?textSearch=${accountInputName}`)
  //     .then((response) =>{
  //       const accountNameList = response.data.payload.data.map((item) => ({
  //         label: item.accountName, // Thay item.fullName bằng key tương ứng từ API
  //         code: item.id,
  //       }));
  //       // console.log("=========accountNameList============", accountNameList)
  //       setAccountName(accountNameList);
  //     })
  //     .catch ((error) =>{
  //       console.error("Error fetching accountName:", error);
  //     })

  // }, [accountInputName]);

  // const onClosePopup = () => {
  //   onClose();
  // }
  // const handleFilterCategorys = useCallback(
  //   (newValue) => {
  //     console.log("==category=", newValue)
  //     methods.setValue("category", newValue)
  //     // setApprover(newValue.approver)
  //     methods.setValue("accountName", newValue.approver, { shouldValidate: true, shouldDirty: true });
  //     methods.trigger("accountName"); // Gọi trig
  //   },
  //   [methods]
  // );
  const handleFilterCategorys = useCallback(
    (newValue) => {
      console.log('==category=', newValue);
      methods.setValue('category', newValue);
      setApprovers(newValue.approver);
      if (newValue?.approver) {
        methods.setValue('approver', newValue.approver, {
          shouldValidate: true,
          shouldDirty: true,
        });
        methods.trigger('approver'); // Kích hoạt re-render
      }
    },
    [methods]
  );

  const handleApprovers = useCallback((newValue) => {
    // console.log("==approver=", newValue)
    methods.setValue('approver', newValue);
    setApprovers(newValue);
  }, []);

  const renderForm = (
    <Stack spacing={2}>
      <RHFAutocompleteAccount
        apiUrl={endpoints.auth.users}
        name="accountName"
        size="large"
        label="Contributer"
        placeholder="Tên Account"
        fullWidth
        getOptionLabel={(option) => option?.label || ''}
        isOptionEqualToValue={(option, value) => option.code === value.code}
        onChange={(event, newValue) => methods.setValue('accountName', newValue)}
        error={!!methods.formState.errors.accountName}
        helperText={methods.formState.errors.accountName?.message}
        renderOption={(props, option) => (
          <li {...props} key={option.code}>
            {option.label}
          </li>
        )}
        disabled={loading}
        // onChange={}
      />
      {/* <UserSearch/> */}
      <RHFAutocomplete
        name="category"
        type="Category"
        label="Category"
        placeholder="Chọn Category"
        fullWidth
        options={categories || []}
        isOptionEqualToValue={(option, value) => option.code === value.code}
        onChange={(event, newValue) => handleFilterCategorys(newValue)}
        getOptionLabel={(option) => option.label || ''}
        error={!!methods.formState.errors.category}
        helperText={methods.formState.errors.category?.message}
        disabled={loading}
      />
      <RHFTextField
        name="approver"
        size="large"
        type = "Approver"
        InputLabelProps={{ shrink: true }}
        label={approvers !== '' ? '' : 'Approver'}
        disabled
        // onChange={}
      />
      {/* <RHFAutocomplete
        name="approver"
        type="Approver"
        label="Approver"
        placeholder=""
        fullWidth
        options={approvers || []}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(event, newValue) => handleApprovers(newValue)}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            {option.name}
          </li>
        )}
        getOptionLabel={(option) => option?.name || ""}
        error={!!methods.formState.errors.approver}
        helperText={methods.formState.errors.approver?.message}
        disabled={loading}
      /> */}
      <RHFAutocompleteAccount
        apiUrl={endpoints.auth.users}
        name="supervisor"
        type="Supervisor"
        label="Supervisor"
        placeholder="Chọn Supervisor"
        fullWidth
        getOptionLabel={(option) => option?.label || ''}
        isOptionEqualToValue={(option, value) => option.code === value.code}
        onChange={(event, newValue) => methods.setValue('supervisor', newValue)}
        error={!!methods.formState.errors.supervisor}
        helperText={methods.formState.errors.supervisor?.message}
        renderOption={(props, option) => (
          <li {...props} key={option.code}>
            {option.label}
          </li>
        )}
        disabled={loading}
      />
      <RHFTextField
        name="descriptions"
        label="Description"
        fullWidth
        multiline
        rows={3}
        disabled={loading}
      />
      {/* <Controller
        name="hasNotifyMail"
        control={methods.control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                {...field}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                size="small"
                disabled={loading}
              />
            }
            label="Thông báo mail"
          />
        )}
      /> */}
      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link> */}
      <LoadingButton
        fullWidth
        color="inherit"
        type="submit"
        variant="contained"
        loading={loading}
        sx={{
          '&:hover': {
            cursor: loading ? 'not-allowed' : 'pointer',
          },
          backgroundColor: '#d2b36d',
          color: 'white',
        }}
        disabled={loading}
      >
        Log Contribute
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h4">Submit scoring</Typography>
        {/* <Typography variant="caption" sx={{ color: 'grey' }}>
          Sign-in to your account and start the adventure
        </Typography> */}
      </Stack>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
SubmitView.propTypes = {
  onClose: PropTypes.func.isRequired,
};
