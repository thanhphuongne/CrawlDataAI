import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import { TableNoData, TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'No.', align: 'center' },
  { id: 'accountName', label: 'Account Name', align: 'left' },
  { id: 'totalScore', label: 'Total Score', align: 'center' },
];

// ----------------------------------------------------------------------

export default function RankingLeaderboardTable({ data, table }) {
  const notFound = !data?.length;
  return (
    <Box sx={{backgroundColor:'rgba(27, 43, 53, 0.9)', borderTopLeftRadius:'18px', borderTopRightRadius:'18px'}}>
      <TableContainer
        sx={{ flex: 1, position: 'relative', overflow: 'auto', borderTopLeftRadius:'18px', borderTopRightRadius:'18px' }}
      >
        <Table size={table.dense ? 'small' : 'medium'}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            rowCount={data?.length}
            // numSelected={table.selected.length}
            // onSort={table.onSort}
          />
          {notFound ? (
            <TableBody>
              <TableNoData notFound={data.length === 0} />
            </TableBody>
          ) : (
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} sx={{ height: 45 }}>
                  <TableCell align="center">
                    {index + 1 + table.page * table.rowsPerPage <= 3 ? (
                      [
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
                      ][index]
                    ) : (
                      <strong>{index + 1 + table.page * table.rowsPerPage}</strong>
                    )}
                  </TableCell>

                  <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      alt={row.accountName}
                      src={row?.avatar}
                      sx={{ mr: 1.5, width: 35, height: 35,padding : '21px' }}
                    />
                    <Box>
                      <Typography variant="body2">{row.accountName}</Typography>
                      {/* <Typography variant="caption" color="text.secondary">
                          {fShortenWalletAddress(row.public_address ? row.public_address : row.wallet_address)}
                        </Typography> */}
                    </Box>
                  </TableCell>

                  <TableCell align="center">{fNumber(row.totalScore)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        {/* </Scrollbar> */}
      </TableContainer>

      {/* <TablePaginationCustom
        count={data.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
        rowsPerPageOptions={rowsPerPage}
      /> */}
    </Box>
  );
}

RankingLeaderboardTable.propTypes = {
  table: PropTypes.any,
  data: PropTypes.array,
};
