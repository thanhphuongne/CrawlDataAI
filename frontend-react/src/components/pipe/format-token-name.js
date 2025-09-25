// import PropTypes from 'prop-types';

export default function formatTokenName(token) {
  if (token !== 'VND' && token !== 'USD') return ' $' + token;
  return ' '+token;
}
