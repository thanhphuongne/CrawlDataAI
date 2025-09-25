import { useState } from 'react';
import PropTypes from 'prop-types';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import { Link } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import Image from 'src/components/image';
import SearchNotFound from 'src/components/search-not-found';

// ----------------------------------------------------------------------

export default function UserSearch({ query, results, onSearch }) {
  const { push } = useRouter();

  const [searchPosts, setSearchPosts] = useState('');

  const [searchResults, setSearchResults] = useState([]);

  const handleSearchPosts = async (value) => {
    try {
      setSearchPosts(value);

      if (value) {
        const url = endpoints.auth.users;
        const response = await axios.get(url, {
          params: { textSearch: value },
        });
      // console.log("===response",response)
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (id) => {
    push(paths.campaign.details(id));
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      const selectedOption = searchResults.find((option) => option.accountName === searchPosts);
      if (selectedOption) {
        handleClick(selectedOption.id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 1, md: 1 }, border: 1, borderRadius: '10px' }}
      autoHighlight
      popupIcon={null}
      options={searchResults}
      onInputChange={(event, value) => {
        handleSearchPosts(value);
      }}
      getOptionLabel={(post) => post.name}
      noOptionsText={<SearchNotFound query={searchPosts} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      componentsProps={{
        popper: {
          sx: {
            width:  { xs: 1, sm: 1, md: 1 },
          },
        },
        paper: {
          sx: {
            '& .MuiAutocomplete-option': {
              px: `8px !important`,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Account Name"
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                {/* <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} /> */}
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, post, { inputValue }) => {
        const { name, logo_image, id } = post;
        const matches = match(name, inputValue);
        const parts = parse(name, matches);

        return (
          <Link underline="none" onClick={() => handleClick(id)} key={id}>
            <li {...props}>
              <Image
                alt={logo_image}
                src={logo_image}
                sx={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, mr: 1.5 }}
              />
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  variant="subtitle2"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                >
                  {part.text}
                </Typography>
              ))}
            </li>
          </Link>
        );
      }}
    />
  );
}

UserSearch.propTypes = {
  hrefItem: PropTypes.func,
  onSearch: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array,
};
