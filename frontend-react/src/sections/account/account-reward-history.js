'use client';

import { useState, useEffect, useCallback } from 'react';

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableBody from '@mui/material/TableBody';
import { DatePicker } from '@mui/x-date-pickers';
import TableContainer from '@mui/material/TableContainer';

import { rewardHistory } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';

import Scrollbar from 'src/components/scrollbar';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import loadTable from './account-table-skeleton';
import AccountTimeRange from './account-time-range';
import AccountRewardHistoryRow from './account-reward-history-row';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'center' },
  { id: 'name', label: 'Name', align: 'center' },
  { id: 'received', label: 'Received', align: 'center' },
  { id: 'bonus', label: 'Bonus', align: 'center' },
  { id: 'total', label: 'Total', align: 'center' },
];

const defaultFilters = {
  date: null,
  limit: 5,
  filter: '1',
  skip: 0,
};
const TIME_RANGE_OPTIONS = [
  { value: '1', label: 'Today' },
  { value: '2', label: 'Yesterday' },
  { value: '3', label: 'Week' },
  { value: '4', label: 'Month' },
  { value: '5', label: 'Total' },
];

// ----------------------------------------------------------------------

export default function AccountRewardHistory() {
  const { user } = useAuthContext();
  const table = useTable();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [countAll, setCountAll] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const res = await rewardHistory(user, filters);
          setTableData(res.data);
          setCountAll(res.count);
        } catch (error) {
          setIsLoading(false);
          console.error('Error fetching getShareById data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [user, filters]);

  const handleSelectDate = useCallback(
    (newValue) => {
      if (filters.date !== newValue) {
        setFilters({ ...filters, date: newValue, filter: '0', skip: 0 });
        setTableData([]);
      }
    },
    [filters]
  );

  const handleTimeRange = useCallback(
    (newValue) => {
      if (filters.filter !== newValue) {
        setFilters({
          ...filters,
          date: null,
          filter: newValue,
          skip: 0,
        });
        setTableData([]);
      }
    },
    [filters]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      setFilters({ ...filters, limit: event.target.value, skip: 0 });
      setTableData([]);
    },
    [filters]
  );

  const handleChangePage = useCallback(
    (event, newPage) => {
      setFilters({ ...filters, skip: newPage * filters.limit });
      setTableData([]);
    },
    [filters]
  );
  return (
    <>
      <Stack direction="row" alignContent="center" justifyContent="space-between" sx={{ p: 2 }}>
        <DatePicker
          label="Select Date"
          value={filters.date}
          onChange={handleSelectDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 180 },
          }}
        />
        <AccountTimeRange
          title="Time range:"
          sort={TIME_RANGE_OPTIONS[filters.filter - 1]?.label || 'None'}
          onSort={handleTimeRange}
          sortOptions={TIME_RANGE_OPTIONS}
        />
      </Stack>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />
            {isLoading ? (
              loadTable({ numRow: filters.limit, numCol: TABLE_HEAD.length })
            ) : (
              <TableBody>
                {tableData.map((row) => (
                  <AccountRewardHistoryRow key={row.id} row={row} />
                ))}
              </TableBody>
            )}
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={countAll}
        page={filters.skip / filters.limit}
        rowsPerPage={filters.limit}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        //
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </>
  );
}
