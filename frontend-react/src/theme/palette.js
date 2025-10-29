import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS

export const grey = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#dfe3e6',
  600: '#637381',
  700: '#454F5B',
  800: '#272B35',
  900: '#161C24',
};

export const primary = {
  lighter: '#7C3AED',
  light: '#8B5CF6',
  main: '#6366F1',
  dark: '#4F46E5',
  darker: '#3730A3',
  contrastText: '#FFFFFF',
};

export const secondary = {
  lighter: '#F59E0B',
  light: '#FCD34D',
  main: '#F59E0B',
  dark: '#D97706',
  darker: '#92400E',
  contrastText: '#FFFFFF',
};

export const info = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#D3FCD2',
  light: '#46fa73',
  main: '#22C55E',
  dark: '#118D57',
  darker: '#065E49',
  contrastText: '#ffffff',
};

export const warning = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: grey[800],
};

export const error = {
  lighter: '#FFE9D5',
  light: '#f25602',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

export const common = {
  black: '#000000',
  white: '#FFFFFF',
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
};

// ----------------------------------------------------------------------

export function palette(mode) {
  const light = {
    ...base,
    mode: 'light',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    background: {
      paper: '#FFFFFF',
      default: '#F9FAFB',
      neutral: '#F3F4F6',
      imgUrl: 'url(/assets/background/img_bg_main.png)'
    },
    action: {
      ...base.action,
      active: grey[600],
    },
  };

  const dark = {
    ...base,
    mode: 'dark',
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      disabled: '#6B7280',
    },
    background: {
      paper: '#1F2937',
      default: '#111827',
      neutral: '#374151',
      imgUrl: 'url(/assets/background/img_bg_main.png)'
    },
    action: {
      ...base.action,
      active: grey[400],
    },
  };

  return mode === 'light' ? light : dark;
}
