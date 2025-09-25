import PropTypes from 'prop-types';
// import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { getComments } from 'src/api/campaign';

import Label from 'src/components/label';
// ----------------------------------------------------------------------
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import CommentList from './comment-list';
import Iconify from '../../components/iconify';

export default function MysubmitTableRow({
  row,
  index,
  table
}) {
  const popover = usePopover();
  const confirm = useBoolean();
  // const router = useRouter();  // Use Next.js useRouter hook for navigation
  // console.log(row);
  // const handleViewRow = () => {
  //   let url = row?.ref_id ? `/campaign/${row?.code}` : `/campaign/${row?.campaign_id}`;
  //   router.push(url);  // Navigate to the appropriate URL
  //   popover.onClose();  // Close the popover after navigation
  // };
  const [comment, setComments] = useState('');
  const handleViewRow = useCallback(
    async (id) => {
      const cmt = await getComments(id);
      setComments(cmt);
    },
    []
  );
  // console.log(row)
  return (
    <>
      <TableRow hover >
        <TableCell align="center">
          <strong>{index + 1 + table.page * table.rowsPerPage}</strong>
        </TableCell>

        <TableCell sx={{ alignItems: 'center', maxWidth:'100px',justifyItems:'center' }}>
          <Typography variant="body2" noWrap>
            {row?.accountName ? (
              <Typography variant="filled">
                {row?.accountName}
              </Typography>
            ) : (
              <Typography variant="filled">
                ---
              </Typography>
            )}
          </Typography>
        </TableCell>

        <TableCell sx={{ maxWidth: '250px', whiteSpace: 'normal', wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          <Tooltip title={row?.category?.name}>
          <Typography variant="body2" sx={{ display: 'inline', whiteSpace: 'normal', wordWrap: 'break-word',}}>
            {row?.descriptions ? (
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
            {row?.descriptions ? (
              <Typography variant="filled" sx={{ display: 'inline' }}>
                {row?.descriptions}
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
            {/* {row?.quest + '/' + row?.total} */}
            {row?.approver ? (
              <Typography variant="filled">
                {row?.approver}
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
            {/* {row?.quest + '/' + row?.total} */}
            {row?.supervisorInfo?.accountName ? (
              <Typography variant="filled">
                {row?.supervisorInfo?.accountName}
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
            {/* {row?.quest + '/' + row?.total} */}
            {row?.category?.score ? (
              <Typography variant="filled">
                {row?.category?.score}
              </Typography>
            ) : (
              <Typography variant="filled">
                ---
              </Typography>
            )}
          </Typography>
        </TableCell>
        <TableCell sx={{textAlign:'center'}}>
          {(() => {
            const statusConfig = {
              APPROVED: { label: 'Approved', color: 'success' },
              WAITING: { label: 'Waiting', color: 'info' },
              REJECT: { label: 'Cancelled', color: 'error' },
              CONFIRMED: { label: 'Confirmed', color: 'primary' },
            };
            // Lấy giá trị từ object hoặc mặc định nếu status không khớp
            const { label, color } = statusConfig[row?.status] || { label: 'Uncompleted', color: 'warning' };

            return (
              <Label variant="soft" color={color} sx={{ width: '100px', py: 2 }}>
                {label}
              </Label>
            );
          })()}
        </TableCell>
        <TableCell sx={{textAlign:'center'}} >{fDate(row?.createdAt)}</TableCell>

        <TableCell align="center" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={async () => {
            await handleViewRow(row?.id);
            confirm.onTrue();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View Comment
        </MenuItem>
      </CustomPopover>
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
        {/* <FormProvider methods={methods} onSubmit={onSubmit}> */}
          <DialogContent
            sx={{
              mt: 3,
              mx: 1,
              mb : 3,
            }}
          >
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Typography variant="h4">View Comments</Typography>
            </Stack>
            <CommentList comments={comment?.dataSubmit}></CommentList>
            
            
          </DialogContent>
      </Dialog>
    </>
    
  );
}

MysubmitTableRow.propTypes = {
  row: PropTypes.object,
  index:PropTypes.any,
  table:PropTypes.any
};
