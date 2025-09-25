import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import axios, { endpoints } from 'src/utils/axios';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import {
  useTable,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'No.', align: 'center' },
  { id: 'accountName', label: 'Account Name', align: 'left' },
  { id: 'descriptions', label: 'Descriptions', align: 'center' },
  { id: 'approver', label: 'Approver', align: 'center' },
  { id: 'supervisor', label: 'Supervisor', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'createdAt', label: 'CreatedAt', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function SupervisorTable({ data, filtersSuper, countSuper, setFiltersSuper, isLoading }) {
  // const [tableData, setTableData] = useState(data);
  const popover = usePopover();
  const confirm = useBoolean();
  const [loading, setLoading] = useState(false);
  const [dataConfirm, setDataConfirm] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [errorMsg, setErrorMsg] = useState('');
  // const router = useRouter();  // Use Next.js useRouter hook for navigation
  // console.log(row);
  const handleViewRow = () => {
    // let url = row.ref_id ? `/campaign/${row.code}` : `/campaign/${row.campaign_id}`;
    // router.push(url);  // Navigate to the appropriate URL
    popover.onClose();  // Close the popover after navigation
  };
  const handleConfirm = useCallback((row) => {

    setDataConfirm(prev => (JSON.stringify(prev) !== JSON.stringify(row) ? row : prev));
    confirm.onTrue();
  }, []);
  const handleChangePage = useCallback(
    (event, newPage) => {
      // console.log("===newPage===",newPage)
      setFiltersSuper({ page: newPage, size: filtersSuper.size });
      // setTableData([]);
    },
    [filtersSuper]
  );

  const table = useTable();

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      setFiltersSuper({ size: event.target.value, page: 0 });
      // setTableData([]);
    },
    [filtersSuper]
  );

  const SubmitSchema = Yup.object().shape({
    descriptions: Yup.string().required('Description is required'),
    approve: Yup.boolean(),
  });

  const defaultValues = {
    descriptions: '',
    approve: false
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

  const onSubmit = handleSubmit(async (data_) => {
    setLoading(true);
    try {
      data_.id = dataConfirm.id;
      const response = await axios.post(endpoints.submitRequest.supervisorApprove, data_);
      if (response.status === 200) {
        enqueueSnackbar("Cancelled success", { variant: 'success' })
      }
      setLoading(false);
      confirm.onFalse();
      setFiltersSuper({ page: filtersSuper.page, size: filtersSuper.size });
    } catch (error) {
      setLoading(false);
      console.error(error);
      // reset();
      // setErrorMsg(typeof error === 'string' ? error : error.message);
      enqueueSnackbar(typeof error === 'object' ? error.errors[0].msg : error.errors[0].msg, { variant: 'error' })
    }
  });
  
  const handleConfirmSuccess = useCallback(async (row) => {
    setLoading(true);
    try {
      const data_ = {
        id: row.id,
        descriptions:"Confirm",
        approve:true
      }
      const response = await axios.post(endpoints.submitRequest.supervisorApprove, data_);
      if (response.status === 200) {
        setFiltersSuper({ page: filtersSuper.page, size: filtersSuper.size });
        enqueueSnackbar("Confirm success", { variant: 'success' })
      }
      setLoading(false);
      confirm.onFalse();

    } catch (error) {
      setLoading(false);
      console.error(error);
      // reset();
      // setErrorMsg(typeof error === 'string' ? error : error.message);
      enqueueSnackbar(typeof error === 'object' ? error.errors[0].msg : error.errors[0].msg, { variant: 'error' })
    }
  },[]);
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>This is the list of submit assigned for apuervisor</Typography>
      <Typography>{' '}</Typography>
      <TableContainer sx={{ flex: 1, position: 'relative', overflow: 'auto', mt: 2 }}>
        {/* <Scrollbar sx={{ maxHeight: 700, '& .simplebar-scrollbar': { width: '8px'} }} > */}
        <Table size={table.dense ? 'small' : 'medium'} >
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            numSelected={table.selected.length}
            onSort={table.onSort}
          />
          {data?.length === 0 ?
            (
              <Typography sx={{ p: 3 }}>No Data</Typography>
            ) : (
              <TableBody>
                {data?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ height: 45 }}
                  >
                    <TableCell align="center">
                      <strong>{index + 1 + table.page * table.rowsPerPage}</strong>
                    </TableCell>

                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" noWrap>
                        {/* {row.quest + '/' + row.total} */}
                        {row.accountName ? (
                          <Typography variant="filled">
                            {row.accountName}
                          </Typography>
                        ) : (
                          <Typography variant="filled">
                            ---
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" noWrap>
                        {row.descriptions ? (
                          <Typography variant="filled" sx={{ display: 'inline' }}>
                            {row.descriptions}
                          </Typography>
                        ) : (
                          <Typography variant="filled" sx={{ display: 'inline' }}>
                            ---
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {/* {row.quest + '/' + row.total} */}
                        {row.approver ? (
                          <Typography variant="filled">
                            {row.approver}
                          </Typography>
                        ) : (
                          <Typography variant="filled">
                            ---
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {/* {row.quest + '/' + row.total} */}
                        {row.supervisorInfo?.accountName ? (
                          <Typography variant="filled">
                            {row.supervisorInfo?.accountName}
                          </Typography>
                        ) : (
                          <Typography variant="filled">
                            ---
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const statusConfig = {
                          APPROVED: { label: 'approved', color: 'success' },
                          WAITING: { label: 'Waiting', color: 'info' },
                          REJECT: { label: 'Cancelled', color: 'error' },
                          CONFIRMED: { label: 'Confirmed', color: 'primary' },
                        };
                        // Lấy giá trị từ object hoặc mặc định nếu status không khớp
                        const { label, color } = statusConfig[row.status] || { label: 'Uncompleted', color: 'warning' };

                        return (
                          <Label variant="soft" color={color} sx={{ width: '150px', py: 2 }}>
                            {label}
                          </Label>
                        );
                      })()}
                    </TableCell>
                    <TableCell>{fDate(row.createdAt)}</TableCell>
                    <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }} >
                      <Tooltip title="Reject" placement="top" arrow>
                        <Button variant="soft" color="error" sx={{ width: '100px', py: 0.4 }} disabled={row.status !== 'WAITING'} onClick={() => handleConfirm(row)}>
                          <Iconify icon="solar:alarm-remove-bold" />Cancel
                        </Button>
                      </Tooltip>
                      <Tooltip title="Confirm" placement="top" arrow>
                        <Button variant="soft" color="success" sx={{ width: '100px', py: 0.4 }} disabled={row.status !== 'WAITING'} onClick={() => handleConfirmSuccess(row)}>
                          <Iconify icon="solar:check-circle-bold" /> Confirm
                        </Button>
                      </Tooltip>
                      {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>

                ))}
              </TableBody>
            )}
        </Table>
        {/* </Scrollbar> */}
      </TableContainer>
      <Dialog
        fullWidth
        maxWidth={false}
        open={confirm.value}
        onClose={confirm.onFalse}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{
          sx: { maxWidth: 520 },
        }}
        sx={{
          zIndex: 999,
        }}
      >
        {/* <DialogTitle id="dialog-title"></DialogTitle> */}
        <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent
          sx={{
            mt: 3,
            mx: 1,
          }}
        >
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography variant="h4">Cancel contribute</Typography>
          </Stack>
        
            <RHFTextField
              name="descriptions"
              label="Description"
              fullWidth
              multiline
              rows={3}
            // disabled={loading}
            />
        
        </DialogContent>
        <DialogActions sx={{ my: 0, py: 1.5 }}>
          <LoadingButton
            // fullWidth
            // color="while"
            backgroundColor='#d2b36d'
            type="submit"
            variant="contained"
            loading={loading}
            sx={{
              '&:hover': {
                cursor: loading ? 'not-allowed' : 'pointer',
              },
            }}
            disabled={loading}
          >
            Confirm
          </LoadingButton>
          {/* <Button onClick={confirm.onFalse} color="warning" variant="soft">
            Close
          </Button> */}
        </DialogActions>
        </FormProvider>
      </Dialog>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            handleViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>
      <TablePaginationCustom
        count={countSuper}
        page={filtersSuper.page}
        rowsPerPage={filtersSuper.size}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Box>

  );
}

SupervisorTable.propTypes = {
  data: PropTypes.array,
  filtersSuper: PropTypes.any,
  countSuper: PropTypes.any,
  setFiltersSuper: PropTypes.any,
  isLoading: PropTypes.any
};