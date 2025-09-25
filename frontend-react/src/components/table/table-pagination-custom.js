import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

// ----------------------------------------------------------------------

export default function TablePaginationCustom({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  // dense,
  // onChangeDense,
  rowsPerPageOptions = [5, 10, 25],
  sx,
}) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
        sx={{
          borderTopColor: 'transparent',
        }}
      />

      {/* {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: 'absolute',
            },
          }}
        />
      )} */}
    </Box>
  );
}


TablePaginationCustom.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func.isRequired,
  // dense: PropTypes.bool,
  // onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
};
