import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import { Skeleton, TableRow, TableBody, TableCell } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { _invoices } from 'src/_mock';

import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

// import CommissionTableAff from '../commission-table-aff';
// ----------------------------------------------------------------------

const TABLE_HEAD_AFF = [
  // { id: 'logo', label: '' },
  { id: 'user_name', label: 'Name' },
  // { id: 'dueDate', label: 'Refferal' },
  { id: 'campaign', label: 'Campaign ' },
  // { id: 'sent', label: 'Quest' },
  { id: 'status', label: 'Status' },
  // { id: 'earned_affiliate', label: 'Earned Affiliate' },
  { id: 'earned_affiliate', label: 'Earned Affiliate' },
  { id: 'createDate', label: 'Date' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  date: null,
  status: 'all',
  limit: 10,
  skip: 0,
};

// ----------------------------------------------------------------------

export default function AffiliatesCampaignTable({ user, dataAff, filtersAff, countAff, setFiltersAff, isLoading }) {
  const router = useRouter();
  const [tableData, setTableData] = useState(_invoices);

  const handleChangePage = useCallback(
    (event, newPage) => {
      setFiltersAff({ ...filtersAff, skip: newPage * filtersAff.limit });
      setTableData([]);
    },
    [filtersAff]
  );

  const table = useTable();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filtersAff,
  });

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      setFiltersAff({ ...filtersAff, limit: event.target.value, skip: 0 });
      setTableData([]);
    },
    [filtersAff]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.details(id));
    },
    [router]
  );


  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD_AFF}
              rowCount={dataFiltered.length}
              onSort={table.onSort}
            />
            {isLoading ? (
              <TableBody>
                <TableRow>
                  {[...Array(6)].map((_2, index2) => (
                    <TableCell>
                      <Skeleton key={index2 + '_summary_item'} sx={{ width: '80%', height: 20, my: 1.5 }} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {dataAff.length > 0 ? dataAff.map(
                  (aff) => (
                    // <CommissionTableAff
                    //   key={aff.campaign_id}
                    //   row={aff}
                    //   user={user}
                    //   onViewRow={() => handleViewRow(aff.campaign_id)}
                    // />
                    <TableNoData
                  notFound={
                    (dataFiltered.length > 0 ? dataFiltered : dataAff).length === 0
                  }
                />
                  )
                ) : <TableNoData
                  notFound={
                    (dataFiltered.length > 0 ? dataFiltered : dataAff).length === 0
                  }
                />}

              </TableBody>
            )
            }
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={countAff} // Giả sử này cần thay đổi dựa theo tổng số bản ghi thực tế từ API
        page={filtersAff.skip / filtersAff.limit}
        rowsPerPage={filtersAff.limit}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

AffiliatesCampaignTable.propTypes = {
  user: PropTypes.any,
  dataAff: PropTypes.any,
  filtersAff: PropTypes.any,
  countAff: PropTypes.any,
  setFiltersAff: PropTypes.any,
  isLoading: PropTypes.any
};

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (name) {
    inputData = inputData.filter((activity) =>
      activity.campaign_name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return inputData;
}