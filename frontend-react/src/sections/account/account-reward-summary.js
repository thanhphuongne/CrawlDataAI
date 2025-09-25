'use client';

import { useState, useEffect, useCallback } from 'react';

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { rewardSummary } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';

import Scrollbar from 'src/components/scrollbar';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import loadTable from './account-table-skeleton';
import AccountTimeRange from './account-time-range';
import AccountRewardSummaryRow from './account-reward-summary-row';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'center' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: 'date', label: 'Date', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'amount', label: 'Amount', align: 'center' },
];

const defaultFilters = {
  limit: 5,
  status: 0,
  skip: 0,
};
const STATUS_OPTIONS = [
  { value: '0', label: 'All Status' },
  { value: '1', label: 'Claimed' },
  { value: '2', label: 'Unclaimed' },
  { value: '3', label: 'Pending' },
];

// ----------------------------------------------------------------------

export default function AccountRewardSummary() {
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
          const res = await rewardSummary(user, filters);
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

  const handleTimeRange = useCallback(
    (newValue) => {
      console.log(newValue);
      if (filters.status !== newValue) {
        setFilters({
          ...filters,
          date: null,
          status: newValue,
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
      <Stack direction="row" alignContent="center" justifyContent="flex-end" sx={{ p: 2 }}>
        <AccountTimeRange
          title="Status:"
          sort={STATUS_OPTIONS[filters.status]?.label}
          onSort={handleTimeRange}
          sortOptions={STATUS_OPTIONS}
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
                  <AccountRewardSummaryRow key={row.id} row={row} />
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
