import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------

// function createData(calories, fat, carbs, protein) {
//   return { calories, fat, carbs, protein };
// }

// const TABLE_DATA = [
//   createData(305, 3.7, 67, 4.3),
//   createData(452, 25.0, 51, 4.9),
//   createData(262, 16.0, 24, 6.0),
//   createData(159, 6.0, 24, 4.0),
//   createData(356, 16.0, 49, 3.9),
//   createData(408, 3.2, 87, 6.5),
//   createData(237, 9.0, 37, 4.3),
//   createData(375, 0.0, 94, 0.0),
//   createData(518, 26.0, 65, 7.0),
//   createData(392, 0.2, 98, 0.0),
//   createData(318, 0, 81, 2.0),
//   createData(360, 19.0, 9, 37.0),
// ];

const TABLE_HEAD = [
  { id: 'aff_name', label: 'User', align: 'center' },
  { id: 'aff_join_at', label: 'Register Date', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
];

// ----------------------------------------------------------------------

export default function SortingSelectingTable({ data }) {
  const table = useTable({
    defaultOrderBy: 'full_name',
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const ls_data = data.map((item) =>
      item.aff_name === '' || item.aff_name == null
        ? {
            ...item,
            aff_name:
              item.aff_wallet_address?.substring(0, 6) + '...' + item.aff_wallet_address?.slice(-5),
            status: item.status_id === 23 ? 'Active' : 'Inactive',
          }
        : { ...item, status: item.status_id === 23 ? 'Active' : 'Inactive' }
    );
    setTableData(ls_data);
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const denseHeight = table.dense ? 34 : 34 + 20;
  const change_data = (e) => {
    table.setRowsPerPage(e.target.value);
    // console.log('rowsPerPage==', table.onChangePage);
    // console.log('dataFiltered==', table.);
    // console.log('rowsPerPage==', );
  };
  const change_page = () => {
    console.log('page');
    // table.setPage(table.page );
  };
  return (
    <div>
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <Typography variant="h6">Sorting & Selecting</Typography>

        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      </Stack> */}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={tableData.length}
          // onSelectAllRows={(checked) =>
          //   table.onSelectAllRows(
          //     checked,
          //     tableData.map((row) => row.name)
          //   )
          // }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary">
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          }
        />

        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              // onSelectAllRows={(checked) =>
              //   table.onSelectAllRows(
              //     checked,
              //     tableData.map((row) => row.name)
              //   )
              // }
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <TableRow
                    hover
                    key={index}
                    // onClick={() => table.onSelectRow(row.name)}
                    // selected={table.selected.includes(row.name)}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox checked={table.selected.includes(row.name)} />
                    </TableCell> */}
                    {/* <TableCell> {row.name} </TableCell> */}
                    {/* <TableCell align="center">{row.calories}</TableCell> */}
                    <TableCell align="center">{row.aff_name}</TableCell>
                    <TableCell align="center">{row.aff_join_at}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                  </TableRow>
                ))}

              {/* <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              /> */}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        //
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </div>
  );
}

SortingSelectingTable.propTypes = {
  data: PropTypes.array,
};
// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
