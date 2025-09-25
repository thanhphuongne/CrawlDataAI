import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Iconify from 'src/components/iconify';
// import CountrySelect from 'src/components/country-select';

// ----------------------------------------------------------------------
import { formHelperTextClasses } from '@mui/material/FormHelperText';

// ----------------------------------------------------------------------
import { isAfter } from 'src/utils/format-time';

export default function RankingFilters({
  open,
  onOpen,
  onClose,
  //
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  // roleOptions,
  // experienceOptions,
  quarter,
  months,
}) {
  // console.log("filters===",filters.month)
  const handleFilterMonth = useCallback(
    (newValue) => {
      // const checked = filters.campaignTypes.includes(newValue)
      //   ? filters.campaignTypes.filter((value) => value !== newValue)
      //   : [...filters.campaignTypes, newValue];
      // console.log("newValue=-",newValue)
      onFilters('month', newValue);
    },
    [onFilters]
  );

  const handleFilterQuarter = useCallback(
    (newValue) => {
      // onFilters('experience', newValue);
      // console.log('newValue: ', newValue);
      onFilters('quarter', newValue);
    },
    [onFilters]
  );
  const handleFilters = (name, value) => {
    // console.log("=====name, value=====", name, value);
  };
  // const handleFilterCategorys = useCallback(
  //   (newValue) => {
  //     onFilters('categories', newValue);
  //   },
  //   [onFilters]
  // );


  // const handleFilterLocations = useCallback(
  //   (newValue) => {
  //     onFilters('locations', newValue);
  //   },
  //   [onFilters]
  // );

  // const handleFilterBenefits = useCallback(
  //   (newValue) => {
  //     const checked = filters.benefits.includes(newValue)
  //       ? filters.benefits.filter((value) => value !== newValue)
  //       : [...filters.benefits, newValue];
  //     onFilters('benefits', checked);
  //   },
  //   [filters.benefits, onFilters]
  // );

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={onResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderQuarter = (
    <Stack sx={{ width: { xs: 1, sm: 1 } }}>
      <Autocomplete
        sx={{
          width: { xs: 1, sm: 1, md: 330 },
          border: 1,
          borderRadius: '10px',
        }}
        disableCloseOnSelect
        options={quarter}
        getOptionLabel={(option) => option}
        value={filters.quarter || null}
        onChange={(event, newValue) => handleFilterQuarter(newValue)}
        renderInput={(params) => (
          <TextField placeholder="Select Quarter" {...params} sx={{ lineHeight: 1 }} />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={option}
              size="small"
              variant="soft"
            />
          ))
        }
      />
    </Stack>
  );
  const renderMonths = (
    <Stack sx={{ width: { xs: 1, sm: 1 } }}>
      <Autocomplete
        sx={{ width: { xs: 1, sm: 1, md: 330 }, border: 1, borderRadius: "10px" }}
        disableCloseOnSelect
        options={months} // Ensure months is an array of objects { value, label }
        getOptionLabel={(option) => option} // Extract the label
        value={filters.month || null} // Ensure the value matches one of the options
        onChange={(event, newValue) => handleFilterMonth(newValue)} // Update the filters
        renderInput={(params) => (
          <TextField {...params} placeholder="Select Month" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option} {/* Render only the label */}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={option} // Use only the label
              size="small"
              variant="outlined"
            />
          ))
        }
      />
    </Stack>
  );

  // const renderCategory = (
  //   // <Stack>
  //   //   {/* <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
  //   //     Category
  //   //   </Typography> */}
  //   //   <Autocomplete
  //   //     sx={{ width: { xs: 1, sm: 260, md: 260 } }}
  //   //     multiple
  //   //     disableCloseOnSelect
  //   //     // options={roleOptions.map((option) => option)}
  //   //     options={categoryOptions.map((option) => option)}
  //   //     getOptionLabel={(option) => option}
  //   //     value={filters.roles}
  //   //     onChange={(event, newValue) => handleFilterCategorys(newValue)}
  //   //     renderInput={(params) => <TextField placeholder="Select Categories" {...params} />}
  //   //     renderOption={(props, option) => (
  //   //       <li {...props} key={option}>
  //   //         {option}
  //   //       </li>
  //   //     )}
  //   //     renderTags={(selected, getTagProps) =>
  //   //       selected.map((option, index) => (
  //   //         <Chip
  //   //           {...getTagProps({ index })}
  //   //           key={option}
  //   //           label={option}
  //   //           size="small"
  //   //           variant="soft"
  //   //         />
  //   //       ))
  //   //     }
  //   //   />
  //   // </Stack>
  //   <Stack sx={{ width: { xs: 1, sm: 1 } }}>
  //     {/* <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
  //   Category
  // </Typography> */}
  //     <Autocomplete
  //       // sx={{ width: { xs: 1, sm: 260, md: 260 } }}
  //       sx={{
  //         width: { xs: 1, sm: 1, md: 330 },
  //         // border: ' gray',
  //         border: 1,
  //         // borderColor: 'grey',
  //         borderRadius: '10px',
  //       }}
  //       multiple
  //       disableCloseOnSelect
  //       options={categoryOptions.map((option) => option)} // Add 'All' to options
  //       getOptionLabel={(option) => option}
  //       value={filters.categories} // Ensure 'All' is the default value
  //       onChange={(event, newValue) => handleFilterCategorys(newValue)} // Ensure newValue is an array with a single item
  //       renderInput={(params) => (
  //         <TextField placeholder="Select Category" {...params} sx={{ lineHeight: 1 }} />
  //       )}
  //       renderOption={(props, option) => (
  //         <li {...props} key={option}>
  //           {option}
  //         </li>
  //       )}
  //       renderTags={(selected, getTagProps) =>
  //         selected.map((option, index) => (
  //           <Chip
  //             {...getTagProps({ index })}
  //             key={option}
  //             label={option}
  //             size="small"
  //             variant="soft"
  //           />
  //         ))
  //       }
  //     />
  //   </Stack>
  // );
   const dateError = isAfter(filters.startDate, filters.endDate);
    // console.log("=======filters=======",filters)
    const handleFilterRole = useCallback(
      (event) => {
        onFilters(
          'status',
          typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
        );
      },
      [onFilters]
    );
  const handleFilterStartDate = useCallback(
    (newValue) => {
      const adjustedDate = new Date(newValue);
      // Đặt giờ về 12:00 để giảm tác động của chuyển đổi múi giờ
      adjustedDate.setHours(12, 0, 0, 0);
      onFilters('startDate', adjustedDate);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      const adjustedDate = new Date(newValue);
      // Đặt giờ về 12:00 để giảm tác động của chuyển đổi múi giờ
      adjustedDate.setHours(12, 0, 0, 0);
      onFilters('endDate', adjustedDate);
    },
    [onFilters]
  );
  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
      >
        {/* {renderMonths} */}
        {/* {renderCategory} */}
        {/* {renderQuarter} */}
        <DatePicker
          label="Start date"
          value={filters.startDate}
          onChange={handleFilterStartDate}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
          sx={{
            maxWidth: { md: 200 },
          }}
        />

        <DatePicker
          label="End date"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText:  dateError && 'End date must be later than start date',
            },
          }}
          sx={{
            maxWidth: { md: 200 },
            [`& .${formHelperTextClasses.root}`]: {
              position: { md: 'absolute' },
              bottom: { md: -40 },
            },
          }}
        />
      </Stack>

      {/* tam thoi an */}

      {/* <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        Filters */}
      {/* </Button> */}
      {/* 
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderMonth}

            {renderChain}

            {renderCategory}

            {renderLocations}
            {renderBenefits}
          </Stack>
        </Scrollbar>
      </Drawer> */}
    </>
  );
}

RankingFilters.propTypes = {
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  // roleOptions: PropTypes.array,
  categoryOptions: PropTypes.array,
  onResetFilters: PropTypes.func,
  // benefitOptions: PropTypes.array,
  // locationOptions: PropTypes.array,
  // experienceOptions: PropTypes.array,
  // chainsOptions: PropTypes.array,
  months: PropTypes.array,
  quarter: PropTypes.array,
};
