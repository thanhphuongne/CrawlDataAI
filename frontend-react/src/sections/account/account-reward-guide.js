'use client';

import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { rewardGuide } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';

import Scrollbar from 'src/components/scrollbar';
import { useTable, TableHeadCustom } from 'src/components/table';

import loadTable from './account-table-skeleton';
import AccountRewardGuideRow from './account-reward-guide-row';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'center' },
  { id: 'reward', label: 'Reward', align: 'center' },
  { id: 'description', label: 'Description', align: 'center' },
  { id: 'regularity', label: 'Regularity', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
];

// ----------------------------------------------------------------------

export default function AccountRewardGuide() {
  const table = useTable({ defaultOrderBy: 'createDate' });
  const [tableData, setTableData] = useState([]);
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const res = await rewardGuide(user);
          setTableData(res);
          console.log("RES GUID", res)
        } catch (error) {
          setIsLoading(false);
          console.error('Error fetching getShareById data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);
  return (
    <>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />
            {isLoading ? (
              loadTable({ numRow: 6, numCol: TABLE_HEAD.length })
            ) : (
              <TableBody>
                {tableData.map((row) => (
                  <AccountRewardGuideRow key={row.id} row={row} />
                ))}
              </TableBody>
            )}
          </Table>
        </Scrollbar>
      </TableContainer>

      {/* <TablePaginationCustom
        count={tableData.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        //
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      /> */}
    </>
  );
}
