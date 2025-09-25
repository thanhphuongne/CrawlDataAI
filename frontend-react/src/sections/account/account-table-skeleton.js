import { Skeleton, TableRow, TableBody, TableCell } from '@mui/material';

export default function loadTable({ numRow, numCol }) {
  return (
    <TableBody>
      {[...Array(numRow)].map((_1, index1) => (
        <TableRow key={index1 + '_summary_row'}>
          {[...Array(numCol)].map((_2, index2) => (
            <TableCell>
              <Skeleton key={index2 + '_summary_item'} sx={{ width: '75%', height: 20, my: 1.5 }} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
