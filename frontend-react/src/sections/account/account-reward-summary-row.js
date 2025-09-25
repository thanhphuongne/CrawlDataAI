import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function AccountRewardSummaryRow({ row }) {
  const { campaign_name, campaign_type, joined_at, amount } = row;
  let status;
  if (row?.pay_status_id === 26) {
    status = 'Pending';
  } else if (row?.is_claimed === 1) {
    status = 'Claimed';
  } else {
    status = 'Unclaimed';
  }

  const getStatusColor = (stt) => {
    if (stt === 'Pending') return 'error';
    if (stt === 'Unclaimed') return 'warning';
    return 'success';
  };
  return (
    <TableRow hover>
      <TableCell>{campaign_name}</TableCell>
      <TableCell sx={{ textAlign: 'center' }}>{campaign_type}</TableCell>
      <TableCell sx={{ textAlign: 'center' }}>
        <ListItemText
          primary={fDate(joined_at)}
          secondary={fTime(joined_at)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell sx={{ textAlign: 'center' }}>
        <Label color={getStatusColor(status)} sx={{ p: 1.5 }}>
          {status}
        </Label>
      </TableCell>
      <TableCell sx={{ textAlign: 'center' }}>{amount}</TableCell>
    </TableRow>
  );
}

AccountRewardSummaryRow.propTypes = {
  row: PropTypes.object,
};
