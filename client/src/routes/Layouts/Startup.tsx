import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import type { TStartupConfig } from 'librechat-data-provider';
import AuthLayout from '~/components/Auth/AuthLayout';

// Removing useLocalize header giving custom params
//import { useLocalize } from '~/hooks';

// const headerMap = {
//   '/login': 'com_auth_welcome_back',
//   '/register': 'com_auth_create_account',
//   '/forgot-password': 'com_auth_reset_password',
//   '/reset-password': 'com_auth_reset_password',
// };

const headerMap = {
  '/login': 'Redirecting ...',
  '/register': 'Create your account',
  '/forgot-password': 'Reset your password',
  '/reset-password': 'Set a new password',
};

export default function StartupLayout({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [headerText, setHeaderText] = useState<string | null>(null);
  const [startupConfig, setStartupConfig] = useState<TStartupConfig | null>(null);
  const {
    data,
    isFetching,
    error: startupConfigError,
  } = useGetStartupConfig({
    enabled: isAuthenticated ? startupConfig === null : true,
  });
  // const localize = useLocalize();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/c/new', { replace: true });
    }
    if (data) {
      setStartupConfig(data);
    }
  }, [isAuthenticated, navigate, data]);

  useEffect(() => {
    document.title = startupConfig?.appTitle || 'LibreChat';
  }, [startupConfig?.appTitle]);

  useEffect(() => {
    setError(null);
    setHeaderText(null);
  }, [location.pathname]);

  const contextValue = {
    error,
    setError,
    headerText,
    setHeaderText,
    startupConfigError,
    startupConfig,
    isFetching,
  };

  return (
    <AuthLayout
      header={headerText || headerMap[location.pathname]}
      isFetching={isFetching}
      startupConfig={startupConfig}
      startupConfigError={startupConfigError}
      pathname={location.pathname}
      error={error}
    >
      <Outlet context={contextValue} />
    </AuthLayout>
  );
}
