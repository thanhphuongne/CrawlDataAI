'use client';

import PropTypes from 'prop-types';

// import DashboardLayout from 'src/layouts/dashboard';
import MainLayout from 'src/layouts/main';
import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
