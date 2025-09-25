import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { TablePaginationCustom } from 'src/components/table';

import RankingLeaderboardTable from './ranking-leaderboard-table';

// ----------------------------------------------------------------------

export default function RankingList({ rankings, changePageAndSize, page, size, totalCount }) {
  const router = useRouter();
  // console.log("table.totalCount",totalCount)
  const [table, setTable] = useState({
    page, // Current page (0-based index)
    rowsPerPage: size, // Number of rows per page
  });

  const rowsPerPageOptions = [5, 10, 25];
  // Navigate to campaign details
  const handleView = useCallback(
    (id) => {
      router.push(paths.campaign.details(id));
    },
    [router]
  );

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setTable((prev) => ({
      ...prev,
      rowsPerPage: newRowsPerPage,
      page: 0, // Reset to the first page when rows per page changes
    }));
    changePageAndSize(0, newRowsPerPage); // Inform the parent of the change
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setTable((prev) => ({
      ...prev,
      page: newPage,
    }));
    // console.log("table.rowsPerPage",table.rowsPerPage)
    changePageAndSize(newPage, table.rowsPerPage); // Inform the parent of the change
  };

  return (
    < >
      <Box
        gap={2.5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {/* Add content here if necessary */}
      </Box>

      <RankingLeaderboardTable data={rankings} table={table} />

      <Stack sx={{backgroundColor:'rgba(27, 43, 53, 0.9)', borderBottomLeftRadius:'18px',borderBottomRightRadius:'18px'}}>
        <TablePaginationCustom
          count={totalCount} // Total records from backend
          page={table.page} // Current page
          rowsPerPage={table.rowsPerPage} // Rows per page
          onPageChange={handlePageChange} // Triggered on page change
          onRowsPerPageChange={handleRowsPerPageChange} // Triggered on rows per page change
          rowsPerPageOptions={rowsPerPageOptions} // Options for rows per page
        />
      </Stack>
    </>
  );
}

RankingList.propTypes = {
  rankings: PropTypes.array.isRequired,
  changePageAndSize: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};
