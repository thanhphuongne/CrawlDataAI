'use client';

import PropTypes from 'prop-types';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export function TonProvider({ children }) {
  return <TonConnectUIProvider manifestUrl="https://brand.xoffer.io/assets/data/tonconnect-manifest.json">
    {children}
  </TonConnectUIProvider>;
}

TonProvider.propTypes = {
  children: PropTypes.node,
};
