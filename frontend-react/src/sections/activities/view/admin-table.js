import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useCallback,useEffect } from 'react';
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
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
// import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import axios, { endpoints } from 'src/utils/axios';

import { getComments } from 'src/api/campaign';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom
} from 'src/components/table';

import CommentList from '../comment-list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'No.', align: 'center' },
  {id:'createBy',label:'Create By',align:'center'},
  { id: 'accountName', label: 'Contributer', align: 'left' },
  { id: 'category', label: 'Category' },
  { id: 'descriptions', label: 'Descriptions', align: 'center' },
  { id: 'approver', label: 'Approver', align: 'center' },
  { id: 'supervisor', label: 'Supervisor', align: 'center' },
  { id: 'score', label: 'Score' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'createdAt', label: 'Created At', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function AdminTable({ data, filtersAdmin, countAdmin, setFiltersAdmin, isLoading }) {
  // const [tableData, setTableData] = useState(data);
  // console.log("===ApproverTable==",data)
  const popover = usePopover();
  const confirm = useBoolean();
  const [loading, setLoading] = useState(false);
  const [dataConfirm, setDataConfirm] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const confirmView = useBoolean();
  const [dataRow, setDataRow] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [comment, setComments] = useState('');
  // const router = useRouter();  // Use Next.js useRouter hook for navigation
  // console.log(data);
  
  const handleViewRow = useCallback(
    async (id) => {
      console.log("===", dataRow)
      const cmt = await getComments(id);
      setComments(cmt);
    },
    [popover]
  );
  const handleConfirm = useCallback((row) => {

    setDataConfirm(prev => (JSON.stringify(prev) !== JSON.stringify(row) ? row : prev));
    confirm.onTrue();
  }, []);
  const handleChangePage = useCallback(
    (event, newPage) => {
      setFiltersAdmin((prev) => ({ ...prev, page: newPage, size: filtersAdmin.size }));
    },
    [filtersAdmin]
  );

  const table = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  useEffect(() => {
    setFiltersAdmin((prev) => ({ ...prev, sortField: table.orderBy, sortDirection: table.order }));

    },[table.order,table.orderBy])

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      setFiltersAdmin((prev) => ({ ...prev, size: event.target.value, page: 0 }));
      // setTableData([]);
    },
    [filtersAdmin]
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
      data_.id = dataConfirm?.id;
      const response = await axios.post(endpoints.submitRequest.AdminAprove, data_);
      if (response.status === 200) {
        enqueueSnackbar("Cancel success", { variant: 'success' })
      }
      setLoading(false);
      confirm.onFalse();
      // setFiltersAdmin({ page: filtersAdmin.page, size: filtersAdmin.size });
      setFiltersAdmin((prev) => ({ ...prev, page: prev.page, size: prev.size }));
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
        id: row?.id,
        descriptions: '',
        approve: true
      }
      const response = await axios.post(endpoints.submitRequest.AdminAprove, data_);
      if (response.status === 200) {
        // setFiltersAdmin({ page: filtersAdmin.page, size: filtersAdmin.size });
        setFiltersAdmin((prev) => ({ ...prev, page: prev.page, size: prev.size }));
        enqueueSnackbar("Approve success", { variant: 'success' })
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
  }, []);
  return (
    <Box>
      {/* <Typography variant="body2" sx={{ fontStyle: 'italic' }}>This is the list of submit assigned for admin</Typography> */}
      {/* <Typography>{' '}</Typography> */}
      <TableContainer sx={{ flex: 1, position: 'relative', overflow: 'auto', mt: 4 }}>
        {/* <Scrollbar sx={{ maxHeight: 700, '& .simplebar-scrollbar': { width: '8px'} }} > */}
        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            numSelected={table.selected.length}
            onSort={table.onSort}
          />
          {data?.length === 0 ?
            (
              <TableBody>
                <TableNoData
                  notFound={
                    data.length === 0
                  }
                />
              </TableBody>

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

                    <TableCell sx={{ alignItems: 'center',justifyItems:'center' }}>
                       <Typography variant="body2" noWrap>
                        {/* {row?.quest + '/' + row?.total} */}
                        {row.createBy ? (
                          <Typography variant="filled">
                           {row?.createBy}
                          </Typography>
                        ) : (
                          <Typography variant="filled">
                            ---
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ alignItems: 'center', justifyItems:'center' }}>
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
                    <TableCell sx={{ maxWidth: '180px', whiteSpace: 'normal', wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                     <Tooltip title={row?.category?.name}>
                      <Typography variant="body2" sx={{ display: 'inline', whiteSpace: 'normal', wordWrap: 'break-word',}}>
                        {row.descriptions ? (
                          <Typography variant="filled" sx={{ display: 'inline' }}>
                            {row?.category?.name}
                          </Typography>
                        ) : (
                          <Typography variant="filled" sx={{ display: 'inline' }}>
                            ---
                          </Typography>
                        )}
                      </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                      <Tooltip title={row?.descriptions}>
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
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{justifyItems:'center'}}>
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
                    <TableCell sx={{justifyItems:'center'}}>
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
                    <TableCell sx={{justifyItems:'center'}}>
                      <Typography variant="body2" noWrap>
                        {/* {row.quest + '/' + row.total} */}
                        {row.category?.score ? (
                          <Typography variant="filled">
                            {row.category?.score}
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
                          APPROVED: { label: 'Approved', color: 'success' },
                          WAITING: { label: 'Waiting', color: 'info' },
                          REJECT: { label: 'Cancelled', color: 'error' },
                          CONFIRMED: { label: 'Confirmed', color: 'primary' },
                        };
                        // Lấy giá trị từ object hoặc mặc định nếu status không khớp
                        const { label, color } = statusConfig[row.status] || { label: 'Waiting', color: 'info' };

                        return (
                          <Label variant="soft" color={color} sx={{ width: '100px', py: 2 }}>
                            {label}
                          </Label>
                        );
                      })()}
                    </TableCell>
                    <TableCell>{fDate(row.createdAt)}</TableCell>
                    <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }} >
                      <Tooltip title="Reject" placement="top" arrow>
                        {/* onClick={quickEdit.onTrue} */}
                        {/* color={quickEdit.value ? 'inherit' : 'default'} */}
                        <Button variant="soft" color="error" sx={{ minWidth:'40px', py: 0.4 , margin : '10px' }} onClick={() => handleConfirm(row)}>
                          <Iconify icon="ri:close-circle-fill" />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Confirm" placement="top" arrow>
                        <Button variant="soft" color="success" sx={{ minWidth:'40px', py: 0.4 }} onClick={() => handleConfirmSuccess(row)}>
                          <Iconify icon="solar:check-circle-bold" /> 
                        </Button>
                      </Tooltip>
                      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={(event) => {
                        popover.onOpen(event);
                        setDataRow(row);
                      }}>
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                ))}
                <Dialog
                  fullWidth
                  maxWidth={false}
                  open={confirmView.value}
                  onClose={confirmView.onFalse}
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
                  {/* <FormProvider methods={methods} onSubmit={onSubmit}> */}
                  <DialogContent
                    sx={{
                      mt: 3,
                      mx: 1,
                      mb:3,
                    }}
                  >
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Typography variant="h4">View Comments</Typography>
                    </Stack>
                    <CommentList comments={comment?.dataSubmit}></CommentList>


                  </DialogContent>
                </Dialog>
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
              // color="inherit"
              backgroundColor='#d2b36d'
              type="submit"
              variant="contained"
              loading={loading}
              sx={{
                '&:hover': {
                  cursor: loading ? 'not-allowed' : 'pointer',
                },
                backgroundColor: '#d2b36d',
                color: 'white'
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
          onClick={async () => {
            await handleViewRow(dataRow?.id);
            popover.onClose();
            confirmView.onTrue();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View Comment
        </MenuItem>
      </CustomPopover>
      <TablePaginationCustom
        count={countAdmin}
        page={filtersAdmin.page}
        rowsPerPage={filtersAdmin.size}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Box>

  );
}

AdminTable.propTypes = {
  data: PropTypes.array,
  filtersAdmin: PropTypes.any,
  countAdmin: PropTypes.any,
  setFiltersAdmin: PropTypes.any,
  isLoading: PropTypes.any
};