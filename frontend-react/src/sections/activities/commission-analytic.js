import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CommissionAnalytic({ title, total, icon, color, percent, price, tooltip }) {
  return (
    <Stack
      spacing={2.5}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: 1, minWidth: 200 }}
    >
      <Tooltip title={tooltip}>
        <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative', cursor: 'pointer' }}>
          <Iconify icon={icon} width={32} sx={{ color, position: 'absolute' }} />
          <CircularProgress
            variant="determinate"
            value={percent}
            size={56}
            thickness={2}
            sx={{ color, opacity: 0.48 }}
          />

          <CircularProgress
            variant="determinate"
            value={100}
            size={56}
            thickness={3}
            sx={{
              top: 0,
              left: 0,
              opacity: 0.48,
              position: 'absolute',
              color: (theme) => alpha(theme.palette.grey[500], 0.16),
            }}
          />
        </Stack>
      </Tooltip>
      <Stack spacing={0.5}>
        <Typography variant="subtitle1">{title}</Typography>
        <Box component="span" sx={{ typography: 'body2' }}>
          {total ?? 0}
        </Box>

        <Typography variant="subtitle2">{fCurrency(price)}</Typography>
      </Stack>

    </Stack>
  );
}

CommissionAnalytic.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  percent: PropTypes.number,
  price: PropTypes.number,
  title: PropTypes.string,
  total: PropTypes.number,
  tooltip: PropTypes.any
};
