import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
// import { alpha } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';

import { fNumber, fShortenWalletAddress } from 'src/utils/format-number';

import { getLeaderboard } from 'src/api/campaign-detail';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
// import { TableHeadCustom } from 'src/components/table';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import CampaignLeaderboardTable from './ranking-leaderboard-table';

// ----------------------------------------------------------------------

export default function CampaignLeaderboard({
  campaignId,
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}) {
  const props = { defaultRowsPerPage: 10 };
  const table = useTable(props);
  const rowsPerPage = [5, 10, 25];

  const isPopupOpen = useBoolean();
  const [leaderboard, setLearderboard] = useState([]);
  const [scroll] = useState('paper');

  // Lấy toàn bộ leaderboard
  const getViewAll = async () => {
    const dataLeaderboard = await getLeaderboard(campaignId, 0);
    setLearderboard(dataLeaderboard);
    isPopupOpen.onTrue();
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />
      <TableContainer>
        <Scrollbar>
          <Table
            size="small"
            sx={
              {
                //  minWidth: 640
              }
            }
          >
            <TableHeadCustom headLabel={tableLabels} />

            {tableData && (
              <TableBody>
                {tableData.map((row, index) => (
                  <CampaignLeaderboardRow key={row.id} row={row} index={index} />
                ))}
              </TableBody>
            )}
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {tableData.length >= 10 && (
        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button
            size="small"
            color="inherit"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
            onClick={() => getViewAll()}
          >
            View All
          </Button>
        </Box>
      )}

      <Dialog open={isPopupOpen.value} onClose={isPopupOpen.onFalse}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <CampaignLeaderboardTable data={leaderboard} table={table} />
        </DialogContent>

        <DialogActions sx={{ p: 0 }}>
          <TablePaginationCustom
            count={leaderboard.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            // dense={table.dense}
            // onChangeDense={table.onChangeDense}
            rowsPerPageOptions={rowsPerPage}
          />
        </DialogActions>
      </Dialog>
    </Card>
  );
}

CampaignLeaderboard.propTypes = {
  campaignId: PropTypes.string,
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function CampaignLeaderboardRow({ row, index }) {
  return (
    <TableRow>
      <TableCell align="center">
        {[
          <Iconify
            icon="solar:crown-bold"
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              color: 'warning.main',
            }}
          />,
          <Iconify
            icon="hugeicons:medal-second-place"
            sx={{
              mt: 0.5,
              width: 30,
              height: 30,
              borderRadius: '50%',
              color: '#78909C',
            }}
          />,
          <Iconify
            icon="hugeicons:medal-third-place"
            sx={{
              mt: 0.5,
              width: 30,
              height: 30,
              borderRadius: '50%',
              color: '#8D6E63',
            }}
          />,
        ][index] || <strong>{index + 1}</strong>}
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={row.full_name} src={row.avatar} sx={{ mr: 1.5, width: 35, height: 35 }} />
        <Box>
          <Typography variant="body2">
            {row.full_name ? row.full_name : fShortenWalletAddress(row.email)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {fShortenWalletAddress(row.public_address ? row.public_address : row.wallet_address)}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">{fNumber(row.total_point)}</TableCell>
    </TableRow>
  );
}

CampaignLeaderboardRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
};
