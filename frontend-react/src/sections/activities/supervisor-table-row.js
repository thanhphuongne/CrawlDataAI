import PropTypes from 'prop-types';
// import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
// ----------------------------------------------------------------------

export default function SubpervisorTableRow({
  row,
}) {
  // const popover = usePopover();
  // const router = useRouter();  // Use Next.js useRouter hook for navigation
  // console.log(row);
  // const handleViewRow = () => {
  //   let url = row.ref_id ? `/campaign/${row.code}` : `/campaign/${row.campaign_id}`;
  //   router.push(url);  // Navigate to the appropriate URL
  //   popover.onClose();  // Close the popover after navigation
  // };
  return (
    <>
      <TableRow hover>
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

        <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
              REJECT: { label: 'Rejected', color: 'error' },
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

        {/* <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      {/* <CustomPopover
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
      </CustomPopover> */}
    </>
  );
}

SubpervisorTableRow.propTypes = {
  row: PropTypes.object,
};
