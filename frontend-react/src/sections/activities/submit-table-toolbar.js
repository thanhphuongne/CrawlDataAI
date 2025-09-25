import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import  TextField  from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import  InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

// ----------------------------------------------------------------------
import { isAfter } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { start } from 'nprogress';
import { Tab } from '@mui/material';

export default function FilterTableToolbar({
  filters,
  onFilters,
  user,
  roleOptions,
  handlerExport,
  tab
}) {

  const [localData, setLocalData] = useState(
    {
      textSearch : '' ,
      startDate : null ,
      endDate : null,
      status : []
    }
  )
  
  const popover = usePopover();

  useEffect(()=>{
    // console.log(localData);
  },[localData, setLocalData])
  
  const handleFilterName = useCallback((event) => {
      setLocalData(prev => ({
        ...prev,
        textSearch : event.target.value,
      }))
    },[]);
  
  const handleSearchSubmit = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        onFilters(localData)
        console.log(localData)
      }
    },[localData]
  )

  const dateError = isAfter(filters.startDate, filters.endDate);
  // console.log("=======filters=======",filters)
  const handleFilterRole = useCallback(
    (event) => {
      setLocalData((prevState) => ({
        ...prevState,
        status: event.target.value,
      }));
      // onFilters(
      //   'status',
      //   typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      // );
    },
    []
  );
  const handleFilterStartDate = useCallback(
    (newValue) => {
      const adjustedDate = new Date(newValue);
      // Đặt giờ về 12:00 để giảm tác động của chuyển đổi múi giờ
      adjustedDate.setHours(12, 0, 0, 0);
      setLocalData((prevState) => ({
        ...prevState,
        startDate:adjustedDate,
      }));
      // onFilters('startDate', adjustedDate);
    },
    []
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      const adjustedDate = new Date(newValue);
      // Đặt giờ về 12:00 để giảm tác động của chuyển đổi múi giờ
      adjustedDate.setHours(12, 0, 0, 0);
      // onFilters('endDate', adjustedDate);
      setLocalData((prevState) => ({
        ...prevState,
        endDate:adjustedDate,
      }));
    },
    []
  );

  const submintHandler = () => {
    // console.log(localData);
    onFilters(localData)
    console.log(localData);

  }

  const handleRender = (selected) =>{
    const tempResult = []
    if(Array.isArray(selected)){
      selected.forEach(select =>{
        const objectSelected = roleOptions.find(item => item.value === select);
        tempResult.push(objectSelected.field);
      })
    }
    return tempResult.join(', ');
  }

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        justifyContent="flex-end"
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          // pr: { xs: 2.5, md: 1 },
        }}
      >
        <DatePicker
          label="Start date"
          value={localData.startDate}
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
          value={localData.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText: dateError && 'End date must be later than start date',
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
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },

          }}
        >
          <InputLabel>Status</InputLabel>

          <Select
            multiple
            value={localData.status}
            onChange={handleFilterRole}
            input={<OutlinedInput label="Status" />}
            renderValue={(selected) => handleRender(selected)}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {roleOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox disableRipple size="small" checked={localData.status.includes(option.value)} />
                {option.field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} > */}
        <TextField
            fullWidth
            value={localData.textSearch}
            onKeyDown={handleSearchSubmit}
            onChange={handleFilterName}
            placeholder="Search Name..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <Button 
          onClick = {submintHandler}
          sx={{backgroundColor: '#d2b36d', color: "white" }}
          >
            Search
          </Button>

        {user?.user?.role === 'ADMIN' && tab === 'admin' ? (<Button onClick={handlerExport} variant="contained" sx={{ backgroundColor: '#d2b36d', color: "white" }}>
          <Iconify icon="solar:export-bold" />
          Export
        </Button>) : ""}
        {/* </Stack> */}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem> */}

        {/* <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

FilterTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
  user:PropTypes.any,
  handlerExport: PropTypes.any,
  tab : PropTypes.string,
};
