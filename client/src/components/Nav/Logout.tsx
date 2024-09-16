import { forwardRef, useMemo } from 'react';
import { LogOutIcon } from '../svg';
import { useAuthContext } from '~/hooks/AuthContext';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useLocalize } from '~/hooks';

const Logout = forwardRef(() => {
  const { logout } = useAuthContext();
  const localize = useLocalize();

  const { data: startupConfig, isLoading } = useGetStartupConfig();

  const keycloakLogoutUrl = useMemo(() => {
    if (!isLoading && startupConfig) {
      const url = `${startupConfig.openidIssuerUrl}/protocol/openid-connect/logout?post_logout_redirect_uri=${startupConfig.serverDomain}&client_id=${startupConfig.openidClientId}`;
      console.log('Keycloak Logout URL:', url);
      return url;
    }
    return '';
  }, [isLoading, startupConfig]);

  const handleLogout = async () => {
    try {
      await logout();
      if (keycloakLogoutUrl) {
        window.location.href = keycloakLogoutUrl;
      } else {
        console.error('Keycloak logout URL not set.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <button
      className="group group flex w-full cursor-pointer items-center gap-2 rounded p-2.5 text-sm transition-colors duration-200 hover:bg-gray-500/10 focus:ring-0 dark:text-white dark:hover:bg-gray-600"
      onClick={handleLogout}
      disabled={isLoading || !keycloakLogoutUrl}
    >
      <LogOutIcon />
      {localize('com_nav_log_out')}
    </button>
  );
});

export default Logout;
