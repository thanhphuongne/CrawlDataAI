import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function AccountRewardGuideRow({ row }) {
  const { reward_name, reward_points, reward_description, rewards_regularity_name } = row;
  let status;
  if (row?.is_one_time === 0) {
    status = row?.earned;
  } else if (row?.status === 0) {
    status = 'Not done';
  } else {
    status = 'Done';
  }

  return (
    <TableRow hover>
      <TableCell>{reward_name}</TableCell>
      <TableCell sx={{ textAlign: 'center' }}>{reward_points}</TableCell>
      <TableCell>{reward_description}</TableCell>
      <TableCell>{rewards_regularity_name}</TableCell>
      <TableCell sx={{ textAlign: 'center' }}>
        <Label color={status === 'Not done' || status === 0 ? 'error' : 'success'} sx={{ p: 1.5 }}>
          {status}
        </Label>
      </TableCell>
    </TableRow>
  );
}

AccountRewardGuideRow.propTypes = {
  row: PropTypes.object,
};
