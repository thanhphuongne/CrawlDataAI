import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function AccountRewardHistoryRow({ row }) {
  const { updated_at, reward_name, points_received, points_bonus, total_points } = row;

  return (
    <TableRow hover>
        <TableCell sx={{ textAlign: 'center' }}>
          <ListItemText
            primary={fDate(updated_at)}
            secondary={fTime(updated_at)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell sx={{ textAlign: 'center' }}>{reward_name}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{points_received}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{points_bonus}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{total_points}</TableCell>
      </TableRow>
  );
}

AccountRewardHistoryRow.propTypes = {
  row: PropTypes.object,
};
