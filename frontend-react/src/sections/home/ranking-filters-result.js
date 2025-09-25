import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function RankingFiltersResult({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  results,
  ...other
}) {
  // const handleRemoveCampaignTypes = (inputValue) => {
  //   const newValue = filters.campaignTypeOptions.filter((item) => item !== inputValue);
  //   onFilters('campaignTypes', newValue);
  // };
  const handleRemoveCampaignTypes = (inputValue) => {
    // console.log('remove CPT-----', inputValue);
    // const newValue = filters.month.filter((item) => item !== inputValue);
    onFilters('month', null);
  };

  // const handleRemoveExperience = () => {
  //   onFilters('experience', 'all');
  // };

  const handleRemoveChains = (inputValue) => {
    // const newValue = filters.quarter.filter((item) => item !== inputValue);
    onFilters('quarter', null);
    // onFilters('chains', 'all');
  };

  // const handleRemoveCategories = (inputValue) => {
  //   const newValue = filters.roles.filter((item) => item !== inputValue);
  //   onFilters('role', newValue);
  // };
  const handleRemoveCategories = (inputValue) => {
    // console.log('remove-----', inputValue);
    const newValue = filters.categories.filter((item) => item !== inputValue);
    onFilters('categories', newValue);
  };

  const handleRemoveBenefits = (inputValue) => {
    const newValue = filters.benefits.filter((item) => item !== inputValue);
    onFilters('benefits', newValue);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.month && (
          <Block label="Months:">
            {/* {filters.month.map((item) => ( */}
              <Chip
                key={filters.month}
                label={filters.month}
                size="small"
                onDelete={() => handleRemoveCampaignTypes(filters.month)}
              />
            {/* ))} */}
          </Block>
        )}

        {/* {filters.experience !== 'all' && (
          <Block label="Experience:">
            <Chip size="small" label={filters.experience} onDelete={handleRemoveChains} />
          </Block>
        )}
         */}

        {!!filters.quarter && (
          <Block label="Quarter:">
            {/* <Chip size="small" label={filters.chains} onDelete={handleRemoveChains} /> */}
            {/* {filters.quarter.map((item) => ( */}
              <Chip
                key={filters.quarter}
                label={filters.quarter}
                size="small"
                onDelete={() => handleRemoveChains(filters.quarter)}
              />
            {/* ))} */}
          </Block>
        )}

        {canReset && (
          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

RankingFiltersResult.propTypes = {
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
