import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import axios from 'src/utils/axios';

export default function RHFAutocompleteAccount({
  name,
  label,
  type,
  helperText,
  placeholder,
  apiUrl, // Thêm props API
  ...other
}) {
  const { control, setValue } = useFormContext();
  const [options, setOptions] = useState([]); // Lưu kết quả API
  const [searchTerm, setSearchTerm] = useState(''); // Lưu giá trị input
  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Gọi API khi searchTerm thay đổi
  useEffect(() => {
    if (searchTerm.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}?textSearch=${searchTerm}`);

        const accountNameList = response.data.payload.data.map((item) => ({
          label: item.accountName, // Thay item.fullName bằng key tương ứng từ API
          code: item.id,
        }));

        setOptions(accountNameList); // Cập nhật danh sách gợi ý
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    // Thêm debounce để tránh gọi API liên tục
    const timeoutId = setTimeout(fetchData, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, apiUrl]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          id={`autocomplete-${name}`}
          options={options} // Dữ liệu từ API
          loading={loading}
          onInputChange={(event, newValue) => setSearchTerm(newValue)} // Cập nhật searchTerm
          onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error?.message : helperText}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
            />
          )}
          {...other}
        />
      )}
    />
  );
}

RHFAutocompleteAccount.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  placeholder: PropTypes.string,
  apiUrl: PropTypes.string.isRequired, // API URL bắt buộc
};
